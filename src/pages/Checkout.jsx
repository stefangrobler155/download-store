// src/pages/Checkout.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { getUserEmail } from '../utils/api';
import './Checkout.css';

export default function Checkout({ setCart, handleRemoveItem }) {
  const [localCart, setLocalCart] = useState([]);
  const [billingDetails, setBillingDetails] = useState({
    first_name: 'Demo',
    last_name: 'User',
    email: 'demouser@user.co.za',
    phone: '0712345678',
    address_1: 'demo street 123',
    city: 'Demotown',
    state: 'demostate',
    postcode: '68878',
    country: 'South Africa',
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartAndUser = async () => {
      try {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        console.log('Cart contents:', JSON.stringify(storedCart, null, 2));
        setLocalCart(storedCart);

        const userId = localStorage.getItem('user_id');
        console.log('User ID from localStorage:', userId);
        if (userId) {
          const email = await getUserEmail(userId);
          console.log('Fetched user email:', email);
          setBillingDetails((prev) => ({ ...prev, email }));
        }
      } catch (error) {
        console.error('Error fetching cart or user:', error);
        toast.error('Failed to load cart or user data.');
      }
    };
    fetchCartAndUser();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillingDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleRemove = (item) => {
    if (window.confirm(`Remove ${item.name} from cart?`)) {
      handleRemoveItem(item);
      const updatedCart = localCart.filter((cartItem) => cartItem.id !== item.id);
      setLocalCart(updatedCart);
      setCart(updatedCart); // Update parent cart state
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      toast.success(`${item.name} removed from cart!`);
    }
  };

  const calculateTotal = () => {
    return localCart
      .reduce((total, item) => {
        const price = parseFloat(item.price) || 0;
        return total + price * (item.quantity || 1);
      }, 0)
      .toFixed(2);
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (localCart.length === 0) {
      toast.error('Your cart is empty.');
      return;
    }
    setIsLoading(true);
    try {
      const userId = localStorage.getItem('user_id');
      console.log('User ID before order creation:', userId);

      const lineItems = localCart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity || 1,
      }));
      console.log('Line items for order:', lineItems);

      const orderData = {
        payment_method: 'cod',
        payment_method_title: 'Cash on Delivery',
        set_paid: true,
        billing: billingDetails,
        shipping: billingDetails,
        line_items: lineItems,
        customer_id: userId ? parseInt(userId) : 0,
      };
      console.log('Order data being sent:', JSON.stringify(orderData, null, 2));

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/orders`,
        orderData,
        {
          headers: {
            Authorization: `Basic ${btoa(
              `${import.meta.env.VITE_CONSUMER_KEY}:${import.meta.env.VITE_CONSUMER_SECRET}`
            )}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Full response object:', response);
      console.log('Order response:', JSON.stringify(response.data, null, 2));
      console.log('Order customer_id:', response.data.customer_id);
      console.log('Order downloads:', response.data.downloads || 'No downloads field');

      if (response.data.id && response.data.status !== 'failed') {
        localStorage.removeItem('cart');
        setLocalCart([]);
        setCart([]); // Update parent cart state
        toast.success('Order placed successfully!');
        navigate(`/order-confirmation/${response.data.id}`);
      } else {
        throw new Error('Order created but marked as failed in WooCommerce');
      }
    } catch (error) {
      console.error('Detailed checkout error:', {
        message: error.message,
        response: error.response ? {
          status: error.response.status,
          data: JSON.stringify(error.response.data, null, 2),
          headers: error.response.headers,
        } : 'No response data',
        stack: error.stack,
      });
      if (!error.response?.data?.id || error.response?.data?.status === 'failed') {
        toast.error('Checkout failed: ' + (error.response?.data?.message || error.message));
      } else {
        localStorage.removeItem('cart');
        setLocalCart([]);
        setCart([]);
        toast.success('Order placed successfully, but there was a minor issue. Please check your order in the dashboard.');
        navigate(`/order-confirmation/${error.response.data.id}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <h1 className="checkout-title">Checkout</h1>
      <div className="checkout-container">
        <div className="billing-section">
          <h2 className="section-title">Billing Details</h2>
          <form onSubmit={handleCheckout} className="billing-form">
            <div className="form-group">
              <label htmlFor="first_name" className="form-label">First Name</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={billingDetails.first_name}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter first name"
                required
                aria-required="true"
              />
            </div>
            <div className="form-group">
              <label htmlFor="last_name" className="form-label">Last Name</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={billingDetails.last_name}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter last name"
                required
                aria-required="true"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={billingDetails.email}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter email"
                required
                aria-required="true"
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone" className="form-label">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={billingDetails.phone}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter phone number"
              />
            </div>
            <div className="form-group">
              <label htmlFor="address_1" className="form-label">Address</label>
              <input
                type="text"
                id="address_1"
                name="address_1"
                value={billingDetails.address_1}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter address"
                required
                aria-required="true"
              />
            </div>
            <div className="form-group">
              <label htmlFor="city" className="form-label">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={billingDetails.city}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter city"
                required
                aria-required="true"
              />
            </div>
            <div className="form-group">
              <label htmlFor="state" className="form-label">State</label>
              <input
                type="text"
                id="state"
                name="state"
                value={billingDetails.state}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter state"
              />
            </div>
            <div className="form-group">
              <label htmlFor="postcode" className="form-label">Postcode</label>
              <input
                type="text"
                id="postcode"
                name="postcode"
                value={billingDetails.postcode}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter postcode"
                required
                aria-required="true"
              />
            </div>
            <div className="form-group">
              <label htmlFor="country" className="form-label">Country</label>
              <input
                type="text"
                id="country"
                name="country"
                value={billingDetails.country}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter country"
                required
                aria-required="true"
              />
            </div>
            <button
              type="submit"
              className={`submit-btn ${isLoading ? 'btn-loading' : ''}`}
              disabled={isLoading}
              aria-label={isLoading ? 'Processing order' : 'Place order'}
            >
              {isLoading ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>
        <div className="order-summary-section">
          <h2 className="section-title">Order Summary</h2>
          {localCart.length > 0 ? (
            <div className="order-summary">
              <table className="order-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {localCart.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.quantity || 1}</td>
                      <td>R{parseFloat(item.price || 0).toFixed(2)}</td>
                      <td>
                        <button
                          className="remove-btn"
                          onClick={() => handleRemove(item)}
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="2">Total</td>
                    <td>R{calculateTotal()}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <p className="no-data-message">Your cart is empty.</p>
          )}
        </div>
      </div>
    </div>
  );
}