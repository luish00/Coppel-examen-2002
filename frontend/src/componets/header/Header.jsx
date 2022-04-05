import React from 'react';

import './header.css';

const Header = ({title}) => (
  <header className='header-container'>
    <h1 className='m-l-16'>{title}</h1>
  </header>
);

export { Header };
