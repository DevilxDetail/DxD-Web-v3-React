import React, { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import Header from '../components/header'
import CenterText from '../components/center-text'
import ConsistentFooter from '../components/ConsistentFooter'
import './faq.css'

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
        <title>FAQ - DxD</title>
        <meta property="og:title" content="FAQ - DxD" />
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
            <span className="faq-text17">FAQ</span>
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
                  Is it possible to purchase a drop after the release window
                  has closed?
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
                      Unfortunately, once a drop window has closed, the release is
                      no longer available for direct purchase. Our limited-edition
                      pieces are established with the collaborator and are not
                      restocked. However, keep an eye out for future drops or
                      special collaborations for similar designs or inspirations.
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
                  Do I need a crypto wallet to receive my digital assets as
                  part of a drop?
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
                      No, you don't need to have a crypto wallet to receive your
                      digital assets. When you create an account with your email
                      or phone number, we create a crypto wallet for you. You
                      always have the option to export assets to a sovereign
                      wallet if you choose.
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
                  What is the Devil x Detail Affinity Program?
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
                      <span>
                        Oh you are going to love it. The Affinity Program is the
                        loyalty program that we created on day 1. Fully onchain,
                        you own your Affinity Token and all of the perks that come
                        with it. To learn more, check out our
                        {' '}
                      </span>
                      <Link to="/affinity" className="faq-navlink1">
                        Affinity page
                      </Link>
                      <span>.</span>
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
                  What does it mean when you say that an item is digitally
                  authenticated?
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
                      All limited edition Devil x Detail items have a NFC chip
                      attached to the piece. This chip, when scanned with an NFC
                      reader (like your phone), will bring you to a webpage
                      verifying the item&apos;s authenticity.
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
                  Can I pay for a drop with a credit card instead of crypto?
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
                      We will always attempt to allow for multiple payment options
                      for a drop including credit cards. If the drop is restricted
                      to a certain payment type, we will do our best to
                      communicate the limitations and explain why.
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
                  Are your artists and collaborators compensated for their
                  involvment in your drops?
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
                      Absolutely. We will never ask an artist to provide work for
                      &quot;exposure&quot;. Compensation varies by collaborator
                      but we will always ensure that our friends are taken care
                      of.
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
                  Will every drop include an accompanying digital asset?
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
                      <span>
                        Definitely. We will always ensure a digital intersection
                        with every physical item we release. For more information
                        on how we operate check out our
                        {' '}
                      </span>
                      <Link to="/about" className="faq-navlink2">
                        About page
                      </Link>
                      <span>.</span>
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
                      <span>
                        We are always down to talk about new ideas. Our drops are
                        highly curated so there is no guarantee that the timing
                        will work out but please get in touch with us at
                        artists@devilxdetail.com or DM us on Twitter. You can also
                        learn more about our collaborations
                        {' '}
                      </span>
                      <Link to="/collabs" className="faq-navlink3">
                        here
                      </Link>
                      <span>.</span>
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
