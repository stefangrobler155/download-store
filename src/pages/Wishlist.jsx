// src/pages/Wishlist.jsx
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import "./Wishlist.css";
export default function Wishlist({ handleAddToCart, wishlist, toggleWishlist }) {
  if (!wishlist.length) {
    return (
      <div className="wishlist-page">
        <h1>Your Wishlist</h1>
        <p>No items saved yet.</p>
        <Link to="/products" className="btn btn-primary">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <h1 className="page-title">Your Wishlist</h1>
      <div className="products-grid">
        {wishlist.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            handleAddToCart={handleAddToCart}
            wishlist={wishlist}
            toggleWishlist={toggleWishlist}
            />
        ))}
      </div>
    </div>
  );
}
