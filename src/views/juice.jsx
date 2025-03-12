import React, { Fragment } from 'react'
import { Helmet } from 'react-helmet'

import Header from '../components/header'
import CenterText from '../components/center-text'
import ConsistentFooter from '../components/ConsistentFooter'
import './juice.css'

const Juice = (props) => {
  return (
    <div className="juice-container1">
      <Helmet>
        <title>Juice - DxD</title>
        <meta property="og:title" content="Juice - DxD" />
      </Helmet>
      <Header
        text={
          <Fragment>
            <span className="juice-text10">About DxD</span>
          </Fragment>
        }
        iconBlackSrc="/icon%20-%20black-200h.png"
        rootClassName="header-root-class-name5"
      />
      <div className="juice-container2">
        <img
          alt="image"
          src="/juice%20banner%20desktop-1500w.png"
          className="juice-image1"
        />
        <img
          alt="image"
          src="/juice%20banner%20mobile-1500w.png"
          className="juice-image2"
        />
        <CenterText
          text={
            <Fragment>
              <span className="juice-text17">Juice Bruns</span>
            </Fragment>
          }
          rootClassName="center-textroot-class-name6"
        />
        <div className="juice-container3">
          <span className="juice-text18">
            <span>
              In March of 2024, we approached Juice Bruns with an idea that
              would eventually become Devil x Detail... a brand built around
              collaborative apparel drops. Juice, an incredible
              multidisciplinary artist and rapper, felt like the perfect fit.
              But it wasn't just his talent that stood out; it was his vibe and
              ethos. Juice believes deeply in the power of collaboration,
              bringing authenticity and intention to everything he does.
            </span>
            <br></br>
            <br></br>
            <span>
              From the moment we connected, he was all in. His creative insight
              and feedback were invaluable, and his flexibility with our model
              made him the ideal artist to launch with. Together, we crafted a
              limited edition kit featuring a long-sleeved t-shirt and a hat.
              Juice designed five original pieces of art for this drop... one
              for the hat, one for the NFT, and three for the shirt, with
              artwork on the front, sleeve, and back. Each piece was
              thoughtfully created, rich with meaning, and visually stunning.
            </span>
            <br></br>
            <br></br>
            <span>
              Our first ever drop, Reconnected, took place on July 22nd, 2024.
            </span>
            <br></br>
            <br></br>
            <span>
              To learn more about Juice Bruns:
              <span
                dangerouslySetInnerHTML={{
                  __html: ' ',
                }}
              />
            </span>
            <a
              href="https://x.com/juice_bruns"
              target="_blank"
              rel="noreferrer noopener"
              className="juice-link1"
            >
              @juice_bruns
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
              href="https://opensea.io/assets/ethereum/0x283e6ed2b0eabc52c9dee94536bdabea40d6dfa7/1"
              target="_blank"
              rel="noreferrer noopener"
              className="juice-link2"
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

export default Juice
