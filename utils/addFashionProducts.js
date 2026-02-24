/**
 * One-time script: Add Fashion category + dress products to an existing database.
 * Run from the backend folder:  node utils/addFashionProducts.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/Category');
const Product = require('../models/Product');

async function run() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Create or find Fashion category
    let fashionCat = await Category.findOne({ slug: 'fashion' });
    if (!fashionCat) {
        fashionCat = await Category.create({
            name: 'Fashion',
            slug: 'fashion',
            description: 'Trendy dresses and fashion wear for women',
            order: 5,
        });
        console.log('✅ Fashion category created');
    } else {
        console.log('ℹ️  Fashion category already exists');
    }

    const fashionDresses = [
        {
            name: 'Floral Wrap Midi Dress',
            description: 'Elegant floral printed wrap midi dress with flutter sleeves, perfect for brunch, parties and casual outings',
            price: 799, originalPrice: 1599,
            category: fashionCat._id, categoryName: 'Fashion',
            meeshoLink: 'https://www.meesho.com/floral-wrap-midi-dress/p/13',
            isFeatured: true, isTrending: true, badge: 'Trending', rating: 4.7, order: 1,
            images: ['https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=500'],
            tags: ['dress', 'floral', 'midi', 'wrap'],
        },
        {
            name: 'Black Bodycon Dress',
            description: 'Sleek black bodycon dress with off-shoulder neckline, ideal for evening events and parties',
            price: 699, originalPrice: 1399,
            category: fashionCat._id, categoryName: 'Fashion',
            meeshoLink: 'https://www.meesho.com/black-bodycon-dress/p/14',
            isFeatured: true, isTrending: true, badge: 'Hot', rating: 4.8, order: 2,
            images: ['https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=500'],
            tags: ['dress', 'black', 'bodycon', 'party'],
        },
        {
            name: 'Boho Maxi Sundress',
            description: 'Breezy bohemian maxi sundress with ethnic prints and adjustable straps, great for beach and vacation',
            price: 899, originalPrice: 1799,
            category: fashionCat._id, categoryName: 'Fashion',
            meeshoLink: 'https://www.meesho.com/boho-maxi-sundress/p/15',
            isFeatured: true, isTrending: false, badge: 'New', rating: 4.6, order: 3,
            images: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500'],
            tags: ['dress', 'maxi', 'boho', 'sundress'],
        },
        {
            name: 'Pastel A-Line Dress',
            description: 'Soft pastel A-line dress with lace trim and puff sleeves, a feminine must-have for any wardrobe',
            price: 649, originalPrice: 1299,
            category: fashionCat._id, categoryName: 'Fashion',
            meeshoLink: 'https://www.meesho.com/pastel-aline-dress/p/16',
            isFeatured: false, isTrending: true, badge: 'Sale', rating: 4.5, order: 4,
            images: ['https://images.unsplash.com/photo-1495385794356-15371f348c31?w=500'],
            tags: ['dress', 'pastel', 'aline', 'lace'],
        },
        {
            name: 'Dungaree Denim Dress',
            description: 'Casual denim dungaree dress with adjustable straps and front pockets, effortlessly stylish',
            price: 549, originalPrice: 1099,
            category: fashionCat._id, categoryName: 'Fashion',
            meeshoLink: 'https://www.meesho.com/dungaree-denim-dress/p/17',
            isFeatured: false, isTrending: true, badge: '', rating: 4.4, order: 5,
            images: ['https://images.unsplash.com/photo-1554412933-514a83d2f3c8?w=500'],
            tags: ['dress', 'denim', 'dungaree', 'casual'],
        },
        {
            name: 'Ethnic Print Shirt Dress',
            description: 'Vibrant ethnic block-print shirt dress with a relaxed fit and wooden-button front, kurta-meets-dress style',
            price: 749, originalPrice: 1499,
            category: fashionCat._id, categoryName: 'Fashion',
            meeshoLink: 'https://www.meesho.com/ethnic-shirt-dress/p/18',
            isFeatured: true, isTrending: false, badge: 'New', rating: 4.6, order: 6,
            images: ['https://images.unsplash.com/photo-1583744946564-b52d01a7b321?w=500'],
            tags: ['dress', 'ethnic', 'print', 'shirt dress'],
        },
        {
            name: 'Ruffle Hem Party Dress',
            description: 'Chic ruffle-hem mini dress in rich wine colour, perfect for cocktail nights and festivities',
            price: 849, originalPrice: 1699,
            category: fashionCat._id, categoryName: 'Fashion',
            meeshoLink: 'https://www.meesho.com/ruffle-party-dress/p/19',
            isFeatured: true, isTrending: true, badge: 'Hot', rating: 4.7, order: 7,
            images: ['https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=500'],
            tags: ['dress', 'ruffle', 'party', 'mini'],
        },
        {
            name: 'Co-ord Set Dress',
            description: 'Trendy matching co-ord set with a crop top and flared skirt in geometric print, complete the look effortlessly',
            price: 999, originalPrice: 1999,
            category: fashionCat._id, categoryName: 'Fashion',
            meeshoLink: 'https://www.meesho.com/coord-set-dress/p/20',
            isFeatured: true, isTrending: true, badge: 'Trending', rating: 4.8, order: 8,
            images: ['https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=500'],
            tags: ['dress', 'co-ord', 'set', 'crop top'],
        },
    ];

    // Avoid duplicate inserts
    let inserted = 0;
    for (const dress of fashionDresses) {
        const exists = await Product.findOne({ name: dress.name, categoryName: 'Fashion' });
        if (!exists) {
            await Product.create(dress);
            inserted++;
            console.log(`  ➕ Added: ${dress.name}`);
        } else {
            console.log(`  ⏭️  Skipped (already exists): ${dress.name}`);
        }
    }

    console.log(`\n✅ Done! ${inserted} new Fashion products added.`);
    await mongoose.disconnect();
}

run().catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
});
