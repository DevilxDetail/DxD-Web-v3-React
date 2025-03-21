import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'

import PropTypes from 'prop-types'

import './footer.css'

const Footer = (props) => {
  return (
    <div className={`footer-container1 ${props.rootClassName} `}>
      <div className="footer-container2">
        <div className="footer-container3">
          <div className="footer-container4">
            <span className="footer-text10">
              {props.text1 ?? (
                <Fragment>
                  <span>SOCIALS</span>
                </Fragment>
              )}
            </span>
            <a
              href={props.textUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="footer-text11"
            >
              {props.text2 ?? (
                <Fragment>
                  <span>Twitter (X)</span>
                </Fragment>
              )}
            </a>
            <a
              href={props.textUrl1}
              target="_blank"
              rel="noreferrer noopener"
              className="footer-link"
            >
              {props.text3 ?? (
                <Fragment>
                  <span>Instagram</span>
                </Fragment>
              )}
            </a>
          </div>
          <div className="footer-container5">
            <span className="footer-text12">
              {props.text5 ?? (
                <Fragment>
                  <span>HELP</span>
                </Fragment>
              )}
            </span>
            <Link to="/faq" className="footer-navlink1">
              {props.text6 ?? (
                <Fragment>
                  <span>FAQ</span>
                </Fragment>
              )}
            </Link>
            <Link to="/contact" className="footer-navlink2">
              {props.text7 ?? (
                <Fragment>
                  <span>Contact Us</span>
                </Fragment>
              )}
            </Link>
          </div>
          <div className="footer-container6">
            <span className="footer-text13">
              {props.text8 ?? (
                <Fragment>
                  <span>COMPANY</span>
                </Fragment>
              )}
            </span>
            <Link to="/privacypolicy" className="footer-navlink3">
              {props.text9 ?? (
                <Fragment>
                  <span>Privacy Policy</span>
                </Fragment>
              )}
            </Link>
            <Link to="/termsofservice" className="footer-navlink4">
              {props.text10 ?? (
                <Fragment>
                  <span>Terms of Service</span>
                </Fragment>
              )}
            </Link>
            <Link to="/affinity" className="footer-navlink5">
              {props.text12 ?? (
                <Fragment>
                  <span>Affinity Token</span>
                </Fragment>
              )}
            </Link>
          </div>
        </div>
        <div className="footer-container7">
          <span className="footer-text14">
            {props.text11 ?? (
              <Fragment>
                <span>© 2025 Devil x Detail</span>
              </Fragment>
            )}
          </span>
        </div>
      </div>
    </div>
  )
}

Footer.defaultProps = {
  text1: undefined,
  text2: undefined,
  text3: undefined,
  text4: undefined,
  text5: undefined,
  text6: undefined,
  text7: undefined,
  text8: undefined,
  text9: undefined,
  text10: undefined,
  text11: undefined,
  text12: undefined,
  textUrl: 'https://twitter.com',
  textUrl1: 'https://instagram.com',
  textUrl2: 'https://discord.com',
  textUrl3: 'mailto:hello@dxd.com',
  rootClassName: '',
}

Footer.propTypes = {
  text1: PropTypes.element,
  text2: PropTypes.element,
  text3: PropTypes.element,
  text4: PropTypes.element,
  text5: PropTypes.element,
  text6: PropTypes.element,
  text7: PropTypes.element,
  text8: PropTypes.element,
  text9: PropTypes.element,
  text10: PropTypes.element,
  text11: PropTypes.element,
  text12: PropTypes.element,
  textUrl: PropTypes.string,
  textUrl1: PropTypes.string,
  textUrl2: PropTypes.string,
  textUrl3: PropTypes.string,
  rootClassName: PropTypes.string,
}

export default Footer
