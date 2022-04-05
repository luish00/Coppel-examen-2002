import React, { useEffect, useState } from 'react';

import { HomeScreen, LoginScreen } from './screens';
import { Header } from './componets/header';

import { getToken } from './utils/storage';

import './App.css';

function App() {
  const [token, setToken] = useState('');

  useEffect(() => {
    async function loadToken() {
      const lastToken = await getToken();

      if (lastToken) {
        setToken(lastToken);
      }
    };

    loadToken();
  }, []);

  return (
    <div className="App">
      <Header title={token ? 'Home' : 'Login'} />

      {!token ? (<LoginScreen setToken={setToken} />) : (<HomeScreen />)}
    </div>
  );
}

export default App;
