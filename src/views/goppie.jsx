import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { supabase } from '../lib/supabase';
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
    const [debugInfo, setDebugInfo] = useState([]);

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
        const debug = [];
        
        try {
            debug.push(`Checking UID: ${uid}`);
            debug.push(`UID type: ${typeof uid}`);
            debug.push(`UID length: ${uid?.length}`);
            
            // First, let's see all records in the table for debugging
            const { data: allRecords, error: allError } = await supabase
                .from('goppie')
                .select('iyk_uid, manifold_code');
            
            if (allError) {
                debug.push(`Error fetching records: ${allError.message}`);
            } else {
                debug.push(`Found ${allRecords?.length || 0} records in table`);
                allRecords?.forEach((record, idx) => {
                    debug.push(`Record ${idx + 1}: UID="${record.iyk_uid}" (${typeof record.iyk_uid}), Code="${record.manifold_code}"`);
                });
            }
            
            // Now try to match the specific UID
            const { data, error } = await supabase
                .from('goppie')
                .select('manifold_code, iyk_uid')
                .eq('iyk_uid', uid)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    debug.push('No matching UID found in database');
                } else {
                    debug.push(`Query error: ${error.message}`);
                }
                setDebugInfo(debug);
                return;
            }

            debug.push(`Match found! Code: ${data.manifold_code}`);
            if (data && data.manifold_code) {
                setManifoldCode(data.manifold_code);
            }
            setDebugInfo(debug);
        } catch (err) {
            debug.push(`Exception: ${err.message}`);
            setDebugInfo(debug);
        } finally {
            setCheckingDatabase(false);
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
                                    <h1 className="welcome-title">
                                        Welcome<br />
                                        Goppie
                                    </h1>
                                    <p className="welcome-subtitle">Your access is confirmed</p>
                                    <p className="welcome-message">
                                        Congratulations! You have successfully authenticated your IYK chip.
                                    </p>
                                    {chipUid && (
                                        <p className="chip-uid">
                                            Chip UID: {chipUid}
                                        </p>
                                    )}
                                    
                                    {/* Show loading state while checking database */}
                                    {checkingDatabase && (
                                        <div className="manifold-loading">
                                            <div className="loading-spinner"></div>
                                            <p>Checking for your code...</p>
                                        </div>
                                    )}
                                    
                                    {/* Show manifold code if found */}
                                    {!checkingDatabase && manifoldCode && (
                                        <div className="manifold-code-container">
                                            <h2 className="manifold-title">Your Manifold Code</h2>
                                            <p className="manifold-code">{manifoldCode}</p>
                                        </div>
                                    )}
                                    
                                    {/* Show message if no code found */}
                                    {!checkingDatabase && !manifoldCode && chipUid && (
                                        <p className="no-code-message">
                                            No code found for this chip.
                                        </p>
                                    )}
                                    
                                    {/* Debug Info */}
                                    {debugInfo.length > 0 && (
                                        <div className="debug-info">
                                            <h3>Debug Info:</h3>
                                            {debugInfo.map((info, idx) => (
                                                <p key={idx}>{info}</p>
                                            ))}
                                        </div>
                                    )}
                                    
                                    <p className="welcome-footer">
                                        Thank you for being part of the Devil x Detail community!
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

export default Goppie;
