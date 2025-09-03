import { FaCamera } from 'react-icons/fa';

export default function Loader() {
  return (
    <div className="loader-overlay">
      <div className="aperture-loader">
        <FaCamera className="camera-icon" />
        <div className="aperture-ring"></div>
      </div>
      <p className="loading-text">Developing your view...</p>
    </div>
  );
}