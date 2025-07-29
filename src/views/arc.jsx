import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { usePrivy } from "@privy-io/react-auth";
import { supabase, supabaseServiceRole } from '../lib/supabase';
import './arc.css';

const Arc = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const iykRef = searchParams.get('iykRef');
    const { login, authenticated, user } = usePrivy();
    const [apiData, setApiData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedShoeSize, setSelectedShoeSize] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState('');

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

    const handleCreateAccount = async () => {
        if (!authenticated) {
            // User is not authenticated, trigger login flow
            await login();
            return;
        }

        // User is authenticated, proceed with submission
        await handleSubmit();
    };

    const handleSubmit = async () => {
        if (!selectedShoeSize) {
            alert('Please select a shoe size');
            return;
        }

        if (!authenticated || !user?.id) {
            alert('Please connect your account first');
            return;
        }

        setSubmitting(true);
        setSubmitStatus('submitting');

        try {
            console.log('Starting submission process for user:', user.id);
            console.log('Selected shoe size:', selectedShoeSize);
            console.log('Privy authenticated:', authenticated);
            console.log('Privy user:', user);

            // Check Supabase auth state
            const { data: { user: supabaseUser }, error: authError } = await supabase.auth.getUser();
            console.log('Supabase auth user:', supabaseUser);
            console.log('Supabase auth error:', authError);

            // First, check if user exists in user table
            console.log('Checking if user exists in user table...');
            const { data: existingUser, error: userCheckError } = await supabase
                .from('user')
                .select('user_id, auth_user_id')
                .eq('auth_user_id', user.id)
                .single();

            if (userCheckError && userCheckError.code !== 'PGRST116') {
                console.error('Error checking user existence:', userCheckError);
                // Continue anyway - might be a new user
            } else if (!existingUser) {
                console.log('User not found in user table, creating new user...');
                const { error: createUserError } = await supabase
                    .from('user')
                    .insert([{
                        auth_user_id: user.id,
                        evm_wallet: user.wallet?.address || '',
                        email: user.email?.address || '',
                        name: user.name || '',
                        role: 'Arc',
                        created_at: new Date().toISOString()
                    }]);
                
                if (createUserError) {
                    console.error('Error creating user:', createUserError);
                    // Continue with order creation anyway
                } else {
                    console.log('User created successfully');
                }
            } else {
                // User exists, update their role to "Arc"
                console.log('User exists, updating role to Arc...');
                const { data: userUpdateData, error: userUpdateError } = await supabase
                    .from('user')
                    .update({ role: 'Arc' })
                    .eq('auth_user_id', user.id)
                    .select();

                if (userUpdateError) {
                    console.error('Error updating user role:', userUpdateError);
                    // Continue with order creation even if role update fails
                } else {
                    console.log('User role updated successfully:', userUpdateData);
                }
            }

            // Then, create the order in the order table
            console.log('Attempting to create order...');
            
            // Get the user_id from the user table first
            const { data: userData, error: userDataError } = await supabase
                .from('user')
                .select('user_id')
                .eq('auth_user_id', user.id)
                .single();

            if (userDataError) {
                console.error('Error getting user_id:', userDataError);
                throw userDataError;
            }

            const orderData = {
                user_id: userData.user_id,
                drop: 'Blue Skies Bonus',
                size: selectedShoeSize,
                created_at: new Date().toISOString(),
                email_sent: 'No'
            };
            console.log('Order data to insert:', orderData);

            // Use the same pattern as blueskies.jsx
            const { error: orderError } = await supabase
                .from('order')
                .insert([orderData]);

            if (orderError) {
                console.error('Error creating order:', orderError);
                console.error('Error details:', {
                    code: orderError.code,
                    message: orderError.message,
                    details: orderError.details,
                    hint: orderError.hint
                });
                throw orderError;
            }

            console.log('Order created successfully');

            setSubmitStatus('success');
            setTimeout(() => {
                setSubmitStatus('');
                setSelectedShoeSize('');
            }, 3000);

        } catch (error) {
            console.error('Error submitting order:', error);
            console.error('Full error object:', {
                message: error.message,
                code: error.code,
                details: error.details,
                hint: error.hint,
                stack: error.stack
            });
            setSubmitStatus('error');
            setTimeout(() => {
                setSubmitStatus('');
            }, 3000);
        } finally {
            setSubmitting(false);
        }
    };

    // Handle post-authentication flow
    useEffect(() => {
        if (authenticated && user?.id && apiData?.isValidRef) {
            // User just authenticated, automatically proceed with submission if shoe size is selected
            if (selectedShoeSize) {
                handleSubmit();
            }
        }
    }, [authenticated, user, apiData]);

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
                                        <button 
                                            className="create-account-btn" 
                                            onClick={handleCreateAccount}
                                            disabled={submitting}
                                        >
                                            {submitting ? 'PROCESSING...' : authenticated ? 'SUBMIT' : 'CREATE ACCOUNT'}
                                        </button>
                                        <select 
                                            value={selectedShoeSize} 
                                            onChange={handleShoeSizeChange}
                                            className="shoe-size-dropdown"
                                            disabled={submitting}
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

                    {/* Submission Status Overlay */}
                    {submitStatus && (
                        <div className="arc-status-overlay">
                            <div className="arc-status-modal">
                                <div className="arc-status-content">
                                    {submitStatus === 'submitting' && (
                                        <>
                                            <div className="arc-spinner"></div>
                                            <h3>Processing your order...</h3>
                                            <p>Please wait while we save your information</p>
                                        </>
                                    )}
                                    
                                    {submitStatus === 'success' && (
                                        <>
                                            <div className="arc-success-icon">✓</div>
                                            <h3>Order Submitted Successfully!</h3>
                                            <p>Your Arc Holder bonus has been recorded</p>
                                        </>
                                    )}
                                    
                                    {submitStatus === 'error' && (
                                        <>
                                            <div className="arc-error-icon">✗</div>
                                            <h3>Submission Failed</h3>
                                            <p>Please try again or contact support</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Arc; 