import React, { Fragment } from 'react'
import { Helmet } from 'react-helmet'

import Header from '../components/header'
import CenterText from '../components/center-text'
import ConsistentFooter from '../components/ConsistentFooter'
import './affinity.css'

const Affinity = (props) => {
  return (
    <div className="affinity-container1">
      <Helmet>
        <title>Affinity - DxD</title>
        <meta property="og:title" content="Affinity - DxD" />
      </Helmet>
      <Header
        text={
          <Fragment>
            <span className="affinity-text10">About DxD</span>
          </Fragment>
        }
        iconBlackSrc="/icon%20-%20black-200h.png"
        rootClassName="header-root-class-name8"
      />
      <div className="affinity-container2">
        <div className="affinity-container3">
          <img
            alt="image"
            src="/demo%20token%205-800w.png"
            className="affinity-image1"
          />
          <img
            alt="image"
            src="/demo%20token%204-900w.png"
            className="affinity-image2"
          />
          <img
            alt="image"
            src="/demo%20token%206-800w.png"
            className="affinity-image3"
          />
        </div>
        <CenterText
          text={
            <Fragment>
              <span className="affinity-text17">Affinity Token</span>
            </Fragment>
          }
          rootClassName="center-textroot-class-name8"
        />
        <div className="affinity-container4">
          <span className="affinity-text18">
            <span>
              The Affinity Token is our onchain loyalty program, designed to
              recognize and reward our community's support. Whether through
              purchases, social media engagement, advice, or any other
              contribution, fans can earn Affinity Tokens as a symbol of their
              connection to DxD.
            </span>
            <br></br>
            <br></br>
            <span>
              Fully self-custodial and transferable, the Affinity Token puts
              ownership in your hands... you've earned it, you own it. Tokens
              can unlock perks like limited-edition merch, early access to
              drops, and invites to exclusive events. We also use them to assign
              community roles, highlight standout supporters, and track
              engagement.
            </span>
            <br></br>
            <br></br>
            <span>
              Each Affinity Token features unique artwork commissioned from a
              generative artist, making every token a true 1/1/x. (Click
              <span
                dangerouslySetInnerHTML={{
                  __html: ' ',
                }}
              />
            </span>
            <a
              href="https://opensea.io/collection/dxdaffinity"
              target="_blank"
              rel="noreferrer noopener"
              className="affinity-link"
            >
              here
            </a>
            <span> to view the collection.)</span>
            <br></br>
            <br></br>
            <span>
              As we grow, so will the benefits... think contributions to future
              collaborations, partner perks, and more. Affinity isn't just a
              program; it's how we keep our people at the center of everything
              we do.
            </span>
          </span>
        </div>
      </div>
      <ConsistentFooter />
    </div>
  )
}

export default Affinity
