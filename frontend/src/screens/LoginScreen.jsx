import React, { useState, useCallback } from 'react';
import { useEffect } from 'react';

import { useApiPost, useInputState } from '../hooks';
import { saveToken } from '../utils/storage';

import './css/login.css';

const LoginScreen = ({ setToken }) => {
  const [loginData, login, isLoading] = useApiPost({ url: 'api/auth' });

  const [error, setError] = useState(false);
  const [remember, setRemember] = useState(false);

  const [user, onChangeUser] = useInputState('');

  useEffect(() => {
    if (!error) return;

    setError(false);
  }, [user]);

  const onSubmit = useCallback((event) => {
    event.preventDefault();

    if (isLoading) return;

    const onLogin = async () => {
      const response = await login({ body: { email: user } });

      const { data } = response;
      console.log('response', response)
      if (response.isValid) {
        saveToken({ value: data.accessToken, remember });
        setToken(data.accessToken)
      } else {
        setError(true)
      }
    };

    onLogin();
  }, [user, remember]);

  const handeRememberChange = useCallback(() => {
    setRemember((prev) => !prev);
  }, []);

  return (
    <div className="login-div">
      <form className="form-login" onSubmit={onSubmit} disabled={isLoading}>
        <img alt="logo" />

        <label htmlFor="inp-user">
          <span>Usuario</span>

          <input
            id="inp-user"
            disabled={isLoading}
            onChange={onChangeUser}
            placeholder="Usuario"
            type="email"
            className={`${error ? 'login-input-err' : ''}`}
            value={user}
          />
        </label>

        <div className='flex-row'>
          <input id="inp-remember" type="checkbox" onChange={handeRememberChange} />

          <label htmlFor="inp-remember">Reacordar</label>
        </div>

        {error && (
          <div className="login-error">
            <span>Usuario no autorizado.</span>
          </div>)}

        <button type="submit" disabled={!user || isLoading}>
          <span>{`${isLoading ? 'Cargando...' : 'Login'}`}</span>
        </button>
      </form>
    </div>
  );
};

export { LoginScreen };
