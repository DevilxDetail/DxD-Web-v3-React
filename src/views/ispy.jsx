import React, { Fragment, useState, useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet'
import { usePrivy, useWallets } from "@privy-io/react-auth"
import { supabase } from '../lib/supabase'
import Web3 from 'web3'
import Header from '../components/header'
import ConsistentFooter from '../components/ConsistentFooter'
import './ispy.css'

const BlueSkies = () => {
  // I Spy Collection - Clean working copy
  const { login, authenticated, user } = usePrivy()
  const { wallets } = useWallets()
  
  // Interactive overlay state
  const [showOverlay, setShowOverlay] = useState(true)
  const [clickedItems, setClickedItems] = useState({
    prayerCandle: false,
    zippo: false,
    dogTags: false
  })
  const [overlayAnimating, setOverlayAnimating] = useState(false)
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
  const imageRef = useRef(null)
  const svgRef = useRef(null)

  // Interactive overlay handlers
  const handleItemClick = (itemKey) => {
    console.log('Item clicked:', itemKey) // Debug log
    
    const newClickedItems = {
      ...clickedItems,
      [itemKey]: true
    }
    
    setClickedItems(newClickedItems)
    
    // Check if all items are clicked
    if (newClickedItems.prayerCandle && newClickedItems.zippo && newClickedItems.dogTags) {
      console.log('All items found! Starting animation...') // Debug log
      // All items clicked, start animation
      setOverlayAnimating(true)
      setTimeout(() => {
        setShowOverlay(false)
        setOverlayAnimating(false)
      }, 1000) // Animation duration
    }
  }
  
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

  // Handle main content visibility based on overlay state
  useEffect(() => {
    if (!showOverlay) {
      // Ensure main content is visible when overlay is gone
      const mainContent = document.querySelector('.blueskies-main-content')
      if (mainContent) {
        mainContent.style.opacity = '1'
        mainContent.style.pointerEvents = 'auto'
      }
    }
  }, [showOverlay])

  // Ensure SVG overlay matches image dimensions exactly
  useEffect(() => {
    if (imageRef.current && svgRef.current) {
      const updateSVGSize = () => {
        const img = imageRef.current
        const svg = svgRef.current
        if (img && svg) {
          // Simple approach: just ensure SVG covers the container
          svg.style.width = '100%'
          svg.style.height = '100%'
        }
      }
      
      // Update on load and resize
      updateSVGSize()
      window.addEventListener('resize', updateSVGSize)
      
      return () => window.removeEventListener('resize', updateSVGSize)
    }
  }, [imageRef.current, svgRef.current])

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

        // Contract details - I Spy Collection ERC721 NFT Claim
        const contractAddress = "0xb9868148c1E51DA4093498062FA8d4C2E8cCcb0C";
        
        // ERC721 NFT Claim ABI - trying different claim function signatures
        const nftClaimABI = [
          // Standard claim function
          {
            "inputs": [
              { "internalType": "address", "name": "_receiver", "type": "address" },
              { "internalType": "uint256", "name": "_quantity", "type": "uint256" },
              { "internalType": "address", "name": "_currency", "type": "address" },
              { "internalType": "uint256", "name": "_pricePerToken", "type": "uint256" },
              { "components": [
                  { "internalType": "bytes32[]", "name": "proof", "type": "bytes32[]" },
                  { "internalType": "uint256", "name": "quantityLimitPerWallet", "type": "uint256" },
                  { "internalType": "uint256", "name": "pricePerToken", "type": "uint256" },
                  { "internalType": "address", "name": "currency", "type": "address" }
                ],
                "internalType": "struct IDrop721.AllowlistProof",
                "name": "_allowlistProof",
                "type": "tuple"
              },
              { "internalType": "bytes", "name": "_data", "type": "bytes" }
            ],
            "name": "claim",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
          },
          // Alternative claim function (some contracts use this)
          {
            "inputs": [
              { "internalType": "address", "name": "_to", "type": "address" },
              { "internalType": "uint256", "name": "_quantity", "type": "uint256" }
            ],
            "name": "claim",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
          },
          // Simple mint function
          {
            "inputs": [
              { "internalType": "address", "name": "_to", "type": "address" }
            ],
            "name": "mint",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
          }
        ]

          // Initialize contract
          const nftClaimContract = new web3.eth.Contract(nftClaimABI, contractAddress);

          // Mint parameters for I Spy Collection
          const receiver = userAddress;
          const quantity = "1"; // Mint 1 NFT
          const currency = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"; // ETH
          const pricePerToken = web3.utils.toWei("0.1", "ether"); // 0.1 ETH in wei
          const allowlistProof = {
            proof: [],
            quantityLimitPerWallet: "0", // No limit
            pricePerToken: pricePerToken,
            currency: "0x0000000000000000000000000000000000000000"
          };
          const data = "0x";

          // Try to read contract state first
          try {
            const contractCode = await web3.eth.getCode(contractAddress);
            if (contractCode === '0x' || contractCode === '0x0') {
              throw new Error('Contract not deployed at this address');
            }
            console.log('Contract code found, length:', contractCode.length);
          } catch (error) {
            console.error('Error checking contract:', error);
            throw new Error('Contract verification failed');
          }


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
              quantity,
              pricePerToken,
              allowlistProof,
              data
            });

          
          // Try different minting approaches
          let receipt;
          
          try {
            // First, try the standard claim function
            console.log('Attempting standard claim function...');
            receipt = await nftClaimContract.methods
              .claim(
                receiver,              // _receiver
                quantity,              // _quantity
                currency,              // _currency (ETH)
                pricePerToken,         // _pricePerToken
                allowlistProof,        // _allowlistProof struct
                data                   // _data
              )
              .send({
                from: receiver,
                value: pricePerToken,  // payable ETH (0.1 ETH)
                gas: 300_000
              });
          } catch (error) {
            console.log('Standard claim failed, trying alternative claim...', error.message);
            
            try {
              // Try alternative claim function
              receipt = await nftClaimContract.methods
                .claim(
                  receiver,              // _to
                  quantity              // _quantity
                )
                .send({
                  from: receiver,
                  value: pricePerToken,  // payable ETH (0.1 ETH)
                  gas: 300_000
                });
            } catch (error2) {
              console.log('Alternative claim failed, trying simple mint...', error2.message);
              
              // Try simple mint function
              receipt = await nftClaimContract.methods
                .mint(
                  receiver              // _to
                )
                .send({
                  from: receiver,
                  value: pricePerToken,  // payable ETH (0.1 ETH)
                  gas: 300_000
                });
            }
          }

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
              drop: 'I Spy Collection',
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
          
          // Send mint confirmation email
          try {
            const userEmail = userData?.email || formData.email;
            if (userEmail) {
              const emailResponse = await fetch('/api/send-mint-email', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  userEmail: userEmail,
                  mintDetails: {
                    transactionHash: receipt.transactionHash,
                    walletAddress: userAddress,
                                              collectionName: 'I Spy Collection',
                    size: selectedSize
                  }
                })
              });

              if (emailResponse.ok) {
                console.log('Mint confirmation email sent successfully');
              } else {
                console.error('Failed to send mint confirmation email:', await emailResponse.text());
              }
            }
          } catch (emailError) {
            console.error('Error sending mint confirmation email:', emailError);
            // Don't fail the mint if email fails
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
      
      {/* Interactive Overlay */}
      {showOverlay && (
        <div className={`ispy-overlay ${overlayAnimating ? 'overlay-animating' : ''}`}>
          <div className="overlay-image-container">
            <img 
              ref={imageRef}
              src="/ispy-t-shirt-design-front-final.PNG.png" 
              alt="I Spy Collection - Find the hidden items" 
              className="overlay-image"
              onLoad={() => {
                if (imageRef.current) {
                  console.log('Image loaded successfully:', {
                    naturalWidth: imageRef.current.naturalWidth,
                    naturalHeight: imageRef.current.naturalHeight,
                    clientWidth: imageRef.current.clientWidth,
                    clientHeight: imageRef.current.clientHeight,
                    src: imageRef.current.src
                  })
                }
              }}
              onError={(e) => {
                console.error('Image failed to load:', e)
              }}
            />
            
            {/* SVG Overlay with Polygon Click Areas */}
            <svg 
              ref={svgRef}
              className="overlay-svg" 
              viewBox="0 0 2400 2400" 
              preserveAspectRatio="xMidYMid meet"
              style={{ width: '100%', height: '100%' }}
            >
              {/* Prayer Candle */}
              <polygon
                className={`click-area prayer-candle ${clickedItems.prayerCandle ? 'clicked' : ''}`}
                points="528,410 541,389 581,366 611,355 636,345 655,345 672,338 687,338 700,338 717,338 727,342 740,349 753,355 761,359 767,366 772,376 774,391 842,622 977,1125 969,1144 956,1152 939,1161 918,1169 890,1176 869,1182 848,1190 818,1199 793,1207 770,1205 751,1201 738,1195 541,506 530,472 524,438"
                onClick={() => handleItemClick('prayerCandle')}
                data-title="Prayer Candle"
              />
              {clickedItems.prayerCandle && (
                <text x="650" y="800" className="found-indicator">✓</text>
              )}
              
              {/* Zippo */}
              <polygon
                className={`click-area zippo ${clickedItems.zippo ? 'clicked' : ''}`}
                points="748,1417 814,1470 776,1542 848,1576 854,1595 863,1610 865,1621 865,1634 833,1651 842,1665 865,1680 818,1820 791,1824 659,1757 708,1614 640,1555 672,1492 723,1417"
                onClick={() => handleItemClick('zippo')}
                data-title="Zippo"
              />
              {clickedItems.zippo && (
                <text x="750" y="1650" className="found-indicator">✓</text>
              )}
              
              {/* Dog Tags */}
              <polygon
                className={`click-area dog-tags ${clickedItems.dogTags ? 'clicked' : ''}`}
                points="977,1256 1003,1258 1024,1250 1043,1237 1060,1224 1079,1210 1105,1184 1124,1157 1145,1127 1168,1084 1185,1038 1196,1004 1202,970 1204,934 1204,900 1198,868 1189,839 1196,794 1196,758 1192,737 1183,705 1170,673 1151,643 1132,607 1119,584 1107,563 1100,544,1115 525,1132 512,1136 529,1139 542,1139 557,1145 571,1162 590,1215 620,1306 665,1323 665,1344 663,1357 654,1372 641,1380 620,1387 601,1389 578,1389 559,1387 540,1380 520,1367 504,1355 491,1202 419,1187,423 1170,427 1160,436 1149,448 1141,461 1134,480,1119 482,1105 493,1094 512,1096 529,1083 561,1069 576,1056 601,1054 624,1054 648,1064 682,1086 705,1105 726,1117 737,1132 758,1145 773,1160 788,1172 807,1181 822,1189 843,1175 879,1164 908,1147 936,1128 972,1107 1006,1092 1025,1071 1051,1054 1076,1037 1097,1026 1116,1013 1131,1001 1148,988 1171,975 1195,967,1214 965,1235"
                onClick={() => handleItemClick('dogTags')}
                data-title="Dog Tags"
              />
              {clickedItems.dogTags && (
                <text x="1100" y="1100" className="found-indicator">✓</text>
              )}
            </svg>
          </div>
        </div>
      )}
      
      <div className="blueskies-main-content">
        <div className="blueskies-banner">
          <img src="/ispy-hero-asset-web-1.png" alt="I Spy Collection Hero" className="blueskies-banner-image" />
        </div>
        <div className="blueskies-content-sections">
          <div className="blueskies-left-section">
            <div className="blueskies-description">
              Discover the hidden world around you with DK's I Spy Collection. This unique collaboration brings together the art of observation and the thrill of discovery, creating an experience that challenges you to see the extraordinary in the ordinary.
            </div>
            
            <div className="blueskies-included-section">
              <h3 className="blueskies-included-title">Included in this drop:</h3>
              <div className="blueskies-item">
                <h4 className="blueskies-item-title">I Spy Collection Screened Tee</h4>
                <ul className="blueskies-item-details">
                  <li>6.5oz garment dyed cotton</li>
                  <li>Oversized, modern fit</li>
                  <li>Front and back screen</li>
                  <li>NFC chipped</li>
                </ul>
              </div>
              <div className="blueskies-item">
                <h4 className="blueskies-item-title">DK Edition</h4>
                <ul className="blueskies-item-details">
                  <li>"I Spy" digital art edition</li>
                  <li>ERC721 (Sepolia testnet)</li>
                </ul>
              </div>
              <div className="blueskies-item">
                <h4 className="blueskies-item-title">Discovery Kit</h4>
                <ul className="blueskies-item-details">
                  <li>Interactive elements</li>
                  <li>Hidden details to find</li>
                </ul>
              </div>
              <div className="blueskies-item">
                <h4 className="blueskies-item-title">Plus???</h4>
              </div>
            </div>
          </div>
          
          <div className="blueskies-right-section">
            <div className="blueskies-price">.1 ETH</div>
            
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
                                      <p><strong>Drop:</strong> I Spy Collection</p>
                  <p><strong>Size:</strong> {selectedSize}</p>
                                      <p><strong>Price:</strong> 0.1 ETH</p>
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
      
      <ConsistentFooter />
    </div>
  )
}

export default BlueSkies 
