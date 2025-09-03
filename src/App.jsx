// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Footer from './components/Footer';
import NavBar from './components/NavBar';
import Products from './pages/Products';
import Auth from './pages/Auth';
import SingleProduct from './pages/SingleProduct';
import Dashboard from './pages/Dashboard';
import { ToastContainer, toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { loginUser, logoutUser, registerUser } from './utils/api';
import OrderConfirmation from './pages/OrderConfirmation';
import Wishlist from './pages/Wishlist';

export default function App() {
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart')) || []);
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem('wishlist')) || []);
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('jwt')); // Initialize from localStorage
  const [userName, setUserName] = useState(() => localStorage.getItem('user_name') || ''); // Store user name

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('user_name', userName);
  }, [userName]);

  const addToCart = (product) => {
    const currentCart = [...cart];
    const productExists = currentCart.find((item) => item.id === product.id);

    if (productExists) {
      productExists.quantity += 1;
    } else {
      product.quantity = 1;
      currentCart.push(product);
    }

    setCart(currentCart);
    toast.success('Item Added To Cart');
  };

  const removeCartItem = (product) => {
    if (window.confirm('You are about to remove this item from your cart!')) {
      const updatedCart = cart.filter((item) => item.id !== product.id);
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      toast.success('Product removed from Cart!');
    }
  };

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        toast.info("Removed from Wishlist");
        return prev.filter((item) => item.id !== product.id);
      } else {
        toast.success("Added to Wishlist");
        return [...prev, product];
      }
    });
  };

  const handleLogin = async (username, password) => {
    try {
      const response = await loginUser(username, password);
      localStorage.setItem('jwt', response.token);
      localStorage.setItem('user_id', response.user_id);
      localStorage.setItem('user_name', response.user_name || username); // Store user name
      setIsLoggedIn(true);
      setUserName(response.user_name || username);
      toast.success('Login successful!');
      return response;
    } catch (error) {
      toast.error('Login failed: ' + (error.response?.data?.message || error.message));
      throw error;
    }
  };

  const handleSignup = async (userData) => {
    try {
      const response = await registerUser(userData);
      localStorage.setItem('jwt', response.token);
      localStorage.setItem('user_id', response.user_id);
      localStorage.setItem('user_name', userData.name); // Store user name
      setIsLoggedIn(true);
      setUserName(userData.name);
      toast.success('User signed up successfully!');
      return response;
    } catch (error) {
      toast.error('Signup failed: ' + (error.response?.data?.message || error.message));
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setCart([]);
      setWishlist([]);
      setIsLoggedIn(false);
      setUserName('');
      localStorage.removeItem('jwt');
      localStorage.removeItem('user_id');
      localStorage.removeItem('user_name');
      localStorage.setItem('cart', JSON.stringify([]));
      localStorage.setItem('wishlist', JSON.stringify([]));
      toast.success('Logged out successfully!');
    } catch (error) {
      toast.error('Logout failed: ' + error.message);
    }
  };

  function ProtectedRoute({ children }) {
    return isLoggedIn ? children : <Navigate to="/auth" />;
  }

  return (
    <>
      <NavBar
        cartItem={cart}
        wishlist={wishlist}
        handleLogout={handleLogout}
        isLoggedIn={isLoggedIn}
        userName={userName}
      />
      <div className="container">
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/products"
            element={
              <Products
                handleAddToCart={addToCart}
                wishlist={wishlist}
                toggleWishlist={toggleWishlist}
              />
            }
          />
          <Route
            path="/cart"
            element={
              <Cart
                handleRemoveItem={removeCartItem}
                cart={cart}
                setCart={setCart}
              />
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout
                  handleRemoveItem={removeCartItem}
                  cart={cart}
                  setCart={setCart} // Ensure this is 'setCart', not 'setCartProp'
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-confirmation/:orderId"
            element={<OrderConfirmation />}
          />
          <Route
            path="/auth"
            element={
              <Auth
                handleLogin={handleLogin}
                handleSignup={handleSignup}
                handleLogout={handleLogout}
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
                userName={userName}
                setUserName={setUserName}
              />
            }
          />
          <Route
            path="/product/:productId"
            element={<SingleProduct handleAddToCart={addToCart} />}
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <Wishlist
                wishlist={wishlist}
                toggleWishlist={toggleWishlist}
                handleAddToCart={addToCart}
              />
            }
          />
        </Routes>
      </div>
      <Footer />
    </>
  );
}