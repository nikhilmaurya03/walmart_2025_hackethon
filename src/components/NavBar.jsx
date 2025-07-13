import React, { useState } from 'react';
import './NavBar.css';
function NavBar() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="wmt-nav">
     
      <div className="wmt-nav-item wmt-nav-dropdowns">
        <div className="wmt-dropdown">
          <a href="/departments">
            Departments <span className="wmt-arrow">▼</span>
          </a>
        </div>
        <div className="wmt-dropdown">
          <a href="/services">
            Services <span className="wmt-arrow">▼</span>
          </a>
        </div>
      </div>

      
      <div className="wmt-nav-item wmt-nav-toggle" onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
        ☰
      </div>

    
      <ul className={`wmt-nav-item wmt-nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
        <li><a href="/deals">Deals</a></li>
        <li><a href="/categories">Categories</a></li>
        <li><a href="/membership">Membership</a></li>
        <li><a href="/storefinder">Find a Store</a></li>
      </ul>

      <div className="wmt-nav-item wmt-nav-actions">
        <button className="wmt-btn wmt-signin-btn">Sign In</button>
        <button className="wmt-btn wmt-cart-btn">Cart (0)</button>
      </div>
    </nav>
  );
}

export default NavBar