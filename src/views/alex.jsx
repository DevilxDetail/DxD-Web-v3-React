import React, { Fragment } from 'react'

import { Helmet } from 'react-helmet'

import Header from '../components/header'
import CenterText from '../components/center-text'
import Footer from '../components/footer'
import './alex.css'

const Alex = (props) => {
  return (
    <div className="alex-container1">
      <Helmet>
        <title>alex - exported project</title>
        <meta property="og:title" content="alex - exported project" />
      </Helmet>
      <Header
        text={
          <Fragment>
            <span className="alex-text10">(Hey There)</span>
          </Fragment>
        }
        drops={
          <Fragment>
            <span className="alex-text11">Drops</span>
          </Fragment>
        }
        button={
          <Fragment>
            <span className="alex-text12">CONNECT</span>
          </Fragment>
        }
        aboutUs={
          <Fragment>
            <span className="alex-text13">About Us</span>
          </Fragment>
        }
        affinity={
          <Fragment>
            <span className="alex-text14">Affinity</span>
          </Fragment>
        }
        thoughts={
          <Fragment>
            <span className="alex-text15">Thoughts</span>
          </Fragment>
        }
        myAccount={
          <Fragment>
            <span className="alex-text16">My Account</span>
          </Fragment>
        }
        rootClassName="headerroot-class-name8"
      ></Header>
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
        ></CenterText>
        <div className="alex-container3">
          <span className="alex-text18">
            <span>
              We’ve been fans of Alex Mack for a long time. An incredible
              ambassador in the space and a talented landscape photographer
              based in Vancouver, British Columbia, Alex’s work had always stood
              out. Beyond her breathtaking landscapes, we were also drawn to her
              expressive watercolor pieces. Her desire to experiment, paired
              with her down-to-earth vibe, made her the perfect collaborator.
            </span>
            <br></br>
            <br></br>
            <span>
              As we started brainstorming, Alex came to us with the concept of
              MounTone—a creative twist on the popular Pantone panels. She
              blended her stunning mountain photography with abstract watercolor
              overlays, creating a six-panel MounTone piece that felt like six
              works of art in one. The result was nothing short of breathtaking.
            </span>
            <br></br>
            <br></br>
            <span>
              Given her northern influence and the fall season, we chose a
              heavyweight, 100% cotton sweatshirt for the drop. The MounTone
              panels took center stage on the front, complemented by an original
              artwork from Alex on the back. To complete the experience, each
              drop included an NFT paired with a high-quality print on
              watercolor paper, reinforcing the authenticity of her work.
            </span>
            <br></br>
            <br></br>
            <span>
              Alex’s limited edition drop launched on September 23rd and was met
              with adoration. Her thoughtfulness and attention to detail made
              our second drop an absolute success.
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
      <Footer
        text={
          <Fragment>
            <span className="alex-text36">© 2025 Devil x Detail</span>
          </Fragment>
        }
        text1={
          <Fragment>
            <span className="alex-text37">SOCIAL</span>
          </Fragment>
        }
        text2={
          <Fragment>
            <span className="alex-text38">Twitter (X)</span>
          </Fragment>
        }
        text3={
          <Fragment>
            <span className="alex-text39">Instagram</span>
          </Fragment>
        }
        text4={
          <Fragment>
            <span className="alex-text40">HELP</span>
          </Fragment>
        }
        text5={
          <Fragment>
            <span className="alex-text41">FAQ</span>
          </Fragment>
        }
        text6={
          <Fragment>
            <span className="alex-text42">Contact Us</span>
          </Fragment>
        }
        text7={
          <Fragment>
            <span className="alex-text43">COMPANY</span>
          </Fragment>
        }
        text8={
          <Fragment>
            <span className="alex-text44">Privacy Policy</span>
          </Fragment>
        }
        text9={
          <Fragment>
            <span className="alex-text45">Terms of Service</span>
          </Fragment>
        }
        text91={
          <Fragment>
            <span className="alex-text46">Affinity Token</span>
          </Fragment>
        }
        rootClassName="footerroot-class-name9"
      ></Footer>
    </div>
  )
}

export default Alex
