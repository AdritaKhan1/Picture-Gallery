import { useState } from 'react';
import Login from './components/Login';
import Upload from './components/Upload';
import Items from './components/Items';
import './css/App.css';

function App() {
  const [authToken, setAuthToken] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const handleRefresh = () => setRefreshTrigger(prev => !prev);

  return (
    <>
      <h1>My Pictures</h1>

      {!authToken && <Login authToken={authToken} setAuthToken={setAuthToken} />}

      {authToken && (
        <>
          <Upload authToken={authToken} onChanged={handleRefresh} />
          <Items
            authToken={authToken}
            refreshTrigger={refreshTrigger}
            onChanged={handleRefresh}
          />
          <Login authToken={authToken} setAuthToken={setAuthToken} />
        </>
      )}
    </>
  );
}

export default App;
