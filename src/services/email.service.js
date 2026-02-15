import "dotenv/config";
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Function to send email
export const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Govt. Services Management" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export const sendRegistrationEmail = async function(userEmail, userName){
  const subject = "Welcome to Govt. Services Management!";
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #222;">
      <h2 style="margin-bottom: 8px;">Hello ${userName},</h2>
      <p style="margin: 0 0 10px 0;">
        Thanks for consulting <strong>Govt. Services Management</strong>.
      </p>
      <p style="margin: 0 0 10px 0;">
        You can now request any service or give any feedbacks to us.
      </p>
      <p style="margin: 18px 0 0 0;">
        Best regards,<br/>
        <strong>Govt. Services Management Team.</strong>
      </p>
    </div>
  `;
  const text = `
  Hello Sri/Srimati ${userName},

  Thank you for registering at Govt. Services Management.
  You can now securely track and manage all your transactions in one place.

  Best regards,
  The Govt. Services Management Team.
  (Registered email: ${userEmail})
  `;
  await sendEmail(userEmail, subject, text, html);
}

