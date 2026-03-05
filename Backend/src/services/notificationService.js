const nodemailer = require('nodemailer');

const notificationService = {
  // Email transporter
  getEmailTransporter: () => {
    if (process.env.EMAIL_HOST && process.env.EMAIL_PORT && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_PORT === '465',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    }
    // Development fallback - log to console
    return {
      sendMail: async (options) => {
        console.log('📧 Email (Dev Mode):', {
          to: options.to,
          subject: options.subject,
          text: options.text,
          attachments: options.attachments ? `[${options.attachments.length} attachments]` : 'None'
        });
        return { messageId: 'dev-' + Date.now() };
      }
    };
  },

  // Send email verification
  sendVerificationEmail: async (email, token, name) => {
    try {
      const transporter = notificationService.getEmailTransporter();
      const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;
      
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'CommerceHub <noreply@commercehub.com>',
        to: email,
        subject: 'Verify Your Email - CommerceHub',
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06); border: 1px solid #e5e7eb;">
            <div style="background: linear-gradient(135deg, #25D366 0%, #1DB954 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">CommerceHub</h1>
            </div>
            <div style="padding: 40px 30px; background: #ffffff;">
              <h2 style="color: #111827; margin-top: 0; font-size: 20px;">Hi ${name},</h2>
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                Welcome to CommerceHub! To complete your registration and start exploring the platform, please verify your email address by clicking the button below.
              </p>
              <div style="text-align: center; margin: 35px 0;">
                <a href="${verificationUrl}" style="background: linear-gradient(135deg, #25D366 0%, #1DB954 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 9999px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 12px rgba(37, 211, 102, 0.25);">
                  Verify Email Address
                </a>
              </div>
              <p style="color: #6b7280; font-size: 14px;">
                Or copy and paste this link into your browser:<br>
                <a href="${verificationUrl}" style="color: #25D366; word-break: break-all; margin-top: 8px; display: inline-block;">${verificationUrl}</a>
              </p>
              <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">
                This link will expire in 24 hours.
              </p>
              <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #f3f4f6;">
                <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                  If you didn't create an account with CommerceHub, you can safely ignore this email.
                </p>
              </div>
            </div>
            <div style="background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 13px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0;">© ${new Date().getFullYear()} CommerceHub. All rights reserved.</p>
            </div>
          </div>
        `,
        text: `Hi ${name},\n\nWelcome to CommerceHub! Please verify your email by clicking the link below:\n\n${verificationUrl}\n\nThis link will expire in 24 hours.\n\nIf you didn't create an account, please ignore this email.`
      };

      const result = await transporter.sendMail(mailOptions);
      console.log('✅ Verification email sent:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('❌ Email send error:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Send password reset email
  sendPasswordResetEmail: async (email, token, name) => {
    try {
      const transporter = notificationService.getEmailTransporter();
      const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;

      const mailOptions = {
        from: process.env.EMAIL_FROM || 'CommerceHub <noreply@commercehub.com>',
        to: email,
        subject: 'Reset Your Password - CommerceHub',
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06); border: 1px solid #e5e7eb;">
            <div style="background: linear-gradient(135deg, #111827 0%, #374151 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">CommerceHub</h1>
            </div>
            <div style="padding: 40px 30px; background: #ffffff;">
              <h2 style="color: #111827; margin-top: 0; font-size: 20px;">Hi ${name},</h2>
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                You recently requested to reset your password for your CommerceHub account. Click the button below to proceed.
              </p>
              <div style="text-align: center; margin: 35px 0;">
                <a href="${resetUrl}" style="background: #111827; color: white; padding: 14px 32px; text-decoration: none; border-radius: 9999px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 12px rgba(17, 24, 39, 0.25);">
                  Reset Password
                </a>
              </div>
              <p style="color: #6b7280; font-size: 14px;">
                Or copy and paste this link into your browser:<br>
                <a href="${resetUrl}" style="color: #111827; word-break: break-all; margin-top: 8px; display: inline-block;">${resetUrl}</a>
              </p>
              <p style="color: #ef4444; font-size: 14px; margin-top: 24px;">
                This password reset link will expire in 10 minutes.
              </p>
              <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #f3f4f6;">
                <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                  If you did not request a password reset, please ignore this email or contact support if you have concerns.
                </p>
              </div>
            </div>
            <div style="background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 13px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0;">© ${new Date().getFullYear()} CommerceHub. All rights reserved.</p>
            </div>
          </div>
        `,
        text: `Hi ${name},\n\nYou requested a password reset. Click the link below to reset your password:\n\n${resetUrl}\n\nThis link will expire in 10 minutes.\n\nIf you did not request this, please ignore this email.`
      };

      const result = await transporter.sendMail(mailOptions);
      console.log('✅ Password reset email sent:', result.messageId);
  // Send WhatsApp message (using Twilio or direct API)
  sendWhatsApp: async (phone, message) => {
    // If Twilio is configured
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_WHATSAPP_NUMBER) {
      try {
        const twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        const result = await twilio.messages.create({
          body: message,
          from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
          to: `whatsapp:${phone}`
        });
        console.log('WhatsApp sent:', result.sid);
        return { success: true, sid: result.sid };
      } catch (error) {
        console.error('WhatsApp send error:', error.message);
        return { success: false, error: error.message };
      }
    }

    // Fallback: Generate WhatsApp link
    const encodedMsg = encodeURIComponent(message);
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const link = `https://wa.me/${cleanPhone}?text=${encodedMsg}`;

    console.log('WhatsApp link generated:', link);
    return { success: true, link, method: 'link' };
  },

  // Order notification templates
  getOrderNotification: (order, type) => {
    const templates = {
      placed: `🛒 *Order Confirmed!*\n\nOrder: ${order.orderNumber}\nTotal: ₹${order.total?.toLocaleString('en-IN')}\nItems: ${order.items?.length || 0}\n\nThank you for your order! We'll notify you when it ships.`,

      confirmed: `✅ *Order Confirmed*\n\nYour order ${order.orderNumber} has been confirmed and is being prepared.\n\nTotal: ₹${order.total?.toLocaleString('en-IN')}`,

      shipped: `📦 *Order Shipped!*\n\nYour order ${order.orderNumber} is on its way!\n${order.trackingNumber ? `Tracking: ${order.trackingNumber}` : ''}\n\nEstimated delivery: 3-5 business days`,

      delivered: `🎉 *Order Delivered!*\n\nYour order ${order.orderNumber} has been delivered.\n\nWe hope you enjoy your purchase! Please leave a review.`,

      cancelled: `❌ *Order Cancelled*\n\nYour order ${order.orderNumber} has been cancelled.\n\nIf you have questions, please contact support.`,
    };

    return templates[type] || templates.placed;
  },

  // Catalog share message
  getCatalogShareMessage: (catalog, tenantName) => {
    return `📋 *${catalog.name}*\n\nCheck out our latest catalog from ${tenantName}!\n\n${catalog.products?.length || 0} products available.\n\nView catalog: ${process.env.CLIENT_URL}/catalog/${catalog.sharing?.shareableLink}`;
  }
};

module.exports = notificationService;