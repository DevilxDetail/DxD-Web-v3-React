import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { usePrivy } from "@privy-io/react-auth";
import PropTypes from 'prop-types'

import './header.css'

const Header = (props) => {
  const { login, logout, authenticated, user } = usePrivy();
  return (
    <div className={`header-header ${props.rootClassName} `}>
      <div data-thq="thq-dropdown" className="header-thq-dropdown list-item">
        <div data-thq="thq-dropdown-toggle" className="header-dropdown-toggle1">
          <div data-thq="thq-dropdown-arrow" className="header-dropdown-arrow">
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path
                d="M3 5h18M3 12h18M3 19h18"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
          </div>
        </div>
        <ul data-thq="thq-dropdown-list" className="header-dropdown-list">
          <li data-thq="thq-dropdown" className="header-dropdown1 list-item">
            <div
              data-thq="thq-dropdown-toggle"
              className="header-dropdown-toggle2"
            >
              <span className="header-my-account">
                {props.myAccount ?? (
                  <Fragment>
                    <span className="header-text4">My Account</span>
                  </Fragment>
                )}
              </span>
            </div>
          </li>
          <li data-thq="thq-dropdown" className="header-dropdown2 list-item">
            <div
              data-thq="thq-dropdown-toggle"
              className="header-dropdown-toggle3"
            >
              <span className="header-drops">
                {props.drops ?? (
                  <Fragment>
                    <span className="header-text7">Drops</span>
                  </Fragment>
                )}
              </span>
            </div>
          </li>
          <li data-thq="thq-dropdown" className="header-dropdown3 list-item">
            <div
              data-thq="thq-dropdown-toggle"
              className="header-dropdown-toggle4"
            >
              <span className="header-thoughts">
                {props.thoughts ?? (
                  <Fragment>
                    <span className="header-text6">Thoughts</span>
                  </Fragment>
                )}
              </span>
            </div>
          </li>
          <li data-thq="thq-dropdown" className="header-dropdown4 list-item">
            <div
              data-thq="thq-dropdown-toggle"
              className="header-dropdown-toggle5"
            >
              <span className="header-affinity">
                {props.affinity ?? (
                  <Fragment>
                    <span className="header-text3">Affinity</span>
                  </Fragment>
                )}
              </span>
            </div>
          </li>
          <li data-thq="thq-dropdown" className="header-dropdown5 list-item">
            <div
              data-thq="thq-dropdown-toggle"
              className="header-dropdown-toggle6"
            >
              <span className="header-about-us">
                {props.aboutUs ?? (
                  <Fragment>
                    <span className="header-text5">About Us</span>
                  </Fragment>
                )}
              </span>
            </div>
          </li>
        </ul>
      </div>
      <img
        alt={props.iconBlackAlt}
        src={props.iconBlackSrc}
        className="header-icon-black"
      />
      <Link to="/" className="header-navlink1">
        <img
          alt={props.textBlackAlt}
          src={props.textBlackSrc}
          className="header-text-black"
        />
      </Link>
      <div className="header-container">
        <Link to="/about" className="header-navlink2">
          {props.text ?? (
            <Fragment>
              <span className="header-text2">(Hey There)</span>
            </Fragment>
          )}
        </Link>
        <button type="button" className="header-button button" onClick={authenticated ? logout : login}>
  <span>
    {authenticated ? (
      <Fragment>
        <span className="header-text8">LOGOUT</span>
      </Fragment>
    ) : (
      <Fragment>
        <span className="header-text8">CONNECT</span>
      </Fragment>
    )}
  </span>
</button>
      </div>
    </div>
  )
}

Header.defaultProps = {
  textBlackSrc: '/icon%20-%20black-200h.png',
  text: undefined,
  affinity: undefined,
  iconBlackSrc: '/icon%20-%20black-200h.png',
  myAccount: undefined,
  aboutUs: undefined,
  iconBlackAlt: 'image',
  textBlackAlt: 'image',
  thoughts: undefined,
  drops: undefined,
  button: undefined,
  rootClassName: '',
}

Header.propTypes = {
  textBlackSrc: PropTypes.string,
  text: PropTypes.element,
  affinity: PropTypes.element,
  iconBlackSrc: PropTypes.string,
  myAccount: PropTypes.element,
  aboutUs: PropTypes.element,
  iconBlackAlt: PropTypes.string,
  textBlackAlt: PropTypes.string,
  thoughts: PropTypes.element,
  drops: PropTypes.element,
  button: PropTypes.element,
  rootClassName: PropTypes.string,
}

export default Header
