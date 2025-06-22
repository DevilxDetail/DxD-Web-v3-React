import React from 'react';
import './ny25.css';

const NY25 = () => {
    return (
        <div className="ny25-page">
            <video autoPlay muted loop id="bg-vid">
                <source src="/bkgrd-vid.MP4" type="video/mp4" />
            </video>
            <div className="video-overlay"></div>
             <a href="/" className="top-right-logo-container" target="_blank" rel="noopener noreferrer">
                <img src="/icon-white-200h.png" alt="Logo" className="top-right-logo" />
            </a>
            <div className="ny25-content">

                <img src="/ny25-header.png" alt="NY25 Header" className="ny25-header-image" />

                <p className="ny25-text">
                    So happy we got to connect in NY!
                </p>
                <p className="ny25-text">
                    This token grants you access to the presale list and a chance to win BOTH of our upcoming drops.
                </p>
                <p className="ny25-text">
                    Check out each artist's page to enter.
                </p>

                <div className="artist-profiles">
                    <a href="/liv" className="profile" target="_blank" rel="noopener noreferrer">
                        <img src="/liv-pfp.png" alt="Olivia Pedi" className="profile-pic" />
                        <p>@oliviapedi</p>
                    </a>
                    <a href="/dk" className="profile" target="_blank" rel="noopener noreferrer">
                        <img src="/dk-pfp.png" alt="Daniel Koeth" className="profile-pic" />
                        <p>@danielkoeth</p>
                    </a>
                </div>

                <p className="ny25-text follow-text">
                    Make sure you are following <a href="https://www.instagram.com/devilxdetail" target="_blank" rel="noopener noreferrer">@devilxdetail</a>
                </p>
            </div>
        </div>
    );
};

export default NY25; 