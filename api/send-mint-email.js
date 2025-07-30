const sgMail = require('@sendgrid/mail');

module.exports = async function handler(req, res) {
  console.log('SendGrid function invoked');

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  // Set CORS header for actual response
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userEmail, mintDetails } = req.body;

    // Validate required fields
    if (!userEmail || !mintDetails) {
      return res.status(400).json({ 
        error: 'Missing required fields: userEmail and mintDetails' 
      });
    }

    // Set SendGrid API key
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    // Prepare email data
    const msg = {
      to: userEmail,
      from: 'hello@devilxdetail.com',
      templateId: 'd-759bfd57d96c40bab6aea84d9f71db60',
      dynamicTemplateData: {
        user_email: userEmail,
        mint_date: new Date().toLocaleDateString(),
        mint_time: new Date().toLocaleTimeString(),
        transaction_hash: mintDetails.transactionHash || 'N/A',
        wallet_address: mintDetails.walletAddress || 'N/A',
        collection_name: mintDetails.collectionName || 'Blue Skies Forever',
        size: mintDetails.size || 'N/A'
      }
    };

    // Send email
    await sgMail.send(msg);

    console.log(`Mint confirmation email sent to: ${userEmail}`);
    
    return res.status(200).json({ 
      success: true, 
      message: 'Mint confirmation email sent successfully' 
    });

  } catch (error) {
    console.error('Error sending mint confirmation email:', error);
    
    return res.status(500).json({ 
      error: 'Failed to send mint confirmation email',
      details: error.message 
    });
  }
}; 