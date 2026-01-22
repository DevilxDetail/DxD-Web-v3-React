import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { getSupabaseClient } from '../lib/supabase';
import './goppie.css';

const Goppie = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const iykRef = searchParams.get('iykRef');
    const [apiData, setApiData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [chipUid, setChipUid] = useState(null);
    const [manifoldCode, setManifoldCode] = useState(null);
    const [checkingDatabase, setCheckingDatabase] = useState(false);
    const [copied, setCopied] = useState(false);

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
            
            // Capture the chip UID if valid reference
            if (data.isValidRef && data.uid) {
                setChipUid(data.uid);
                console.log('Chip UID captured:', data.uid);
                
                // Check database for manifold code
                await checkManifoldCode(data.uid);
            }
        } catch (err) {
            setError(err.message);
            console.error('Error fetching IYK data:', err);
        } finally {
            setLoading(false);
        }
    };

    const checkManifoldCode = async (uid) => {
        setCheckingDatabase(true);
        
        try {
            const client = getSupabaseClient();
            console.log('Checking database for UID:', uid);
            
            const { data, error } = await client
                .from('goppie')
                .select('manifold_code, iyk_uid')
                .eq('iyk_uid', uid)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    console.log('No matching UID found in database');
                } else {
                    console.error('Error querying database:', error);
                }
                return;
            }

            if (data && data.manifold_code) {
                setManifoldCode(data.manifold_code);
                console.log('Manifold code found:', data.manifold_code);
            }
        } catch (err) {
            console.error('Error checking manifold code:', err);
        } finally {
            setCheckingDatabase(false);
        }
    };

    const handleCopyCode = async () => {
        if (!manifoldCode) return;
        
        try {
            await navigator.clipboard.writeText(manifoldCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy code:', err);
        }
    };

    useEffect(() => {
        if (!iykRef) {
            setError('No IYK reference provided in the URL. Please use /goppie?iykRef=YOUR_REF');
            setApiData(null);
            return;
        }
        setError(null);
        fetchIYKData();
    }, [iykRef]);

    return (
        <>
            <Helmet>
                <title>Goppie - Devil x Detail</title>
                <meta name="description" content="Goppie page" />
            </Helmet>
            
            <div className="goppie-page">
                <div className="goppie-overlay"></div>
                <div className="goppie-content">
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
                                    <img src="/goppie-hero.png" alt="Goppie" className="hero-image" />
                                    <p className="welcome-message">
                                        The beginning of what's next. Open to influence and interpretation.
                                    </p>
                                    <p className="welcome-message">
                                        To mint, copy the claim code and click the Manifold link below.
                                    </p>
                                    <p className="welcome-message">
                                        Do not lose this tile, it will be your key to future access.
                                    </p>
                                    
                                    {/* Show loading state while checking database */}
                                    {checkingDatabase && (
                                        <div className="manifold-loading">
                                            <div className="loading-spinner"></div>
                                            <p>Checking for your code...</p>
                                        </div>
                                    )}
                                    
                                    {/* Show manifold code if found */}
                                    {!checkingDatabase && manifoldCode && (
                                        <>
                                            <div className="manifold-code-container" onClick={handleCopyCode}>
                                                <h2 className="manifold-title">Claim Code</h2>
                                                <p className="manifold-code">{manifoldCode}</p>
                                                <p className="copy-hint">{copied ? 'Copied!' : '(click to copy)'}</p>
                                            </div>
                                            <a 
                                                href="https://manifold.xyz/@goppie/id/4109994224" 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="manifold-link"
                                            >
                                                Mint CTRL
                                            </a>
                                        </>
                                    )}
                                    
                                    {/* Show message if no code found */}
                                    {!checkingDatabase && !manifoldCode && chipUid && (
                                        <p className="no-code-message">
                                            No code found for this chip.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Goppie;
