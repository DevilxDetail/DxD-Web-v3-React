import React, { Fragment, useState } from 'react'
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { Helmet } from 'react-helmet'
import Web3 from 'web3';

import Header from '../components/header'
import CenterText from '../components/center-text'
import ConsistentFooter from '../components/ConsistentFooter'
import './drop.css'

// Sepolia chain ID
const SEPOLIA_CHAIN_ID = 11155111;

const Drop = (props) => {
  const { login, authenticated, user } = usePrivy();
  const { wallets } = useWallets();
  const [mintLoading, setMintLoading] = useState(false);
  const [mintStatus, setMintStatus] = useState('');

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

        // Retrieve the first linked (non-embedded) wallet from Privy
        const linkedWallet = wallets?.find((w) => !w.isEmbedded);
        if (!linkedWallet) {
          throw new Error("No linked external wallet found");
        }

        const provider = await linkedWallet.getEthereumProvider();
        const web3 = new Web3(provider);
        const userAddress = linkedWallet.address;
        console.log("Connected wallet address:", userAddress);

        // Ensure wallet is on Sepolia
        try {
          const currentChainId = await web3.eth.getChainId();
          if (currentChainId !== SEPOLIA_CHAIN_ID) {
            try {
              await linkedWallet.switchChain(SEPOLIA_CHAIN_ID);
            } catch (switchErr) {
              console.error('Failed to switch chain:', switchErr);
              setMintStatus('error');
              setMintLoading(false);
              return;
            }
          }
        } catch (chainErr) {
          console.error('Unable to get chainId', chainErr);
        }

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

        // Define claim parameters
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

          // Send transaction
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

  return (
    <div className="drop-container1">
      <Helmet>
        <title>DxD - Drop</title>
        <meta name="description" content="Culturally inspired, digitally integrated apparel and goods" />
        
        {/* Essential OG Tags */}
        <meta property="og:title" content="DxD - Drop" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://devilxdetail.com/drop" />
        <meta property="og:image" content="https://devilxdetail.com/alpha_thumbnail.jpg" />
        <meta property="og:image:secure_url" content="https://devilxdetail.com/alpha_thumbnail.jpg" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Devil x Detail Drop 2024" />
        <meta property="og:description" content="Culturally inspired, digitally integrated apparel and goods" />
        <meta property="og:site_name" content="Devil x Detail" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@devilxdetail" />
        <meta name="twitter:title" content="DxD - Drop" />
        <meta name="twitter:description" content="Culturally inspired, digitally integrated apparel and goods" />
        <meta name="twitter:image" content="https://devilxdetail.com/alpha_thumbnail.jpg" />
        <meta name="twitter:image:alt" content="Devil x Detail Drop 2024" />
      </Helmet>
      <Header
        text={
          <Fragment>
            <span className="drop-text10">About DxD</span>
          </Fragment>
        }
        iconBlackSrc="/icon%20-%20black-200h.png"
        rootClassName="header-root-class-name6"
      />
      <div className="drop-container2">
        <div className="drop-container3">
          <img
            alt="image"
            src="/instc%202025-02-10%20203658.858-800w.png"
            className="drop-image1"
          />
          <img
            alt="image"
            src="/instc%202025-02-10%20203700.949-900w.png"
            className="drop-image2"
          />
          <img
            alt="image"
            src="/instc%202025-02-10%20203700.470-800w.png"
            className="drop-image3"
          />
        </div>
        <CenterText
          text={
            <Fragment>
              <span className="drop-text17">Drop 2024</span>
            </Fragment>
          }
          rootClassName="center-textroot-class-name4"
        />
        <div className="drop-container4">
          <span className="drop-text18">
            <span>
              For anyone who's experienced Art Blocks Weekend in Marfa, Texas,
              no explanation is needed... it's pure magic. Imagine spending a
              long weekend in a small, art-focused town, surrounded by a couple
              hundred of your closest digital friends from all over the world.
              Our first taste of it was in 2023, and heading into 2024, we knew
              we wanted to contribute to what makes this event so special.
            </span>
            <br></br>
            <br></br>
            <span>
              We teamed up with our friends at Shillr to host a Vibe Sesh on
              Friday afternoon. We took over The Otherside, a bar tucked behind
              Glitch Gallery, and created a space filled with music,
              conversation, cocktails, and exclusive, limited-edition Marfa-only
              Devil x Detail merch. Thinking back to that day still gives us
              chills... the energy, the connections, the people who made it
              unforgettable.
            </span>
            <br></br>
            <br></br>
            <span>
              This event embodied exactly why Devil x Detail exists. It's about
              bringing together incredibly talented, creative, and intentional
              people. When we talk about blending the digital and physical,
              we're not just referring to our clothing. It's about creating real
              bridges, through art, conversations, and a whole lot of hugs.
            </span>
          </span>
        </div>
        <div className="drop-mint-container">
          <button 
            type="button" 
            className={`drop-mint-button ${mintLoading ? 'saving' : ''}`}
            onClick={handleMint}
            disabled={mintLoading}
          >
            {mintLoading ? 'CONNECTING...' : 'MINT'}
          </button>
          {mintStatus === 'success' && (
            <div className="drop-success-message">Wallet connected successfully!</div>
          )}
          {mintStatus === 'error' && (
            <div className="drop-error-message">Failed to connect wallet. Please try again.</div>
          )}
        </div>
        <div className="drop-container5">
          <img
            alt="image"
            src="/instc%202025-02-10%20203822.019-800w.png"
            className="drop-image4"
          />
          <img
            alt="image"
            src="/instc%202025-02-10%20203825.076-500w.png"
            className="drop-image5"
          />
          <img
            alt="image"
            src="/instc%202025-02-10%20203823.535-800w.png"
            className="drop-image6"
          />
        </div>
        <div className="drop-container6">
          <img
            alt="image"
            src="/instc%202025-02-10%20203822.777-800w.png"
            className="drop-image7"
          />
          <img
            alt="image"
            src="/instc%202025-02-10%20203824.306-800w.png"
            className="drop-image8"
          />
          <img
            alt="image"
            src="/instc%202025-02-10%20203826.358-800w.png"
            className="drop-image9"
          />
        </div>
      </div>
      <ConsistentFooter />
    </div>
  )
}

export default Drop 