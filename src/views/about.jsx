import React, { Fragment } from 'react'
import { usePrivy } from "@privy-io/react-auth";
import { Helmet } from 'react-helmet'

import Header from '../components/header'
import ConsistentFooter from '../components/ConsistentFooter'
import './about.css'

const About = (props) => {
  const { authenticated } = usePrivy();
  
  return (
    <div className="about-container1">
      <Helmet>
        <title>DxD - About</title>
        <meta name="description" content="Culturally inspired, digitally integrated apparel and goods" />
        
        {/* Essential OG Tags */}
        <meta property="og:title" content="DxD - About" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://devilxdetail.com/about" />
        <meta property="og:image" content="https://devilxdetail.com/alpha_thumbnail.jpg" />
        <meta property="og:description" content="Culturally inspired, digitally integrated apparel and goods" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="DxD - About" />
        <meta name="twitter:description" content="Culturally inspired, digitally integrated apparel and goods" />
      </Helmet>
      <Header
        text={
          <Fragment>
            <span className="about-text10">About DxD</span>
          </Fragment>
        }
        iconBlackSrc="/icon%20-%20black-200h.png"
        rootClassName="header-root-class-name1"
      />
      <div className="about-container2">
        <div className="about-what">
          <div className="about-container3">
            <img
              alt="image"
              src="/instc%202025-02-20%20160244.059-700w.png"
              className="about-image"
            />
          </div>
          <div className="about-container4">
            <div className="about-container5">
              <span className="about-text16">We Live in the Lab</span>
              <span className="about-text17">
                We are alchemists at heart. We experiment, tinker and build.
                We take things that we find interesting in the world and piece
                them together to create something new.
              </span>
            </div>
            <div className="about-container6">
              <span className="about-text18">We Rep Our People</span>
              <span className="about-text19">Enough said.</span>
            </div>
            <div className="about-container7">
              <span className="about-text20">
                We Are A Vibrational Amplifier
              </span>
              <span className="about-text21">
                When cool people get around cool people, great things happen.
                Our job is to help these collisions take place. Through
                fashion, art, music, conversations and moments, we are here to
                make sure that the best things (and people) in this world are
                brought together.
              </span>
            </div>
            <div className="about-container8">
              <span className="about-text22">We Blend Worlds</span>
              <span className="about-text23">
                We are not fans of the lines that get drawn in the world.
                Whenever possible, we prefer "and" not
                "or". Physical and digital. Art and tech. Young and
                old. Vintage and modern. Minimal and deep.
              </span>
            </div>
          </div>
        </div>
      </div>
      <ConsistentFooter />
    </div>
  )
}

export default About
