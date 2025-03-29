import React, { Fragment } from 'react'
import { Helmet } from 'react-helmet'

import Header from '../components/header'
import CenterText from '../components/center-text'
import ConsistentFooter from '../components/ConsistentFooter'
import './marfa.css'

const Marfa = (props) => {
  return (
    <div className="marfa-container1">
      <Helmet>
        <title>DxD - Marfa</title>
        <meta name="description" content="Culturally inspired, digitally integrated apparel and goods" />
        
        {/* Essential OG Tags */}
        <meta property="og:title" content="DxD - Marfa" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://devilxdetail.com/marfa" />
        <meta property="og:image" content="https://devilxdetail.com/alpha_thumbnail.jpg" />
        <meta property="og:description" content="Culturally inspired, digitally integrated apparel and goods" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="DxD - Marfa" />
        <meta name="twitter:description" content="Culturally inspired, digitally integrated apparel and goods" />
      </Helmet>
      <Header
        text={
          <Fragment>
            <span className="marfa-text10">About DxD</span>
          </Fragment>
        }
        iconBlackSrc="/icon%20-%20black-200h.png"
        rootClassName="header-root-class-name6"
      />
      <div className="marfa-container2">
        <div className="marfa-container3">
          <img
            alt="image"
            src="/instc%202025-02-10%20203658.858-800w.png"
            className="marfa-image1"
          />
          <img
            alt="image"
            src="/instc%202025-02-10%20203700.949-900w.png"
            className="marfa-image2"
          />
          <img
            alt="image"
            src="/instc%202025-02-10%20203700.470-800w.png"
            className="marfa-image3"
          />
        </div>
        <CenterText
          text={
            <Fragment>
              <span className="marfa-text17">Marfa 2024</span>
            </Fragment>
          }
          rootClassName="center-textroot-class-name4"
        />
        <div className="marfa-container4">
          <span className="marfa-text18">
            <span>
              For anyone who's experienced Art Blocks Weekend in Marfa, Texas,
              no explanation is needed... it's pure magic. Imagine spending a
              long weekend in a small, art-focused town, surrounded by a couple
              hundred of your closest digital friends from all over the world.
              Our first taste of it was in 2023, and heading into 2024, we knew
              we wanted to contribute to what makes this event so special.
            </span>
            <br></br>
            <br></br>
            <span>
              We teamed up with our friends at Shillr to host a Vibe Sesh on
              Friday afternoon. We took over The Otherside, a bar tucked behind
              Glitch Gallery, and created a space filled with music,
              conversation, cocktails, and exclusive, limited-edition Marfa-only
              Devil x Detail merch. Thinking back to that day still gives us
              chills... the energy, the connections, the people who made it
              unforgettable.
            </span>
            <br></br>
            <br></br>
            <span>
              This event embodied exactly why Devil x Detail exists. It's about
              bringing together incredibly talented, creative, and intentional
              people. When we talk about blending the digital and physical,
              we're not just referring to our clothing. It's about creating real
              bridges, through art, conversations, and a whole lot of hugs.
            </span>
          </span>
        </div>
        <div className="marfa-container5">
          <img
            alt="image"
            src="/instc%202025-02-10%20203822.019-800w.png"
            className="marfa-image4"
          />
          <img
            alt="image"
            src="/instc%202025-02-10%20203825.076-500w.png"
            className="marfa-image5"
          />
          <img
            alt="image"
            src="/instc%202025-02-10%20203823.535-800w.png"
            className="marfa-image6"
          />
        </div>
        <div className="marfa-container6">
          <img
            alt="image"
            src="/instc%202025-02-10%20203822.777-800w.png"
            className="marfa-image7"
          />
          <img
            alt="image"
            src="/instc%202025-02-10%20203824.306-800w.png"
            className="marfa-image8"
          />
          <img
            alt="image"
            src="/instc%202025-02-10%20203826.358-800w.png"
            className="marfa-image9"
          />
        </div>
      </div>
      <ConsistentFooter />
    </div>
  )
}

export default Marfa
