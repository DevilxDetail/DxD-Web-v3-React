import React, { Fragment } from 'react'
import { usePrivy } from "@privy-io/react-auth";
import { Helmet } from 'react-helmet'

import Header from '../components/header'
import ConsistentFooter from '../components/ConsistentFooter'
import './profile.css'

const Profile = (props) => {
  const { login, authenticated, user } = usePrivy();

  // Redirect to login if not authenticated
  if (!authenticated) {
    return (
      <div className="profile-container1">
        <Helmet>
          <title>Profile - DxD</title>
          <meta property="og:title" content="Profile - DxD" />
        </Helmet>
        <Header
          text={
            <Fragment>
              <span className="profile-text10">About DxD</span>
            </Fragment>
          }
          iconBlackSrc="/icon%20-%20black-200h.png"
          rootClassName="header-root-class-name3"
        />
        <div className="profile-container2" style={{ alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
          <h1 style={{ color: 'white', marginBottom: '20px' }}>Please connect your wallet to view your profile</h1>
          <button onClick={login} className="profile-button">
            Connect Wallet
          </button>
        </div>
        <ConsistentFooter />
      </div>
    )
  }

  return (
    <div className="profile-container1">
      <Helmet>
        <title>Profile - DxD</title>
        <meta property="og:title" content="Profile - DxD" />
      </Helmet>
      <Header
        text={
          <Fragment>
            <span className="profile-text10">About DxD</span>
          </Fragment>
        }
        iconBlackSrc="/icon%20-%20black-200h.png"
        rootClassName="header-root-class-name3"
      />
      <div className="profile-container2">
        <div className="profile-container3">
          <img
            alt="image"
            src="https://play.teleporthq.io/static/svg/default-img.svg"
            className="profile-image"
          />
          <div className="profile-container4">
            <span className="profile-text15">Name</span>
            <span className="profile-text16">Wallet</span>
          </div>
        </div>
        <div className="profile-container5">
          <span className="profile-text17">My Collection</span>
        </div>
        <div className="profile-container6"></div>
      </div>
      <ConsistentFooter />
    </div>
  )
}

export default Profile 