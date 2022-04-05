import React from 'react';

import './buttonColored.css';

const ButtonColored = ({ className, disabled, onClick, text, icon }) => (
  <button
    className={`button-colored ${className}`}
    onClick={onClick}
    disabled={disabled}
  >
    {icon && <span className="material-icons m-r-8">{icon}</span>}
    {text}
  </button>
);

export { ButtonColored };