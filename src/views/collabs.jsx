import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'

import { Helmet } from 'react-helmet'

import Header from '../components/header'
import CenterText from '../components/center-text'
import Footer from '../components/footer'
import './collabs.css'

const Collabs = (props) => {
  return (
    <div className="collabs-container10">
      <Helmet>
        <title>collabs - exported project</title>
        <meta property="og:title" content="collabs - exported project" />
      </Helmet>
      <Header
        text={
          <Fragment>
            <span className="collabs-text10">(Hey There)</span>
          </Fragment>
        }
        drops={
          <Fragment>
            <span className="collabs-text11">Drops</span>
          </Fragment>
        }
        button={
          <Fragment>
            <span className="collabs-text12">CONNECT</span>
          </Fragment>
        }
        aboutUs={
          <Fragment>
            <span className="collabs-text13">About Us</span>
          </Fragment>
        }
        affinity={
          <Fragment>
            <span className="collabs-text14">Affinity</span>
          </Fragment>
        }
        thoughts={
          <Fragment>
            <span className="collabs-text15">Thoughts</span>
          </Fragment>
        }
        myAccount={
          <Fragment>
            <span className="collabs-text16">My Account</span>
          </Fragment>
        }
        rootClassName="headerroot-class-name5"
      ></Header>
      <CenterText
        text={
          <Fragment>
            <span className="collabs-text17">Collaborator FAQ</span>
          </Fragment>
        }
        rootClassName="center-textroot-class-name3"
      ></CenterText>
      <div className="collabs-container11">
        <div className="collabs-container12">
          <div className="collabs-container13">
            <div data-thq="accordion" className="collabs-accordion1">
              <details
                data-thq="accordion-trigger"
                className="collabs-trigger1"
              >
                <summary
                  data-thq="accordion-summary"
                  className="collabs-summary1"
                >
                  <span className="collabs-text18">
                    Who do you look to collaborate with?
                  </span>
                  <div
                    data-thq="accordion-icon"
                    className="collabs-icon-container1"
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24">
                      <path d="m12 14l-4-4h8z" fill="currentColor"></path>
                    </svg>
                  </div>
                </summary>
              </details>
              <div data-thq="accordion-content">
                <div className="collabs-container14">
                  <p className="collabs-text19">
                    <span>
                      We look for vibes first and foremost. If an artist,
                      musician, creative or any cultural driver matches our
                      wavelength, we are interested. If what we have to say on
                      our
                      <span
                        dangerouslySetInnerHTML={{
                          __html: ' ',
                        }}
                      />
                    </span>
                    <Link to="/about" className="collabs-navlink">
                      About
                    </Link>
                    <span>
                      {' '}
                      page speaks to you, we want to connect. If the vibe is
                      right, the results will no doubt be amazing.
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div data-thq="accordion" className="collabs-accordion2">
              <details
                data-thq="accordion-trigger"
                className="collabs-trigger2"
              >
                <summary
                  data-thq="accordion-summary"
                  className="collabs-summary2"
                >
                  <span className="collabs-text22">Why collaborations?</span>
                  <div
                    data-thq="accordion-icon"
                    className="collabs-icon-container2"
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24">
                      <path d="m12 14l-4-4h8z" fill="currentColor"></path>
                    </svg>
                  </div>
                </summary>
              </details>
              <div data-thq="accordion-content">
                <div className="collabs-container15">
                  <p className="collabs-text23">
                    Because we are inspired by our creative friends. We have a
                    chance to create cool things with cool people so we are
                    going to take it.
                  </p>
                </div>
              </div>
            </div>
            <div data-thq="accordion" className="collabs-accordion3">
              <details
                data-thq="accordion-trigger"
                className="collabs-trigger3"
              >
                <summary
                  data-thq="accordion-summary"
                  className="collabs-summary3"
                >
                  <span className="collabs-text24">
                    What does a DxD collaboration look like?
                  </span>
                  <div
                    data-thq="accordion-icon"
                    className="collabs-icon-container3"
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24">
                      <path d="m12 14l-4-4h8z" fill="currentColor"></path>
                    </svg>
                  </div>
                </summary>
              </details>
              <div data-thq="accordion-content">
                <div className="collabs-container16">
                  <p className="collabs-text25">
                    We try to make it a very inspiring, fun experience. Our goal
                    is to bring out the authentic creativity of our collaborator
                    and overlay that with the DxD ethos. We will coordinate the
                    piece(s), the art, the theme and all drop details together
                    but there are no set parameters. Let&apos;s make something
                    truly unique.
                  </p>
                </div>
              </div>
            </div>
            <div data-thq="accordion" className="collabs-accordion4">
              <details
                data-thq="accordion-trigger"
                className="collabs-trigger4"
              >
                <summary
                  data-thq="accordion-summary"
                  className="collabs-summary4"
                >
                  <span className="collabs-text26">
                    Are there limits to what kinds of apparel we can create?
                  </span>
                  <div
                    data-thq="accordion-icon"
                    className="collabs-icon-container4"
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24">
                      <path d="m12 14l-4-4h8z" fill="currentColor"></path>
                    </svg>
                  </div>
                </summary>
              </details>
              <div data-thq="accordion-content">
                <div className="collabs-container17">
                  <p className="collabs-text27">
                    For the most part no. The best part about letting creative
                    minds use apparel and goods as a canvas is that the limits
                    are virtually endless. We do, of course, want our fans to
                    wear what we make so maybe no pirate hats (or idk, maybe
                    yes).
                  </p>
                </div>
              </div>
            </div>
            <div data-thq="accordion" className="collabs-accordion5">
              <details
                data-thq="accordion-trigger"
                className="collabs-trigger5"
              >
                <summary
                  data-thq="accordion-summary"
                  className="collabs-summary5"
                >
                  <span className="collabs-text28">
                    Why limited edition drops?
                  </span>
                  <div
                    data-thq="accordion-icon"
                    className="collabs-icon-container5"
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24">
                      <path d="m12 14l-4-4h8z" fill="currentColor"></path>
                    </svg>
                  </div>
                </summary>
              </details>
              <div data-thq="accordion-content">
                <div className="collabs-container18">
                  <p className="collabs-text29">
                    We love limited edition drops because they capture a moment
                    in time. Each collaboration is a snapshot of culture,
                    creativity, and connection. While we may evolve our model in
                    the future, right now, scarcity fuels significance. Every
                    piece is crafted with intention, uniquely chipped, and
                    linked to our digital universe, making it part of a living
                    story.
                  </p>
                </div>
              </div>
            </div>
            <div data-thq="accordion" className="collabs-accordion6">
              <details
                data-thq="accordion-trigger"
                className="collabs-trigger6"
              >
                <summary
                  data-thq="accordion-summary"
                  className="collabs-summary6"
                >
                  <span className="collabs-text30">
                    Do you compensate collaborators?
                  </span>
                  <div
                    data-thq="accordion-icon"
                    className="collabs-icon-container6"
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24">
                      <path d="m12 14l-4-4h8z" fill="currentColor"></path>
                    </svg>
                  </div>
                </summary>
              </details>
              <div data-thq="accordion-content">
                <div className="collabs-container19">
                  <p className="collabs-text31">
                    Absolutely. We don&apos;t believe in &quot;exposure&quot; as
                    payment. Each collaboration is a combination of commission
                    and percentage of drop profits agreed upon with the
                    collaborator up front.
                  </p>
                </div>
              </div>
            </div>
            <div data-thq="accordion" className="collabs-accordion7">
              <details
                data-thq="accordion-trigger"
                className="collabs-trigger7"
              >
                <summary
                  data-thq="accordion-summary"
                  className="collabs-summary7"
                >
                  <span className="collabs-text32">
                    What do you request of your collaborators?
                  </span>
                  <div
                    data-thq="accordion-icon"
                    className="collabs-icon-container7"
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24">
                      <path d="m12 14l-4-4h8z" fill="currentColor"></path>
                    </svg>
                  </div>
                </summary>
              </details>
              <div data-thq="accordion-content">
                <div className="collabs-container20">
                  <p className="collabs-text33">
                    We take the term &quot;collaboration&quot; seriously. As we
                    dedicated to create something amazing, we hope for the same.
                    In addition to close coordination in selecting the garments,
                    art, and production details, we also look for dedicated
                    efforts in promoting the drop as well. We will create the
                    promotion plan together but it will not only include content
                    and social posts but direct communications with our existing
                    communities and supporters.
                  </p>
                </div>
              </div>
            </div>
            <div data-thq="accordion" className="collabs-accordion8">
              <details
                data-thq="accordion-trigger"
                className="collabs-trigger8"
              >
                <summary
                  data-thq="accordion-summary"
                  className="collabs-summary8"
                >
                  <span className="collabs-text34">
                    I am an artist with a dope idea, are you open to new
                    collaborations?
                  </span>
                  <div
                    data-thq="accordion-icon"
                    className="collabs-icon-container8"
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24">
                      <path d="m12 14l-4-4h8z" fill="currentColor"></path>
                    </svg>
                  </div>
                </summary>
              </details>
              <div data-thq="accordion-content">
                <div className="collabs-container21">
                  <p className="collabs-text35">
                    We are always down to talk about new ideas. Our drops are
                    highly curated so there is no guarantee that the timing will
                    work out but please get in touch with us at
                    artists@devilxdetail.com or DM us on Twitter.
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
            <span className="collabs-text36">© 2025 Devil x Detail</span>
          </Fragment>
        }
        text1={
          <Fragment>
            <span className="collabs-text37">SOCIAL</span>
          </Fragment>
        }
        text2={
          <Fragment>
            <span className="collabs-text38">Twitter (X)</span>
          </Fragment>
        }
        text3={
          <Fragment>
            <span className="collabs-text39">Instagram</span>
          </Fragment>
        }
        text4={
          <Fragment>
            <span className="collabs-text40">HELP</span>
          </Fragment>
        }
        text5={
          <Fragment>
            <span className="collabs-text41">FAQ</span>
          </Fragment>
        }
        text6={
          <Fragment>
            <span className="collabs-text42">Contact Us</span>
          </Fragment>
        }
        text7={
          <Fragment>
            <span className="collabs-text43">COMPANY</span>
          </Fragment>
        }
        text8={
          <Fragment>
            <span className="collabs-text44">Privacy Policy</span>
          </Fragment>
        }
        text9={
          <Fragment>
            <span className="collabs-text45">Terms of Service</span>
          </Fragment>
        }
        text91={
          <Fragment>
            <span className="collabs-text46">Affinity Token</span>
          </Fragment>
        }
        rootClassName="footerroot-class-name4"
      ></Footer>
    </div>
  )
}

export default Collabs
