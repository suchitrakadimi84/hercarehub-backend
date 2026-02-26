/**
 * One-time script to update admin credentials in the database.
 * Run with: node utils/resetAdminCredentials.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

const NEW_EMAIL = process.env.ADMIN_EMAIL;
const NEW_PASSWORD = process.env.ADMIN_PASSWORD;

async function resetAdmin() {
    if (!NEW_EMAIL || !NEW_PASSWORD) {
        console.error('❌ ADMIN_EMAIL or ADMIN_PASSWORD not set in .env');
        process.exit(1);
    }

    try {
        console.log('🔗 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const hashed = await bcrypt.hash(NEW_PASSWORD, 12);

        // Find any existing admin and update, or create one if none exists
        const result = await Admin.findOneAndUpdate(
            {},                          // match any admin
            {
                email: NEW_EMAIL.toLowerCase(),
                password: hashed,
                name: 'Admin'
            },
            { upsert: true, new: true }  // create if not found
        );

        console.log(`✅ Admin credentials updated successfully!`);
        console.log(`   Email   : ${result.email}`);
        console.log(`   Password: (hashed & saved)`);
    } catch (err) {
        console.error('❌ Error updating admin:', err);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
}

resetAdmin();
