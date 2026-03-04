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
        from: process.env.EMAIL_FROM || 'NextGen B2B <noreply@nextgen.com>',
        to: email,
        subject: 'Verify Your Email - NextGen B2B',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0;">Welcome to NextGen B2B!</h1>
            </div>
            <div style="padding: 40px 30px; background: #f9fafb;">
              <h2 style="color: #1f2937; margin-top: 0;">Hi ${name},</h2>
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                Thank you for registering with NextGen B2B! To complete your registration and start managing your business, please verify your email address.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                  Verify Email Address
                </a>
              </div>
              <p style="color: #6b7280; font-size: 14px;">
                Or copy and paste this link in your browser:<br>
                <a href="${verificationUrl}" style="color: #667eea; word-break: break-all;">${verificationUrl}</a>
              </p>
              <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                This link will expire in 24 hours.
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin-top: 30px;">
                If you didn't create an account with NextGen B2B, please ignore this email.
              </p>
            </div>
            <div style="background: #1f2937; padding: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
              <p style="margin: 0;">© ${new Date().getFullYear()} NextGen B2B. All rights reserved.</p>
            </div>
          </div>
        `,
        text: `Hi ${name},\n\nThank you for registering with NextGen B2B! Please verify your email by clicking the link below:\n\n${verificationUrl}\n\nThis link will expire in 24 hours.\n\nIf you didn't create an account, please ignore this email.`
      };

      const result = await transporter.sendMail(mailOptions);
      console.log('✅ Verification email sent:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('❌ Email send error:', error.message);
      return { success: false, error: error.message };
    }
  },

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