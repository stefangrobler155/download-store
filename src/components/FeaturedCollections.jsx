import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import { getCategories } from '../utils/api';
import './FeaturedCollections.css';

export default function FeaturedCollections() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setLoading(true);
    const fetchCategories = async () => {
      try {
        const cats = await getCategories();
          const noUncategorized = cats.filter(cat => cat.slug !== 'uncategorized');
          const photography = noUncategorized.find(cat => cat.slug === 'photography');
          const filtered = noUncategorized.filter(cat => cat.parent === photography?.id);
          setCategories(filtered);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);
  {loading && <div className="loader-overlay"><div className="aperture-loader"></div></div>}

  return (
    <section className="featured-collections">
      <h2>Featured Collections</h2>
      {error && <p>Error: {error}</p>}
      <div className="collections-grid">
        {categories.map(cat => (
          <div key={cat.id} className="collection-card">
            <img
              src={cat.image?.src || '/placeholder.png'}
              alt={cat.name}
              loading="lazy"
            />
            <h3>{cat.name}</h3>
            <div className="collection-button-container">
              <Link
                to={`/products?category=${cat.id}`}
                className="btn btn-outline"
              >
                View Collection
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


