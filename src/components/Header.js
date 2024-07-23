import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">Supply Chain Dashboard</h1>
        <nav className="header-nav">
          <Link to="/" className="header-link">Dashboard</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
