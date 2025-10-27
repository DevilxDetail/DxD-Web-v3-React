import React, { Fragment, useState, useEffect } from 'react'
import { usePrivy } from "@privy-io/react-auth";
import { Helmet } from 'react-helmet'
import { getSupabaseClient } from '../lib/supabase'
import { Link, useHistory } from 'react-router-dom'

import Header from '../components/header'
import ConsistentFooter from '../components/ConsistentFooter'
import './profile.css'

const Profile = (props) => {
  const { login, authenticated, user } = usePrivy();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    async function fetchUserProfile() {
      if (authenticated && user?.id) {
        try {
          const client = getSupabaseClient();
          const { data, error } = await client
            .from('user')
            .select('id, auth_user_id, evm_wallet, email, name, profile_image')
            .eq('auth_user_id', user.id)
            .maybeSingle();

          if (error) {
            console.error('Error fetching user profile:', error);
            return;
          }

          setProfileData(data);
        } catch (error) {
          console.error('Error:', error);
        } finally {
          setLoading(false);
        }
      }
    }

    fetchUserProfile();
  }, [authenticated, user]);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!authenticated && !loading) {
      history.push('/');
    }
  }, [authenticated, loading, history]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="profile-container1">
        <Helmet>
          <title>DxD - Profile</title>
          <meta name="description" content="Culturally inspired, digitally integrated apparel and goods" />
          
          {/* Essential OG Tags */}
          <meta property="og:title" content="DxD - Profile" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://devilxdetail.com/profile" />
          <meta property="og:image" content="https://devilxdetail.com/alpha_thumbnail.jpg" />
          <meta property="og:description" content="Culturally inspired, digitally integrated apparel and goods" />
          
          {/* Twitter Card tags */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="DxD - Profile" />
          <meta name="twitter:description" content="Culturally inspired, digitally integrated apparel and goods" />
        </Helmet>
        <Header
          text={<Fragment><span className="profile-text10">About DxD</span></Fragment>}
          iconBlackSrc="/icon%20-%20black-200h.png"
          rootClassName="header-root-class-name3"
        />
        <div className="profile-container2" style={{ alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
          <h2 style={{ color: 'white' }}>Loading profile...</h2>
        </div>
        <ConsistentFooter />
      </div>
    );
  }

  // Don't render anything while redirect is happening
  if (!authenticated) {
    return null;
  }

  return (
    <div className="profile-container1">
      <Helmet>
        <title>DxD - Profile</title>
        <meta name="description" content="Culturally inspired, digitally integrated apparel and goods" />
        
        {/* Essential OG Tags */}
        <meta property="og:title" content="DxD - Profile" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://devilxdetail.com/profile" />
        <meta property="og:image" content="https://devilxdetail.com/alpha_thumbnail.jpg" />
        <meta property="og:description" content="Culturally inspired, digitally integrated apparel and goods" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="DxD - Profile" />
        <meta name="twitter:description" content="Culturally inspired, digitally integrated apparel and goods" />
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
            alt="Profile"
            src={profileData?.profile_image || "/default profile.png"}
            className="profile-image"
          />
          <div className="profile-container4">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '10px' }}>
              <span className="profile-text15">
                {profileData?.name || 'Anon'}
              </span>
              <Link to="/account">
                <svg 
                  className="profile-edit-icon" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                </svg>
              </Link>
            </div>
            <span className="profile-text16" style={{ wordBreak: 'break-all' }}>
              {profileData?.evm_wallet || 'No wallet connected'}
            </span>
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