import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import { supabase } from '../lib/supabase'
import './dk.css'

const DK = () => {
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
            artist: 'DK'
          }
        ])

      if (error) {
        throw error
      }

      setSubmitMessage('Successfully registered for the presale!')
      setShowToast(true)
      setFormData({ twitter: '', email: '' })
      
      // Hide toast after 4 seconds
      setTimeout(() => {
        setShowToast(false)
        setSubmitMessage('')
      }, 4000)
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitMessage('Error submitting form. Please try again.')
      setShowToast(true)
      
      // Hide toast after 4 seconds
      setTimeout(() => {
        setShowToast(false)
        setSubmitMessage('')
      }, 4000)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="dk-container">
      <Helmet>
        <title>DxD - DK Presale</title>
        <meta name="description" content="Join the DK x devil x detail presale list" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        
        {/* Essential OG Tags */}
        <meta property="og:title" content="DxD - DK Presale" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://devilxdetail.com/dk" />
        <meta property="og:image" content="https://devilxdetail.com/dk-header.png" />
        <meta property="og:description" content="Join the DK x devil x detail presale list" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="DxD - DK Presale" />
        <meta name="twitter:description" content="Join the DK x devil x detail presale list" />
        <meta name="twitter:image" content="https://devilxdetail.com/dk-header.png" />
      </Helmet>
      
      <div className="dk-background">
        <div className="dk-top-icons">
          <a 
            href="https://dk-nft.xyz/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="dk-logo-link"
          >
            <img 
              src="/dk-logo.png" 
              alt="DK Logo" 
              className="dk-logo"
            />
          </a>
          <a 
            href="/" 
            target="_blank"
            rel="noopener noreferrer"
            className="dk-home-link"
          >
            <img 
              src="/icon - white-200h.png" 
              alt="White Icon" 
              className="dk-white-icon"
            />
          </a>
        </div>
        
        <div className="dk-content">
          <div className="dk-main-content">
            <img 
              src="/dk-header.png" 
              alt="DK & devil x detail" 
              className="dk-header-image"
            />
            
            <div className="dk-date">Authenticated</div>
            
            <img 
              src="/BSF Background Mobile.png" 
              alt="BSF Background" 
              className="dk-bsf-background"
            />
            
            <div className="dk-description">
              Blue Skies Forever<br />
              Official DK x DxD Collaboration
            </div>
            
            <div className="dk-footer-text">
              Keep an eye out for some more fun stuff...<br />
              <a 
                href="https://x.com/danielkoeth" 
                target="_blank" 
                rel="noopener noreferrer"
                className="dk-footer-link"
              >
                @danielkoeth
              </a> and <a 
                href="https://x.com/devilxdetail" 
                target="_blank" 
                rel="noopener noreferrer"
                className="dk-footer-link"
              >
                @devilxdetail
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Toast Notification */}
      {showToast && (
        <div className={`dk-toast ${showToast ? 'dk-toast-show' : ''}`}>
          <div className={`dk-toast-content ${submitMessage.includes('Error') ? 'dk-toast-error' : 'dk-toast-success'}`}>
            {submitMessage.includes('Error') ? '❌' : '✅'} {submitMessage}
          </div>
        </div>
      )}
    </div>
  )
}

export default DK 
