export async function downloadFile(downloadId, token) {
  const url = `https://test.sfgweb.co.za/wp-json/jwt-wc/v1/download/${downloadId}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`${response.status}  ${errorText}`);
  }

  // Trigger browser download
  const blob = await response.blob();
  const downloadUrl = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = 'file'; // Browser will use server's filename if available
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(downloadUrl);
}
