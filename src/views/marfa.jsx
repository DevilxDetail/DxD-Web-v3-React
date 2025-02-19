import React, { Fragment } from 'react'

import { Helmet } from 'react-helmet'

import Header from '../components/header'
import CenterText from '../components/center-text'
import Footer from '../components/footer'
import './marfa.css'

const Marfa = (props) => {
  return (
    <div className="marfa-container1">
      <Helmet>
        <title>marfa - exported project</title>
        <meta property="og:title" content="marfa - exported project" />
      </Helmet>
      <Header
        text={
          <Fragment>
            <span className="marfa-text10">(Hey There)</span>
          </Fragment>
        }
        drops={
          <Fragment>
            <span className="marfa-text11">Drops</span>
          </Fragment>
        }
        button={
          <Fragment>
            <span className="marfa-text12">CONNECT</span>
          </Fragment>
        }
        aboutUs={
          <Fragment>
            <span className="marfa-text13">About Us</span>
          </Fragment>
        }
        affinity={
          <Fragment>
            <span className="marfa-text14">Affinity</span>
          </Fragment>
        }
        thoughts={
          <Fragment>
            <span className="marfa-text15">Thoughts</span>
          </Fragment>
        }
        myAccount={
          <Fragment>
            <span className="marfa-text16">My Account</span>
          </Fragment>
        }
        rootClassName="headerroot-class-name9"
      ></Header>
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
        ></CenterText>
        <div className="marfa-container4">
          <span className="marfa-text18">
            <span>
              For anyone who’s experienced Art Blocks Weekend in Marfa, Texas,
              no explanation is needed... it’s pure magic. Imagine spending a
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
              This event embodied exactly why Devil x Detail exists. It’s about
              bringing together incredibly talented, creative, and intentional
              people. When we talk about blending the digital and physical,
              we’re not just referring to our clothing. It’s about creating real
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
      <Footer
        text={
          <Fragment>
            <span className="marfa-text26">© 2025 Devil x Detail</span>
          </Fragment>
        }
        text1={
          <Fragment>
            <span className="marfa-text27">SOCIAL</span>
          </Fragment>
        }
        text2={
          <Fragment>
            <span className="marfa-text28">Twitter (X)</span>
          </Fragment>
        }
        text3={
          <Fragment>
            <span className="marfa-text29">Instagram</span>
          </Fragment>
        }
        text4={
          <Fragment>
            <span className="marfa-text30">HELP</span>
          </Fragment>
        }
        text5={
          <Fragment>
            <span className="marfa-text31">FAQ</span>
          </Fragment>
        }
        text6={
          <Fragment>
            <span className="marfa-text32">Contact Us</span>
          </Fragment>
        }
        text7={
          <Fragment>
            <span className="marfa-text33">COMPANY</span>
          </Fragment>
        }
        text8={
          <Fragment>
            <span className="marfa-text34">Privacy Policy</span>
          </Fragment>
        }
        text9={
          <Fragment>
            <span className="marfa-text35">Terms of Service</span>
          </Fragment>
        }
        text91={
          <Fragment>
            <span className="marfa-text36">Affinity Token</span>
          </Fragment>
        }
        rootClassName="footerroot-class-name8"
      ></Footer>
    </div>
  )
}

export default Marfa
