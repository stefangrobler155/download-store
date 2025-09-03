// src/pages/Cart.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import './Cart.css';

export default function Cart({ handleRemoveItem, cart, setCart }) {
  const [cartItems, setCartItems] = useState(cart);
  const navigate = useNavigate();

  const redirectToCheckout = () => {
    navigate("/checkout");
  };

  useEffect(() => {
    setCartItems(cart || []);
  }, [cart]);

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      toast.error("Quantity must be at least 1.");
      return;
    }
    const updatedCart = cartItems.map((item) =>
      item.id === itemId ? { ...item, quantity: Number(newQuantity) } : item
    );
    setCartItems(updatedCart);
    setCart(updatedCart);
    toast.success("Quantity updated!");
  };

  const calcCartTotal = () => {
    return cartItems
      .reduce((total, item) => {
        const price = item.price ? parseFloat(item.price) : 0;
        return total + price * item.quantity;
      }, 0)
      .toFixed(2);
  };

  return (
    <div className="cart-page">
      <h1>Cart</h1>
      <div className="empty-cart-message">
        {cartItems.length <= 0 && <p>Your cart is empty.</p>}
      </div>
      {cartItems.length > 0 && (
        <div className="cart-items">
          <table className="cart-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((cartItem) => (
                <tr key={cartItem.id}>
                  <td data-label="Image">
                    <img
                      src={cartItem?.images?.[0]?.src || "/placeholder-image.jpg"}
                      alt={cartItem?.images?.[0]?.alt || cartItem.name}
                    />
                  </td>
                  <td data-label="Product">{cartItem.name}</td>
                  <td data-label="Price">
                    R {(cartItem.quantity * cartItem.price).toFixed(2)}
                    {cartItem.on_sale && (
                      <span className="cart-regular-price">
                        <br />R {(cartItem.regular_price * cartItem.quantity).toFixed(2)}
                      </span>
                    )}
                  </td>
                  <td data-label="Quantity">
                    <div className="quantity-control">
                      <button
                        className="quantity-btn-decrement"
                        onClick={() => updateQuantity(cartItem.id, cartItem.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={cartItem.quantity}
                        min="1"
                        onChange={(e) => updateQuantity(cartItem.id, e.target.value)}
                        className="quantity-input"
                        aria-label="Quantity"
                      />
                      <button
                        className="quantity-btn-increment"
                        onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td data-label="Action">
                    <button
                      className="remove-btn"
                      onClick={() => handleRemoveItem(cartItem)}
                      aria-label="Remove item"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="cart-summary">
            <span className="cart-total">Total: R {calcCartTotal()}</span>
            <button className="checkout-btn" onClick={redirectToCheckout}>
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}