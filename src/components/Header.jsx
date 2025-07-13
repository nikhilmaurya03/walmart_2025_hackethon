import React from "react";
import './Header.css'
function Header() {
  return (
    <header className="wmt-header">
      
      <div className="wmt-header-left">
        <a href="/" className="wmt-logo-link">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Walmart_logo.svg/320px-Walmart_logo.svg.png"
            alt="Walmart"
            className="wmt-logo"
          />
        </a>
        <div className="wmt-location">
          <span className="wmt-location-icon">📍</span>
          <span className="wmt-location-text">
            <strong>How do you want your items?</strong>
            <br />
            <small>Enter ZIP code or select store</small>
          </span>
        </div>
      </div>

   
      <div className="wmt-search">
        <input type="text" placeholder="Search everything at Walmart online and in store" />
        <button className="wmt-search-button">🔍</button>
      </div>

      
      <div className="wmt-header-right">
        <div className="wmt-account">
          <span>👤</span>
          <span>Sign In</span>
        </div>
        <div className="wmt-cart">
          🛒
          <span className="wmt-cart-count">0</span>
        </div>
      </div>
    </header>
  );
}

export default Header
