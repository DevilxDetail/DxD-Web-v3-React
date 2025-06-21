import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import { supabase } from '../lib/supabase'
import './liv.css'

const Liv = () => {
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
            artist: 'Liv'
          }
        ])

      if (error) {
        throw error
      }

      setSubmitMessage('Successfully registered for the presale!')
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
    <div className="liv-container">
      <Helmet>
        <title>DxD - Liv Collaboration</title>
        <meta name="description" content="Join the Liv x devil x detail presale list" />
        
        {/* Essential OG Tags */}
        <meta property="og:title" content="DxD - Liv Collaboration" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://devilxdetail.com/liv" />
        <meta property="og:image" content="https://devilxdetail.com/liv-header.png" />
        <meta property="og:description" content="Join the Liv x devil x detail presale list" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="DxD - Liv Collaboration" />
        <meta name="twitter:description" content="Join the Liv x devil x detail presale list" />
        <meta name="twitter:image" content="https://devilxdetail.com/liv-header.png" />
      </Helmet>
      
      <div className="liv-background">
        <div className="liv-content">
          <div className="liv-top-icons">
            <a 
              href="https://oliviapedigo.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="liv-logo-link"
            >
              <img 
                src="/liv-logo.png" 
                alt="Liv Logo" 
                className="liv-logo"
              />
            </a>
            <a 
              href="/" 
              className="liv-icon-link"
            >
              <img 
                src="/icon-white-200h.png" 
                alt="White Icon" 
                className="liv-white-icon"
              />
            </a>
          </div>
          
          <div className="liv-main-content">
            <img 
              src="/liv-header.png" 
              alt="Liv Chat Interface" 
              className="liv-header-image"
            />
            
            <form onSubmit={handleSubmit} className="liv-form">
              <input
                type="text"
                name="twitter"
                placeholder="Twitter Handle"
                value={formData.twitter}
                onChange={handleInputChange}
                className="liv-input"
                required
              />
              
              <div className="liv-email-container">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="liv-input liv-email-input"
                  required
                />
                <button 
                  type="submit" 
                  className="liv-submit-btn-embedded"
                  disabled={isSubmitting}
                >
                  <img src="/liv-button.png" alt="Submit" className="liv-button-image-embedded" />
                </button>
              </div>
            </form>
            
            {/* Toast notification */}
            {showToast && submitMessage && (
              <div className={`liv-toast ${submitMessage.includes('Error') ? 'error' : 'success'}`}>
                <div className="liv-toast-content">
                  <span className="liv-toast-icon">
                    {submitMessage.includes('Error') ? '❌' : '✅'}
                  </span>
                  <span className="liv-toast-message">{submitMessage}</span>
                  <button 
                    className="liv-toast-close"
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
            
            <div className="liv-footer-text">
              Make sure you are following<br />
              <a 
                href="https://x.com/oliviapedi" 
                target="_blank" 
                rel="noopener noreferrer"
                className="liv-footer-link"
              >
                @oliviapedi
              </a> and <a 
                href="https://x.com/devilxdetail" 
                target="_blank" 
                rel="noopener noreferrer"
                className="liv-footer-link"
              >
                @devilxdetail
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Liv 