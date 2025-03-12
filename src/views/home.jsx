import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { usePrivy } from "@privy-io/react-auth";
import { Helmet } from 'react-helmet'

import Header from '../components/header'
import Footer from '../components/footer'
import './home.css'

const Home = (props) => {
  const { authenticated } = usePrivy();
  
  return (
    <div className="home-container1">
      <Helmet>
        <title>DxD - Devil x Detail</title>
        <meta property="og:title" content="DxD - Devil x Detail" />
      </Helmet>
      <Header
        text={
          <Fragment>
            <span className="home-text10">About DxD</span>
          </Fragment>
        }
        iconBlackSrc="/icon%20-%20black-200h.png"
        rootClassName="header-root-class-name"
      />
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
                <span className="home-text15">Collaboration</span>
                <span className="home-text16">Juice Bruns</span>
                <span className="home-text17">7/22/24</span>
                <span className="home-text18">
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
                <span className="home-text19">Collaboration</span>
                <span className="home-text20">Alex Mack</span>
                <span className="home-text21">9/23/24</span>
                <span className="home-text22">
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
                <span className="home-text23">IRL</span>
                <span className="home-text24">Marfa, Tx</span>
                <span className="home-text25">11/15/2024</span>
                <span className="home-text26">
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
      <Footer rootClassName="footer-root-class-name" />
    </div>
  )
}

export default Home
