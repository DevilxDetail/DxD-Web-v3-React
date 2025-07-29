import React, { Fragment, useState, useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet'
import { usePrivy, useWallets } from "@privy-io/react-auth"
import { supabase } from '../lib/supabase'
import Web3 from 'web3'
import Header from '../components/header'
import './blueskies.css'

const BlueSkies = () => {
  const { login, authenticated, user } = usePrivy()
  const { wallets } = useWallets()
  const [selectedSize, setSelectedSize] = useState('')
  const [isOrdering, setIsOrdering] = useState(false)
  const [showDataModal, setShowDataModal] = useState(false)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [userData, setUserData] = useState(null)
  const [formData, setFormData] = useState({
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  })
  const [formErrors, setFormErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [mintingStatus, setMintingStatus] = useState('')
  const [mintLoading, setMintLoading] = useState(false)
  const [mintStatus, setMintStatus] = useState('')
  const [transactionReceipt, setTransactionReceipt] = useState(null)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showSignUpModal, setShowSignUpModal] = useState(false)
  const [isNewUser, setIsNewUser] = useState(false)
  const [googlePlacesLoaded, setGooglePlacesLoaded] = useState(false)
  const [manualAddressMode, setManualAddressMode] = useState(false)
  const [editManualAddressMode, setEditManualAddressMode] = useState(false)
  const addressInputRef = useRef(null)
  const editAddressInputRef = useRef(null)
  const autocompleteRef = useRef(null)

  // Load Google Places API
  useEffect(() => {
    const loadGooglePlaces = () => {
      console.log('Loading Google Places API...')
      
      if (window.google && window.google.maps) {
        console.log('Google Maps already loaded')
        setGooglePlacesLoaded(true)
        return
      }

      const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY
      if (!apiKey) {
        console.error('Google Places API key is not configured. Please add VITE_GOOGLE_PLACES_API_KEY to your .env file.')
        return
      }

      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
      script.async = true
      script.defer = true
      script.onload = () => {
        console.log('Google Places API loaded successfully')
        setGooglePlacesLoaded(true)
      }
      script.onerror = (error) => {
        console.error('Error loading Google Places API:', error)
      }
      document.head.appendChild(script)
    }

    loadGooglePlaces()
  }, [])

  // Initialize Google Places Autocomplete
  useEffect(() => {
    console.log('Autocomplete effect triggered:', { googlePlacesLoaded, hasInput: !!addressInputRef.current, manualMode: manualAddressMode })
    
    if (googlePlacesLoaded && addressInputRef.current && !manualAddressMode) {
      console.log('Initializing Google Places Autocomplete')
      
      // Clean up previous autocomplete instance
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current)
        autocompleteRef.current = null
      }
      
      try {
        const autocomplete = new window.google.maps.places.Autocomplete(addressInputRef.current, {
          types: ['address'],
          componentRestrictions: { country: 'us' }
        })

        autocompleteRef.current = autocomplete

        autocomplete.addListener('place_changed', () => {
          console.log('Place changed event triggered')
          const place = autocomplete.getPlace()
          console.log('Selected place:', place)
          
          if (place.geometry) {
            // Extract address components
            let streetNumber = ''
            let route = ''
            let city = ''
            let state = ''
            let zipCode = ''

            place.address_components.forEach(component => {
              const types = component.types
              console.log('Address component:', component.long_name, types)

              if (types.includes('street_number')) {
                streetNumber = component.long_name
              } else if (types.includes('route')) {
                route = component.long_name
              } else if (types.includes('locality')) {
                city = component.long_name
              } else if (types.includes('administrative_area_level_1')) {
                state = component.short_name
              } else if (types.includes('postal_code')) {
                zipCode = component.long_name
              }
            })

            // Update form data with the full formatted address from Google Places
            const fullAddress = place.formatted_address
            
            console.log('Selected address:', fullAddress)
            
            setFormData(prev => ({
              ...prev,
              address: fullAddress
            }))
          }
        })

        console.log('Autocomplete initialized successfully')
      } catch (error) {
        console.error('Error initializing autocomplete:', error)
      }
    }
    
    // Cleanup function
    return () => {
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current)
        autocompleteRef.current = null
      }
    }
  }, [googlePlacesLoaded, manualAddressMode])

  // Fetch user data on component mount
  useEffect(() => {
    if (authenticated && user?.id) {
      fetchUserData()
    }
  }, [authenticated, user])

  // Handle post-authentication flow
  useEffect(() => {
    if (authenticated && user?.id && showSignUpModal) {
      // User just signed in, check if they have saved data
      const checkUserData = async () => {
        await fetchUserData()
        // After fetching data, check if user has saved email and address
        if (userData?.email && userData?.address) {
          // User has saved data, show confirmation modal
          setShowSignUpModal(false)
          setShowConfirmationModal(true)
        } else {
          // User doesn't have saved data, show data collection modal
          setShowSignUpModal(false)
          setShowDataModal(true)
        }
      }
      checkUserData()
    }
  }, [authenticated, user, showSignUpModal])

  const fetchUserData = async () => {
    try {
      const { data, error } = await supabase
        .from('user')
        .select('email, address')
        .eq('auth_user_id', user.id)
        .single()

      if (error) {
        console.error('Error fetching user data:', error)
        return
      }

      setUserData(data)
      if (data?.email) {
        setFormData(prev => ({ ...prev, email: data.email }))
      }
      if (data?.address) {
        // Use the full address directly from Google Places
        setFormData(prev => ({ ...prev, address: data.address }))
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateForm = () => {
    const errors = {}
    
    if (!formData.email || !validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }
    
    if (!formData.address?.trim()) {
      errors.address = 'Please enter your mailing address'
    }
    
    // City, state, and ZIP are auto-filled by Google Places, so we don't validate them
    // They will be included in the full address when saved
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSizeChange = (e) => {
    setSelectedSize(e.target.value)
  }

  const handlePlaceOrder = async () => {
    if (!selectedSize) {
      alert('Please select a size')
      return
    }

    if (!authenticated) {
      // Show sign-in/sign-up modal for unauthenticated users
      setShowSignUpModal(true)
      return
    }

    // Check if user has saved email and address
    if (userData?.email && userData?.address) {
      // Show confirmation modal with saved data
      setShowConfirmationModal(true)
    } else {
      // Show data collection modal
      setShowDataModal(true)
    }
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleDataSubmit = async () => {
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    try {
      // Save to user table - use address directly from Google Places
      const { error: userError } = await supabase
        .from('user')
        .update({
          email: formData.email,
          address: formData.address
        })
        .eq('auth_user_id', user.id)

      if (userError) throw userError

      // Refresh user data
      await fetchUserData()
      
      setShowDataModal(false)
      setShowConfirmationModal(true)
    } catch (error) {
      console.error('Error saving data:', error)
      alert('Error saving your information. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Reinitialize autocomplete when modal opens
  useEffect(() => {
    if (showDataModal && googlePlacesLoaded && addressInputRef.current) {
      console.log('Reinitializing autocomplete for modal')
      setTimeout(() => {
        if (addressInputRef.current && window.google && window.google.maps) {
          // Clean up previous autocomplete instance
          if (autocompleteRef.current) {
            window.google.maps.event.clearInstanceListeners(autocompleteRef.current)
            autocompleteRef.current = null
          }
          
          try {
            const autocomplete = new window.google.maps.places.Autocomplete(addressInputRef.current, {
              types: ['address'],
              componentRestrictions: { country: 'us' }
            })

            autocompleteRef.current = autocomplete

            autocomplete.addListener('place_changed', () => {
              console.log('Place changed event triggered')
              const place = autocomplete.getPlace()
              console.log('Selected place:', place)
              
              if (place.geometry) {
                // Extract address components
                let streetNumber = ''
                let route = ''
                let city = ''
                let state = ''
                let zipCode = ''

                place.address_components.forEach(component => {
                  const types = component.types
                  console.log('Address component:', component.long_name, types)

                  if (types.includes('street_number')) {
                    streetNumber = component.long_name
                  } else if (types.includes('route')) {
                    route = component.long_name
                  } else if (types.includes('locality')) {
                    city = component.long_name
                  } else if (types.includes('administrative_area_level_1')) {
                    state = component.short_name
                  } else if (types.includes('postal_code')) {
                    zipCode = component.long_name
                  }
                })

                // Update form data with the full formatted address from Google Places
                const fullAddress = place.formatted_address
                
                console.log('Edit form selected address:', fullAddress)
                
                setFormData(prev => ({
                  ...prev,
                  address: fullAddress
                }))
              }
            })

            console.log('Modal autocomplete initialized successfully')
          } catch (error) {
            console.error('Error initializing modal autocomplete:', error)
          }
        }
      }, 100)
    }
  }, [showDataModal, googlePlacesLoaded])

  // Initialize autocomplete for edit form when it opens
  useEffect(() => {
    if (showEditForm && googlePlacesLoaded && editAddressInputRef.current && !editManualAddressMode) {
      console.log('Initializing autocomplete for edit form')
      setTimeout(() => {
        if (editAddressInputRef.current && window.google && window.google.maps) {
          // Clean up previous autocomplete instance
          if (autocompleteRef.current) {
            window.google.maps.event.clearInstanceListeners(autocompleteRef.current)
            autocompleteRef.current = null
          }
          
          try {
            const autocomplete = new window.google.maps.places.Autocomplete(editAddressInputRef.current, {
              types: ['address'],
              componentRestrictions: { country: 'us' }
            })

            autocompleteRef.current = autocomplete

            autocomplete.addListener('place_changed', () => {
              console.log('Edit form place changed event triggered')
              const place = autocomplete.getPlace()
              console.log('Edit form selected place:', place)
              
              if (place.geometry) {
                // Extract address components
                let streetNumber = ''
                let route = ''
                let city = ''
                let state = ''
                let zipCode = ''

                place.address_components.forEach(component => {
                  const types = component.types
                  console.log('Edit form address component:', component.long_name, types)

                  if (types.includes('street_number')) {
                    streetNumber = component.long_name
                  } else if (types.includes('route')) {
                    route = component.long_name
                  } else if (types.includes('locality')) {
                    city = component.long_name
                  } else if (types.includes('administrative_area_level_1')) {
                    state = component.short_name
                  } else if (types.includes('postal_code')) {
                    zipCode = component.long_name
                  }
                })

                // Update form data with parsed address
                // Use the full formatted address from Google Places
                const fullAddress = place.formatted_address || `${streetNumber} ${route}`.trim()
                
                console.log('Edit form parsed address:', { fullAddress, city, state, zipCode })
                
                setFormData(prev => ({
                  ...prev,
                  address: fullAddress,
                  city: city,
                  state: state,
                  zipCode: zipCode
                }))
              }
            })

            console.log('Edit form autocomplete initialized successfully')
          } catch (error) {
            console.error('Error initializing edit form autocomplete:', error)
          }
        }
      }, 100)
    }
  }, [showEditForm, googlePlacesLoaded, editManualAddressMode])

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

        // Retrieve the appropriate linked wallet: prioritize user's primary wallet address
        if (!user?.wallet?.address) {
          throw new Error("Authenticated user has no linked wallet address");
        }

        const linkedWallet = wallets?.find(
          (w) => w.address?.toLowerCase() === user.wallet.address.toLowerCase()
        );

        if (!linkedWallet) {
          throw new Error("Linked wallet matching user not found or not connected");
        }

        const provider = await linkedWallet.getEthereumProvider();

        // Ensure the wallet is connected to Sepolia
        const SEPOLIA_ID = "0xaa36a7"; // Hex chain id for Sepolia (11155111)
        try {
          const chainIdHex = await provider.request({ method: "eth_chainId" });
          if (chainIdHex !== SEPOLIA_ID) {
            try {
              await provider.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: SEPOLIA_ID }],
              });
            } catch (switchErr) {
              // 4902 = Unrecognized chain -> add it first
              if (switchErr.code === 4902) {
                await provider.request({
                  method: "wallet_addEthereumChain",
                  params: [{
                    chainId: SEPOLIA_ID,
                    chainName: "Ethereum Sepolia",
                    rpcUrls: ["https://11155111.rpc.thirdweb.com"],
                    nativeCurrency: { name: "Sepolia Ether", symbol: "ETH", decimals: 18 },
                    blockExplorerUrls: ["https://sepolia.etherscan.io"],
                  }],
                });
              } else {
                throw switchErr;
              }
            }
          }
        } catch (chainErr) {
          console.error("Chain check/switch failed:", chainErr);
          setMintStatus("error: Wrong network");
          return;
        }

        const web3 = new Web3(provider);
        const userAddress = linkedWallet.address;
        console.log("Connected wallet address:", userAddress);

        // Contract details
        const contractAddress = "0x41E791EC136492484A96455CDA32C5201cF11650";



        // (Old claim flow removed for clarity – we now use bsfEdition below)


          const editionABI = [
            {
              "inputs": [
                { "internalType": "address",  "name": "_receiver",         "type": "address" },
                { "internalType": "uint256",  "name": "_tokenId",          "type": "uint256" },
                { "internalType": "uint256",  "name": "_quantity",         "type": "uint256" },
                { "internalType": "address",  "name": "_currency",         "type": "address" },
                { "internalType": "uint256",  "name": "_pricePerToken",    "type": "uint256" },
                { "components": [
                    { "internalType": "bytes32[]", "name": "proof",                 "type": "bytes32[]" },
                    { "internalType": "uint256",   "name": "quantityLimitPerWallet","type": "uint256" },
                    { "internalType": "uint256",   "name": "pricePerToken",         "type": "uint256" },
                    { "internalType": "address",   "name": "currency",              "type": "address" }
                  ],
                  "internalType": "struct IDrop1155.AllowlistProof",
                  "name": "_allowlistProof",
                  "type": "tuple"
                },
                { "internalType": "bytes",    "name": "_data",             "type": "bytes" }
              ],
              "name": "claim",
              "outputs": [],
              "stateMutability": "payable",
              "type": "function"
            }
          ]

          // Initialize contract
          const bsfEdition = new web3.eth.Contract(editionABI, contractAddress);


          const receiver = userAddress;
          const tokenId = 0;
          const quantity = "1";
          const currency = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
          const pricePerToken = "150000000000000000";
          const allowlistProof = {
            proof: [],
            quantityLimitPerWallet: "0",
            pricePerToken: "115792089237316195423570985008687907853269984665640564039457584007913129639935",
            currency: "0x0000000000000000000000000000000000000000"
          };
          const data = "0x";


        /*
          const tokenId        = 0;                            // ID you lazy‑minted
          const quantity       = "1";
          const pricePerToken  = web3.utils.toWei("0.15", "ether");   // 0.15 ETH
          
          // Native ETH is always the zero‑address in thirdweb Drop contracts
          const ZERO_ADDRESS   = "0x0000000000000000000000000000000000000000";
          
         // *
         //  * `AllowlistProof` struct — leave empty if you are NOT using an allowlist.
         //  * Web3 v1.10+ accepts either an object (as shown) or an ordered array:
        //   *    const allowlistProof = [ [], quantity, pricePerToken, ZERO_ADDRESS ];
          
          const allowlistProof = {
            proof:                 [],                // no Merkle proof
            quantityLimitPerWallet: "5",         // 1 ‑‑ matches your claim phase
            pricePerToken:         pricePerToken,     // must mirror pricePerToken arg
            currency:              "0x0000000000000000000000000000000000000000"
          };
          
          const data = "0x";                          // arbitrary bytes payload (unused)
          */
        
          // -----------------------------------------------------------------------------
          // 3)  Send the single‑signature mint transaction
          // -----------------------------------------------------------------------------
          console.log("Claiming…");

          try {
            console.log("Preparing transaction with parameters:", {
              receiver,
              tokenId,
              quantity,
              pricePerToken,
              allowlistProof,
              data
            });

          
          const receipt = await bsfEdition.methods
            .claim(
              receiver,              // _receiver
              tokenId,           // _tokenId                ←  NOTE the parameter order!
              quantity,          // _quantity
              currency,      // _currency  (ETH)
              pricePerToken,     // _pricePerToken
              allowlistProof,    // _allowlistProof struct
              data               // _data
            )
            .send({
              from:   receiver,
              value:  pricePerToken, // payable ETH
              gas:    300_000
            });

          // Transaction receipt contains transactionHash and other details
          console.log("Transaction successful:", receipt);
          setTransactionReceipt(receipt);
          
          // If transaction successful, save to database
          try {
            // First, get the user_id from the user table
            const { data: dbUserData, error: userDataError } = await supabase
              .from('user')
              .select('user_id')
              .eq('auth_user_id', user.id)
              .single();

            if (userDataError) {
              console.error('Error getting user_id:', userDataError);
              throw userDataError;
            }

            // Save to order table using user_id (primary key from user table)
            const orderData = {
              user_id: dbUserData.user_id,
              drop: 'Blue Skies Forever',
              size: selectedSize,
              address: userData?.address || formData.address,
              transaction_id: receipt.transactionHash,
              email_sent: 'No',
              created_at: new Date().toISOString()
            };

            console.log('Order data to insert:', orderData);

            const { error: orderError } = await supabase
              .from('order')
              .insert([orderData]);

            if (orderError) {
              console.error('Error saving to order table:', orderError);
              console.error('Order error details:', {
                code: orderError.code,
                message: orderError.message,
                details: orderError.details,
                hint: orderError.hint
              });
              throw orderError;
            } else {
              console.log('Successfully saved to order table');
            }
          } catch (dbError) {
            console.error('Database error:', dbError);
            console.error('Full database error object:', {
              message: dbError.message,
              code: dbError.code,
              details: dbError.details,
              hint: dbError.hint,
              stack: dbError.stack
            });
            // Still show success since minting worked
          }
          
          // Set mint status to success so UI shows correct confirmation
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
  }

  const handleSaveChanges = async () => {
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    try {
      // Save to user table - use address directly from Google Places
      const { error: userError } = await supabase
        .from('user')
        .update({
          email: formData.email,
          address: formData.address
        })
        .eq('auth_user_id', user.id)

      if (userError) throw userError

      // Refresh user data
      await fetchUserData()
      setShowEditForm(false)
      
      // Show success message
      alert('Your information has been saved successfully!')
    } catch (error) {
      console.error('Error saving data:', error)
      alert('Error saving your information. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirmation = async () => {
    setShowConfirmationModal(false)
    await handleMint()
  }

  return (
    <div className="blueskies-container blueskies-page">
      <Helmet>
        <title>Blue Skies Forever</title>
        <meta property="og:title" content="Blue Skies Forever" />
        <meta name="description" content="Blue Skies Forever - a DK collaboration" />
      </Helmet>
      
      <Header
        text={
          <Fragment>
            <span className="blueskies-text10">About DxD</span>
          </Fragment>
        }
        iconBlackSrc="/icon%20-%20white-200h.png"
        rootClassName="header-root-class-name"
      />
      
      <div className="blueskies-main-content">
        <div className="blueskies-banner">
          <img src="/BSF Background.png" alt="Blue Skies Forever Background" className="blueskies-banner-image" />
        </div>
        <div className="blueskies-content-sections">
          <div className="blueskies-left-section">
            <div className="blueskies-description">
              Imagine a body of work so powerful that you are reminded of it every time you look up on a sunny day. This is what DK has accomplished with his Blue Skies Forever collection. We are now taking it to the next level with this collaboration.
            </div>
            
            <div className="blueskies-included-section">
              <h3 className="blueskies-included-title">Included in this drop:</h3>
              <div className="blueskies-item">
                <h4 className="blueskies-item-title">Blue Skies Forever Screened Tee</h4>
                <ul className="blueskies-item-details">
                  <li>6.5oz garment dyed cotton</li>
                  <li>oversized, modern fit</li>
                  <li>front and back screen</li>
                  <li>NFC chipped</li>
                </ul>
              </div>
              <div className="blueskies-item">
                <h4 className="blueskies-item-title">DK Edition</h4>
                <ul className="blueskies-item-details">
                  <li>"Seein' Stars" digital art edition</li>
                  <li>ERC1155 (ETH mainnet)</li>
                </ul>
              </div>
              <div className="blueskies-item">
                <h4 className="blueskies-item-title">Bag Boy Diner Mug</h4>
                <ul className="blueskies-item-details">
                  <li>Ceramic diner mug</li>
                  <li>Bag boy design</li>
                </ul>
              </div>
              <div className="blueskies-plus">Plus???</div>
            </div>
          </div>
          
          <div className="blueskies-right-section">
            <div className="blueskies-price">.15 ETH</div>
            
            <div className="blueskies-size-selection">
              <select 
                value={selectedSize} 
                onChange={handleSizeChange}
                className="blueskies-size-dropdown"
              >
                <option value="">Select Size</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>
            </div>
            
            <button 
              onClick={handlePlaceOrder}
              disabled={isOrdering || !selectedSize}
              className="blueskies-order-button"
            >
              {isOrdering ? 'PLACING ORDER...' : 'PLACE ORDER'}
            </button>
          </div>
        </div>
      </div>

      {/* Data Collection Modal */}
      {showDataModal && (
        <div className="blueskies-modal-overlay">
          <div className="blueskies-modal">
            <div className="blueskies-modal-header">
              <h3>Shipping Information</h3>
              <button 
                onClick={() => setShowDataModal(false)}
                className="blueskies-modal-close"
              >
                ×
              </button>
            </div>
            <div className="blueskies-modal-content">
              <p>Please provide your shipping information to complete your order.</p>
              
              <div className="blueskies-form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  className={formErrors.email ? 'blueskies-input-error' : 'blueskies-input'}
                  placeholder="your@email.com"
                />
                {formErrors.email && <span className="blueskies-error">{formErrors.email}</span>}
              </div>



              <div className="blueskies-form-group">
                <label>Mailing Address *</label>
                {!manualAddressMode ? (
                  <>
                    <input
                      ref={addressInputRef}
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleFormChange}
                      className={formErrors.address ? 'blueskies-input-error' : 'blueskies-input'}
                      placeholder="Start typing your address..."
                    />
                    {!googlePlacesLoaded && (
                      <span className="blueskies-info">Loading address autocomplete...</span>
                    )}
                    {googlePlacesLoaded && (
                      <span className="blueskies-info">Address autocomplete ready - start typing</span>
                    )}
                    <button
                      type="button"
                      onClick={() => setManualAddressMode(true)}
                      className="blueskies-manual-address-btn"
                    >
                      Enter manually
                    </button>
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleFormChange}
                      className={formErrors.address ? 'blueskies-input-error' : 'blueskies-input'}
                      placeholder="Enter your full address manually..."
                    />
                    <button
                      type="button"
                      onClick={() => setManualAddressMode(false)}
                      className="blueskies-manual-address-btn"
                    >
                      Use autocomplete
                    </button>
                  </>
                )}
                {formErrors.address && <span className="blueskies-error">{formErrors.address}</span>}
              </div>



              <div className="blueskies-modal-actions">
                <button 
                  onClick={() => setShowDataModal(false)}
                  className="blueskies-button-secondary"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDataSubmit}
                  disabled={isLoading}
                  className="blueskies-button-primary"
                >
                  Continue to Minting
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="blueskies-modal-overlay">
          <div className="blueskies-modal">
            <div className="blueskies-modal-header">
              <h3>Confirm Your Order</h3>
              <button 
                onClick={() => setShowConfirmationModal(false)}
                className="blueskies-modal-close"
              >
                ×
              </button>
            </div>
            <div className="blueskies-modal-content">
              <div className="blueskies-order-summary">
                <h4>Order Summary</h4>
                <div className="blueskies-order-details">
                  <p><strong>Drop:</strong> Blue Skies Forever</p>
                  <p><strong>Size:</strong> {selectedSize}</p>
                  <p><strong>Price:</strong> 0.15 ETH</p>
                </div>
                
                <div className="blueskies-shipping-info">
                  <div className="blueskies-shipping-header">
                    <h5>Shipping Information</h5>
                    <button 
                      onClick={() => setShowEditForm(!showEditForm)}
                      className="blueskies-edit-button"
                    >
                      {showEditForm ? 'Cancel Edit' : 'Edit'}
                    </button>
                  </div>
                  
                  {!showEditForm ? (
                    <>
                      <p><strong>Email:</strong> {userData?.email || formData.email}</p>
                      <p><strong>Address:</strong> {userData?.address || formData.address}</p>
                    </>
                  ) : (
                    <div className="blueskies-edit-form">
                      <div className="blueskies-form-group">
                        <label>Email Address *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleFormChange}
                          className={formErrors.email ? 'blueskies-input-error' : 'blueskies-input'}
                          placeholder="your@email.com"
                        />
                        {formErrors.email && <span className="blueskies-error">{formErrors.email}</span>}
                      </div>



                      <div className="blueskies-form-group">
                        <label>Mailing Address *</label>
                        {!editManualAddressMode ? (
                          <>
                            <input
                              ref={editAddressInputRef}
                              type="text"
                              name="address"
                              value={formData.address}
                              onChange={handleFormChange}
                              className={formErrors.address ? 'blueskies-input-error' : 'blueskies-input'}
                              placeholder="Start typing your address..."
                            />
                            {googlePlacesLoaded && (
                              <span className="blueskies-info">Address autocomplete ready - start typing</span>
                            )}
                            <button
                              type="button"
                              onClick={() => setEditManualAddressMode(true)}
                              className="blueskies-manual-address-btn"
                            >
                              Enter manually
                            </button>
                          </>
                        ) : (
                          <>
                            <input
                              type="text"
                              name="address"
                              value={formData.address}
                              onChange={handleFormChange}
                              className={formErrors.address ? 'blueskies-input-error' : 'blueskies-input'}
                              placeholder="Enter your full address manually..."
                            />
                            <button
                              type="button"
                              onClick={() => setEditManualAddressMode(false)}
                              className="blueskies-manual-address-btn"
                            >
                              Use autocomplete
                            </button>
                          </>
                        )}
                        {formErrors.address && <span className="blueskies-error">{formErrors.address}</span>}
                      </div>

                      <div className="blueskies-modal-actions" style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #E2E8F0' }}>
                        <button 
                          onClick={() => setShowEditForm(false)}
                          className="blueskies-button-secondary"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={handleSaveChanges}
                          disabled={isLoading}
                          className="blueskies-button-primary"
                        >
                          {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>


                    </div>
                  )}
                </div>
              </div>

              {!showEditForm && (
                <div className="blueskies-modal-actions">
                  <button 
                    onClick={() => setShowConfirmationModal(false)}
                    className="blueskies-button-secondary"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleConfirmation}
                    disabled={mintLoading || isLoading}
                    className="blueskies-button-primary"
                  >
                    {mintLoading ? 'Processing...' : isLoading ? 'Saving...' : 'Confirm Order'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sign Up Modal */}
      {showSignUpModal && (
        <div className="blueskies-modal-overlay">
          <div className="blueskies-modal">
            <div className="blueskies-modal-header">
              <h3>Sign In to Continue</h3>
              <button 
                onClick={() => setShowSignUpModal(false)}
                className="blueskies-modal-close"
              >
                ×
              </button>
            </div>
            <div className="blueskies-modal-content">
              <p>Please sign in or create an account to proceed.</p>
              
              <div className="blueskies-signup-options">
                <button 
                  onClick={async () => {
                    setShowSignUpModal(false)
                    await login()
                  }}
                  className="blueskies-button-primary"
                  style={{ width: '100%', marginBottom: '12px' }}
                >
                  Sign In / Create Account
                </button>
                
                <button 
                  onClick={() => setShowSignUpModal(false)}
                  className="blueskies-button-secondary"
                  style={{ width: '100%' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Minting Status Overlay */}
      {mintStatus && (
        <div className="blueskies-minting-overlay">
          <div className="blueskies-minting-modal">
            <div className="blueskies-minting-content">
              {mintStatus === 'connecting' && (
                <>
                  <div className="blueskies-spinner"></div>
                  <h3>Connecting to wallet...</h3>
                  <p>Please approve the connection in your wallet</p>
                </>
              )}
              
              {mintStatus === 'requesting' && (
                <>
                  <div className="blueskies-spinner"></div>
                  <h3>Minting...</h3>
                  <p>Submitting transaction</p>
                </>
              )}
              
              {mintStatus === 'success' && (
                <>
                  <div className="blueskies-success-icon">✓</div>
                  <h3>Minting Successful!</h3>
                  <a 
                    href={`https://etherscan.io/tx/${transactionReceipt?.transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="blueskies-transaction-link"
                  >
                    View Transaction
                  </a>
                  <p>Please check your email for confirmation and additional information.</p>
                  <button 
                    onClick={() => {
                      setMintStatus('')
                      setSelectedSize('')
                      setTransactionReceipt(null)
                    }}
                    className="blueskies-button-primary"
                    style={{ marginTop: '20px' }}
                  >
                    Close
                  </button>
                </>
              )}
              
              {mintStatus.startsWith('error:') && (
                <>
                  <div className="blueskies-error-icon">✗</div>
                  <h3>Minting Failed</h3>
                  <p>{mintStatus.replace('error: ', '')}</p>
                  <button 
                    onClick={() => setMintStatus('')}
                    className="blueskies-button-primary"
                    style={{ marginTop: '20px' }}
                  >
                    Try Again
                  </button>
                </>
              )}
              
              {mintStatus === 'error' && (
                <>
                  <div className="blueskies-error-icon">✗</div>
                  <h3>Minting Failed</h3>
                  <p>Please try again or email hello@devilxdetail.com</p>
                  <button 
                    onClick={() => setMintStatus('')}
                    className="blueskies-button-primary"
                    style={{ marginTop: '20px' }}
                  >
                    Try Again
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BlueSkies 
