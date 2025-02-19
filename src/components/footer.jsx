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
                  <span className="footer-text20">SOCIAL</span>
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
                  <span className="footer-text22">Twitter (X)</span>
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
                  <span className="footer-text19">Instagram</span>
                </Fragment>
              )}
            </a>
          </div>
          <div className="footer-container5">
            <span className="footer-text12">
              {props.text4 ?? (
                <Fragment>
                  <span className="footer-text17">HELP</span>
                </Fragment>
              )}
            </span>
            <Link to="/faq" className="footer-navlink1">
              {props.text5 ?? (
                <Fragment>
                  <span className="footer-text15">FAQ</span>
                </Fragment>
              )}
            </Link>
            <Link to="/contact" className="footer-navlink2">
              {props.text6 ?? (
                <Fragment>
                  <span className="footer-text25">Contact Us</span>
                </Fragment>
              )}
            </Link>
          </div>
          <div className="footer-container6">
            <span className="footer-text13">
              {props.text7 ?? (
                <Fragment>
                  <span className="footer-text16">COMPANY</span>
                </Fragment>
              )}
            </span>
            <Link to="/privacypolicy" className="footer-navlink3">
              {props.text8 ?? (
                <Fragment>
                  <span className="footer-text23">Privacy Policy</span>
                </Fragment>
              )}
            </Link>
            <Link to="/termsofservice" className="footer-navlink4">
              {props.text9 ?? (
                <Fragment>
                  <span className="footer-text18">Terms of Service</span>
                </Fragment>
              )}
            </Link>
            <Link to="/affinity" className="footer-navlink5">
              {props.text91 ?? (
                <Fragment>
                  <span className="footer-text21">Affinity Token</span>
                </Fragment>
              )}
            </Link>
          </div>
        </div>
        <div className="footer-container7">
          <span className="footer-text14">
            {props.text ?? (
              <Fragment>
                <span className="footer-text24">© 2025 Devil x Detail</span>
              </Fragment>
            )}
          </span>
        </div>
      </div>
    </div>
  )
}

Footer.defaultProps = {
  text5: undefined,
  text7: undefined,
  text4: undefined,
  textUrl1: 'https://instagram.com/devilxdetail',
  textUrl: 'https://x.com/devilxdetail',
  text9: undefined,
  text3: undefined,
  text1: undefined,
  text91: undefined,
  text2: undefined,
  text8: undefined,
  rootClassName: '',
  text: undefined,
  text6: undefined,
}

Footer.propTypes = {
  text5: PropTypes.element,
  text7: PropTypes.element,
  text4: PropTypes.element,
  textUrl1: PropTypes.string,
  textUrl: PropTypes.string,
  text9: PropTypes.element,
  text3: PropTypes.element,
  text1: PropTypes.element,
  text91: PropTypes.element,
  text2: PropTypes.element,
  text8: PropTypes.element,
  rootClassName: PropTypes.string,
  text: PropTypes.element,
  text6: PropTypes.element,
}

export default Footer
