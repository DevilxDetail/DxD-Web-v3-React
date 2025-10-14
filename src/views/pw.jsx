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

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      const { data, error } = await supabase
        .from('presale')
        .insert([
          {
            twitter: formData.twitter,
            email: formData.email,
            artist: 'Post Wook'
          }
        ])

      if (error) {
        throw error
      }

      setSubmitMessage('You've been successfully registered!')
      setFormData({ twitter: '', email: '' })
      setShowToast(true)
      
      // Auto-dismiss toast after 4 seconds
      setTimeout(() => {
        setShowToast(false)
        setSubmitMessage('')
      }, 4000)
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitMessage('Error submitting form. Please try again.')
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
        <title>Post Wook x DxD</title>
        <meta name="description" content="Post Wook x DxD" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        
        {/* Essential OG Tags */}
        <meta property="og:title" content="Post Wook x DxD" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://devilxdetail.com/pw" />
        <meta property="og:image" content="https://devilxdetail.com/pw-header.png" />
        <meta property="og:description" content="Post Wook x DxD" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Post Wook x DxD" />
        <meta name="twitter:description" content="Post Wook x DxD" />
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
                <p className="pw-auction-text">Post Wook x DxD</p>
                <p className="pw-auction-text">October 2025</p>
                <p className="pw-auction-text">18 1/1 Auctions w/ Matching 1/1 Jacket</p>
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
                and a special gift.
              </p>
              
              <form onSubmit={handleSubmit} className="pw-form">
                <input
                  type="text"
                  name="twitter"
                  placeholder="Twitter Handle"
                  value={formData.twitter}
                  onChange={handleInputChange}
                  className="pw-input"
                  required
                />
                
                <div className="pw-email-container">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pw-input pw-email-input"
                    required
                  />
                  <button 
                    type="submit" 
                    className="pw-submit-btn"
                    disabled={isSubmitting}
                  >
                    Submit
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
