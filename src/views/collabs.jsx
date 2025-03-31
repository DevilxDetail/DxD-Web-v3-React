import React, { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import Header from '../components/header'
import CenterText from '../components/center-text'
import ConsistentFooter from '../components/ConsistentFooter'
import './collabs.css'

const Collabs = (props) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const collabQuestions = [
    {
      question: 'Art Blocks',
      answer: 'Art Blocks is a generative art platform that pioneered the on-chain art movement. We collaborated with them to bring our vision of digital fashion to life through generative art.'
    },
    {
      question: 'Bright Moments',
      answer: 'Bright Moments is a Web3 cultural center and NFT art gallery. Our collaboration focused on bridging the gap between digital art and physical fashion.'
    },
    {
      question: 'PROOF Collective',
      answer: 'PROOF Collective is an exclusive community of NFT collectors and artists. Together, we explored innovative ways to merge high-end fashion with digital collectibles.'
    },
    // Add more collaborations as needed
  ];

  return (
    <div className="collabs-container">
      <Helmet>
        <title>DxD - Collabs</title>
        <meta name="description" content="Culturally inspired, digitally integrated apparel and goods" />
        <meta property="og:title" content="DxD - Collabs" />
      </Helmet>
      <div className="collabs-container1">
        <div className="collabs-faq">
          <span className="collabs-text">Collaborations</span>
          {collabQuestions.map((item, index) => (
            <div
              key={index}
              className="collabs-question-container"
              onClick={() => toggleQuestion(index)}
            >
              <div className="collabs-question">
                <span className="collabs-header">{item.question}</span>
                <div className="collabs-icon-container">
                  <img
                    alt="image"
                    src="/arrow.svg"
                    className={`collabs-icon ${openIndex === index ? 'rotate' : ''}`}
                  />
                </div>
              </div>
              <span className={`collabs-answer ${openIndex === index ? 'show' : ''}`}>
                {item.answer}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Collabs
