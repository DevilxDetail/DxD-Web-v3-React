import React, { Fragment, useState, useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet'
import { supabase, supabaseServiceRole } from '../lib/supabase'
import Web3 from 'web3'
import Header from '../components/header'
import './thegarden.css'

const TheGarden = () => {
  const [selectedSize, setSelectedSize] = useState('')
  const [isOrdering, setIsOrdering] = useState(false)
  const [showDataModal, setShowDataModal] = useState(false)
  const [userData, setUserData] = useState(null)
  const [formData, setFormData] = useState({
    twitter: ''
  })
  const [formErrors, setFormErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [inventory, setInventory] = useState({})
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.thegarden-custom-dropdown')) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownOpen])

  // Fetch inventory from database on component mount
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        console.log('Attempting to fetch inventory...')
        console.log('supabaseServiceRole:', supabaseServiceRole)
        
        if (!supabaseServiceRole) {
          console.error('supabaseServiceRole is null - check environment variables')
          return
        }
        
        // Try with regular supabase client first
        let { data, error } = await supabase
          .from('inventory_garden')
          .select('*')
        
        if (error) {
          console.error('Error fetching inventory with regular client:', error)
          console.error('Error details:', error.message, error.details, error.hint)
          
          // Try with service role client as fallback
          console.log('Trying with service role client...')
          const serviceResult = await supabaseServiceRole
            .from('inventory_garden')
            .select('*')
          
          if (serviceResult.error) {
            console.error('Error fetching inventory with service role:', serviceResult.error)
            return
          }
          
          data = serviceResult.data
          error = serviceResult.error
        }
        
        console.log('Fetched inventory data:', data)
        console.log('Data length:', data?.length)
        
        if (!data || data.length === 0) {
          console.log('No inventory data found in database - likely RLS blocking query')
          console.log('Setting default inventory for now')
          // Set default inventory since RLS is likely blocking the query
          setInventory({
            S: 5,
            M: 8,
            L: 12,
            XL: 6,
            XXL: 3
          })
          return
        }
        
        // Convert array to object with size as key
        const inventoryObj = {}
        data.forEach(item => {
          inventoryObj[item.size] = item.quantity
        })
        
        console.log('Converted inventory object:', inventoryObj)
        setInventory(inventoryObj)
      } catch (error) {
        console.error('Error fetching inventory:', error)
        console.error('Error stack:', error.stack)
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
      // Create order record directly
      const { error: orderError } = await supabaseServiceRole
        .from('order_garden')
        .insert([{
          size: selectedSize,
          twitter: formData.twitter,
          transaction_id: null
        }])

      if (orderError) {
        console.error('Error saving to order_garden table:', orderError)
        alert('Error saving your order. Please try again.')
        return
      }

      // Decrement inventory for purchased size
      const sizeMap = { 'S': 'Small', 'M': 'Medium', 'L': 'Large', 'XL': 'XLarge', 'XXL': 'XXLarge' }
      const dbSizeName = sizeMap[selectedSize]
      if (dbSizeName) {
        const currentQty = inventory?.[dbSizeName] ?? 0
        const nextQty = currentQty > 0 ? currentQty - 1 : 0
        const { error: inventoryError } = await supabaseServiceRole
          .from('inventory_garden')
          .update({ quantity: nextQty })
          .eq('size', dbSizeName)
        
        if (inventoryError) {
          console.error('Error updating inventory:', inventoryError)
        } else {
          setInventory(prev => ({ ...prev, [dbSizeName]: nextQty }))
        }
      }

      // Send SMS notification
      try {
        await fetch('/api/send-order-sms', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phoneNumber: '+1234567890', // Replace with your phone number for SMS notifications
            orderDetails: {
              size: selectedSize,
              twitter: formData.twitter,
              orderId: new Date().getTime().toString() // Simple order ID based on timestamp
            }
          })
        })
        console.log('SMS notification sent successfully')
      } catch (smsError) {
        console.error('Error sending SMS notification:', smsError)
        // Don't fail the order if SMS fails
      }

      // Close data modal and show success modal
      setShowDataModal(false)
      setShowSuccessModal(true)
    } catch (error) {
      console.error('Error processing order:', error)
      alert('Error processing your order. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="thegarden-container thegarden-page">
      <Helmet>
        <title>The Garden</title>
        <meta property="og:title" content="The Garden" />
        <meta name="description" content="The Garden - a DxD collaboration" />
        <style>{`
          body.thegarden-page, html.thegarden-page {
            background: none !important;
            background-color: transparent !important;
          }
          .thegarden-page .header-header {
            background: none !important;
            background-color: transparent !important;
            backdrop-filter: none !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            z-index: 1000 !important;
            padding-top: 20px !important;
            padding-bottom: 20px !important;
            padding-left: 40px !important;
            padding-right: 40px !important;
          }
        `}</style>
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://devilxdetail.com/Jules Thumbnail.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://devilxdetail.com/Jules Thumbnail.jpg" />
      </Helmet>
      
      {/* Header hidden on this page */}
      
      {/* Background video removed for white background */}
      
      <div className="thegarden-main-content">
        <div className="thegarden-hero-section">
          <img src="/Marfa Garden 3.png" alt="Marfa Garden 3" className="thegarden-hero-image" />
        </div>
        <div className="thegarden-content-sections">
          <div className="thegarden-left-section">
            <div className="thegarden-included-section">
              <div className="thegarden-item">
                <h4 className="thegarden-item-title">The Garden at Roy’s - Zip Up</h4>
                <ul className="thegarden-item-details">
                  <li>.0169 ETH // $69 USD</li>
                  <li>Pick up in Marfa</li>
                  <li>Produced with Devil x Detail</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="thegarden-right-section">
            
            <div className="thegarden-size-selection">
              <div className="thegarden-custom-dropdown">
                <div 
                  className="thegarden-dropdown-trigger"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <span>{selectedSize ? `${selectedSize === 'S' ? 'Small' : selectedSize === 'M' ? 'Medium' : selectedSize === 'L' ? 'Large' : selectedSize === 'XL' ? 'XLarge' : 'XXLarge'} ${inventory[selectedSize === 'S' ? 'Small' : selectedSize === 'M' ? 'Medium' : selectedSize === 'L' ? 'Large' : selectedSize === 'XL' ? 'XLarge' : 'XXLarge'] === 0 ? '(Unavailable)' : inventory[selectedSize === 'S' ? 'Small' : selectedSize === 'M' ? 'Medium' : selectedSize === 'L' ? 'Large' : selectedSize === 'XL' ? 'XLarge' : 'XXLarge'] ? `(${inventory[selectedSize === 'S' ? 'Small' : selectedSize === 'M' ? 'Medium' : selectedSize === 'L' ? 'Large' : selectedSize === 'XL' ? 'XLarge' : 'XXLarge']} remaining)` : '(Loading...)'}` : 'Select Size'}</span>
                  <span className="thegarden-dropdown-arrow">▼</span>
                </div>
                {dropdownOpen && (
                  <div className="thegarden-dropdown-menu">
                    <div 
                      className="thegarden-dropdown-item"
                      onClick={() => {
                        setSelectedSize('');
                        setDropdownOpen(false);
                      }}
                    >
                      Select Size
                    </div>
                    <div 
                      className={`thegarden-dropdown-item ${inventory.Small === 0 ? 'disabled' : ''}`}
                      onClick={() => {
                        if (inventory.Small > 0) {
                          setSelectedSize('S');
                          setDropdownOpen(false);
                        }
                      }}
                    >
                      Small {inventory.Small === 0 ? '(Unavailable)' : inventory.Small ? `(${inventory.Small} remaining)` : '(Loading...)'}
                    </div>
                    <div 
                      className={`thegarden-dropdown-item ${inventory.Medium === 0 ? 'disabled' : ''}`}
                      onClick={() => {
                        if (inventory.Medium > 0) {
                          setSelectedSize('M');
                          setDropdownOpen(false);
                        }
                      }}
                    >
                      Medium {inventory.Medium === 0 ? '(Unavailable)' : inventory.Medium ? `(${inventory.Medium} remaining)` : '(Loading...)'}
                    </div>
                    <div 
                      className={`thegarden-dropdown-item ${inventory.Large === 0 ? 'disabled' : ''}`}
                      onClick={() => {
                        if (inventory.Large > 0) {
                          setSelectedSize('L');
                          setDropdownOpen(false);
                        }
                      }}
                    >
                      Large {inventory.Large === 0 ? '(Unavailable)' : inventory.Large ? `(${inventory.Large} remaining)` : '(Loading...)'}
                    </div>
                    <div 
                      className={`thegarden-dropdown-item ${inventory.XLarge === 0 ? 'disabled' : ''}`}
                      onClick={() => {
                        if (inventory.XLarge > 0) {
                          setSelectedSize('XL');
                          setDropdownOpen(false);
                        }
                      }}
                    >
                      XLarge {inventory.XLarge === 0 ? '(Unavailable)' : inventory.XLarge ? `(${inventory.XLarge} remaining)` : '(Loading...)'}
                    </div>
                    <div 
                      className={`thegarden-dropdown-item ${inventory.XXLarge === 0 ? 'disabled' : ''}`}
                      onClick={() => {
                        if (inventory.XXLarge > 0) {
                          setSelectedSize('XXL');
                          setDropdownOpen(false);
                        }
                      }}
                    >
                      XXLarge {inventory.XXLarge === 0 ? '(Unavailable)' : inventory.XXLarge ? `(${inventory.XXLarge} remaining)` : '(Loading...)'}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <button 
              onClick={handlePlaceOrder}
              disabled={isOrdering}
              className="thegarden-order-button"
            >
              {isOrdering ? 'PROCESSING...' : 'RESERVE'}
            </button>
          </div>
        </div>
      </div>

      {/* Data Collection Modal */}
      {showDataModal && (
        <div className="thegarden-modal-overlay">
          <div className="thegarden-modal">
            <div className="thegarden-modal-header">
              <h3>Order Information</h3>
              <button 
                onClick={() => setShowDataModal(false)}
                className="thegarden-modal-close"
              >
                ×
              </button>
            </div>
            <div className="thegarden-modal-content">
              <p>
                Please provide your Twitter handle and select a size to reserve your hoodie.{' '}
                <strong>The hoodie is only available for pick up in Marfa 10/15 - 10/19.</strong>{' '}
              </p>

              <p>
                We will coordinate pickup via DM. Be prepared to pay at that time (send ETH to devilxdetail.eth or pay in cash).
              </p>
              
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
                  <option value="S" disabled={inventory.Small === 0}>Small {inventory.Small === 0 ? '(Unavailable)' : inventory.Small ? `(${inventory.Small} remaining)` : '(Loading...)'}</option>
                  <option value="M" disabled={inventory.Medium === 0}>Medium {inventory.Medium === 0 ? '(Unavailable)' : inventory.Medium ? `(${inventory.Medium} remaining)` : '(Loading...)'}</option>
                  <option value="L" disabled={inventory.Large === 0}>Large {inventory.Large === 0 ? '(Unavailable)' : inventory.Large ? `(${inventory.Large} remaining)` : '(Loading...)'}</option>
                  <option value="XL" disabled={inventory.XLarge === 0}>XLarge {inventory.XLarge === 0 ? '(Unavailable)' : inventory.XLarge ? `(${inventory.XLarge} remaining)` : '(Loading...)'}</option>
                  <option value="XXL" disabled={inventory.XXLarge === 0}>XXLarge {inventory.XXLarge === 0 ? '(Unavailable)' : inventory.XXLarge ? `(${inventory.XXLarge} remaining)` : '(Loading...)'}</option>
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
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}



      {showSuccessModal && (
        <div className="thegarden-modal-overlay">
          <div className="thegarden-modal">
            <div className="thegarden-modal-header">
              <h3>Purchase Confirmed</h3>
              <button 
                onClick={() => setShowSuccessModal(false)}
                className="thegarden-modal-close"
              >
                ×
              </button>
            </div>
            <div className="thegarden-modal-content">
              <p>Your hoodie is reserved! We will DM you to coordinate pick up in Marfa.</p>
              <div className="thegarden-modal-actions">
                <button 
                  onClick={() => setShowSuccessModal(false)}
                  className="thegarden-button-primary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer intentionally omitted on The Garden page */}
    </div>
  )
}

export default TheGarden
