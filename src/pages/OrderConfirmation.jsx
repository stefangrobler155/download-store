// src/pages/OrderConfirmation.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import './OrderConfirmation.css';

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
      const fetchOrder = async () => {
        try {
          const token = localStorage.getItem('jwt');
          if (!token) {
            throw new Error('No authentication token found');
          }
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/orders/${orderId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );
          console.log('Order details:', JSON.stringify(response.data, null, 2));
          setOrder(response.data);
        } catch (error) {
          console.error('Error fetching order:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
          });
          toast.error('Failed to load order details. Please check your order in the dashboard.');
          setTimeout(() => navigate('/dashboard'), 3000);
        } finally {
          setIsLoading(false);
        }
      };
    fetchOrder();
  }, [orderId, navigate]);

  if (isLoading) {
    return <div className="loading-message">Loading order details...</div>;
  }

  if (!order) {
    return (
      <div className="order-confirmation-page">
        <h1 className="confirmation-title">Order Confirmation</h1>
        <p className="error-message">
          Unable to load order details for Order #{orderId}. Please check your order in the{' '}
          <a href="/dashboard" className="dashboard-link">
            dashboard
          </a>.
        </p>
      </div>
    );
  }

  return (
    <div className="order-confirmation-page">
      <h1 className="confirmation-title">Order Confirmation</h1>
      <p className="confirmation-message">
        Thank you for your order! Your order #{order.id} has been placed successfully.
      </p>
      <div className="order-details">
        <h2 className="section-title">Order Details</h2>
        <table className="order-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {order.line_items.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>R{(parseFloat(item.price) || 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="2">Total</td>
              <td>R{(parseFloat(order.total) || 0).toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="billing-details">
        <h2 className="section-title">Billing Information</h2>
        <p>
          {order.billing.first_name} {order.billing.last_name}<br />
          {order.billing.address_1}, {order.billing.city}, {order.billing.postcode}<br />
          {order.billing.country}<br />
          Email: {order.billing.email}<br />
          Phone: {order.billing.phone}
        </p>
      </div>
      <button
        className="dashboard-btn"
        onClick={() => navigate('/dashboard')}
        aria-label="Go to dashboard"
      >
        Go to Dashboard
      </button>
    </div>
  );
}