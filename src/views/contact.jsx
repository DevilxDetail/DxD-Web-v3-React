import React, { Fragment } from 'react'

import { Helmet } from 'react-helmet'

import Header from '../components/header'
import CenterText from '../components/center-text'
import Footer from '../components/footer'
import './contact.css'

const Contact = (props) => {
  return (
    <div className="contact-container1">
      <Helmet>
        <title>contact - exported project</title>
        <meta property="og:title" content="contact - exported project" />
      </Helmet>
      <Header
        text={
          <Fragment>
            <span className="contact-text10">(Hey There)</span>
          </Fragment>
        }
        drops={
          <Fragment>
            <span className="contact-text11">Drops</span>
          </Fragment>
        }
        button={
          <Fragment>
            <span className="contact-text12">CONNECT</span>
          </Fragment>
        }
        aboutUs={
          <Fragment>
            <span className="contact-text13">About Us</span>
          </Fragment>
        }
        affinity={
          <Fragment>
            <span className="contact-text14">Affinity</span>
          </Fragment>
        }
        thoughts={
          <Fragment>
            <span className="contact-text15">Thoughts</span>
          </Fragment>
        }
        myAccount={
          <Fragment>
            <span className="contact-text16">My Account</span>
          </Fragment>
        }
        rootClassName="headerroot-class-name10"
      ></Header>
      <CenterText
        text={
          <Fragment>
            <span className="contact-text17">Get In Touch</span>
          </Fragment>
        }
        rootClassName="center-textroot-class-name7"
      ></CenterText>
      <div className="contact-container2">
        <div className="contact-container3">
          <span className="contact-text18">
            <span>Twitter</span>
            <br></br>
          </span>
          <span>
            <span>
              The best way to reach us is via Twitter DMs. Feel free to jump in
              with any questions, issues or ideas you may have:
              <span
                dangerouslySetInnerHTML={{
                  __html: ' ',
                }}
              />
            </span>
            <a
              href="https://x.com/devilxdetail"
              target="_blank"
              rel="noreferrer noopener"
              className="contact-link1"
            >
              @devilxdetail
            </a>
            <br></br>
          </span>
        </div>
        <div className="contact-container4">
          <span className="contact-text24">
            <span>Email (General)</span>
            <br></br>
          </span>
          <span>
            <span>
              You are always welcome to send us an email at
              <span
                dangerouslySetInnerHTML={{
                  __html: ' ',
                }}
              />
            </span>
            <a
              href="mailto:hello@devilxdetail.com?subject="
              className="contact-link2"
            >
              hello@devilxdetail.com
            </a>
            <span>
              {' '}
              with questions or concerns. Please note that we normally need 1-2
              days to respond.
            </span>
            <br></br>
          </span>
        </div>
        <div className="contact-container5">
          <span className="contact-text31">
            <span>Email (Collaborators)</span>
            <br></br>
          </span>
          <span>
            <span>
              If you are an artist or collaborator that wants to reach out with
              ideas, concepts or questions, please email us at
              <span
                dangerouslySetInnerHTML={{
                  __html: ' ',
                }}
              />
            </span>
            <a
              href="mailto:artists@devilxdetail.com?subject="
              className="contact-link3"
            >
              artists@devilxdetail.com
            </a>
            <span>.</span>
            <br></br>
          </span>
        </div>
      </div>
      <Footer
        text={
          <Fragment>
            <span className="contact-text38">© 2025 Devil x Detail</span>
          </Fragment>
        }
        text1={
          <Fragment>
            <span className="contact-text39">SOCIAL</span>
          </Fragment>
        }
        text2={
          <Fragment>
            <span className="contact-text40">Twitter (X)</span>
          </Fragment>
        }
        text3={
          <Fragment>
            <span className="contact-text41">Instagram</span>
          </Fragment>
        }
        text4={
          <Fragment>
            <span className="contact-text42">HELP</span>
          </Fragment>
        }
        text5={
          <Fragment>
            <span className="contact-text43">FAQ</span>
          </Fragment>
        }
        text6={
          <Fragment>
            <span className="contact-text44">Contact Us</span>
          </Fragment>
        }
        text7={
          <Fragment>
            <span className="contact-text45">COMPANY</span>
          </Fragment>
        }
        text8={
          <Fragment>
            <span className="contact-text46">Privacy Policy</span>
          </Fragment>
        }
        text9={
          <Fragment>
            <span className="contact-text47">Terms of Service</span>
          </Fragment>
        }
        text91={
          <Fragment>
            <span className="contact-text48">Affinity Token</span>
          </Fragment>
        }
        rootClassName="footerroot-class-name7"
      ></Footer>
    </div>
  )
}

export default Contact
