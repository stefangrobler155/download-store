// src/components/QuickViewModal.jsx
import { FiX, FiShoppingCart, FiHeart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { FaEye, FaHeart } from "react-icons/fa6";
import "./QuickViewModal.css"; 

export default function QuickViewModal({ product, onClose, handleAddToCart, wishlist, toggleWishlist }) {
    const navigate = useNavigate();
    const inWishlist = product?.id && wishlist ? wishlist.some((item) => item.id === product.id) : false;

    if (!product || !product.id) {
        return (
        <div className="quick-view-overlay">
            <div className="quick-view-content">
            <button className="close-btn" onClick={onClose}>
                <FiX />
            </button>
            <p>Error: Product data is missing.</p>
            </div>
        </div>
        );
    }  
 
  return (
    <div className="quick-view-overlay">
      <div className="quick-view-content">
        <button className="close-btn" onClick={onClose}>
          <FiX />
        </button>
        <div className="quick-view-body">
          <div className="quick-view-image">
            <img src={product.images[0]?.src} alt={product.name} />
          </div>
          <div className="quick-view-info">
            <h2>{product.name}</h2>
            <p className="price">
              {product.on_sale ? (
                <>
                  <span className="original-price">R{product.regular_price}</span>
                  <span className="sale-price">R{product.price}</span>
                </>
              ) : (
                <span>R{product.regular_price}</span>
              )}
            </p>
            <div
              className="product-description"
              dangerouslySetInnerHTML={{ __html: product.short_description }}
            />

            <div className="quick-view-actions">
              <button 
                className="add-to-cart-btn"
                onClick={() => handleAddToCart(product)}
              >
                <FiShoppingCart /> Add to Cart
              </button>

              <button 
                className="view-product-btn"
                onClick={() => {
                  onClose();
                  navigate(`/product/${product.id}`);
                }}
              >
                <FaEye />View Full Product
              </button>
                <button 
                className={`wishlist-btn ${inWishlist ? "active" : ""}`}
                aria-label="Toggle wishlist"
                onClick={() => toggleWishlist(product)} // Use prop function
                >
                {inWishlist ? <FaHeart /> : <FiHeart />} 
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
