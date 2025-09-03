// src/pages/SingleProduct.jsx
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../utils/api";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import "./SingleProduct.css"; // Import the new CSS file

export default function SingleProduct({ handleAddToCart }) {
  const { productId } = useParams(); // Get productId from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(productId);
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  if (loading) return <Loader />;
  if (error) return <div className="error-message">{error}</div>;
  if (!product) return <div className="no-product-message">Product not found.</div>;

  return (
    <div className="single-product-page">
      <h1 className="single-product-title">{product.name}</h1>
      <div className="single-product-container">
        <div className="single-product-image-section">
          <img
            src={product.images[0]?.src || "https://via.placeholder.com/300"}
            alt={product.name}
            className="single-product-image"
          />
        </div>
        <div className="single-product-details-section">
          <p className="single-product-price">
            <strong>Price:</strong> R{parseFloat(product.price || 0).toFixed(2)}
          </p>
          <div
            className="single-product-description"
            dangerouslySetInnerHTML={{
              __html: product.description || product.short_description,
            }}
          />
          <p className="single-product-category">
            <strong>Category:</strong>{" "}
            {product.categories?.map((cat) => cat.name).join(", ") || "N/A"}
          </p>
          <p className="single-product-stock">
            <strong>Stock Status:</strong> {product.stock_status}
          </p>
          <div className="single-product-actions">
            <button className="btn btn-primary" onClick={() => handleAddToCart(product)}>
              Add to Cart
            </button>
            <button className="btn btn-secondary" onClick={() => navigate(-1)}>
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}