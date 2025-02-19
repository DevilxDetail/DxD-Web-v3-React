import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'

import { Helmet } from 'react-helmet'

import Header from '../components/header'
import CenterText from '../components/center-text'
import Footer from '../components/footer'
import './faq.css'

const Faq = (props) => {
  return (
    <div className="faq-container10">
      <Helmet>
        <title>faq - exported project</title>
        <meta property="og:title" content="faq - exported project" />
      </Helmet>
      <Header
        text={
          <Fragment>
            <span className="faq-text10">(Hey There)</span>
          </Fragment>
        }
        drops={
          <Fragment>
            <span className="faq-text11">Drops</span>
          </Fragment>
        }
        button={
          <Fragment>
            <span className="faq-text12">CONNECT</span>
          </Fragment>
        }
        aboutUs={
          <Fragment>
            <span className="faq-text13">About Us</span>
          </Fragment>
        }
        affinity={
          <Fragment>
            <span className="faq-text14">Affinity</span>
          </Fragment>
        }
        thoughts={
          <Fragment>
            <span className="faq-text15">Thoughts</span>
          </Fragment>
        }
        myAccount={
          <Fragment>
            <span className="faq-text16">My Account</span>
          </Fragment>
        }
        rootClassName="headerroot-class-name1"
      ></Header>
      <CenterText
        text={
          <Fragment>
            <span className="faq-text17">FAQ</span>
          </Fragment>
        }
        rootClassName="center-textroot-class-name1"
      ></CenterText>
      <div className="faq-container11">
        <div className="faq-container12">
          <div className="faq-container13">
            <div data-thq="accordion" className="faq-accordion1">
              <details data-thq="accordion-trigger" className="faq-trigger1">
                <summary data-thq="accordion-summary" className="faq-summary1">
                  <span className="faq-text18">
                    Is it possible to purchase a drop after the release window
                    has closed?
                  </span>
                  <div
                    data-thq="accordion-icon"
                    className="faq-icon-container1"
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24">
                      <path d="m12 14l-4-4h8z" fill="currentColor"></path>
                    </svg>
                  </div>
                </summary>
              </details>
              <div data-thq="accordion-content">
                <div className="faq-container14">
                  <p className="faq-text19">
                    Unfortunately, once a drop window has closed, the release is
                    no longer available for direct purchase. Our limited-edition
                    pieces are established with the collaborator and are not
                    restocked. However, keep an eye out for future drops or
                    special collaborations for similar designs or inspirations.
                  </p>
                </div>
              </div>
            </div>
            <div data-thq="accordion" className="faq-accordion2">
              <details data-thq="accordion-trigger" className="faq-trigger2">
                <summary data-thq="accordion-summary" className="faq-summary2">
                  <span className="faq-text20">
                    Do I need a crypto wallet to receive my digital assets as
                    part of a drop?
                  </span>
                  <div
                    data-thq="accordion-icon"
                    className="faq-icon-container2"
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24">
                      <path d="m12 14l-4-4h8z" fill="currentColor"></path>
                    </svg>
                  </div>
                </summary>
              </details>
              <div data-thq="accordion-content">
                <div className="faq-container15">
                  <p className="faq-text21">
                    No, you don’t need to have a crypto wallet to receive your
                    digital assets. When you create an account with your email
                    or phone number, we create a crypto wallet for you. You
                    always have the option to export assets to a sovereign
                    wallet if you choose.
                    <span
                      dangerouslySetInnerHTML={{
                        __html: ' ',
                      }}
                    />
                  </p>
                </div>
              </div>
            </div>
            <div data-thq="accordion" className="faq-accordion3">
              <details data-thq="accordion-trigger" className="faq-trigger3">
                <summary data-thq="accordion-summary" className="faq-summary3">
                  <span className="faq-text22">
                    What is the Devil x Detail Affinity Program?
                  </span>
                  <div
                    data-thq="accordion-icon"
                    className="faq-icon-container3"
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24">
                      <path d="m12 14l-4-4h8z" fill="currentColor"></path>
                    </svg>
                  </div>
                </summary>
              </details>
              <div data-thq="accordion-content">
                <div className="faq-container16">
                  <p className="faq-text23">
                    <span>
                      Oh you are going to love it. The Affinity Program is the
                      loyalty program that we created on day 1. Fully onchain,
                      you own your Affinity Token and all of the perks that come
                      with it. To learn more, check out our
                      <span
                        dangerouslySetInnerHTML={{
                          __html: ' ',
                        }}
                      />
                    </span>
                    <Link to="/affinity" className="faq-navlink1">
                      Affinity page
                    </Link>
                    <span>.</span>
                  </p>
                </div>
              </div>
            </div>
            <div data-thq="accordion" className="faq-accordion4">
              <details data-thq="accordion-trigger" className="faq-trigger4">
                <summary data-thq="accordion-summary" className="faq-summary4">
                  <span className="faq-text26">
                    What does it mean when you say that an item is digitally
                    authenticated?
                  </span>
                  <div
                    data-thq="accordion-icon"
                    className="faq-icon-container4"
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24">
                      <path d="m12 14l-4-4h8z" fill="currentColor"></path>
                    </svg>
                  </div>
                </summary>
              </details>
              <div data-thq="accordion-content">
                <div className="faq-container17">
                  <p className="faq-text27">
                    All limited edition Devil x Detail items have a NFC chip
                    attached to the piece. This chip, when scanned with an NFC
                    reader (like your phone), will bring you to a webpage
                    verifying the item&apos;s authenticity.
                  </p>
                </div>
              </div>
            </div>
            <div data-thq="accordion" className="faq-accordion5">
              <details data-thq="accordion-trigger" className="faq-trigger5">
                <summary data-thq="accordion-summary" className="faq-summary5">
                  <span className="faq-text28">
                    Can I pay for a drop with a credit card instead of crypto?
                  </span>
                  <div
                    data-thq="accordion-icon"
                    className="faq-icon-container5"
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24">
                      <path d="m12 14l-4-4h8z" fill="currentColor"></path>
                    </svg>
                  </div>
                </summary>
              </details>
              <div data-thq="accordion-content">
                <div className="faq-container18">
                  <p className="faq-text29">
                    We will always attempt to allow for multiple payment options
                    for a drop including credit cards. If the drop is restricted
                    to a certain payment type, we will do our best to
                    communicate the limitations and explain why.
                  </p>
                </div>
              </div>
            </div>
            <div data-thq="accordion" className="faq-accordion6">
              <details data-thq="accordion-trigger" className="faq-trigger6">
                <summary data-thq="accordion-summary" className="faq-summary6">
                  <span className="faq-text30">
                    Are your artists and collaborators compensated for their
                    involvment in your drops?
                  </span>
                  <div
                    data-thq="accordion-icon"
                    className="faq-icon-container6"
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24">
                      <path d="m12 14l-4-4h8z" fill="currentColor"></path>
                    </svg>
                  </div>
                </summary>
              </details>
              <div data-thq="accordion-content">
                <div className="faq-container19">
                  <p className="faq-text31">
                    Absolutely. We will never ask an artist to provide work for
                    &quot;exposure&quot;. Compensation varies by collaborator
                    but we will always ensure that our friends are taken care
                    of.
                  </p>
                </div>
              </div>
            </div>
            <div data-thq="accordion" className="faq-accordion7">
              <details data-thq="accordion-trigger" className="faq-trigger7">
                <summary data-thq="accordion-summary" className="faq-summary7">
                  <span className="faq-text32">
                    Will every drop include an accompanying digital asset?
                  </span>
                  <div
                    data-thq="accordion-icon"
                    className="faq-icon-container7"
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24">
                      <path d="m12 14l-4-4h8z" fill="currentColor"></path>
                    </svg>
                  </div>
                </summary>
              </details>
              <div data-thq="accordion-content">
                <div className="faq-container20">
                  <p className="faq-text33">
                    <span>
                      Definitely. We will always ensure a digital intersection
                      with every physical item we release. For more information
                      on how we operate check out our
                      <span
                        dangerouslySetInnerHTML={{
                          __html: ' ',
                        }}
                      />
                    </span>
                    <Link to="/about" className="faq-navlink2">
                      About page
                    </Link>
                    <span>.</span>
                  </p>
                </div>
              </div>
            </div>
            <div data-thq="accordion" className="faq-accordion8">
              <details data-thq="accordion-trigger" className="faq-trigger8">
                <summary data-thq="accordion-summary" className="faq-summary8">
                  <span className="faq-text36">
                    I am an artist with a dope idea, are you open to new
                    collaborations?
                  </span>
                  <div
                    data-thq="accordion-icon"
                    className="faq-icon-container8"
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24">
                      <path d="m12 14l-4-4h8z" fill="currentColor"></path>
                    </svg>
                  </div>
                </summary>
              </details>
              <div data-thq="accordion-content">
                <div className="faq-container21">
                  <p className="faq-text37">
                    <span>
                      We are always down to talk about new ideas. Our drops are
                      highly curated so there is no guarantee that the timing
                      will work out but please get in touch with us at
                      artists@devilxdetail.com or DM us on Twitter. You can also
                      learn more about our collaborations
                      <span
                        dangerouslySetInnerHTML={{
                          __html: ' ',
                        }}
                      />
                    </span>
                    <Link to="/collabs" className="faq-navlink3">
                      here
                    </Link>
                    <span>.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer
        text={
          <Fragment>
            <span className="faq-text40">© 2025 Devil x Detail</span>
          </Fragment>
        }
        text1={
          <Fragment>
            <span className="faq-text41">SOCIAL</span>
          </Fragment>
        }
        text2={
          <Fragment>
            <span className="faq-text42">Twitter (X)</span>
          </Fragment>
        }
        text3={
          <Fragment>
            <span className="faq-text43">Instagram</span>
          </Fragment>
        }
        text4={
          <Fragment>
            <span className="faq-text44">HELP</span>
          </Fragment>
        }
        text5={
          <Fragment>
            <span className="faq-text45">FAQ</span>
          </Fragment>
        }
        text6={
          <Fragment>
            <span className="faq-text46">Contact Us</span>
          </Fragment>
        }
        text7={
          <Fragment>
            <span className="faq-text47">COMPANY</span>
          </Fragment>
        }
        text8={
          <Fragment>
            <span className="faq-text48">Privacy Policy</span>
          </Fragment>
        }
        text9={
          <Fragment>
            <span className="faq-text49">Terms of Service</span>
          </Fragment>
        }
        text91={
          <Fragment>
            <span className="faq-text50">Affinity Token</span>
          </Fragment>
        }
        rootClassName="footerroot-class-name"
      ></Footer>
    </div>
  )
}

export default Faq
