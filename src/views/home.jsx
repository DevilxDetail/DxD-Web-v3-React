import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'

import { Helmet } from 'react-helmet'

import Header from '../components/header'
import Footer from '../components/footer'
import './home.css'

const Home = (props) => {
  return (
    <div className="home-container1">
      <Helmet>
        <title>exported project</title>
        <meta property="og:title" content="exported project" />
      </Helmet>
      <Header
        text={
          <Fragment>
            <span className="home-text10">(Hey There)</span>
          </Fragment>
        }
        drops={
          <Fragment>
            <span className="home-text11">Drops</span>
          </Fragment>
        }
        button={
          <Fragment>
            <span className="home-text12">CONNECT</span>
          </Fragment>
        }
        aboutUs={
          <Fragment>
            <span className="home-text13">About Us</span>
          </Fragment>
        }
        affinity={
          <Fragment>
            <span className="home-text14">Affinity</span>
          </Fragment>
        }
        thoughts={
          <Fragment>
            <span className="home-text15">Thoughts</span>
          </Fragment>
        }
        myAccount={
          <Fragment>
            <span className="home-text16">My Account</span>
          </Fragment>
        }
        rootClassName="headerroot-class-name2"
      ></Header>
      <div className="home-container2">
        <img
          alt="image"
          src="/header%20vintage%202-1500w.png"
          className="home-image1"
        />
        <img
          alt="image"
          src="/header%20vintage%20mobile-1500w.png"
          className="home-image2"
        />
        <div className="home-container3">
          <Link to="/juice" className="home-navlink1">
            <div className="home-container4">
              <img
                alt="image"
                src="/instc%202025-01-26%20105424.174-1200w.png"
                className="home-image3"
              />
              <div className="home-container5">
                <span className="home-text17">Collaboration</span>
                <span className="home-text18">Juice Bruns</span>
                <span className="home-text19">7/22/24</span>
                <span className="home-text20">
                  Our first official collaborative drop was released in July of
                  2024 and featured the artwork of visual artist and rapper
                  Juice Bruns. Learn more about the artwork and the process of
                  launching the first ever DxD artist collaboration.
                </span>
              </div>
            </div>
          </Link>
          <Link to="/alex" className="home-navlink2">
            <div className="home-container6">
              <img
                alt="image"
                src="/instc%202025-01-26%20105424.281-1200w.png"
                className="home-image4"
              />
              <div className="home-container7">
                <span className="home-text21">Collaboration</span>
                <span className="home-text22">Alex Mack</span>
                <span className="home-text23">9/23/24</span>
                <span className="home-text24">
                  Drop 2, launched in September of 2024 featured Alex Mack, a
                  multidisciplinary artist from Vancouver. Learn more about she
                  combined her landscape photography with her talents in
                  watercolor to create a unique piece for DxD.
                </span>
              </div>
            </div>
          </Link>
          <Link to="/marfa" className="home-navlink3">
            <div className="home-container8">
              <img
                alt="image"
                src="/instc%202025-01-26%20111530.196-1200w.png"
                className="home-image5"
              />
              <div className="home-container9">
                <span className="home-text25">IRL</span>
                <span className="home-text26">Marfa, Tx</span>
                <span className="home-text27">11/15/2024</span>
                <span className="home-text28">
                  Big love to our friends at Shillr for helping us host an
                  unforgettable community event during ArtBlocks Marfa Weekend.
                  We shared drinks with friends, gave away exclusive merch, and
                  immersed ourselves in incredible art.
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>
      <Footer
        text={
          <Fragment>
            <span className="home-text29">© 2025 Devil x Detail</span>
          </Fragment>
        }
        text1={
          <Fragment>
            <span className="home-text30">SOCIAL</span>
          </Fragment>
        }
        text2={
          <Fragment>
            <span className="home-text31">Twitter (X)</span>
          </Fragment>
        }
        text3={
          <Fragment>
            <span className="home-text32">Instagram</span>
          </Fragment>
        }
        text4={
          <Fragment>
            <span className="home-text33">HELP</span>
          </Fragment>
        }
        text5={
          <Fragment>
            <span className="home-text34">FAQ</span>
          </Fragment>
        }
        text6={
          <Fragment>
            <span className="home-text35">Contact Us</span>
          </Fragment>
        }
        text7={
          <Fragment>
            <span className="home-text36">COMPANY</span>
          </Fragment>
        }
        text8={
          <Fragment>
            <span className="home-text37">Privacy Policy</span>
          </Fragment>
        }
        text9={
          <Fragment>
            <span className="home-text38">Terms of Service</span>
          </Fragment>
        }
        text91={
          <Fragment>
            <span className="home-text39">Affinity Token</span>
          </Fragment>
        }
        rootClassName="footerroot-class-name10"
      ></Footer>
    </div>
  )
}

export default Home
