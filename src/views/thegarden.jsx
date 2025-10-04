import React, { Fragment, useState, useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet'
import { usePrivy, useWallets } from "@privy-io/react-auth"
import { supabase, supabaseServiceRole } from '../lib/supabase'
import Web3 from 'web3'
import Header from '../components/header'
import ConsistentFooter from '../components/ConsistentFooter'
import './thegarden.css'

const TheGarden = () => {
  const { login, authenticated, user } = usePrivy()
  const { wallets } = useWallets()
  const [selectedSize, setSelectedSize] = useState('')
  const [isOrdering, setIsOrdering] = useState(false)
  const [showDataModal, setShowDataModal] = useState(false)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [userData, setUserData] = useState(null)
  const [formData, setFormData] = useState({
    twitter: ''
  })
  const [formErrors, setFormErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [mintingStatus, setMintingStatus] = useState('')
  const [mintLoading, setMintLoading] = useState(false)
  const [mintStatus, setMintStatus] = useState('')
  const [transactionReceipt, setTransactionReceipt] = useState(null)
  const [showEditForm, setShowEditForm] = useState(false)
  const [inventory, setInventory] = useState({})

  // Fetch inventory from database on component mount
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const { data, error } = await supabaseServiceRole
          .from('inventory_garden')
          .select('size, quantity')
        
        if (error) {
          console.error('Error fetching inventory:', error)
          return
        }
        
        // Convert array to object with size as key
        const inventoryObj = {}
        data.forEach(item => {
          inventoryObj[item.size] = item.quantity
        })
        
        console.log('Fetched inventory data:', data)
        console.log('Data length:', data?.length)
        console.log('Converted inventory object:', inventoryObj)
        setInventory(inventoryObj)
      } catch (error) {
        console.error('Error fetching inventory:', error)
      }
    }
    
    fetchInventory()
  }, [])





  const validateForm = () => {
    const errors = {}
    
    if (!formData.twitter?.trim()) {
      errors.twitter = 'Please enter your Twitter handle'
    }
    
    if (!selectedSize) {
      errors.size = 'Please select a size'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSizeChange = (e) => {
    setSelectedSize(e.target.value)
  }

  const handlePlaceOrder = async () => {
    // Show data collection modal for Twitter handle first
    setShowDataModal(true)
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
      // Save to order_garden table directly without authentication
      const orderData = {
        size: selectedSize,
        twitter: formData.twitter,
        transaction_id: null // Will be updated after minting
      };

      console.log('Order data to insert:', orderData);

      const { error: orderError } = await supabaseServiceRole
        .from('order_garden')
        .insert([orderData]);

      if (orderError) {
        console.error('Error saving to order_garden table:', orderError);
        throw orderError;
      } else {
        console.log('Successfully saved to order_garden table');
      }
      
      setShowDataModal(false)
      setShowConfirmationModal(true)
    } catch (error) {
      console.error('Error saving data:', error)
      alert('Error saving your information. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }


  const handleMint = async () => {
    try {
      setMintLoading(true);
      setMintStatus('connecting');

      if (!authenticated) {
        console.log("Not authenticated, prompting login");
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

        // Ensure the wallet is connected to Ethereum Mainnet
        const MAINNET_ID = "0x1"; // Hex chain id for Mainnet (1)
        try {
          const chainIdHex = await provider.request({ method: "eth_chainId" });
          if (chainIdHex !== MAINNET_ID) {
            try {
              await provider.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: MAINNET_ID }],
              });
            } catch (switchErr) {
              // 4902 = Unrecognized chain -> add it first
              if (switchErr.code === 4902) {
                await provider.request({
                  method: "wallet_addEthereumChain",
                  params: [{
                    chainId: MAINNET_ID,
                    chainName: "Ethereum Mainnet",
                    rpcUrls: ["https://ethereum.rpc.thirdweb.com"],
                    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
                    blockExplorerUrls: ["https://etherscan.io"],
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

        // Simple ETH transfer to devilxdetail.eth
        const recipientAddress = "devilxdetail.eth"; // ENS name
        const amountInEth = "0.0169"; // 0.0169 ETH
        const amountInWei = web3.utils.toWei(amountInEth, "ether");

        console.log("Sending ETH transfer...");

        try {
          console.log("Preparing ETH transfer:", {
            from: userAddress,
            to: recipientAddress,
            value: amountInWei,
            amount: amountInEth
          });

          const receipt = await web3.eth.sendTransaction({
            from: userAddress,
            to: recipientAddress,
            value: amountInWei,
            gas: 21000 // Standard gas limit for ETH transfer
          });

          // Transaction receipt contains transactionHash and other details
          console.log("ETH transfer successful:", receipt);
          setTransactionReceipt(receipt);
          
          // If transaction successful, update the order with transaction hash
          try {
            const { error: updateError } = await supabaseServiceRole
              .from('order_garden')
              .update({
                transaction_id: receipt.transactionHash
              })
              .eq('size', selectedSize)
              .eq('twitter', formData.twitter)
              .is('transaction_id', null)
              .order('created_at', { ascending: false })
              .limit(1);

            if (updateError) {
              console.error('Error updating order with transaction hash:', updateError);
              // Still show success since transfer worked
            } else {
              console.log('Successfully updated order with transaction hash');
            }
          } catch (dbError) {
            console.error('Database error:', dbError);
            // Still show success since transfer worked
          }
          
          // Deduct from inventory in database
          try {
            const { error: inventoryError } = await supabaseServiceRole
              .from('inventory_garden')
              .update({ quantity: inventory[selectedSize] - 1 })
              .eq('size', selectedSize);

            if (inventoryError) {
              console.error('Error updating inventory:', inventoryError);
            } else {
              // Update local state to reflect the change
              setInventory(prev => ({
                ...prev,
                [selectedSize]: prev[selectedSize] - 1
              }));
            }
          } catch (inventoryError) {
            console.error('Error updating inventory:', inventoryError);
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
      console.error("Error in transfer process:", error);
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
      // Update the order with new Twitter handle
      const { error: updateError } = await supabaseServiceRole
        .from('order_garden')
        .update({
          twitter: formData.twitter
        })
        .eq('size', selectedSize)
        .is('transaction_id', null)
        .order('created_at', { ascending: false })
        .limit(1);

      if (updateError) throw updateError

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
    <div className="thegarden-container thegarden-page">
      <Helmet>
        <title>The Garden</title>
        <meta property="og:title" content="The Garden" />
        <meta name="description" content="The Garden - a DxD collaboration" />
      </Helmet>
      
      <Header
        text={
          <Fragment>
            <span className="thegarden-text10">About DxD</span>
          </Fragment>
        }
        iconBlackSrc="/icon%20-%20white-200h.png"
        rootClassName="header-root-class-name"
      />
      
      <div className="thegarden-main-content">
        <div className="thegarden-banner">
          <img src="/TG Background.png" alt="The Garden Background" className="thegarden-banner-image" />
        </div>
        <div className="thegarden-content-sections">
          <div className="thegarden-left-section">
            <div className="thegarden-description">
              Step into a world where nature meets digital artistry. The Garden represents a harmonious blend of organic beauty and technological innovation, creating a unique space where every element tells a story of growth, creativity, and connection.
            </div>
            
            <div className="thegarden-included-section">
              <h3 className="thegarden-included-title">Included in this drop:</h3>
              <div className="thegarden-item">
                <h4 className="thegarden-item-title">The Garden Organic Tee</h4>
                <ul className="thegarden-item-details">
                  <li>100% organic cotton blend</li>
                  <li>Relaxed, earth-friendly fit</li>
                  <li>Botanical print design</li>
                  <li>Eco-conscious packaging</li>
                </ul>
              </div>
              <div className="thegarden-item">
                <h4 className="thegarden-item-title">Garden Edition NFT</h4>
                <ul className="thegarden-item-details">
                  <li>"Bloom & Grow" digital art collection</li>
                  <li>ERC1155 (ETH mainnet)</li>
                </ul>
              </div>
              <div className="thegarden-item">
                <h4 className="thegarden-item-title">Seed Packet Collection</h4>
                <ul className="thegarden-item-details">
                  <li>Heirloom seed varieties</li>
                  <li>Planting instructions included</li>
                </ul>
              </div>
              <div className="thegarden-item">
                <h4 className="thegarden-item-title">Plus???</h4>
              </div>
            </div>
          </div>
          
          <div className="thegarden-right-section">
            <div className="thegarden-price">.0169 ETH</div>
            
            <div className="thegarden-size-selection">
              <select 
                value={selectedSize} 
                onChange={handleSizeChange}
                className="thegarden-size-dropdown"
              >
                <option value="">Select Size</option>
                <option value="XS" disabled={inventory.XS === 0}>XS {inventory.XS === 0 ? '(Sold Out)' : inventory.XS ? `(${inventory.XS} left)` : '(Loading...)'}</option>
                <option value="S" disabled={inventory.S === 0}>S {inventory.S === 0 ? '(Sold Out)' : inventory.S ? `(${inventory.S} left)` : '(Loading...)'}</option>
                <option value="M" disabled={inventory.M === 0}>M {inventory.M === 0 ? '(Sold Out)' : inventory.M ? `(${inventory.M} left)` : '(Loading...)'}</option>
                <option value="L" disabled={inventory.L === 0}>L {inventory.L === 0 ? '(Sold Out)' : inventory.L ? `(${inventory.L} left)` : '(Loading...)'}</option>
                <option value="XL" disabled={inventory.XL === 0}>XL {inventory.XL === 0 ? '(Sold Out)' : inventory.XL ? `(${inventory.XL} left)` : '(Loading...)'}</option>
                <option value="XXL" disabled={inventory.XXL === 0}>XXL {inventory.XXL === 0 ? '(Sold Out)' : inventory.XXL ? `(${inventory.XXL} left)` : '(Loading...)'}</option>
              </select>
            </div>
            
            <button 
              onClick={handlePlaceOrder}
              disabled={isOrdering}
              className="thegarden-order-button"
            >
              {isOrdering ? 'PROCESSING...' : 'CHECKOUT'}
            </button>
          </div>
        </div>
      </div>

      {/* Data Collection Modal */}
      {showDataModal && (
        <div className="thegarden-modal-overlay">
          <div className="thegarden-modal">
            <div className="thegarden-modal-header">
              <h3>Shipping Information</h3>
              <button 
                onClick={() => setShowDataModal(false)}
                className="thegarden-modal-close"
              >
                ×
              </button>
            </div>
            <div className="thegarden-modal-content">
              <p>Please provide your Twitter handle and select a size to complete your order.</p>
              
              <div className="thegarden-form-group">
                <label>Twitter Handle *</label>
                <input
                  type="text"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleFormChange}
                  className={formErrors.twitter ? 'thegarden-input-error' : 'thegarden-input'}
                  placeholder="@yourusername"
                />
                {formErrors.twitter && <span className="thegarden-error">{formErrors.twitter}</span>}
              </div>

              <div className="thegarden-form-group">
                <label>Size *</label>
                <select 
                  value={selectedSize} 
                  onChange={handleSizeChange}
                  className="thegarden-size-dropdown"
                >
                  <option value="">Select Size</option>
                  <option value="XS" disabled={inventory.XS === 0}>XS {inventory.XS === 0 ? '(Sold Out)' : inventory.XS ? `(${inventory.XS} left)` : '(Loading...)'}</option>
                  <option value="S" disabled={inventory.S === 0}>S {inventory.S === 0 ? '(Sold Out)' : inventory.S ? `(${inventory.S} left)` : '(Loading...)'}</option>
                  <option value="M" disabled={inventory.M === 0}>M {inventory.M === 0 ? '(Sold Out)' : inventory.M ? `(${inventory.M} left)` : '(Loading...)'}</option>
                  <option value="L" disabled={inventory.L === 0}>L {inventory.L === 0 ? '(Sold Out)' : inventory.L ? `(${inventory.L} left)` : '(Loading...)'}</option>
                  <option value="XL" disabled={inventory.XL === 0}>XL {inventory.XL === 0 ? '(Sold Out)' : inventory.XL ? `(${inventory.XL} left)` : '(Loading...)'}</option>
                  <option value="XXL" disabled={inventory.XXL === 0}>XXL {inventory.XXL === 0 ? '(Sold Out)' : inventory.XXL ? `(${inventory.XXL} left)` : '(Loading...)'}</option>
                </select>
              </div>

              <div className="thegarden-modal-actions">
                <button 
                  onClick={() => setShowDataModal(false)}
                  className="thegarden-button-secondary"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDataSubmit}
                  disabled={isLoading || !selectedSize}
                  className="thegarden-button-primary"
                >
                  Purchase
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="thegarden-modal-overlay">
          <div className="thegarden-modal">
            <div className="thegarden-modal-header">
              <h3>Confirm Your Order</h3>
              <button 
                onClick={() => setShowConfirmationModal(false)}
                className="thegarden-modal-close"
              >
                ×
              </button>
            </div>
            <div className="thegarden-modal-content">
              <div className="thegarden-order-summary">
                <h4>Order Summary</h4>
                <div className="thegarden-order-details">
                  <p><strong>Drop:</strong> The Garden</p>
                  <p><strong>Size:</strong> {selectedSize}</p>
                  <p><strong>Price:</strong> 0.0169 ETH</p>
                </div>
                
                <div className="thegarden-shipping-info">
                  <div className="thegarden-shipping-header">
                    <h5>Order Information</h5>
                    <button 
                      onClick={() => setShowEditForm(!showEditForm)}
                      className="thegarden-edit-button"
                    >
                      {showEditForm ? 'Cancel Edit' : 'Edit'}
                    </button>
                  </div>
                  
                  {!showEditForm ? (
                    <>
                      <p><strong>Twitter Handle:</strong> {formData.twitter}</p>
                    </>
                  ) : (
                    <div className="thegarden-edit-form">
                      <div className="thegarden-form-group">
                        <label>Twitter Handle *</label>
                        <input
                          type="text"
                          name="twitter"
                          value={formData.twitter}
                          onChange={handleFormChange}
                          className={formErrors.twitter ? 'thegarden-input-error' : 'thegarden-input'}
                          placeholder="@yourusername"
                        />
                        {formErrors.twitter && <span className="thegarden-error">{formErrors.twitter}</span>}
                      </div>

                      <div className="thegarden-modal-actions" style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #E2E8F0' }}>
                        <button 
                          onClick={() => setShowEditForm(false)}
                          className="thegarden-button-secondary"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={handleSaveChanges}
                          disabled={isLoading}
                          className="thegarden-button-primary"
                        >
                          {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {!showEditForm && (
                <div className="thegarden-modal-actions">
                  <button 
                    onClick={() => setShowConfirmationModal(false)}
                    className="thegarden-button-secondary"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleConfirmation}
                    disabled={mintLoading || isLoading}
                    className="thegarden-button-primary"
                  >
                    {mintLoading ? 'Processing...' : isLoading ? 'Saving...' : 'Confirm Order'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}


      {/* Minting Status Overlay */}
      {mintStatus && (
        <div className="thegarden-minting-overlay">
          <div className="thegarden-minting-modal">
            <div className="thegarden-minting-content">
              {mintStatus === 'connecting' && (
                <>
                  <div className="thegarden-spinner"></div>
                  <h3>Connecting to wallet...</h3>
                  <p>Please approve the connection in your wallet</p>
                </>
              )}
              
              {mintStatus === 'requesting' && (
                <>
                  <div className="thegarden-spinner"></div>
                  <h3>Sending Payment...</h3>
                  <p>Submitting ETH transfer</p>
                </>
              )}
              
              {mintStatus === 'success' && (
                <>
                  <div className="thegarden-success-icon">✓</div>
                  <h3>Payment Successful!</h3>
                  <a 
                    href={`https://etherscan.io/tx/${transactionReceipt?.transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="thegarden-transaction-link"
                  >
                    View Transaction
                  </a>
                  <p>Your order has been confirmed. We will send you information on how to pick up your shirt in Marfa. Thank you for your purchase!</p>
                  <button 
                    onClick={() => {
                      setMintStatus('')
                      setSelectedSize('')
                      setTransactionReceipt(null)
                      setFormData({ twitter: '' })
                      setShowConfirmationModal(false)
                    }}
                    className="thegarden-button-primary"
                    style={{ marginTop: '20px' }}
                  >
                    Close
                  </button>
                </>
              )}
              
              {mintStatus.startsWith('error:') && (
                <>
                  <div className="thegarden-error-icon">✗</div>
                  <h3>Transaction Failed</h3>
                  <p>{mintStatus.replace('error: ', '')}</p>
                  <p>Your order has been cancelled. Please try again or contact hello@devilxdetail.com if you continue to experience issues.</p>
                  <button 
                    onClick={() => {
                      setMintStatus('')
                      setShowConfirmationModal(false)
                    }}
                    className="thegarden-button-primary"
                    style={{ marginTop: '20px' }}
                  >
                    Return to Order
                  </button>
                </>
              )}
              
              {mintStatus === 'error' && (
                <>
                  <div className="thegarden-error-icon">✗</div>
                  <h3>Transaction Failed</h3>
                  <p>Your transaction was cancelled or failed. Your order has been cancelled.</p>
                  <p>Please try again or email hello@devilxdetail.com for assistance.</p>
                  <button 
                    onClick={() => {
                      setMintStatus('')
                      setShowConfirmationModal(false)
                    }}
                    className="thegarden-button-primary"
                    style={{ marginTop: '20px' }}
                  >
                    Return to Order
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

export default TheGarden
