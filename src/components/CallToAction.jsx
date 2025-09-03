import { useNavigate } from "react-router-dom";
import "./CallToAction.css"

export default function CallToAction() {
  const navigate = useNavigate();

  return (
    <section className="cta-section">
      <div className="cta-content">
        <div className="cta-image-container">
          <img
            src="/cta-image.jpg"
            alt="Call to Action"
            className="cta-image"
          />
        </div>
          <div className="col-2">
            <div className="cta-text">
              <h2 className="cta-title">Ready to Find Your Perfect Print?</h2>
              <p className="cta-subtitle">Browse our curated collections or contact us for custom commissions</p>
            </div>
            
            <div className="cta-buttons">
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/products')}
              >
                Browse
              </button>
            </div>
          </div>
        
      </div>
    </section>
  );
}