// src/pages/Downloads.jsx
import { useEffect, useState } from 'react';
import { getDownloads } from '../utils/api';
import DownloadButton from '../components/DownloadButton';
import './Downloads.css';

export default function Downloads() {
  const [downloads, setDownloads] = useState([]);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    const fetchDownloads = async () => {
      if (!userId) return;
      try {
        const data = await getDownloads(userId);
        console.log('Raw download data:', data);
        const uniqueDownloads = data.filter(
          (item, index, self) =>
            index === self.findIndex(d => d.download_id === item.download_id)
        );

        setDownloads(uniqueDownloads);
        setError(null);
      } catch (error) {
        console.error('Error fetching downloads:', error);
        setError(error.message);
      }
    };
    fetchDownloads();
  }, [userId]);

  return (
    <div>
      <h2>My Downloads</h2>
      {error ? (
        <p>Error: {error}</p>
      ) : downloads.length > 0 ? (
        <>
          {downloads.map(dl => (
            <div key={`${dl.download_id}-${dl.order_id}`} style={{ marginBottom: '1rem' }}>
              <h3>Order #{dl.order_number ?? dl.order_id}</h3>
              <p>{dl.product_name}</p>
              <DownloadButton downloadId={dl.download_id} />
            </div>
          ))}
        </>
      ) : (
        <p>No downloads available.</p>
      )}
    </div>
  );
}
