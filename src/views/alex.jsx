import React, { Fragment } from 'react'
import { Helmet } from 'react-helmet'

import Header from '../components/header'
import CenterText from '../components/center-text'
import ConsistentFooter from '../components/ConsistentFooter'
import './alex.css'

const Alex = (props) => {
  return (
    <div className="alex-container1">
      <Helmet>
        <title>DxD - Alex</title>
        <meta name="description" content="Culturally inspired, digitally integrated apparel and goods" />
        
        {/* Essential OG Tags */}
        <meta property="og:title" content="DxD - Alex" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://devilxdetail.com/alex" />
        <meta property="og:image" content="https://devilxdetail.com/instc 2025-01-26 105424.281-1200w.png" />
        <meta property="og:description" content="Culturally inspired, digitally integrated apparel and goods" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="DxD - Alex" />
        <meta name="twitter:description" content="Culturally inspired, digitally integrated apparel and goods" />
        <meta name="twitter:image" content="https://devilxdetail.com/instc 2025-01-26 105424.281-1200w.png" />
      </Helmet>
      <Header
        text={
          <Fragment>
            <span className="alex-text10">About DxD</span>
          </Fragment>
        }
        iconBlackSrc="/icon%20-%20black-200h.png"
        rootClassName="header-root-class-name7"
      />
      <div className="alex-container2">
        <img
          alt="image"
          src="/alex%20banner%20desktop-1500w.png"
          className="alex-image1"
        />
        <img
          alt="image"
          src="/alex%20banner%20mobile-1500w.png"
          className="alex-image2"
        />
        <CenterText
          text={
            <Fragment>
              <span className="alex-text17">Alex Mack</span>
            </Fragment>
          }
          rootClassName="center-textroot-class-name5"
        />
        <div className="alex-container3">
          <span className="alex-text18">
            <span>
              We've been fans of Alex Mack for a long time. An incredible
              ambassador in the space and a talented landscape photographer
              based in Vancouver, British Columbia, Alex's work had always stood
              out. Beyond her breathtaking landscapes, we were also drawn to her
              expressive watercolor pieces. Her desire to experiment, paired
              with her down to earth vibe, made her the perfect collaborator.
            </span>
            <br></br>
            <br></br>
            <span>
              As we started brainstorming, Alex came to us with the concept of
              mounTONE, a creative twist on the popular Pantone panels. She
              blended her stunning mountain photography with abstract watercolor
              overlays, creating a six-panel mounTONE piece that felt like six
              works of art in one. The result was nothing short of breathtaking.
            </span>
            <br></br>
            <br></br>
            <span>
              Given her northern influence and the fall season, we chose a
              heavyweight, 100% cotton sweatshirt for the drop. The mounTONE
              panels took center stage on the front, complemented by an original
              artwork from Alex on the back. To complete the experience, each
              drop included an NFT paired with a high-quality print on
              watercolor paper, reinforcing the authenticity of her work.
            </span>
            <br></br>
            <br></br>
            <span>
              Alex's limited edition drop launched on September 23rd and was met
              with adoration. Her thoughtfulness and attention to detail made
              our second drop one to remember.
            </span>
            <br></br>
            <br></br>
            <span>
              To learn more about Alex Mack:
              <span
                dangerouslySetInnerHTML={{
                  __html: ' ',
                }}
              />
            </span>
            <a
              href="https://x.com/alexmack__"
              target="_blank"
              rel="noreferrer noopener"
              className="alex-link1"
            >
              @alexmack__
            </a>
            <br></br>
            <span>
              Click
              <span
                dangerouslySetInnerHTML={{
                  __html: ' ',
                }}
              />
            </span>
            <a
              href="https://opensea.io/assets/ethereum/0x283e6ed2b0eabc52c9dee94536bdabea40d6dfa7/2"
              target="_blank"
              rel="noreferrer noopener"
              className="alex-link2"
            >
              here
            </a>
            <span> to see the digital art piece.</span>
            <br></br>
          </span>
        </div>
      </div>
      <ConsistentFooter />
    </div>
  )
}

export default Alex
