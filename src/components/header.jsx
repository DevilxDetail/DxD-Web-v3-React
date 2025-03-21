import React, { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { usePrivy } from "@privy-io/react-auth";
import { supabase } from '../lib/supabase'
import PropTypes from 'prop-types'

import './header.css'

const Header = (props) => {
  const { login, authenticated, user, logout } = usePrivy();
  const [profileImage, setProfileImage] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    async function fetchUserProfile() {
      if (authenticated && user?.id) {
        try {
          const { data, error } = await supabase
            .from('user')
            .select('profile_image')
            .eq('auth_user_id', user.id)
            .single();

          if (error) {
            console.error('Error fetching profile image:', error);
            return;
          }

          if (data?.profile_image) {
            setProfileImage(data.profile_image);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }
    }

    fetchUserProfile();
  }, [authenticated, user]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
  };

  return (
    <div className="header-container">
      <header className="header-header">
        <div className="header-logo-container">
          <Link to="/" className="header-navlink1">
            <img
              alt="DxD"
              src="/icon - white-200h.png"
              className="header-icon-black"
            />
          </Link>
        </div>
        <div className="header-container">
          <Link to="/about" className="header-navlink2">
            {props.text}
          </Link>
          {authenticated ? (
            <div className="header-profile-dropdown">
              <div className="header-avatar-container" onClick={toggleDropdown}>
                <img
                  src={profileImage || "/placeholder-image.svg"}
                  alt="Profile"
                  className="header-avatar"
                />
              </div>
              {dropdownOpen && (
                <div className="header-dropdown-menu">
                  <Link to="/profile" className="header-dropdown-item">
                    Profile
                  </Link>
                  <Link to="/account" className="header-dropdown-item">
                    Account
                  </Link>
                  <div className="header-dropdown-item" onClick={handleLogout}>
                    Disconnect
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button onClick={login} className="header-button">
              CONNECT
            </button>
          )}
        </div>
      </header>
    </div>
  )
}

Header.defaultProps = {
  image_src: '5ff0171d-9c8f-43f7-8c1c-c0d3f7c8b7ef',
  image_alt: 'image',
  iconBlackSrc: '/icon - white-200h.png',
  text: 'About DxD',
}

Header.propTypes = {
  image_src: PropTypes.string,
  image_alt: PropTypes.string,
  iconBlackSrc: PropTypes.string,
  text: PropTypes.node,
}

export default Header
