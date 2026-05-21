// Converted from feedback.py
// Netlify Function: Handle feedback submissions
// Saves to dist/data/feedback.json and sends email

const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

// Configuration from environment variables
const FEEDBACK_EMAIL_TO = process.env.FEEDBACK_EMAIL_TO || 'mohaddesehbadpa0@gmail.com';
const EMAIL_FROM = process.env.EMAIL_FROM || 'no-reply@gulzameen.app';
const SMTP_SERVER = process.env.EMAIL_SMTP_SERVER || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.EMAIL_SMTP_PORT || '587');
const SMTP_USER = process.env.EMAIL_SMTP_USER;
const SMTP_PASSWORD = process.env.EMAIL_SMTP_PASSWORD;

async function sendFeedbackEmail(name, feedbackText) {
  /**Send a feedback notification email with the user's name and feedback.*/
  if (!SMTP_USER || !SMTP_PASSWORD) {
    throw new Error('SMTP credentials are not configured.');
  }
  
  const transporter = nodemailer.createTransport({
    host: SMTP_SERVER,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD
    }
  });
  
  const subject = `New Feedback from ${name || 'Anonymous'}`;
  const body = `Name: ${name || 'Anonymous'}\n\nFeedback:\n${feedbackText}\n\nSubmitted: ${new Date().toISOString().replace('T', ' ').split('.')[0]} UTC`;
  
  await transporter.sendMail({
    from: EMAIL_FROM,
    to: FEEDBACK_EMAIL_TO,
    subject: subject,
    text: body
  });
}

exports.handler = async (event, context) => {
  // Handle feedback POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }
  
  try {
    const body = JSON.parse(event.body || '{}');
    const name = (body.name || 'Anonymous').trim();
    const feedbackText = (body.feedback || '').trim();
    
    if (!feedbackText) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Feedback cannot be empty' })
      };
    }
    
    // Create feedback entry
    const entry = {
      name,
      feedback: feedbackText,
      timestamp: new Date().toISOString().replace('T', ' ').split('.')[0] + ' UTC'
    };
    
    // Save to file
    const dataDir = path.join(__dirname, '../../dist/data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    const feedbackFile = path.join(dataDir, 'feedback.json');
    
    let feedbacks = [];
    if (fs.existsSync(feedbackFile)) {
      const fileContent = fs.readFileSync(feedbackFile, 'utf-8');
      feedbacks = JSON.parse(fileContent);
    }
    
    feedbacks.unshift(entry);
    
    fs.writeFileSync(feedbackFile, JSON.stringify(feedbacks, null, 2), 'utf-8');
    
    // Send email notification
    try {
      await sendFeedbackEmail(name, feedbackText);
    } catch (emailError) {
      console.warn('Email notification failed, but feedback was saved:', emailError);
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Feedback saved and emailed!' })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
