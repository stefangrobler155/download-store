import { useEffect, useState } from "react";
import { getCategories } from "../utils/api";
import './FeaturedCollections.css';

export default function FeaturedCollections() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await getCategories();

        // Skip "Uncategorized"
        const noUncategorized = cats.filter(cat => cat.slug !== "uncategorized");

        // show all non-uncategorized
        // setCategories(noUncategorized);

        // only children of Photography
        const photography = noUncategorized.find(cat => cat.slug === "photography");
        const filtered = noUncategorized.filter(cat => cat.parent === photography?.id);

        setCategories(filtered);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchCategories();
  }, []);

  return (
    <section className="featured-collections">
      <h2>Featured Collections</h2>
      {error && <p>Error: {error}</p>}
      <div className="collections-grid">
        {categories.map(cat => (
          <div key={cat.id} className="collection-card">
            <img
              src={cat.image?.src || "/placeholder.png"}
              alt={cat.name}
              loading="lazy"
            />
            <h3>{cat.name}</h3>
            <div className="collection-button-container">
              <a href={`/products?category=${cat.id}`} className="btn btn-outline">
                View Collection
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
