const mongoose = require('mongoose');

const SiteSettingsSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true, default: 'main' },
    whatsappNumber: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: 'contact@hercarehub.in' },
    address: { type: String, default: 'Wadala Junction, Pratiksha Nagar,\nMumbai, Maharashtra\nPincode 400022, India' },
    whatsappEnabled: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('SiteSettings', SiteSettingsSchema);
