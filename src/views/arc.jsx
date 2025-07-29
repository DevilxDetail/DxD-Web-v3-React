import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './arc.css';

const Arc = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const iykRef = searchParams.get('iykRef');
    const [apiData, setApiData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedShoeSize, setSelectedShoeSize] = useState('');

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

    useEffect(() => {
        if (!iykRef) {
            setError('No IYK reference provided in the URL. Please use /arc?iykRef=YOUR_REF');
            setApiData(null);
            return;
        }
        setError(null);
        fetchIYKData();
    }, [iykRef]);

    const handleShoeSizeChange = (e) => {
        setSelectedShoeSize(e.target.value);
    };

    const handleCreateAccount = () => {
        // Functionality will be added later
        console.log('Create Account clicked');
    };

    return (
        <>
            <Helmet>
                <title>Arc - Devil x Detail</title>
                <meta name="description" content="Arc page" />
            </Helmet>
            
            <div className="arc-page">
                <div className="arc-overlay"></div>
                <div className="arc-content">
                    {/* Loading State */}
                    {loading && (
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                        </div>
                    )}

                    {/* Error State - Show black screen with "nothing to see here" */}
                    {error && (
                        <div className="error-container">
                            <div className="error-text">nothing to see here</div>
                        </div>
                    )}

                    {/* API Data Display */}
                    {apiData && !loading && !error && (
                        <div>
                            {/* Invalid Reference - Show black screen with "nothing to see here" */}
                            {!apiData.isValidRef && (
                                <div className="error-container">
                                    <div className="error-text">nothing to see here</div>
                                </div>
                            )}

                            {/* Valid Reference - Show Welcome Content */}
                            {apiData.isValidRef && (
                                <div className="welcome-container">
                                    <h1 className="welcome-title">
                                        Welcome<br />
                                        Arc Holder
                                    </h1>
                                    <p className="welcome-subtitle">Your first gift awaits...</p>
                                    <p className="welcome-message">
                                        If you choose to mint our collab with DK (starting Wednesday, July 30th) you will receive an Arc Holder exclusive bonus.
                                    </p>
                                    <div className="instructions-list">
                                        <p className="instruction-item">1. Create your account</p>
                                        <p className="instruction-item">2. Select your shoe size</p>
                                        <p className="instruction-item">3. Mint the drop</p>
                                    </div>
                                    <div className="action-buttons">
                                        <button className="create-account-btn" onClick={handleCreateAccount}>
                                            CREATE ACCOUNT
                                        </button>
                                        <select 
                                            value={selectedShoeSize} 
                                            onChange={handleShoeSizeChange}
                                            className="shoe-size-dropdown"
                                        >
                                            <option value="">Select Shoe Size</option>
                                            <option value="7">7</option>
                                            <option value="8">8</option>
                                            <option value="9">9</option>
                                            <option value="10">10</option>
                                            <option value="11">11</option>
                                            <option value="12">12</option>
                                            <option value="13">13</option>
                                        </select>
                                    </div>
                                    <p className="welcome-footer">
                                        Remember... your decision to mint (or not mint) the drop does not impact your standing as an Arc Holder in any way. We appreciate your support in every form (not just finacially)!
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Arc; 