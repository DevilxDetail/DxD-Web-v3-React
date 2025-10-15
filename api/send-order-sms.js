const sgMail = require('@sendgrid/mail');

module.exports = async function handler(req, res) {
  console.log('SendGrid SMS function invoked');

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
    const { phoneNumber, orderDetails } = req.body;

    // Validate required fields
    if (!phoneNumber || !orderDetails) {
      return res.status(400).json({ 
        error: 'Missing required fields: phoneNumber and orderDetails' 
      });
    }

    // Set SendGrid API key
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    // Prepare notification message
    const message = `🌿 NEW GARDEN ORDER 🌿\nSize: ${orderDetails.size}\nTwitter: ${orderDetails.twitter}\nOrder ID: ${orderDetails.orderId || 'N/A'}\nTime: ${new Date().toLocaleString()}`;

    // For now, we'll send an email notification since SMS requires additional SendGrid setup
    // To enable actual SMS, you'll need to:
    // 1. Set up SendGrid Messaging API
    // 2. Verify a phone number in SendGrid
    // 3. Replace the email sending with SMS sending code below
    
    const emailMsg = {
      to: process.env.ORDER_NOTIFICATION_EMAIL || 'orders@devilxdetail.com',
      from: 'hello@devilxdetail.com',
      subject: '🌿 New Garden Order Notification',
      text: message,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2d5016;">🌿 New Garden Order</h2>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Size:</strong> ${orderDetails.size}</p>
            <p><strong>Twitter:</strong> ${orderDetails.twitter}</p>
            <p><strong>Order ID:</strong> ${orderDetails.orderId || 'N/A'}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <p style="color: #666; font-size: 14px;">
            This is an automated notification from your Garden order system.
          </p>
        </div>
      `
    };

    // Send email notification
    await sgMail.send(emailMsg);

    console.log(`Order notification sent for: ${orderDetails.twitter}`);
    
    return res.status(200).json({ 
      success: true, 
      message: 'Order notification sent successfully',
      method: 'email' // Indicates we used email instead of SMS
    });

    /* 
    // Uncomment this section when you have SendGrid SMS set up:
    
    // Send SMS using SendGrid Messaging API
    const smsMsg = {
      to: phoneNumber,
      from: process.env.SENDGRID_VERIFIED_PHONE, // Your verified SendGrid phone number
      message: message
    };

    // This would require SendGrid Messaging API setup
    // await sgMail.send(smsMsg);
    
    return res.status(200).json({ 
      success: true, 
      message: 'SMS notification sent successfully',
      method: 'sms'
    });
    */

  } catch (error) {
    console.error('Error sending order notification:', error);
    
    return res.status(500).json({ 
      error: 'Failed to send order notification',
      details: error.message 
    });
  }
};
