import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
      
      // If valid reference, check Supabase
      if (data.isValidRef) {
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
      const { data, error } = await supabase
        .from('cc_user')
        .select('twitter, email, evm_wallet')
        .eq('uid', uid)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setSupabaseData(data);
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
    
    // EVM wallet validation (valid Ethereum address format)
    const walletRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!formData.evm_wallet.trim()) {
      errors.evm_wallet = 'EVM wallet address is required';
    } else if (!walletRegex.test(formData.evm_wallet.trim())) {
      errors.evm_wallet = 'Please enter a valid Ethereum wallet address (0x followed by 40 characters)';
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
      
      const { error } = await client
        .from('cc_user')
        .insert([{
          uid: apiData.uid,
          twitter: twitterHandle,
          email: formData.email.trim(),
          evm_wallet: formData.evm_wallet.trim(),
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;
      
      setSubmitted(true);
      setSupabaseData({
        twitter: twitterHandle,
        email: formData.email.trim(),
        evm_wallet: formData.evm_wallet.trim()
      });
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
      <h3 className="text-lg font-semibold text-white text-center mb-4" style={{ fontFamily: 'Marcellus, serif' }}>
        Follow Us
      </h3>
      
      {/* ClickCreate Section */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-300 text-center mb-3" style={{ fontFamily: 'Lato, sans-serif' }}>
          ClickCreate
        </h4>
        <div className="space-y-3">
          <a 
            href="https://instagram.com/clickcreate" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-lg transition duration-200 transform hover:scale-105"
            style={{ fontFamily: 'Lato, sans-serif' }}
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            Follow on Instagram
          </a>
          
          <a 
            href="https://twitter.com/clickcreate" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition duration-200 transform hover:scale-105"
            style={{ fontFamily: 'Lato, sans-serif' }}
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
            Follow on Twitter
          </a>
        </div>
      </div>
      
      {/* DxD Section */}
      <div>
        <h4 className="text-sm font-medium text-gray-300 text-center mb-3" style={{ fontFamily: 'Lato, sans-serif' }}>
          DxD
        </h4>
        <div className="space-y-3">
          <a 
            href="https://twitter.com/dxd" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition duration-200 transform hover:scale-105"
            style={{ fontFamily: 'Lato, sans-serif' }}
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
            Follow DxD on Twitter
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <div className="iyk-container1" style={{ 
      width: '100%',
      display: 'flex',
      position: 'relative',
      minHeight: '100vh',
      alignItems: 'center',
      flexDirection: 'column',
      justifyContent: 'space-between',
      backgroundColor: '#292929',
      fontFamily: 'Lato, sans-serif'
    }}>
      {/* Main Container */}
      <div className="iyk-container2" style={{
        flex: '0 0 auto',
        width: '100%',
        display: 'flex',
        position: 'relative',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '16px'
      }}>
        <div className="iyk-container3" style={{
          flex: '0 0 auto',
          width: '100%',
          maxWidth: '420px',
          display: 'flex',
          alignItems: 'center',
          alignSelf: 'center',
          justifyContent: 'center'
        }}>
          <div className="iyk-container4" style={{
            flex: '0 0 auto',
            width: '100%',
            display: 'flex',
            alignSelf: 'flex-start',
            alignItems: 'flex-start',
            paddingTop: '24px',
            paddingLeft: '12px',
            paddingRight: '12px',
            flexDirection: 'column',
            paddingBottom: '24px',
            justifyContent: 'flex-start',
            marginBottom: '0'
          }}>
            {/* Header */}
            <h1 className="iyk-text17" style={{
              color: '#ffffff',
              fontFamily: 'Marcellus, serif',
              fontWeight: '400',
              fontSize: '26px',
              marginBottom: '16px',
              textAlign: 'center',
              width: '100%'
            }}>
              IYK Reference
            </h1>

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

                    {/* User already registered */}
                    {!checkingSupabase && supabaseData && (
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
                            Already Registered
                          </div>
                          <div style={{
                            color: '#ffffff',
                            fontSize: '14px',
                            fontFamily: 'Lato, sans-serif'
                          }}>
                            You've already claimed this experience. Follow our socials below!
                          </div>
                        </div>

                        {/* Read-only form */}
                        <div style={{
                          width: '100%',
                          marginBottom: 'var(--dl-space-space-twounits)',
                          padding: 'var(--dl-space-space-unit)',
                          backgroundColor: '#333',
                          border: '1px solid #444',
                          borderRadius: '4px'
                        }}>
                          <div style={{
                            display: 'flex',
                            padding: 'var(--dl-space-space-halfunit) 0',
                            alignItems: 'center',
                            borderBottom: '1px solid #444',
                            marginBottom: 'var(--dl-space-space-halfunit)'
                          }}>
                            <div style={{
                              color: '#ffffff',
                              fontSize: '16px',
                              fontFamily: 'Lato, sans-serif',
                              fontWeight: '700',
                              marginRight: 'var(--dl-space-space-unit)',
                              width: '120px'
                            }}>
                              Twitter Handle
                            </div>
                            <div style={{
                              color: '#ffffff',
                              fontSize: '16px',
                              fontFamily: 'Lato, sans-serif',
                              flex: '1'
                            }}>
                              {supabaseData.twitter}
                            </div>
                          </div>
                          <div style={{
                            display: 'flex',
                            padding: 'var(--dl-space-space-halfunit) 0',
                            alignItems: 'center',
                            borderBottom: '1px solid #444',
                            marginBottom: 'var(--dl-space-space-halfunit)'
                          }}>
                            <div style={{
                              color: '#ffffff',
                              fontSize: '16px',
                              fontFamily: 'Lato, sans-serif',
                              fontWeight: '700',
                              marginRight: 'var(--dl-space-space-unit)',
                              width: '120px'
                            }}>
                              Email
                            </div>
                            <div style={{
                              color: '#ffffff',
                              fontSize: '16px',
                              fontFamily: 'Lato, sans-serif',
                              flex: '1'
                            }}>
                              {supabaseData.email}
                            </div>
                          </div>
                          <div style={{
                            display: 'flex',
                            padding: 'var(--dl-space-space-halfunit) 0',
                            alignItems: 'center'
                          }}>
                            <div style={{
                              color: '#ffffff',
                              fontSize: '16px',
                              fontFamily: 'Lato, sans-serif',
                              fontWeight: '700',
                              marginRight: 'var(--dl-space-space-unit)',
                              width: '120px'
                            }}>
                              EVM Wallet
                            </div>
                            <div style={{
                              color: '#ffffff',
                              fontSize: '16px',
                              fontFamily: 'Lato, sans-serif',
                              flex: '1',
                              wordBreak: 'break-all'
                            }}>
                              {supabaseData.evm_wallet}
                            </div>
                          </div>
                        </div>

                        <SocialLinks />
                      </div>
                    )}

                    {/* User not registered - show registration form */}
                    {!checkingSupabase && !supabaseData && !submitted && (
                      <div style={{ width: '100%' }}>
                        <div style={{
                          width: '100%',
                          marginBottom: 'var(--dl-space-space-twounits)',
                          padding: 'var(--dl-space-space-unit)',
                          backgroundColor: 'rgba(103, 111, 255, 0.1)',
                          border: '1px solid #676FFF',
                          borderRadius: '4px'
                        }}>
                          <div style={{
                            color: '#676FFF',
                            fontSize: '16px',
                            fontFamily: 'Lato, sans-serif',
                            fontWeight: '700',
                            marginBottom: 'var(--dl-space-space-halfunit)'
                          }}>
                            Registration Required
                          </div>
                          <div style={{
                            color: '#ffffff',
                            fontSize: '14px',
                            fontFamily: 'Lato, sans-serif'
                          }}>
                            Please complete your registration to claim this experience.
                          </div>
                        </div>

                        {/* Registration form */}
                        <form onSubmit={handleFormSubmit} style={{
                          width: '100%',
                          padding: 'var(--dl-space-space-unit)',
                          backgroundColor: '#333',
                          border: '1px solid #444',
                          borderRadius: '4px',
                          marginBottom: 'var(--dl-space-space-twounits)'
                        }}>
                          <div style={{ marginBottom: 'var(--dl-space-space-unit)' }}>
                            <label style={{
                              display: 'block',
                              color: '#ffffff',
                              fontSize: '16px',
                              fontFamily: 'Lato, sans-serif',
                              marginBottom: '8px'
                            }}>
                              Twitter Handle *
                            </label>
                            <input
                              type="text"
                              name="twitter"
                              value={formData.twitter}
                              onChange={handleFormChange}
                              placeholder="@yourhandle or yourhandle"
                              className="thq-input"
                              style={{
                                width: '100%',
                                borderColor: formErrors.twitter ? '#b50000' : undefined
                              }}
                            />
                            {formErrors.twitter && (
                              <div style={{
                                color: '#b50000',
                                fontSize: '12px',
                                marginTop: '4px',
                                fontFamily: 'Lato, sans-serif'
                              }}>
                                {formErrors.twitter}
                              </div>
                            )}
                          </div>

                          <div style={{ marginBottom: 'var(--dl-space-space-unit)' }}>
                            <label style={{
                              display: 'block',
                              color: '#ffffff',
                              fontSize: '16px',
                              fontFamily: 'Lato, sans-serif',
                              marginBottom: '8px'
                            }}>
                              Email Address *
                            </label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleFormChange}
                              placeholder="your@email.com"
                              className="thq-input"
                              style={{
                                width: '100%',
                                borderColor: formErrors.email ? '#b50000' : undefined
                              }}
                            />
                            {formErrors.email && (
                              <div style={{
                                color: '#b50000',
                                fontSize: '12px',
                                marginTop: '4px',
                                fontFamily: 'Lato, sans-serif'
                              }}>
                                {formErrors.email}
                              </div>
                            )}
                          </div>

                          <div style={{ marginBottom: 'var(--dl-space-space-twounits)' }}>
                            <label style={{
                              display: 'block',
                              color: '#ffffff',
                              fontSize: '16px',
                              fontFamily: 'Lato, sans-serif',
                              marginBottom: '8px'
                            }}>
                              EVM Wallet Address *
                            </label>
                            <input
                              type="text"
                              name="evm_wallet"
                              value={formData.evm_wallet}
                              onChange={handleFormChange}
                              placeholder="0x..."
                              className="thq-input"
                              style={{
                                width: '100%',
                                borderColor: formErrors.evm_wallet ? '#b50000' : undefined
                              }}
                            />
                            {formErrors.evm_wallet && (
                              <div style={{
                                color: '#b50000',
                                fontSize: '12px',
                                marginTop: '4px',
                                fontFamily: 'Lato, sans-serif'
                              }}>
                                {formErrors.evm_wallet}
                              </div>
                            )}
                          </div>

                          <button
                            type="submit"
                            disabled={submitting}
                            className="thq-button-filled"
                            style={{ width: '100%' }}
                          >
                            {submitting ? 'Submitting...' : 'Complete Registration'}
                          </button>
                        </form>
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
                            Thanks! Your info was submitted.
                          </div>
                          <div style={{
                            color: '#ffffff',
                            fontSize: '14px',
                            fontFamily: 'Lato, sans-serif'
                          }}>
                            Thank you for registering! Follow our socials below.
                          </div>
                        </div>

                        <SocialLinks />
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Refresh Button */}
            <div style={{ width: '100%', textAlign: 'center' }}>
              <button 
                onClick={fetchIYKData}
                disabled={loading}
                className="thq-button-filled"
                style={{ 
                  width: '200px',
                  marginTop: 'var(--dl-space-space-twounits)'
                }}
              >
                {loading ? 'Loading...' : 'Refresh Data'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default IYKPage; 