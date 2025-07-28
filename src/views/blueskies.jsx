import React, { Fragment, useState, useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet'
import { usePrivy, useWallets } from "@privy-io/react-auth"
import { supabase } from '../lib/supabase'
import Web3 from 'web3'
import Header from '../components/header'
import './blueskies.css'

const BlueSkies = () => {
  const { login, authenticated, user } = usePrivy()
  const { wallets, ready } = useWallets()
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
  const [showEditForm, setShowEditForm] = useState(false)
  const [showSignUpModal, setShowSignUpModal] = useState(false)
  const [isNewUser, setIsNewUser] = useState(false)
  const [googlePlacesLoaded, setGooglePlacesLoaded] = useState(false)
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
    console.log('Autocomplete effect triggered:', { googlePlacesLoaded, hasInput: !!addressInputRef.current })
    
    if (googlePlacesLoaded && addressInputRef.current) {
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
  }, [googlePlacesLoaded])

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
    if (showEditForm && googlePlacesLoaded && editAddressInputRef.current) {
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
  }, [showEditForm, googlePlacesLoaded])

  const handleMint = async () => {
    try {
      setMintLoading(true);
      setMintStatus('connecting');

      if (!authenticated) {
        console.log("Not authenticated");
        await login();
        return;
      }

      // Check for Privy's embedded wallet first
      const hasEmbeddedWallet = !!user?.wallet;
      
      // Wait until Privy finishes discovering external wallets
      if (!ready) {
        setMintStatus('connecting');
        return;
      }

      // Combine embedded wallet with external wallets
      const allWallets = [];
      
      if (hasEmbeddedWallet) {
        allWallets.push({
          address: user.wallet.address,
          walletClientType: 'privy',
          walletType: 'embedded',
          getEthereumProvider: () => user.wallet.provider
        });
      }
      
      // Add external wallets
      allWallets.push(...wallets);

      // Log all available wallets for debugging
      console.log('All available wallets:', allWallets.map(wallet => ({
        address: wallet.address,
        provider: wallet.walletClientType,
        type: wallet.walletType || 'external'
      })));

      // Check if user has any wallets at all
      if (allWallets.length === 0) {
        const errorMessage = "No wallet linked to your account. Please link a wallet to your Privy account to proceed with minting.";
        console.error(errorMessage);
        setMintStatus(`error: ${errorMessage}`);
        return;
      }

      // If user has multiple wallets, show error asking them to choose one
      if (allWallets.length > 1) {
        const walletTypes = allWallets.map(w => w.walletClientType).join(', ');
        const errorMessage = `Multiple wallets detected (${allWallets.length}). Please use only one wallet for minting. Available wallets: ${walletTypes}`;
        console.error(errorMessage);
        setMintStatus(`error: ${errorMessage}`);
        return;
      }

      try {
        setMintStatus('requesting');
        
        // Use the single wallet from all available wallets
        const wallet = allWallets[0];
        console.log("Minting with:", wallet.walletClientType, wallet.address);
        
        // Get the Ethereum provider from the wallet
        const provider = await wallet.getEthereumProvider();
        if (!provider) {
          throw new Error("No wallet provider available from Privy");
        }

        const web3 = new Web3(provider);
        const userAddress = wallet.address;

        // Contract details
        const contractAddress = "0x41E791EC136492484A96455CDA32C5201cF11650";



        /*
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

        
        // Define claim parameters
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
        
        try {
          console.log("Preparing transaction with parameters:", {
            receiver,
            quantity,
            currency,
            pricePerToken,
            allowlistProof,
            data
          });

          
          // Send transaction
          const tx = await nftDropContract.methods.claim(
            receiver,
            quantity,
            tokenId,
            currency,
            pricePerToken,
            allowlistProof,
            data
          ).send({
            from: userAddress,
            value: pricePerToken,
            gas: 300000
          });

           const tx = await edition.methods
            .mintTo(
              receiver,    // _to
              tokenId,        // _tokenId
              "",             // _uri  — empty if you don’t need to override
              quantity        // _amount
            )
            .send({
              from: userAddress,
              gas: 300_000
            });
          */


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

          
          console.log("Transaction successful:", receipt);
          
          // If transaction successful, save to database
          try {
            const { error: dropError } = await supabase
              .from('blueskies_drop')
              .insert([{
                auth_user_id: user.id,
                email: userData?.email || formData.email,
                address: userData?.address || formData.address,
                city: formData.city,
                state: formData.state,
                zip_code: formData.zipCode,
                country: formData.country,
                size: selectedSize,
                status: 'minted',
                transaction_hash: receipt.transactionHash
              }])

            if (dropError) {
              console.error('Error saving to database:', dropError)
              // Still show success since minting worked
            }
          } catch (dbError) {
            console.error('Database error:', dbError)
            // Still show success since minting worked
          }
          
          setMintStatus('success');

        } catch (error) {
          console.error("Detailed error:", error);
          const errorMessage = error.message || "Unknown error";
          setMintStatus(`error: ${errorMessage}`);
          throw error;
        }

      } catch (error) {
        console.error("Error accessing Privy wallet:", error);
        if (error.message.includes("No wallet provider available")) {
          setMintStatus('error: Unable to access your linked wallet. Please try reconnecting your wallet to your Privy account.');
        } else {
          setMintStatus('error');
        }
        throw error;
      }

    } catch (error) {
      console.error("Error in mint process:", error);
      const hasEmbeddedWallet = !!user?.wallet;
      const hasExternalWallets = wallets.length > 0;
      
      if (!hasEmbeddedWallet && !hasExternalWallets) {
        setMintStatus('error: No wallet linked to your account. Please link a wallet to your Privy account to proceed with minting.');
      } else {
        setMintStatus('error');
      }
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
        <title>DxD - Blue Skies Forever</title>
        <meta property="og:title" content="DxD - Blue Skies Forever" />
        <meta name="description" content="Blue Skies Forever collection by DK - A powerful body of work that reminds you of it every time you look up on a sunny day." />
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
        <div className="blueskies-title">BLUE SKIES FOREVER</div>
        <div className="blueskies-content-sections">
          <div className="blueskies-left-section">
            <div className="blueskies-description">
              Imagine a body of work so powerful that you are reminded of it every time you look up on a sunny day. This is what DK has accomplished with his Blue Skies Forever collection. We are now taking it to the next level with this collaboration.
            </div>
            
            <div className="blueskies-included-section">
              <h3 className="blueskies-included-title">Included in this drop:</h3>
              <ul className="blueskies-items-list">
                <li>Blue Skies Forever T</li>
                <li>DK Edition</li>
                <li>Bag Boy Diner Mug</li>
              </ul>
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
            
            {authenticated && ready && !user?.wallet && wallets.length === 0 && (
              <div className="blueskies-wallet-notice">
                <p>⚠️ You need to link a wallet to your account to complete this purchase.</p>
                <p>Please connect a wallet in your account settings before proceeding.</p>
              </div>
            )}
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
                  <p><strong>Product:</strong> Blue Skies Forever Collection</p>
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
                        <input
                          ref={editAddressInputRef}
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleFormChange}
                          className={formErrors.address ? 'blueskies-input-error' : 'blueskies-input'}
                          placeholder="Start typing your address..."
                        />
                        {formErrors.address && <span className="blueskies-error">{formErrors.address}</span>}
                        {googlePlacesLoaded && (
                          <span className="blueskies-info">Address autocomplete ready - start typing</span>
                        )}
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
              <p>Please sign in to complete your order. If you don't have an account, you'll be able to create one during the sign-in process.</p>
              
              <div className="blueskies-signup-options">
                <button 
                  onClick={async () => {
                    setShowSignUpModal(false)
                    await login()
                  }}
                  className="blueskies-button-primary"
                  style={{ width: '100%', marginBottom: '12px' }}
                >
                  Sign In / Sign Up
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
                  <h3>Preparing transaction...</h3>
                  <p>Setting up the minting process</p>
                </>
              )}
              
              {mintStatus === 'success' && (
                <>
                  <div className="blueskies-success-icon">✓</div>
                  <h3>Minting Successful!</h3>
                  <p>Your Blue Skies Forever collection has been minted</p>
                  <button 
                    onClick={() => {
                      setMintStatus('')
                      setSelectedSize('')
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
                  <p>Please try again or contact support</p>
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
