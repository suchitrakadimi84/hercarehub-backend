const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

module.exports = async function seedAdmin() {
    try {
        const adminEmail = (process.env.ADMIN_EMAIL || '').toLowerCase();
        const existing = await Admin.findOne({ email: adminEmail });
        if (!existing) {
            const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 12);
            await Admin.create({ email: adminEmail, password: hashed, name: 'Admin' });
            console.log('✅ Admin user seeded');
        }
    } catch (err) {
        console.error('Admin seed error:', err);
    }
};
