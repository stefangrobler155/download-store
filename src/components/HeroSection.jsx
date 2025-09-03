import { useNavigate } from "react-router-dom";
import './HeroSection.css'; 

export default function HeroSection() {
  const navigate = useNavigate();
  
  return (
    <div className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">Capturing Life's Beautiful Moments</h1>
        <p className="hero-subtitle">Limited edition fine art photography prints</p>
        <button className="btn btn-primary" onClick={() => navigate('/products')}>
          Browse Collection
        </button>
      </div>
      <div className="hero-image-container">
        <img 
          src="/hero.jpg" 
          alt="Featured photography" 
          className="hero-image"
          loading="eager"
        />
      </div>
    </div>
  );
}