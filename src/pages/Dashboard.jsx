// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { getUserProfile, getOrders, getDownloads } from '../utils/api';
import DownloadButton from '../components/DownloadButton';
import './Dashboard.css';

export default function Dashboard() {
  const userId = localStorage.getItem('user_id');
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [downloads, setDownloads] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); 
  // Utility function to format ISO date
  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    const optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };
    const optionsTime = { hour: 'numeric', minute: 'numeric', hour12: true };
    const formattedDate = new Intl.DateTimeFormat('en-US', optionsDate).format(date);
    const formattedTime = new Intl.DateTimeFormat('en-US', optionsTime).format(date);
    return `${formattedDate} at ${formattedTime}`;
  };

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        // Get user profile
        const profile = await getUserProfile(userId);
        setUser(profile);

        // Get orders for this user
        const orderData = await getOrders(userId);
        setOrders(orderData);

        // Get available downloads
        const downloadData = await getDownloads(userId);

        // Remove duplicate downloads by ID + order_number
        const uniqueDownloads = downloadData.filter(
          (dl, index, self) =>
            index ===
            self.findIndex(
              (t) =>
                t.download_id === dl.download_id &&
                t.order_number === dl.order_number
            )
        );

        setDownloads(uniqueDownloads);
      } catch (err) {
        console.error('Error loading dashboard:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (!userId) {
    return <p className="error-message">Please log in to view your dashboard.</p>;
  }

  if (loading) {
    return <p className="loading-message">Loading your dashboard...</p>;
  }

  return (
    <div className="dashboard-page">
      {error && <p className="error-message">Error: {error}</p>}

      {user && <h4 className="welcome-message">Welcome back, {user.first_name || user.username}!</h4>}

      <section className="orders-section">
        <h3 className="section-title">My Orders</h3>
        {orders.length > 0 ? (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Status</th>
                <th>Total</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.number}</td>
                  <td>{order.status}</td>
                  <td>{order.total} {order.currency}</td>
                  <td>{formatDate(order.date_created)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-data-message">No orders found.</p>
        )}
      </section>

      <section className="downloads-section">
        <h3 className="section-title">My Downloads</h3>
        {downloads.length > 0 ? (
          <div className="downloads-grid">
            {Object.entries(
              downloads.reduce((acc, dl) => {
                const orderNum = dl.order_id || 'Unknown';
                if (!acc[orderNum]) {
                  acc[orderNum] = [];
                }
                acc[orderNum].push(dl);
                return acc;
              }, {})
            ).map(([orderNumber, orderDownloads]) => (
              <div key={orderNumber} className="order-group">
                <h4 className="order-group-title">Order #{orderNumber}</h4>
                <div className="download-cards">
                  {orderDownloads.map((dl) => (
                    <div key={dl.download_id} className="download-card">
                      <img
                        src={dl.file?.file || '/placeholder.png'}
                        alt={dl.product_name}
                        className="download-image"
                      />
                      <div className="download-info">
                        <strong className="download-name">{dl.product_name}</strong>
                        <DownloadButton downloadId={dl.download_id} className="download-btn" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data-message">No downloads available.</p>
        )}
      </section>
    </div>
  );
}