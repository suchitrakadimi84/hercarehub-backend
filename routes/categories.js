const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const auth = require('../middleware/auth');

// GET /api/categories - Public
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find().sort({ order: 1, createdAt: 1 });
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/categories - Admin only
router.post('/', auth, async (req, res) => {
    try {
        const { name, description, image, order } = req.body;
        const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        const existing = await Category.findOne({ slug });
        if (existing) return res.status(400).json({ message: 'Category already exists' });

        const category = new Category({ name, slug, description, image, order: order || 0 });
        await category.save();
        res.status(201).json(category);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /api/categories/:id - Admin only
router.put('/:id', auth, async (req, res) => {
    try {
        const { name, description, image, order } = req.body;
        const updateData = { description, image, order };
        if (name) {
            updateData.name = name;
            updateData.slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        }
        const category = await Category.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.json(category);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE /api/categories/:id - Admin only
router.delete('/:id', auth, async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.json({ message: 'Category deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
