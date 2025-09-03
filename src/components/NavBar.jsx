import { Link } from 'react-router-dom';
import { useState } from 'react';
import { FiMenu, FiX, FiHome, FiImage, FiShoppingCart, FiUser, FiLogIn, FiLogOut, FiGrid } from 'react-icons/fi';
import { FaHeart } from "react-icons/fa";
import './NavBar.css';

export default function NavBar({ cartItem, wishlist, handleLogout, isLoggedIn }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link className="nav-brand" to="/">
          <FiImage className="icon" /> IMAGEVAULT
        </Link>

        <button 
          className="nav-toggle" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          
          <li>
            <Link className="nav-link" to="/products" onClick={() => setIsMenuOpen(false)}>
              <FiGrid className="icon" /> Products
            </Link>
          </li>
          
          {wishlist.length > 0 && (
              <li className="nav-item">
                <Link className="nav-link" to="/wishlist">
                  <FaHeart className="icon" /> Wishlist ({wishlist.length})
                </Link>
              </li>
            )}
          <li>
            <Link className="nav-link" to="/cart" onClick={() => setIsMenuOpen(false)}>
              <FiShoppingCart className="icon" /> 
              Cart <span className="cart-count">{cartItem.length}</span>
            </Link>
          </li>
          {isLoggedIn ? (
            <>
              <li>
                <Link className="nav-link" to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                  <FiUser className="icon" /> Dashboard
                </Link>
              </li>
              <li>
                <button 
                  className="logout-btn" 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                >
                  <FiLogOut className="icon" /> Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link className="nav-link" to="/auth" onClick={() => setIsMenuOpen(false)}>
                <FiLogIn className="icon" /> Login
              </Link>
            </li>
          )}
          
        </ul>
      </div>
    </nav>
  );
}