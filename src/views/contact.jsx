import React, { Fragment } from 'react'
import { Helmet } from 'react-helmet'

import Header from '../components/header'
import CenterText from '../components/center-text'
import ConsistentFooter from '../components/ConsistentFooter'
import './contact.css'

const Contact = (props) => {
  return (
    <div className="contact-container1">
      <Helmet>
        <title>Contact - DxD</title>
        <meta property="og:title" content="Contact - DxD" />
      </Helmet>
      <Header
        text={
          <Fragment>
            <span className="contact-text10">About DxD</span>
          </Fragment>
        }
        iconBlackSrc="/icon%20-%20black-200h.png"
        rootClassName="header-root-class-name12"
      />
      <CenterText
        text={
          <Fragment>
            <span className="contact-text17">Get In Touch</span>
          </Fragment>
        }
        rootClassName="center-textroot-class-name7"
      />
      <div className="contact-container2">
        <div className="contact-container3">
          <span className="contact-text18">
            <span>Twitter</span>
            <br></br>
          </span>
          <span className="contact-text21">
            <span>
              The best way to reach us is via Twitter DMs. Feel free to jump in
              with any questions, issues or ideas you may have:
              <span
                dangerouslySetInnerHTML={{
                  __html: ' ',
                }}
              />
            </span>
            <a
              href="https://x.com/devilxdetail"
              target="_blank"
              rel="noreferrer noopener"
              className="contact-link1"
            >
              @devilxdetail
            </a>
            <br></br>
          </span>
        </div>
        <div className="contact-container4">
          <span className="contact-text24">
            <span>Email (General)</span>
            <br></br>
          </span>
          <span className="contact-text27">
            <span>
              You are always welcome to send us an email at
              <span
                dangerouslySetInnerHTML={{
                  __html: ' ',
                }}
              />
            </span>
            <a
              href="mailto:hello@devilxdetail.com?subject="
              className="contact-link2"
            >
              hello@devilxdetail.com
            </a>
            <span>
              {' '}
              with questions or concerns. Please note that we normally need 1-2
              days to respond.
            </span>
            <br></br>
          </span>
        </div>
        <div className="contact-container5">
          <span className="contact-text31">
            <span>Email (Collaborators)</span>
            <br></br>
          </span>
          <span className="contact-text34">
            <span>
              If you are an artist or collaborator that wants to reach out with
              ideas, concepts or questions, please email us at
              <span
                dangerouslySetInnerHTML={{
                  __html: ' ',
                }}
              />
            </span>
            <a
              href="mailto:artists@devilxdetail.com?subject="
              className="contact-link3"
            >
              artists@devilxdetail.com
            </a>
            <span>.</span>
            <br></br>
          </span>
        </div>
      </div>
      <ConsistentFooter />
    </div>
  )
}

export default Contact
