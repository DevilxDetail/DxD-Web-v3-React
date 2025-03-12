import React, { Fragment, useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { usePrivy } from "@privy-io/react-auth";
import PropTypes from 'prop-types'

import './header.css'

const Header = (props) => {
  const { login, logout, authenticated, user } = usePrivy();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className={`header-header ${props.rootClassName} `}>
      <div className="header-logo-container">
        <Link to="/" className="header-navlink1">
          <img
            alt="DxD Logo"
            src="/icon-white-200h.png"
            className="header-icon-black"
          />
        </Link>
      </div>
      <div className="header-container">
        <Link to="/about" className="header-navlink2">
          {props.text ?? (
            <Fragment>
              <span className="header-text6">About DxD</span>
            </Fragment>
          )}
        </Link>
        
        {authenticated ? (
          <div className="header-profile-dropdown" ref={dropdownRef}>
            <div className="header-avatar-container" onClick={toggleDropdown}>
              <img 
                src={user?.profilePictureUrl || "/placeholder-image.svg"} 
                alt="Profile" 
                className="header-avatar"
              />
            </div>
            {dropdownOpen && (
              <div className="header-dropdown-menu">
                <Link to="/profile" className="header-dropdown-item" onClick={() => setDropdownOpen(false)}>
                  My Profile
                </Link>
                <Link to="/account" className="header-dropdown-item" onClick={() => setDropdownOpen(false)}>
                  My Account
                </Link>
                <div className="header-dropdown-item" onClick={() => { logout(); setDropdownOpen(false); }}>
                  Disconnect
                </div>
              </div>
            )}
          </div>
        ) : (
          <button type="button" className="header-button button" onClick={login}>
            <span>
              <Fragment>
                <span className="header-text8">CONNECT</span>
              </Fragment>
            </span>
          </button>
        )}
      </div>
    </div>
  )
}

Header.defaultProps = {
  text: undefined,
  rootClassName: '',
}

Header.propTypes = {
  text: PropTypes.element,
  rootClassName: PropTypes.string,
}

export default Header
