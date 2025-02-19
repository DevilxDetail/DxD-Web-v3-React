import React, { Fragment } from 'react'

import { Helmet } from 'react-helmet'

import Header from '../components/header'
import CenterText from '../components/center-text'
import Footer from '../components/footer'
import './about.css'

const About = (props) => {
  return (
    <div className="about-container10">
      <Helmet>
        <title>about - exported project</title>
        <meta property="og:title" content="about - exported project" />
      </Helmet>
      <Header
        text={
          <Fragment>
            <span className="about-text10">(Hey There)</span>
          </Fragment>
        }
        drops={
          <Fragment>
            <span className="about-text11">Drops</span>
          </Fragment>
        }
        button={
          <Fragment>
            <span className="about-text12">CONNECT</span>
          </Fragment>
        }
        aboutUs={
          <Fragment>
            <span className="about-text13">About Us</span>
          </Fragment>
        }
        affinity={
          <Fragment>
            <span className="about-text14">Affinity</span>
          </Fragment>
        }
        thoughts={
          <Fragment>
            <span className="about-text15">Thoughts</span>
          </Fragment>
        }
        myAccount={
          <Fragment>
            <span className="about-text16">My Account</span>
          </Fragment>
        }
        rootClassName="headerroot-class-name6"
      ></Header>
      <div className="about-body">
        <CenterText
          text={
            <Fragment>
              <span className="about-text17">
                Culturally inspired, digitally integrated apparel and goods.
              </span>
            </Fragment>
          }
        ></CenterText>
        <div className="about-container11">
          <div className="about-what">
            <div className="about-container12">
              <img
                alt="image"
                src="/untitled_artwork%2026-1200w.png"
                className="about-image1"
              />
            </div>
            <div className="about-container13">
              <div className="about-container14">
                <span className="about-text18">We Live in the Lab</span>
                <span className="about-text19">
                  We are alchemists at heart. We experiment, tinker and build.
                  We take things that we find interesting in the world and piece
                  them together to create something new.
                </span>
              </div>
              <div className="about-container15">
                <span className="about-text20">We Rep Our People</span>
                <span className="about-text21">Enough said.</span>
              </div>
              <div className="about-container16">
                <span className="about-text22">We Are Culture Catalysts</span>
                <span className="about-text23">
                  We are facinated with the culture around us. The people, the
                  art, the music the voices that shape our world. Our job is to
                  absorb these influences and then propel them back out into the
                  world.
                </span>
              </div>
              <div className="about-container17">
                <span className="about-text24">We Blend Worlds</span>
                <span className="about-text25">
                  We are not fans of the lines that get drawn in the world.
                  Whenever possible, we prefer &quot;and&quot; not
                  &quot;or&quot;. Physical and digital. Art and tech. Young and
                  old. Vintage and modern. Minimal and deep.
                </span>
              </div>
            </div>
          </div>
          <div className="about-why">
            <div className="about-container18">
              <img
                alt="image"
                src="/untitled_artwork%2025-1200w.png"
                className="about-image2"
              />
            </div>
            <div className="about-container19">
              <div className="about-container20">
                <span className="about-text26">
                  We Are a Cultural and Vibrational Amplifier
                </span>
                <span className="about-text27">
                  When cool people get around cool people, great things happen.
                  Our job is to help these collisions take place. Through
                  fashion, art, music, conversations and moments, we are here to
                  make sure that the best things (and people) in this world are
                  brought together.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer
        text={
          <Fragment>
            <span className="about-text28">© 2025 Devil x Detail</span>
          </Fragment>
        }
        text1={
          <Fragment>
            <span className="about-text29">SOCIAL</span>
          </Fragment>
        }
        text2={
          <Fragment>
            <span className="about-text30">Twitter (X)</span>
          </Fragment>
        }
        text3={
          <Fragment>
            <span className="about-text31">Instagram</span>
          </Fragment>
        }
        text4={
          <Fragment>
            <span className="about-text32">HELP</span>
          </Fragment>
        }
        text5={
          <Fragment>
            <span className="about-text33">FAQ</span>
          </Fragment>
        }
        text6={
          <Fragment>
            <span className="about-text34">Contact Us</span>
          </Fragment>
        }
        text7={
          <Fragment>
            <span className="about-text35">COMPANY</span>
          </Fragment>
        }
        text8={
          <Fragment>
            <span className="about-text36">Privacy Policy</span>
          </Fragment>
        }
        text9={
          <Fragment>
            <span className="about-text37">Terms of Service</span>
          </Fragment>
        }
        text91={
          <Fragment>
            <span className="about-text38">Affinity Token</span>
          </Fragment>
        }
        rootClassName="footerroot-class-name5"
      ></Footer>
    </div>
  )
}

export default About
