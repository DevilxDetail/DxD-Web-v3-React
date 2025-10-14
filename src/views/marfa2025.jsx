import React from 'react'
import { Helmet } from 'react-helmet'
import './marfa2025.css'

const Marfa2025 = () => {
  return (
    <div className="marfa2025-container">
      <Helmet>
        <title>DxD - Marfa 2025 Limited Edition</title>
        <meta name="description" content="Claim your Limited Edition Marfa 2025 Tee" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        
        {/* Essential OG Tags */}
        <meta property="og:title" content="DxD - Marfa 2025 Limited Edition" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://devilxdetail.com/marfa2025" />
        <meta property="og:image" content="https://devilxdetail.com/marfa2025-header.png" />
        <meta property="og:description" content="Claim your Limited Edition Marfa 2025 Tee" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="DxD - Marfa 2025 Limited Edition" />
        <meta name="twitter:description" content="Claim your Limited Edition Marfa 2025 Tee" />
        <meta name="twitter:image" content="https://devilxdetail.com/marfa2025-header.png" />
      </Helmet>
      
      <div className="marfa2025-background">
        <video 
          className="marfa2025-video"
          autoPlay 
          loop 
          muted 
          playsInline
        >
          <source src="/IMG_5569.MOV" type="video/mp4" />
        </video>
        
        <div className="marfa2025-content">
          <div className="marfa2025-main-content">
            {/* Hero Section */}
            <div className="marfa2025-hero">
              <h1 className="marfa2025-hero-text">Congratulations!</h1>
              <h2 className="marfa2025-hero-subtitle">The Limited Edition Marfa 2025 Tee is Yours</h2>
              <img 
                src="/Marfa 2025 Shirt Glow.png" 
                alt="Marfa 2025 Shirt" 
                className="marfa2025-shirt-image"
              />
            </div>
            
            {/* Description Section */}
            <div className="marfa2025-description">
              <p className="marfa2025-hero-subtitle">To claim:</p>
              <p className="marfa2025-description-text">
                DM <a 
                  href="https://x.com/devilxdetail" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="marfa2025-link"
                >
                  @devilxdetail
                </a> with a picture of the charm you found and your preferred size.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Marfa2025
