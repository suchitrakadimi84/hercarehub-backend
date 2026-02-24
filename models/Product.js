const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number, default: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    categoryName: { type: String, required: true },
    images: [{ type: String }],
    meeshoLink: { type: String, required: true },
    tags: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    inStock: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    badge: { type: String, default: '' }, // 'New', 'Hot', 'Sale', etc.
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
