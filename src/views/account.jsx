import React, { Fragment, useState, useEffect } from 'react'
import { usePrivy } from "@privy-io/react-auth";
import { Helmet } from 'react-helmet'

import Header from '../components/header'
import ConsistentFooter from '../components/ConsistentFooter'
import './account.css'

const Account = (props) => {
  const { login, authenticated, user } = usePrivy();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  
  const [errors, setErrors] = useState({
    email: '',
    phone: ''
  });

  // Initialize form data with user info if available
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name?.first ? `${user.name.first} ${user.name.last || ''}` : '',
        email: user.email?.address || '',
        phone: user.phone?.number || '',
        address: ''
      });
    }
  }, [user]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    // Regex for phone with country code (e.g., +1 123-456-7890)
    const phoneRegex = /^\+[1-9]\d{0,2}[ -]?\d{1,14}$/;
    return phoneRegex.test(phone);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    // Validate on blur
    if (name === 'email' && value) {
      if (!validateEmail(value)) {
        setErrors(prevErrors => ({
          ...prevErrors,
          email: 'Please enter a valid email address'
        }));
      }
    }
    
    if (name === 'phone' && value) {
      if (!validatePhone(value)) {
        setErrors(prevErrors => ({
          ...prevErrors,
          phone: 'Please enter a valid phone number with country code (e.g., +11234567890)'
        }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields before submission
    const newErrors = {
      email: formData.email && !validateEmail(formData.email) 
        ? 'Please enter a valid email address' 
        : '',
      phone: formData.phone && !validatePhone(formData.phone) 
        ? 'Please enter a valid phone number with country code (e.g., +1 123-456-7890)' 
        : ''
    };
    
    setErrors(newErrors);
    
    // Check if there are any errors
    if (Object.values(newErrors).some(error => error)) {
      console.log('Validation errors:', newErrors);
      return; // Don't submit if there are errors
    }
    
    console.log('Form submitted:', formData);
    // Form submission logic would go here
    alert('Profile information saved!');
  };

  // Load Google Places API script
  useEffect(() => {
    // This would normally load the Google Places API
    // For now, we'll just simulate it with a comment
    console.log('Google Places API would be loaded here');
    // The actual implementation would look something like:
    // const script = document.createElement('script');
    // script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
    // script.async = true;
    // script.defer = true;
    // document.head.appendChild(script);
    // return () => {
    //   document.head.removeChild(script);
    // };
  }, []);

  // Redirect to login if not authenticated
  if (!authenticated) {
    return (
      <div className="account-container1">
        <Helmet>
          <title>Account - DxD</title>
          <meta property="og:title" content="Account - DxD" />
        </Helmet>
        <Header
          text={
            <Fragment>
              <span className="account-text10">About DxD</span>
            </Fragment>
          }
          iconBlackSrc="/icon%20-%20black-200h.png"
          rootClassName="header-root-class-name2"
        />
        <div className="account-container2">
          <div className="account-login-container">
            <h1 className="account-login-text">Please connect your wallet to view your account</h1>
            <button onClick={login} className="account-button button">
              Connect Wallet
            </button>
          </div>
        </div>
        <ConsistentFooter />
      </div>
    )
  }

  return (
    <div className="account-container1">
      <Helmet>
        <title>Account - DxD</title>
        <meta property="og:title" content="Account - DxD" />
      </Helmet>
      <Header
        text={
          <Fragment>
            <span className="account-text10">About DxD</span>
          </Fragment>
        }
        iconBlackSrc="/icon%20-%20black-200h.png"
        rootClassName="header-root-class-name2"
      />
      <div className="account-container2">
        <form className="account-form" onSubmit={handleSubmit}>
          <div className="account-profile-picture">
            <div className="account-avatar-container">
              <img 
                src={user?.profilePictureUrl || "/placeholder-image.svg"} 
                alt="Profile" 
                className="account-avatar"
              />
            </div>
          </div>
          
          <div className="account-form-field">
            <label className="account-label">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Display Name"
              value={formData.name}
              onChange={handleChange}
              className="account-input"
            />
          </div>
          
          <div className="account-form-field">
            <label className="account-label">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`account-input ${errors.email ? 'account-input-error' : ''}`}
            />
            {errors.email && <div className="account-error-message">{errors.email}</div>}
          </div>
          
          <div className="account-form-field">
            <label className="account-label">Phone</label>
            <input
              type="tel"
              name="phone"
              placeholder="+1 123-456-7890"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`account-input ${errors.phone ? 'account-input-error' : ''}`}
            />
            {errors.phone && <div className="account-error-message">{errors.phone}</div>}
            <small className="account-input-hint">Include country code (e.g., +1 for US)</small>
          </div>
          
          <div className="account-form-field">
            <label className="account-label">Shipping Address</label>
            <input
              type="text"
              name="address"
              id="address-autocomplete"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="account-input"
            />
            <small className="account-address-hint">Start typing to see address suggestions</small>
          </div>
          
          <div className="account-form-actions">
            <button type="submit" className="account-save-button">
              SAVE
            </button>
          </div>
        </form>
      </div>
      <ConsistentFooter />
    </div>
  )
}

export default Account 