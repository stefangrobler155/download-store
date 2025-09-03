// src/pages/Products.jsx
import { getAllProducts, getCategories } from "../utils/api";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import ProductCard from "../components/ProductCard";
import "./Products.css";

export default function Products({ handleAddToCart, wishlist, toggleWishlist }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown state
  const [selectedCategory, setSelectedCategory] = useState({ id: "", name: "All Categories" }); // Selected category
  const dropdownRef = useRef(null); // Ref for closing dropdown on click outside

  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const query = categoryParam ? { category: categoryParam } : {};
        const data = await getAllProducts(query);
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again.");
        toast.error("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryParam]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await getCategories();
        // Exclude "Uncategorized" and "Photography" (parent ID 16 or slug)
        const filteredCats = cats.filter(
          (c) => c.slug !== "uncategorized" && c.id !== 16 && c.slug !== "photography"
        );
        setCategories(filteredCats);
      } catch (err) {
        console.error("Failed to load categories:", err);
        toast.error("Failed to load categories.");
      }
    };
    fetchCategories();
  }, []);

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setIsDropdownOpen(false);
    if (cat.id) {
      setSearchParams({ category: cat.id });
    } else {
      setSearchParams({});
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="products-page">
      <h1 className="page-title">Collection</h1>

      {/* Custom category dropdown */}
      <div className="filter-bar" ref={dropdownRef}>
        <button
          className="dropdown-toggle"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          aria-expanded={isDropdownOpen}
          aria-label="Select category"
        >
          {selectedCategory.name}
        </button>
        {isDropdownOpen && (
          <ul className="dropdown-menu">
            <li
              className={`dropdown-item ${!selectedCategory.id ? "selected" : ""}`}
              onClick={() => handleCategorySelect({ id: "", name: "All Categories" })}
            >
              All Categories
            </li>
            {categories.map((cat) => (
              <li
                key={cat.id}
                className={`dropdown-item ${selectedCategory.id === cat.id ? "selected" : ""}`}
                onClick={() => handleCategorySelect({ id: cat.id, name: cat.name })}
              >
                {cat.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="products-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              handleAddToCart={handleAddToCart}
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
            />
          ))
        ) : (
          <p className="no-products-message">No products found for this category.</p>
        )}
      </div>
    </div>
  );
}