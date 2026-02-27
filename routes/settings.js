const express = require('express');
const router = express.Router();
const SiteSettings = require('../models/SiteSettings');
const auth = require('../middleware/auth');

// GET /api/settings — Public (used by frontend for WhatsApp button & contact info)
router.get('/', async (req, res) => {
    try {
        let settings = await SiteSettings.findOne({ key: 'main' });
        if (!settings) {
            // Auto-create with defaults
            settings = await SiteSettings.create({ key: 'main' });
        }
        res.json(settings);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /api/settings — Admin only
router.put('/', auth, async (req, res) => {
    try {
        const { whatsappNumber, phone, email, address, whatsappEnabled } = req.body;
        const updateData = {};
        if (whatsappNumber !== undefined) updateData.whatsappNumber = whatsappNumber;
        if (phone !== undefined) updateData.phone = phone;
        if (email !== undefined) updateData.email = email;
        if (address !== undefined) updateData.address = address;
        if (whatsappEnabled !== undefined) updateData.whatsappEnabled = whatsappEnabled;

        const settings = await SiteSettings.findOneAndUpdate(
            { key: 'main' },
            updateData,
            { new: true, upsert: true }
        );
        res.json(settings);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
