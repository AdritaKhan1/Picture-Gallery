import { useState, useEffect } from 'react';
import ImageBox from './ImageBox';

function Items({ authToken, refreshTrigger, onChanged }) {
  const [items, setItems] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editInfo, setEditInfo]   = useState('');
  const [editImage, setEditImage] = useState(null);

  const loadItems = async () => {
    try {
      const response = await fetch('/api/items');
      setItems(await response.json());
    } catch (error) {
      console.error('Error loading items:', error);
    }
  };

  useEffect(() => { loadItems(); }, [refreshTrigger]);

  const startEdit = (item) => {
    setEditingId(item._id);
    setEditTitle(item.title);
    setEditInfo(item.info);
    setEditImage(null);
  };

  const saveEdit = async (e, id) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', editTitle);
    data.append('info', editInfo);
    if (editImage) data.append('image', editImage);

    try {
      const response = await fetch(`/api/items/${id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${authToken}` },
        body: data
      });
      if (response.status === 200) {
        setEditingId(null);
        if (onChanged) onChanged();
      } else {
        const result = await response.json();
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('Error editing:', error);
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Delete this picture?')) return;
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (response.status === 204) {
        if (onChanged) onChanged();
      } else {
        const result = await response.json();
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  if (items.length === 0) {
    return (
        <div id="items">
        <h2>My Gallery</h2>
        <p>No pictures uploaded yet.</p>
      </div>
    );
  }

  return (
    <div id="items">
      <h2>My Gallery</h2>
      {items.map(item => (
        <div key={item._id} className="item">
          {editingId === item._id ? (
            <form onSubmit={(e) => saveEdit(e, item._id)}>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Information"
                value={editInfo}
                onChange={(e) => setEditInfo(e.target.value)}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setEditImage(e.target.files[0])}
              />
              <button type="submit">Save</button>
              <button type="button" onClick={() => setEditingId(null)}>Cancel</button>
            </form>
          ) : (
            <>
            <ImageBox
              image={`/uploads/${item.image}`}
              title={item.title}
              info={item.info}
            />

            <p className="item-title">{item.title}</p>
            <p className="item-info">{item.info}</p>

            <button className="edit-button" onClick={() => startEdit(item)}>Edit</button>
            <button className="delete-button" onClick={() => deleteItem(item._id)}>Delete</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default Items;
