import React, { Fragment, useState, useEffect, useRef } from 'react'
import { usePrivy } from "@privy-io/react-auth";
import { Helmet } from 'react-helmet'
import { supabase } from '../lib/supabase'
import { uploadProfileImage } from '../lib/storage'
import { useHistory } from 'react-router-dom'
import { ethers } from 'ethers';
import Web3 from 'web3';

import Header from '../components/header'
import ConsistentFooter from '../components/ConsistentFooter'
import './account.css'

const Account = (props) => {
  const { login, authenticated, user, sendTransaction, connectWallet } = usePrivy();
  const history = useHistory();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    profile_image: ''
  });
  
  const [errors, setErrors] = useState({
    email: '',
    phone: ''
  });

  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState(''); // For showing save status messages
  const fileInputRef = useRef(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [mintLoading, setMintLoading] = useState(false);
  const [mintStatus, setMintStatus] = useState(''); // For showing mint status messages

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!authenticated && !loading) {
      history.push('/');
    }
  }, [authenticated, loading, history]);

  // Fetch user data from Supabase
  useEffect(() => {
    async function fetchUserData() {
      if (authenticated && user?.id) {
        try {
          const { data, error } = await supabase
            .from('user')
            .select('*')
            .eq('auth_user_id', user.id)
            .single();

          if (error) {
            console.error('Error fetching user data:', error);
            return;
          }

          if (data) {
            setFormData({
              name: data.name || '',
              email: data.email || '',
              phone: data.phone || '',
              address: data.address || '',
              profile_image: data.profile_image || ''
            });
          }
        } catch (error) {
          console.error('Error:', error);
        } finally {
          setLoading(false);
        }
      }
    }

    fetchUserData();
  }, [authenticated, user]);

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
    
    // Clear any previous save status
    setSaveStatus('');
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields before submission
    const newErrors = {
      email: formData.email && !validateEmail(formData.email) 
        ? 'Please enter a valid email address' 
        : '',
      phone: formData.phone && !validatePhone(formData.phone) 
        ? 'Please enter a valid phone number with country code' 
        : ''
    };
    
    setErrors(newErrors);
    
    // Check if there are any errors
    if (Object.values(newErrors).some(error => error)) {
      setSaveStatus('error');
      return;
    }

    try {
      setSaveStatus('saving');
      
      const { error } = await supabase
        .from('user')
        .update({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          profile_image: formData.profile_image
        })
        .eq('auth_user_id', user.id);

      if (error) throw error;

      setSaveStatus('success');
      setTimeout(() => setSaveStatus(''), 3000); // Clear success message after 3 seconds
    } catch (error) {
      console.error('Error updating profile:', error);
      setSaveStatus('error');
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    try {
      setImageLoading(true);
      const publicUrl = await uploadProfileImage(file, user.id);
      
      // Update the form data with new image URL
      setFormData(prev => ({
        ...prev,
        profile_image: publicUrl
      }));
      
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setImageLoading(false);
    }
  };

  const handleMint = async () => {
    try {
      setMintLoading(true);
      setMintStatus('connecting');

      if (!authenticated) {
        console.log("Not authenticated");
        await login();
        return;
      }

      try {
        setMintStatus('requesting');
        const provider = await window.ethereum;
        if (!provider) {
          throw new Error("No Ethereum provider found");
        }

        const web3 = new Web3(provider);
        const accounts = await web3.eth.getAccounts();
        const userAddress = accounts[0];
        console.log("Connected wallet address:", userAddress);

        // Contract details
        const contractAddress = "0xCFe04bdF3795c52541Ecc504167BbcDFf6dfcBE2";
        
        // Contract ABI for the claim function
        const nftDropAbi = [{
          "inputs": [
            {"internalType": "address","name": "_receiver","type": "address"},
            {"internalType": "uint256","name": "_quantity","type": "uint256"},
            {"internalType": "address","name": "_currency","type": "address"},
            {"internalType": "uint256","name": "_pricePerToken","type": "uint256"},
            {"internalType": "tuple","name": "_allowlistProof","type": "tuple",
             "components": [
               {"internalType": "bytes32[]","name": "proof","type": "bytes32[]"},
               {"internalType": "uint256","name": "quantityLimitPerWallet","type": "uint256"},
               {"internalType": "uint256","name": "pricePerToken","type": "uint256"},
               {"internalType": "address","name": "currency","type": "address"}
             ]
            },
            {"internalType": "bytes","name": "_data","type": "bytes"}
          ],
          "name": "claim",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        }];

        // Initialize contract
        const nftDropContract = new web3.eth.Contract(nftDropAbi, contractAddress);

        // Define claim parameters to match successful transaction
        const receiver = userAddress;
        const quantity = "1";
        const currency = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
        const pricePerToken = "1000000000000000";
        const allowlistProof = {
          proof: [],
          quantityLimitPerWallet: "0",
          pricePerToken: "115792089237316195423570985008687907853269984665640564039457584007913129639935",
          currency: "0x0000000000000000000000000000000000000000"
        };
        const data = "0x";

        try {
          console.log("Preparing transaction with parameters:", {
            receiver,
            quantity,
            currency,
            pricePerToken,
            allowlistProof,
            data
          });

          // Send transaction directly without gas estimation
          const tx = await nftDropContract.methods.claim(
            receiver,
            quantity,
            currency,
            pricePerToken,
            allowlistProof,
            data
          ).send({
            from: userAddress,
            value: pricePerToken,
            gas: 300000
          });

          console.log("Transaction successful:", tx);
          setMintStatus('success');

        } catch (error) {
          console.error("Detailed error:", error);
          const errorMessage = error.message || "Unknown error";
          setMintStatus(`error: ${errorMessage}`);
          throw error;
        }

      } catch (error) {
        console.error("Error accessing wallet:", error);
        setMintStatus('error');
        throw error;
      }

    } catch (error) {
      console.error("Error in mint process:", error);
      setMintStatus('error');
    } finally {
      setMintLoading(false);
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="account-container1">
        <Helmet>
          <title>Account - DxD</title>
          <meta property="og:title" content="Account - DxD" />
        </Helmet>
        <Header
          text={<Fragment><span className="account-text10">About DxD</span></Fragment>}
          iconBlackSrc="/icon%20-%20black-200h.png"
          rootClassName="header-root-class-name2"
        />
        <div className="account-container2" style={{ alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
          <h2 style={{ color: 'white' }}>Loading account information...</h2>
        </div>
        <ConsistentFooter />
      </div>
    );
  }

  // Don't render anything while redirect is happening
  if (!authenticated) {
    return null;
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
            <div 
              className="account-avatar-container" 
              onClick={handleImageClick}
              style={{ cursor: 'pointer', position: 'relative' }}
            >
              <img 
                src={formData.profile_image || "/placeholder-image.svg"} 
                alt="Profile" 
                className="account-avatar"
                style={{ opacity: imageLoading ? 0.5 : 1 }}
              />
              {imageLoading && (
                <div className="account-avatar-loading">
                  <span>Uploading...</span>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <div className="account-avatar-overlay">
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </div>
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
          </div>
          
          <div className="account-form-field">
            <label className="account-label">Phone</label>
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="account-input"
            />
          </div>
          
          <div className="account-form-field">
            <label className="account-label">Address</label>
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="account-input"
            />
          </div>
          
          <div className="account-form-actions">
            <button 
              type="submit" 
              className={`account-save-button ${saveStatus === 'saving' ? 'saving' : ''}`}
              disabled={saveStatus === 'saving'}
            >
              {saveStatus === 'saving' ? 'SAVING...' : 'SAVE'}
            </button>
            <button 
              type="button" 
              className={`account-save-button ${mintLoading ? 'saving' : ''}`}
              style={{ marginTop: '20px' }}
              onClick={handleMint}
              disabled={mintLoading}
            >
              {mintLoading ? 'CONNECTING...' : 'MINT'}
            </button>
            {mintStatus === 'success' && (
              <div className="account-success-message">Wallet connected successfully!</div>
            )}
            {mintStatus === 'error' && (
              <div className="account-error-message">Failed to connect wallet. Please try again.</div>
            )}
            {saveStatus === 'success' && (
              <div className="account-success-message">Profile updated successfully!</div>
            )}
            {saveStatus === 'error' && (
              <div className="account-error-message">Failed to update profile. Please try again.</div>
            )}
          </div>
        </form>
      </div>
      <ConsistentFooter />
    </div>
  );
};

export default Account;