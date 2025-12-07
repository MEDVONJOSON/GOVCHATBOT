const axios = require('axios');
require('dotenv').config();

// Send WhatsApp alert via Meta API
const sendWhatsAppAlert = async (phoneNumber, alertMessage) => {
    try {
        const phoneNumberId = process.env.META_WA_PHONE_NUMBER_ID;
        const accessToken = process.env.META_WA_ACCESS_TOKEN;

        if (!accessToken || !phoneNumberId) {
            console.error('WhatsApp credentials not configured');
            return false;
        }

        await axios({
            method: 'POST',
            url: `https://graph.facebook.com/v17.0/${phoneNumberId}/messages`,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            data: {
                messaging_product: 'whatsapp',
                to: phoneNumber,
                text: { body: alertMessage },
            },
        });

        return true;
    } catch (error) {
        console.error('WhatsApp send error:', error.response ? error.response.data : error.message);
        return false;
    }
};

// Send SMS alert via Twilio
const sendSMSAlert = async (phoneNumber, alertMessage) => {
    try {
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const fromNumber = process.env.TWILIO_PHONE_NUMBER;

        if (!accountSid || !authToken || !fromNumber) {
            console.error('Twilio credentials not configured');
            return false;
        }

        const twilio = require('twilio')(accountSid, authToken);

        await twilio.messages.create({
            body: alertMessage,
            from: fromNumber,
            to: phoneNumber
        });

        return true;
    } catch (error) {
        console.error('SMS send error:', error.message);
        return false;
    }
};

// Send Email alert
const sendEmailAlert = async (email, subject, alertMessage) => {
    try {
        const nodemailer = require('nodemailer');

        // Configure email transporter (using Gmail as example)
        const transporter = nodemailer.createTransporter({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER || 'alerts@gov.sl',
            to: email,
            subject: subject,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #1e5631;">Sierra Leone Government Alert</h2>
                    <div style="background: #f5f5f5; padding: 20px; border-left: 4px solid #1e5631;">
                        ${alertMessage}
                    </div>
                    <p style="color: #666; font-size: 12px; margin-top: 20px;">
                        This is an official government notification. Do not reply to this email.
                    </p>
                </div>
            `
        });

        return true;
    } catch (error) {
        console.error('Email send error:', error.message);
        return false;
    }
};

module.exports = {
    sendWhatsAppAlert,
    sendSMSAlert,
    sendEmailAlert
};
