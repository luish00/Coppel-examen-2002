import React from 'react';

import './shimmer.css';

const Shimmer = ({
  borderRadius = 8,
  children,
  className = '',
  element,
  height = 0,
  visible = true,
  width = 0,
}) => {
  function isVisible() {
    if (visible) {
      return `${className} Shimmer`;
    }

    return className || '';
  }

  function styles() {
    if (!visible) {
      return {};
    }

    const style = { borderRadius: borderRadius };

    if (height) {
      style.height = height;
    }

    if (width) {
      style.width = width;
    }

    return style;
  }

  switch (element) {
    case 'span': {
      return (
        <span className={isVisible()} style={styles()}>
          {children}
        </span>
      );
    }

    case 'td':
      return (
        <td className={isVisible()} style={styles()}>
          {children}
        </td>
      )

    default: return (
      <div className={isVisible()} style={styles()}>
        {children}
      </div>
    );
  }
};

export { Shimmer };
