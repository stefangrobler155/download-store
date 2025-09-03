// src/components/ProductCard.jsx
import { useNavigate } from "react-router-dom";
import { FiShoppingCart, FiEye, FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import QuickViewModal from "./QuickViewModal";
import { useState } from "react";
import "./ProductCard.css"; 

export default function ProductCard({ product, handleAddToCart, wishlist, toggleWishlist }) {
  const navigate = useNavigate();
  const [showQuickView, setShowQuickView] = useState(false);
  const inWishlist = wishlist.some((item) => item.id === product.id); // Derive from prop

  return (
    <>
      <div className="product-card">
        <div className="product-image-container">
          <img 
            src={product.images[0]?.src} 
            alt={product.name} 
            className="product-image"
            onClick={() => navigate(`/product/${product.id}`)}
          />
          <div className="product-badges">
            {product.on_sale && <span className="sale-badge">Sale</span>}
            <button 
              className={`wishlist-btn ${inWishlist ? "active" : ""}`}
              aria-label="Toggle wishlist"
              onClick={() => toggleWishlist(product)} // Use prop function
            >
              {inWishlist ? <FaHeart /> : <FiHeart />} 
            </button>
          </div>
          <button 
            className="quick-view-btn"
            onClick={() => setShowQuickView(true)}
          >
            <FiEye /> Quick View
          </button>
        </div>

        <div className="product-info">
          <h3 
            className="product-title"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            {product.name}
          </h3>

          <div className="product-price">
            {product.on_sale ? (
              <>
                <span className="original-price">R{product.regular_price}</span>
                <span className="sale-price">R{product.price}</span>
              </>
            ) : (
              <span className="price">R{product.regular_price}</span>
            )}
          </div>

          <div className="card-button-container">
            <button 
              className="add-to-cart-btn"
              onClick={() => handleAddToCart(product)}
            >
              <FiShoppingCart /> Add to Cart
            </button>
          </div>
        </div>
      </div>

      {showQuickView && (
        <QuickViewModal
          product={product}
          handleAddToCart={handleAddToCart}
          onClose={() => setShowQuickView(false)}
          wishlist={wishlist} 
          toggleWishlist={toggleWishlist} 
        />
      )}
    </>
  );
}