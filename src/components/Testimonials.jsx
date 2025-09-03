import { useState } from "react";
import "./Testimonials.css"; 
export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      quote: "The print quality exceeded my expectations. The colors are vibrant and true to the digital preview.",
      author: "Sarah J., Interior Designer",
      rating: 5
    },
    {
      id: 2,
      quote: "I've purchased three pieces for my office and get compliments daily. The framing options are excellent.",
      author: "Michael T., Art Collector",
      rating: 5
    }
    ,
    {
      id: 3,
      quote: "The customer service was outstanding. They helped me choose the perfect piece for my living room.",  
      author: "Emily R., Homeowner",
      rating: 5 
    }
  ];
  const goToPrev = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? testimonials.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === testimonials.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };
  return (
    <section className="testimonials">
      <h2 className="testimonial-title">What People Say</h2>
      <div className="testimonials-container">
        

      <div className="testimonial-slider-container">
            
            <div className="slider-wrapper">
              <div className="slider">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={testimonial.id}
                    className={`slide ${index === currentIndex ? 'active' : ''}`}
                  >
                    <div className="testimonial-content">
                      <p className="testimonial-text">"{testimonial.quote}"</p>
                      <div className="testimonial-author">
                        <div className="author-info">
                          <h4 className="author-name">{testimonial.author}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="slider-btn prev" onClick={goToPrev}>
                &lt;
              </button>
              <button className="slider-btn next" onClick={goToNext}>
                &gt;
              </button>
            </div>
            <div className="dots-container">
              {testimonials.map((_, index) => (
                <div
                  key={index}
                  className={`dot ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
          </div>
          <div className="testimonial-image-container">
          <img 
            src="/testimoial-img.jpg" 
            alt="Testimonials" 
            className="testimonial-image"
          />
        </div>
          </div>
    </section>
  );
}