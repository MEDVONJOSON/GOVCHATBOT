const express = require('express');
const router = express.Router();
const axios = require('axios');
const { processMessage } = require('../utils/aiHelper');

// Meta WhatsApp Webhook Verification
router.get('/', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === process.env.META_WA_VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});

// Handle Incoming Messages
router.post('/', async (req, res) => {
    const body = req.body;

    if (body.object) {
        if (
            body.entry &&
            body.entry[0].changes &&
            body.entry[0].changes[0].value.messages &&
            body.entry[0].changes[0].value.messages[0]
        ) {
            const phone_number_id = body.entry[0].changes[0].value.metadata.phone_number_id;
            const from = body.entry[0].changes[0].value.messages[0].from;
            const msg_body = body.entry[0].changes[0].value.messages[0].text.body;

            console.log(`Received message from ${from}: ${msg_body}`);

            try {
                // Process message with AI
                const botResponse = await processMessage(msg_body);

                // Send response via Meta API
                await axios({
                    method: 'POST',
                    url: `https://graph.facebook.com/v17.0/${phone_number_id}/messages`,
                    headers: {
                        'Authorization': `Bearer ${process.env.META_WA_ACCESS_TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                    data: {
                        messaging_product: 'whatsapp',
                        to: from,
                        text: { body: botResponse },
                    },
                });
            } catch (error) {
                console.error('Error processing/sending message:', error.response ? error.response.data : error.message);

                // Send fallback response even if AI or Meta API fails
                try {
                    await axios({
                        method: 'POST',
                        url: `https://graph.facebook.com/v17.0/${phone_number_id}/messages`,
                        headers: {
                            'Authorization': `Bearer ${process.env.META_WA_ACCESS_TOKEN}`,
                            'Content-Type': 'application/json',
                        },
                        data: {
                            messaging_product: 'whatsapp',
                            to: from,
                            text: { body: "Hello! I'm the Truth Engine. I'm currently experiencing technical difficulties with my AI services, but I'm here and working on it!" },
                        },
                    });
                } catch (fallbackError) {
                    console.error('Fallback response also failed:', fallbackError.response ? fallbackError.response.data : fallbackError.message);
                }
            }
        }
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
});

module.exports = router;
