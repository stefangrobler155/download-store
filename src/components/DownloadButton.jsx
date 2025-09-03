// src/components/DownloadButton.jsx
import { useState } from 'react';
import { downloadFile } from '../utils/download';
import './DownloadButton.css'; // Assuming you have a CSS file for styles

export default function DownloadButton({ downloadId, className = '' }) {
  const token = localStorage.getItem('jwt');
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      await downloadFile(downloadId, token);
    } catch (err) {
      console.error('Download failed:', err);
      alert('Download failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className={`download-btn ${className} ${loading ? 'btn-loading' : ''}`}
      aria-label={loading ? 'Downloading file' : 'Download file'}
    >
      {loading ? 'Downloading…' : 'Download'}
    </button>
  );
}