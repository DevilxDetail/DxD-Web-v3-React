import React, { Fragment } from 'react'
import { Helmet } from 'react-helmet'
import Header from '../components/header'
import ConsistentFooter from '../components/ConsistentFooter'
import './postwook.css'

const PostWook = () => {
  return (
    <div className="postwook-container postwook-page">
      <Helmet>
        <title>POST WOOK</title>
        <meta property="og:title" content="POST WOOK" />
        <meta name="description" content="POST WOOK - a collaboration" />
      </Helmet>
      
      <Header
        text={
          <Fragment>
            <span className="postwook-text10">About DxD</span>
          </Fragment>
        }
        iconBlackSrc="/icon%20-%20white-200h.png"
        rootClassName="header-root-class-name"
      />
      
      <div className="postwook-main-content">
        {/* Hero Section */}
        <div className="postwook-hero">
          <img 
            src="/placeholder-image.svg" 
            alt="Hero Image" 
            className="postwook-hero-image"
          />
        </div>

        {/* Text Section */}
        <div className="postwook-text-section">
          <p className="postwook-text-placeholder">
            Placeholder text will go here. This section can contain any descriptive content about the auctions.
          </p>
        </div>

        {/* Auctions Grid */}
        <div className="postwook-auctions-grid">
          {Array.from({ length: 18 }).map((_, index) => (
            <div key={index} className="postwook-auction-item">
              <div className="postwook-auction-placeholder">
                Auction {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      <ConsistentFooter />
    </div>
  )
}

export default PostWook

