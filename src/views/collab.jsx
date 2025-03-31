import React, { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import Header from '../components/header'
import CenterText from '../components/center-text'
import ConsistentFooter from '../components/ConsistentFooter'
import './collab.css'

const Faq = (props) => {
  const [openAccordion, setOpenAccordion] = useState(null);

  const toggleAccordion = (index) => {
    if (openAccordion === index) {
      setOpenAccordion(null);
    } else {
      setOpenAccordion(index);
    }
  };

  return (
    <div className="faq-container1">
      <Helmet>
        <title>DxD - Collaborations</title>
        <meta name="description" content="Culturally inspired, digitally integrated apparel and goods" />
        
        {/* Essential OG Tags */}
        <meta property="og:title" content="DxD - FAQ" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://devilxdetail.com/faq" />
        <meta property="og:image" content="https://devilxdetail.com/alpha_thumbnail.jpg" />
        <meta property="og:description" content="Culturally inspired, digitally integrated apparel and goods" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="DxD - Collaborations" />
        <meta name="twitter:description" content="Culturally inspired, digitally integrated apparel and goods" />
      </Helmet>
      <Header
        text={
          <Fragment>
            <span className="faq-text10">About DxD</span>
          </Fragment>
        }
        iconBlackSrc="/icon%20-%20black-200h.png"
        rootClassName="header-root-class-name9"
      />
      <CenterText
        text={
          <Fragment>
            <span className="faq-text17">Collaborating with DxD</span>
          </Fragment>
        }
        rootClassName="center-textroot-class-name1"
      />
      <div className="faq-container2">
        <div className="faq-container3">
          <div className="faq-container4">
            <div data-thq="accordion" className="faq-accordion1">
              <div 
                className="faq-summary1" 
                onClick={() => toggleAccordion(0)}
              >
                <span className="faq-text18">
                  Who do you look to collaborate with?
                </span>
                <div className={`faq-icon-container1 ${openAccordion === 0 ? 'rotated' : ''}`}>
                  <svg width="32" height="32" viewBox="0 0 24 24">
                    <path d="m12 14l-4-4h8z" fill="currentColor"></path>
                  </svg>
                </div>
              </div>
              {openAccordion === 0 && (
                <div className="faq-content1">
                  <div className="faq-container5">
                    <p className="faq-text19">
                      We look for vibes first and foremost. If an artist, musician, creative or any cultural driver matches our wavelength, we are interested. If what we have to say on our About page speaks to you, we want to connect. If the vibe is right, the results will no doubt be amazing.
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <div data-thq="accordion" className="faq-accordion2">
              <div 
                className="faq-summary2" 
                onClick={() => toggleAccordion(1)}
              >
                <span className="faq-text20">
                  Why collaborations?
                </span>
                <div className={`faq-icon-container2 ${openAccordion === 1 ? 'rotated' : ''}`}>
                  <svg width="32" height="32" viewBox="0 0 24 24">
                    <path d="m12 14l-4-4h8z" fill="currentColor"></path>
                  </svg>
                </div>
              </div>
              {openAccordion === 1 && (
                <div className="faq-content2">
                  <div className="faq-container6">
                    <p className="faq-text21">
                      Because we are inspired by our creative friends. We have a chance to create cool things with cool people so we are going to take it.
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <div data-thq="accordion" className="faq-accordion3">
              <div 
                className="faq-summary3" 
                onClick={() => toggleAccordion(2)}
              >
                <span className="faq-text22">
                  What does a DxD collaboration look like?
                </span>
                <div className={`faq-icon-container3 ${openAccordion === 2 ? 'rotated' : ''}`}>
                  <svg width="32" height="32" viewBox="0 0 24 24">
                    <path d="m12 14l-4-4h8z" fill="currentColor"></path>
                  </svg>
                </div>
              </div>
              {openAccordion === 2 && (
                <div className="faq-content3">
                  <div className="faq-container7">
                    <p className="faq-text23">
                      We try to make it a very inspiring, fun experience. Our goal is to bring out the authentic creativity of our collaborator and overlay that with the DxD ethos. We will coordinate the piece(s), the art, the theme and all drop details together but there are no set parameters. Let's make something truly unique.
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <div data-thq="accordion" className="faq-accordion4">
              <div 
                className="faq-summary4" 
                onClick={() => toggleAccordion(3)}
              >
                <span className="faq-text26">
                  Are there limits to what kinds of apparel we can create?
                </span>
                <div className={`faq-icon-container4 ${openAccordion === 3 ? 'rotated' : ''}`}>
                  <svg width="32" height="32" viewBox="0 0 24 24">
                    <path d="m12 14l-4-4h8z" fill="currentColor"></path>
                  </svg>
                </div>
              </div>
              {openAccordion === 3 && (
                <div className="faq-content4">
                  <div className="faq-container8">
                    <p className="faq-text27">
                      For the most part no. The best part about letting creative minds use apparel and goods as a canvas is that the limits are virtually endless. We do, of course, want our fans to wear what we make so maybe no pirate hats (or idk, maybe yes).
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <div data-thq="accordion" className="faq-accordion5">
              <div 
                className="faq-summary5" 
                onClick={() => toggleAccordion(4)}
              >
                <span className="faq-text28">
                  Why limited edition drops?
                </span>
                <div className={`faq-icon-container5 ${openAccordion === 4 ? 'rotated' : ''}`}>
                  <svg width="32" height="32" viewBox="0 0 24 24">
                    <path d="m12 14l-4-4h8z" fill="currentColor"></path>
                  </svg>
                </div>
              </div>
              {openAccordion === 4 && (
                <div className="faq-content5">
                  <div className="faq-container9">
                    <p className="faq-text29">
                      We love limited edition drops because they capture a moment in time. Each collaboration is a snapshot of culture, creativity, and connection. While we may evolve our model in the future, right now, scarcity fuels significance. Every piece is crafted with intention, uniquely chipped, and linked to our digital universe, making it  part of a living story.
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <div data-thq="accordion" className="faq-accordion6">
              <div 
                className="faq-summary6" 
                onClick={() => toggleAccordion(5)}
              >
                <span className="faq-text30">
                  Do you compensate collaborators?
                </span>
                <div className={`faq-icon-container6 ${openAccordion === 5 ? 'rotated' : ''}`}>
                  <svg width="32" height="32" viewBox="0 0 24 24">
                    <path d="m12 14l-4-4h8z" fill="currentColor"></path>
                  </svg>
                </div>
              </div>
              {openAccordion === 5 && (
                <div className="faq-content6">
                  <div className="faq-container10">
                    <p className="faq-text31">
                      Absolutely. We don't believe in "exposure" as payment. Each collaboration is a combination of commission and percentage of drop profits agreed upon with the collaborator up front.
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <div data-thq="accordion" className="faq-accordion7">
              <div 
                className="faq-summary7" 
                onClick={() => toggleAccordion(6)}
              >
                <span className="faq-text32">
                  What do you expect of your collaborators?
                </span>
                <div className={`faq-icon-container7 ${openAccordion === 6 ? 'rotated' : ''}`}>
                  <svg width="32" height="32" viewBox="0 0 24 24">
                    <path d="m12 14l-4-4h8z" fill="currentColor"></path>
                  </svg>
                </div>
              </div>
              {openAccordion === 6 && (
                <div className="faq-content7">
                  <div className="faq-container11">
                    <p className="faq-text33">
                      We take the term "collaboration" seriously. As we dedicated to create something amazing, we hope for the same. In addition to close coordination in selecting the garments, art, and production details, we also look for dedicated efforts in promoting the drop as well. We will create the promotion plan together but it will not only include content and social posts but direct communications with our existing communities and supporters.
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <div data-thq="accordion" className="faq-accordion8">
              <div 
                className="faq-summary8" 
                onClick={() => toggleAccordion(7)}
              >
                <span className="faq-text36">
                  I am an artist with a dope idea, are you open to new
                  collaborations?
                </span>
                <div className={`faq-icon-container8 ${openAccordion === 7 ? 'rotated' : ''}`}>
                  <svg width="32" height="32" viewBox="0 0 24 24">
                    <path d="m12 14l-4-4h8z" fill="currentColor"></path>
                  </svg>
                </div>
              </div>
              {openAccordion === 7 && (
                <div className="faq-content8">
                  <div className="faq-container12">
                    <p className="faq-text37">
                        We are always down to talk about new ideas. Our drops are
                        highly curated so there is no guarantee that the timing
                        will work out but please get in touch with us at
                        artists@devilxdetail.com or DM us on Twitter.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ConsistentFooter />
    </div>
  )
}

export default Faq
