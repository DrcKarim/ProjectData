import React from 'react';
import useStore from '../store';
import { FaMoon, FaSun } from 'react-icons/fa';
import './Header.css';

/**
 * Header Component with Dark Mode Toggle
 */
function Header() {
  const { darkMode, toggleDarkMode } = useStore();

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-title">
          <h1>📊 Data Visualization Explorer</h1>
          <p>Interactive analysis of tabular and text data</p>
        </div>
        
        <div className="header-controls">
          <button
            className="dark-mode-toggle"
            onClick={toggleDarkMode}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
