import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import { supabase } from '../lib/supabase'
import './pw.css'

const PW = () => {
  const [formData, setFormData] = useState({
    twitter: '',
    email: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim()) {
      return 'Email is required'
    }
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address'
    }
    return null
  }

  const validateTwitter = (twitter) => {
    if (!twitter.trim()) {
      return 'Twitter handle is required'
    }
    // Remove @ if present and validate format
    const cleanTwitter = twitter.replace(/^@/, '')
    const twitterRegex = /^[a-zA-Z0-9_]{1,15}$/
    if (!twitterRegex.test(cleanTwitter)) {
      return 'Please enter a valid Twitter handle (1-15 characters, letters, numbers, and underscores only)'
    }
    return null
  }

  const validateForm = () => {
    const errors = {}
    
    const emailError = validateEmail(formData.email)
    if (emailError) {
      errors.email = emailError
    }
    
    const twitterError = validateTwitter(formData.twitter)
    if (twitterError) {
      errors.twitter = twitterError
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate form before submission
    if (!validateForm()) {
      return
    }
    
    // Check if Supabase is properly configured
    if (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('your_supabase_project_url')) {
      setSubmitMessage('Database not configured. Please contact support.')
      setShowToast(true)
      setTimeout(() => {
        setShowToast(false)
        setSubmitMessage('')
      }, 5000)
      return
    }
    
    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      const { data, error } = await supabase
        .from('presale')
        .insert([
          {
            twitter: formData.twitter.replace(/^@/, ''), // Remove @ symbol if present
            email: formData.email.trim().toLowerCase(), // Normalize email
            artist: 'POST WOOK'
          }
        ])

      if (error) {
        throw error
      }

      setSubmitMessage('Registration Successful!')
      setFormData({ twitter: '', email: '' })
      setShowToast(true)
      
      // Auto-dismiss toast after 4 seconds
      setTimeout(() => {
        setShowToast(false)
        setSubmitMessage('')
      }, 4000)
    } catch (error) {
      console.error('Error submitting form:', error)
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      
      // More specific error message based on error type
      let errorMessage = 'Error submitting form. Please try again.'
      if (error.message?.includes('Invalid API key')) {
        errorMessage = 'Database connection error. Please contact support.'
      } else if (error.message?.includes('relation "presale" does not exist')) {
        errorMessage = 'Database table not found. Please contact support.'
      } else if (error.message?.includes('duplicate key')) {
        errorMessage = 'This email or Twitter handle is already registered.'
      }
      
      setSubmitMessage(errorMessage)
      setShowToast(true)
      
      // Auto-dismiss error toast after 5 seconds
      setTimeout(() => {
        setShowToast(false)
        setSubmitMessage('')
      }, 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="pw-container">
      <Helmet>
        <title>POST WOOK x DxD</title>
        <meta name="description" content="POST WOOK x DxD" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        
        {/* Essential OG Tags */}
        <meta property="og:title" content="POST WOOK x DxD" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://devilxdetail.com/pw" />
        <meta property="og:image" content="https://devilxdetail.com/pw-header.png" />
        <meta property="og:description" content="POST WOOK x DxD" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="POST WOOK x DxD" />
        <meta name="twitter:description" content="POST WOOK x DxD" />
        <meta name="twitter:image" content="https://devilxdetail.com/pw-header.png" />
      </Helmet>
      
      <div className="pw-background">
        <div className="pw-content">
          <div className="pw-main-content">
            {/* Hero Section */}
            <div className="pw-hero">
              <h1 className="pw-hero-text">how are you feeling today?</h1>
              <img 
                src="/Emotion Wheel.png" 
                alt="Emotion Wheel" 
                className="pw-emotion-wheel"
              />
            </div>
            
            {/* Description Section */}
            <div className="pw-description">
              <div className="pw-auction-info">
                <p className="pw-auction-text1">POST WOOK x DxD</p>
                <p className="pw-auction-text2">October 2025</p>
                <p className="pw-auction-text2">18 1/1 Auctions w/ Matching 1/1 Jacket</p>
              </div>
              <img 
                src="/PW Jacket.png" 
                alt="PW Jacket" 
                className="pw-jacket-image"
              />
            </div>
            
            {/* Form Section */}
            <div className="pw-form-section">
              <p className="pw-form-text">
                Enter your info below for a sneak preview <br />
                and a special gift</p>
              
              <form onSubmit={handleSubmit} className="pw-form">
                <div className="pw-input-group">
                  <input
                    type="text"
                    name="twitter"
                    placeholder="Twitter Handle"
                    value={formData.twitter}
                    onChange={handleInputChange}
                    className={`pw-input ${validationErrors.twitter ? 'pw-input-error' : ''}`}
                    required
                  />
                  {validationErrors.twitter && (
                    <div className="pw-error-message">{validationErrors.twitter}</div>
                  )}
                </div>
                
                <div className="pw-email-container">
                  <div className="pw-input-group">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`pw-input pw-email-input ${validationErrors.email ? 'pw-input-error' : ''}`}
                      required
                    />
                    {validationErrors.email && (
                      <div className="pw-error-message">{validationErrors.email}</div>
                    )}
                  </div>
                  <button 
                    type="submit" 
                    className="pw-submit-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </form>
              
              {/* Toast notification */}
              {showToast && submitMessage && (
                <div className={`pw-toast ${submitMessage.includes('Error') ? 'error' : 'success'}`}>
                  <div className="pw-toast-content">
                    <span className="pw-toast-icon">
                      {submitMessage.includes('Error') ? '❌' : '✅'}
                    </span>
                    <span className="pw-toast-message">{submitMessage}</span>
                    <button 
                      className="pw-toast-close"
                      onClick={() => {
                        setShowToast(false)
                        setSubmitMessage('')
                      }}
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
              
              <div className="pw-footer-text">
                Make sure you are following<br />
                <a 
                  href="https://x.com/postwook" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="pw-footer-link"
                >
                  @postwook
                </a> and <a 
                  href="https://x.com/devilxdetail" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="pw-footer-link"
                >
                  @devilxdetail
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PW
