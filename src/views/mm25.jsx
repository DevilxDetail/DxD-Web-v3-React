import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { supabase } from '../lib/supabase';
import './mm25.css';

const MM23 = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const iykRef = searchParams.get('iykRef');
    const [apiData, setApiData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
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
        } catch (err) {
            setError(err.message);
            console.error('Error fetching IYK data:', err);
        } finally {
            setLoading(false);
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

            // Insert into mm_user table
            const { error: userError } = await supabase
                .from('mm_user')
                .insert([{
                    twitter: twitterHandle,
                    email: formData.email.trim(),
                    evm_wallet: formData.evm_wallet.trim()
                }]);

            if (userError) throw userError;
            
            setSubmitted(true);
        } catch (err) {
            console.error('Error submitting form:', err);
            setError('Failed to submit registration. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        if (!iykRef) {
            setError('No IYK reference provided in the URL. Please use /mm25?iykRef=YOUR_REF');
            setApiData(null);
            return;
        }
        setError(null);
        fetchIYKData();
    }, [iykRef]);

    return (
        <>
            <Helmet>
                <title>MM23 - Devil x Detail</title>
                <meta name="description" content="MM23 registration page" />
            </Helmet>
            
            <div className="mm23-page">
                <div className="mm23-overlay"></div>
                
                <a href="/" className="top-right-logo-container" target="_blank" rel="noopener noreferrer">
                    <img src="/icon-white-200h.png" alt="Logo" className="top-right-logo" />
                </a>
                
                <div className="mm23-content">
                    {/* Logo Grid */}
                    <div className="logo-grid">
                        <div className="logo-item top-left">
                            <img src="/la-logo.png" alt="LA Logo" className="logo-circle" />
                        </div>
                        <div className="logo-item top-center">
                            <img src="/cc-logo.png" alt="CC Logo" className="logo-circle" />
                        </div>
                        <div className="logo-item top-right">
                            <img src="/s3-logo.png" alt="S3 Logo" className="logo-circle" />
                        </div>
                        <div className="logo-item bottom-left">
                            <img src="/ww-logo.png" alt="WW Logo" className="logo-circle" />
                        </div>
                        <div className="logo-item bottom-right">
                            <img src="/dd-logo.png" alt="DD Logo" className="logo-circle" />
                        </div>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            Loading...
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="error-container">
                            <div className="error-title">Error</div>
                            <div className="error-text">{error}</div>
                        </div>
                    )}

                    {/* API Data Display */}
                    {apiData && !loading && !error && (
                        <div>
                            {/* Authentication Failed Message */}
                            {!apiData.isValidRef && (
                                <div className="error-container">
                                    <div className="error-title">Authentication Failed</div>
                                    <div className="error-text">
                                        This IYK reference is not valid. Please check your reference and try again.
                                    </div>
                                </div>
                            )}

                            {/* Valid Reference - Show Form */}
                            {apiData.isValidRef && (
                                <>
                                    {/* Success message after registration */}
                                    {submitted && (
                                        <div className="success-message">
                                            <div className="success-title">Registration Successful</div>
                                            <div className="success-text">
                                                Thank you for registering! We'll be in touch soon.
                                            </div>
                                        </div>
                                    )}

                                    {/* Registration form */}
                                    {!submitted && (
                                        <div>
                                            <h2 className="mm23-text" style={{ fontSize: '32px', marginBottom: '16px' }}>
                                                Welcome to MM23
                                            </h2>
                                            <p className="mm23-text">
                                                Please enter your information below to complete your registration.
                                            </p>

                                            <form onSubmit={handleFormSubmit} className="form-container">
                                                <input
                                                    type="text"
                                                    name="twitter"
                                                    value={formData.twitter}
                                                    onChange={handleFormChange}
                                                    placeholder="Twitter Username"
                                                    className={`form-input ${formErrors.twitter ? 'error' : ''}`}
                                                />
                                                {formErrors.twitter && (
                                                    <div className="error-message">{formErrors.twitter}</div>
                                                )}

                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleFormChange}
                                                    placeholder="Email"
                                                    className={`form-input ${formErrors.email ? 'error' : ''}`}
                                                />
                                                {formErrors.email && (
                                                    <div className="error-message">{formErrors.email}</div>
                                                )}

                                                <input
                                                    type="text"
                                                    name="evm_wallet"
                                                    value={formData.evm_wallet}
                                                    onChange={handleFormChange}
                                                    placeholder="Ethereum Wallet Address or ENS Name"
                                                    className={`form-input ${formErrors.evm_wallet ? 'error' : ''}`}
                                                />
                                                {formErrors.evm_wallet && (
                                                    <div className="error-message">{formErrors.evm_wallet}</div>
                                                )}

                                                <button
                                                    type="submit"
                                                    disabled={submitting}
                                                    className="submit-button"
                                                >
                                                    {submitting ? 'Submitting...' : 'Submit'}
                                                </button>
                                            </form>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default MM23; 