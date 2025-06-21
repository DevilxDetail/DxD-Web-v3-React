import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { supabase, supabaseServiceRole } from '../lib/supabase';

const IYKPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const iykRef = searchParams.get('iykRef');
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [supabaseData, setSupabaseData] = useState(null);
  const [checkingSupabase, setCheckingSupabase] = useState(false);
  const [formData, setFormData] = useState({
    twitter: '',
    email: '',
    evm_wallet: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const fetchIYKData = async () => {
    if (!iykRef) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://api.iyk.app/refs/${iykRef}`, {
        method: 'GET',
        headers: {
          'x-iyk-api-key': 'f68709437f89477e1e082faabfcd0623193dcbdce4b7807c64d063a1ae4e2116',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setApiData(data);
      
      // If valid reference and form hasn't been submitted, check Supabase
      if (data.isValidRef && !submitted) {
        checkSupabaseUser(data.uid);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching IYK data:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkSupabaseUser = async (uid) => {
    setCheckingSupabase(true);
    try {
      // First check if the UID exists in cc_uid table (chip already claimed)
      const { data: uidData, error: uidError } = await supabase
        .from('cc_uid')
        .select('uid')
        .eq('uid', uid)
        .single();

      if (uidError && uidError.code !== 'PGRST116') {
        throw uidError;
      }

      // If UID exists in cc_uid, chip has been claimed
      if (uidData) {
        setSupabaseData({ claimed: true });
        return;
      }

      // If UID doesn't exist in cc_uid, check if user has registered in cc_user
      const { data: userData, error: userError } = await supabase
        .from('cc_user')
        .select('twitter, email, evm_wallet')
        .eq('uid', uid)
        .single();

      if (userError && userError.code !== 'PGRST116') {
        throw userError;
      }

      setSupabaseData(userData);
    } catch (err) {
      console.error('Error checking Supabase user:', err);
      setError('Failed to check user registration status');
    } finally {
      setCheckingSupabase(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Twitter validation (must start with @ or be a valid handle)
    if (!formData.twitter.trim()) {
      errors.twitter = 'Twitter handle is required';
    } else {
      const twitterValue = formData.twitter.trim();
      // Allow both @handle and handle formats
      if (!twitterValue.startsWith('@') && !/^[a-zA-Z0-9_]{1,15}$/.test(twitterValue)) {
        errors.twitter = 'Please enter a valid Twitter handle (with or without @)';
      } else if (twitterValue.startsWith('@') && twitterValue.length < 2) {
        errors.twitter = 'Twitter handle is too short';
      }
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }
    
    // EVM wallet validation (valid Ethereum address format OR ENS name)
    const walletRegex = /^0x[a-fA-F0-9]{40}$/;
    const ensRegex = /^.+\.eth$/;
    const walletValue = formData.evm_wallet.trim();
    if (!walletValue) {
      errors.evm_wallet = 'Wallet address or ENS name is required';
    } else if (!walletRegex.test(walletValue) && !ensRegex.test(walletValue)) {
      errors.evm_wallet = 'Please enter a valid Ethereum wallet address (0x followed by 40 characters) or ENS name (ending in .eth)';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    try {
      // Ensure Twitter handle has @ prefix
      const twitterHandle = formData.twitter.trim().startsWith('@') 
        ? formData.twitter.trim() 
        : `@${formData.twitter.trim()}`;

      // Use service role client if available, otherwise fall back to regular client
      const client = supabaseServiceRole || supabase;
      
      // Insert into cc_uid table first (mark chip as claimed)
      const { error: uidError } = await client
        .from('cc_uid')
        .insert([{
          uid: apiData.uid
        }]);

      if (uidError) throw uidError;

      // Then insert into cc_user table with user details
      const { error: userError } = await client
        .from('cc_user')
        .insert([{
          uid: apiData.uid,
          twitter: twitterHandle,
          email: formData.email.trim(),
          evm_wallet: formData.evm_wallet.trim(),
          created_at: new Date().toISOString()
        }]);

      if (userError) throw userError;
      
      setSubmitted(true);
      // Don't set supabaseData here to avoid duplicate SocialLinks
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Failed to submit registration. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!iykRef) {
      setError('No IYK reference provided in the URL. Please use /cc25?iykRef=YOUR_REF');
      setApiData(null);
      return;
    }
    setError(null);
    fetchIYKData();
  }, [iykRef]);

  const SocialLinks = () => (
    <div className="mt-6 p-6 bg-gray-800 border border-gray-700 rounded-lg">
      <h3 className="text-lg font-semibold text-white text-center mb-4" style={{ fontFamily: 'Marcellus, serif', color: 'white' }}>
        Make sure to follow<br/>
        <a 
          href="https://x.com/clickcreateio" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ textDecoration: 'underline', color: 'white' }}
        >
          @clickcreateio
        </a>
        {' '}and{' '}
        <a 
          href="https://x.com/devilxdetail" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ textDecoration: 'underline', color: 'white' }}
        >
          @devilxdetail
        </a>
      </h3>
    </div>
  );

  return (
    <>
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Helmet>
      <style jsx global>{`
        body, html {
          margin: 0 !important;
          padding: 0 !important;
          height: 100vh;
          overflow: hidden;
        }
      `}</style>
      <div className="iyk-container1" style={{ 
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        margin: 0,
        padding: 0,
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("/ClickCreate Background.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontFamily: 'Lato, sans-serif',
        position: 'relative'
      }}>
      {/* Header Container */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        right: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 9999
      }}>
        <a 
          href="https://clickcreate.io" 
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'inline-block' }}
        >
          <img src="/ClickCreate White.png" alt="ClickCreate Logo" style={{ height: '30px' }} />
        </a>
        <a 
          href="/" 
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'inline-block' }}
        >
          <img src="/icon - white-200h.png" alt="DxD Logo" style={{ height: '30px' }} />
        </a>
      </div>
      
      {/* Main Container */}
      <div className="iyk-container2" style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        margin: 0,
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className="iyk-container3" style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          margin: 0,
          padding: 0
        }}>

          <div className="iyk-container4" style={{
            flex: '1',
            width: '100%',
            display: 'flex',
            alignSelf: 'center',
            alignItems: 'center',
            paddingLeft: '24px',
            paddingRight: '24px',
            flexDirection: 'column',
            paddingBottom: '24px',
            paddingTop: '20px',
            justifyContent: 'center',
            marginTop: '-20px'
          }}>
            {/* Loading State */}
            {loading && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'var(--dl-space-space-twounits)',
                color: '#ffffff',
                fontFamily: 'Lato, sans-serif'
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  border: '2px solid #ffffff',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  marginRight: 'var(--dl-space-space-unit)'
                }}></div>
                Loading...
              </div>
            )}

            {/* Error State */}
            {error && (
              <div style={{
                width: '100%',
                marginBottom: 'var(--dl-space-space-twounits)',
                padding: 'var(--dl-space-space-unit)',
                backgroundColor: 'rgba(181, 0, 0, 0.1)',
                border: '1px solid #b50000',
                borderRadius: '4px'
              }}>
                <div style={{
                  color: '#b50000',
                  fontSize: '16px',
                  fontFamily: 'Lato, sans-serif',
                  fontWeight: '700',
                  marginBottom: 'var(--dl-space-space-halfunit)'
                }}>
                  Error
                </div>
                <div style={{
                  color: '#ffffff',
                  fontSize: '14px',
                  fontFamily: 'Lato, sans-serif'
                }}>
                  {error}
                </div>
              </div>
            )}

            {/* API Data Display */}
            {apiData && !loading && !error && (
              <div style={{ width: '100%' }}>
                {/* Authentication Failed Message */}
                {!apiData.isValidRef && (
                  <div style={{
                    width: '100%',
                    marginBottom: 'var(--dl-space-space-twounits)',
                    padding: 'var(--dl-space-space-unit)',
                    backgroundColor: 'rgba(255, 0, 0, 0.2)',
                    border: '1px solid #ff6666',
                    borderRadius: '4px'
                  }}>
                    <div style={{
                      color: '#ff6666',
                      fontSize: '16px',
                      fontFamily: 'Lato, sans-serif',
                      fontWeight: '700',
                      marginBottom: 'var(--dl-space-space-halfunit)'
                    }}>
                      Authentication Failed
                    </div>
                    <div style={{
                      color: '#ffffff',
                      fontSize: '14px',
                      fontFamily: 'Lato, sans-serif'
                    }}>
                      This IYK reference is not valid. Please check your reference and try again.
                    </div>
                  </div>
                )}

                {/* Valid Reference - Show UID and check Supabase */}
                {apiData.isValidRef && (
                  <>
                    {/* Checking Supabase */}
                    {checkingSupabase && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 'var(--dl-space-space-twounits)',
                        color: '#ffffff',
                        fontFamily: 'Lato, sans-serif'
                      }}>
                        <div style={{
                          width: '20px',
                          height: '20px',
                          border: '2px solid #ffffff',
                          borderTop: '2px solid transparent',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite',
                          marginRight: 'var(--dl-space-space-unit)'
                        }}></div>
                        Checking registration status...
                      </div>
                    )}

                    {/* Chip already claimed or user already registered */}
                    {!checkingSupabase && supabaseData && !submitted && (
                      <div style={{ width: '100%' }}>
                        {/* Chip already claimed (UID exists in cc_uid but no user data) */}
                        {supabaseData.claimed && (
                          <div style={{
                            width: '100%',
                            marginBottom: 'var(--dl-space-space-twounits)',
                            padding: 'var(--dl-space-space-unit)',
                            backgroundColor: 'rgba(255, 152, 0, 0.1)',
                            border: '1px solid #FF9800',
                            borderRadius: '4px'
                          }}>
                            <div style={{
                              color: '#FF9800',
                              fontSize: '16px',
                              fontFamily: 'Lato, sans-serif',
                              fontWeight: '700',
                              marginBottom: 'var(--dl-space-space-halfunit)'
                            }}>
                              Clicks Already Claimed
                            </div>
                            <div style={{
                              color: '#ffffff',
                              fontSize: '14px',
                              fontFamily: 'Lato, sans-serif'
                            }}>
                              The Clicks for this shirt have already been claimed. If you are receiving this message in error, please dm the ClickCreate team on Twitter @clickcreateio.
                            </div>
                          </div>
                        )}

                        <SocialLinks />
                      </div>
                    )}

                    {/* Success message after registration */}
                    {submitted && (
                      <div style={{ width: '100%' }}>
                        <div style={{
                          width: '100%',
                          marginBottom: 'var(--dl-space-space-twounits)',
                          padding: 'var(--dl-space-space-unit)',
                          backgroundColor: 'rgba(76, 175, 80, 0.1)',
                          border: '1px solid #4CAF50',
                          borderRadius: '4px'
                        }}>
                          <div style={{
                            color: '#4CAF50',
                            fontSize: '16px',
                            fontFamily: 'Lato, sans-serif',
                            fontWeight: '700',
                            marginBottom: 'var(--dl-space-space-halfunit)'
                          }}>
                            We've Got It
                          </div>
                          <div style={{
                            color: '#ffffff',
                            fontSize: '14px',
                            fontFamily: 'Lato, sans-serif'
                          }}>
                            Thank you for submitting your info. We will notify you once your Clicks have been airdropped!
                          </div>
                        </div>

                        <SocialLinks />
                      </div>
                    )}

                    {/* User not registered - show registration form */}
                    {!checkingSupabase && !supabaseData && !submitted && (
                      <div style={{ width: '100%', textAlign: 'center' }}>
                         <h2 style={{
                          color: '#ffffff',
                          fontFamily: 'Marcellus, serif',
                          fontSize: '32px',
                          marginBottom: '16px',
                          lineHeight: '1.2'
                        }}>
                          Thank you Season 2<br/>
                          full set holders!
                        </h2>
                        <p style={{
                          color: '#ffffff',
                          fontSize: '18px',
                          marginBottom: '24px',
                          fontFamily: 'Lato, sans-serif'
                        }}>
                          We hope you enjoy your merch,<br/>
                          but we have one more surprise...<br/>
                          <br/>
                          Enter your info below<br/>
                          and we will drop you some Clicks!
                        </p>
                        
                        {/* Registration form */}
                        <form onSubmit={handleFormSubmit} style={{
                          width: '100%',
                          marginBottom: 'var(--dl-space-space-twounits)'
                        }}>
                          <div style={{ marginBottom: '16px' }}>
                            <input
                              type="text"
                              name="twitter"
                              value={formData.twitter}
                              onChange={handleFormChange}
                              placeholder="Twitter Username"
                              className="thq-input"
                              style={{
                                width: '100%',
                                backgroundColor: '#ffffff',
                                color: '#000000',
                                padding: '12px',
                                borderRadius: '4px',
                                border: formErrors.twitter ? '1px solid #b50000' : '1px solid #ccc',
                                fontSize: '12pt',
                                textAlign: 'left',
                                fontFamily: 'Lato, sans-serif',
                                'text-align': 'left',
                                textAlign: 'left'
                              }}
                            />
                            {formErrors.twitter && (
                              <div style={{
                                color: '#ffb3b3',
                                fontSize: '12px',
                                marginTop: '4px',
                                fontFamily: 'Lato, sans-serif',
                                textAlign: 'left'
                              }}>
                                {formErrors.twitter}
                              </div>
                            )}
                          </div>

                          <div style={{ marginBottom: '16px' }}>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleFormChange}
                              placeholder="Email"
                              className="thq-input"
                              style={{
                                width: '100%',
                                backgroundColor: '#ffffff',
                                color: '#000000',
                                padding: '12px',
                                borderRadius: '4px',
                                border: formErrors.email ? '1px solid #b50000' : '1px solid #ccc',
                                fontSize: '12pt',
                                textAlign: 'left',
                                fontFamily: 'Lato, sans-serif',
                                'text-align': 'left',
                                textAlign: 'left'
                              }}
                            />
                            {formErrors.email && (
                              <div style={{
                                color: '#ffb3b3',
                                fontSize: '12px',
                                marginTop: '4px',
                                fontFamily: 'Lato, sans-serif',
                                textAlign: 'left'
                              }}>
                                {formErrors.email}
                              </div>
                            )}
                          </div>

                          <div style={{ marginBottom: '24px' }}>
                            <input
                              type="text"
                              name="evm_wallet"
                              value={formData.evm_wallet}
                              onChange={handleFormChange}
                              placeholder="Ethereum Wallet Address or ENS Name"
                              className="thq-input"
                              style={{
                                width: '100%',
                                backgroundColor: '#ffffff',
                                color: '#000000',
                                padding: '12px',
                                borderRadius: '4px',
                                border: formErrors.evm_wallet ? '1px solid #b50000' : '1px solid #ccc',
                                fontSize: '12pt',
                                textAlign: 'left',
                                fontFamily: 'Lato, sans-serif',
                                'text-align': 'left',
                                textAlign: 'left'
                              }}
                            />
                            {formErrors.evm_wallet && (
                              <div style={{
                                color: '#ffb3b3',
                                fontSize: '12px',
                                marginTop: '4px',
                                fontFamily: 'Lato, sans-serif',
                                textAlign: 'left'
                              }}>
                                {formErrors.evm_wallet}
                              </div>
                            )}
                          </div>

                          <button
                            type="submit"
                            disabled={submitting}
                            style={{ 
                              width: '100%',
                              backgroundColor: '#a60000',
                              color: 'white',
                              padding: '14px',
                              fontSize: '14pt',
                              fontWeight: 'bold',
                              fontFamily: 'Lato, sans-serif',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer'
                             }}
                          >
                            {submitting ? 'Submitting...' : 'Submit'}
                          </button>
                        </form>
                         <p style={{ color: 'white', fontSize: '14pt', fontFamily: 'Lato, sans-serif' }}>
                          To learn more about Clicks,<br/>
                          Check out the{' '}
                          <a href="https://clickcreate.io/" target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'underline' }}>
                            ClickCreate Marketplace
                          </a>
                        </p>
                      </div>
                    )}


                  </>
                )}
              </div>
            )}


          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        input::placeholder {
          text-align: left !important;
        }
        
        input::-webkit-input-placeholder {
          text-align: left !important;
        }
        
        input::-moz-placeholder {
          text-align: left !important;
        }
        
        input:-ms-input-placeholder {
          text-align: left !important;
        }
      `}</style>
    </div>
    </>
  );
};

export default IYKPage; 