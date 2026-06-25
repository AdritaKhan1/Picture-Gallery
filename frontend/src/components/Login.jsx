import { useState } from 'react';

const API = import.meta.env.VITE_API_URL || '';

function Login({ authToken, setAuthToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('${API}/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const result = await response.json();

      if (response.status === 200) {
        setAuthToken(result.token);
        setPassword('');
      } else {
        alert('Login failed: ' + result.error);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login request failed. Is the backend running?');
    }
  };

  const handleLogout = () => {
    setAuthToken('');
    setUsername('');
    setPassword('');
  };

  if (authToken) {
    return (
      <div id="logout-panel">
        <button type="button" onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  return (
    <div id="login-panel">
      <h2>Login</h2>
      <p className="login-caption">Please enter your username and password</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Enter</button>
      </form>
    </div>
  );
}

export default Login;
