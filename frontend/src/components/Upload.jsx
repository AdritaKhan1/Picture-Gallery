import { useState } from 'react';

function Upload({ authToken, onChanged }) {
  const [title, setTitle] = useState('');
  const [info, setInfo]   = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) { alert('Please choose a picture.'); return; }

    // send the picture + text together as multipart form-data
    const data = new FormData();
    data.append('title', title);
    data.append('info', info);
    data.append('image', image);

    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}` },   // no Content-Type for FormData
        body: data
      });
      if (response.status === 201) {
        setTitle('');
        setInfo('');
        setImage(null);
        e.target.reset();        // clear the file input
        if (onChanged) onChanged();
      } else {
        const result = await response.json();
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('Error uploading:', error);
    }
  };

  return (
    <div id="upload">
      <h2>Upload your Pictures</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Information"
          value={info}
          onChange={(e) => setInfo(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />
        <button className="upload-button" type="submit">Upload</button>
      </form>
    </div>
  );
}

export default Upload;
