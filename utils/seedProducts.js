const Category = require('../models/Category');
const Product = require('../models/Product');

module.exports = async function seedProducts() {
    try {
        const count = await Product.countDocuments();
        if (count > 0) return;

        // Create categories
        const cats = [
            { name: 'Sarees', slug: 'sarees', description: 'Beautiful Indian sarees', order: 1 },
            { name: 'Bridal Jewellery', slug: 'bridal-jewellery', description: 'Stunning bridal jewellery sets', order: 2 },
            { name: 'Daily Wear Jewellery', slug: 'daily-wear-jewellery', description: 'Elegant everyday jewellery', order: 3 },
            { name: 'Ethnic Sets', slug: 'ethnic-sets', description: 'Coordinated ethnic wear sets', order: 4 },
        ];

        const createdCats = {};
        for (const cat of cats) {
            const existing = await Category.findOne({ slug: cat.slug });
            createdCats[cat.slug] = existing || await Category.create(cat);
        }

        // Sample products with Meesho placeholder links
        const products = [
            // Sarees
            { name: 'Kanjivaram Silk Saree', description: 'Pure Kanjivaram silk saree with zari border, perfect for weddings and festivals', price: 1299, originalPrice: 2499, category: createdCats['sarees']._id, categoryName: 'Sarees', meeshoLink: 'https://www.meesho.com/kanjivaram-silk-saree/p/1', isFeatured: true, isTrending: true, badge: 'Hot', rating: 4.8, order: 1, images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500'], tags: ['silk', 'wedding', 'kanjivaram'] },
            { name: 'Banarasi Georgette Saree', description: 'Gorgeous Banarasi georgette saree with intricate floral embroidery', price: 899, originalPrice: 1799, category: createdCats['sarees']._id, categoryName: 'Sarees', meeshoLink: 'https://www.meesho.com/banarasi-georgette-saree/p/2', isFeatured: true, isTrending: false, badge: 'New', rating: 4.6, order: 2, images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500'], tags: ['banarasi', 'georgette', 'embroidery'] },
            { name: 'Chiffon Printed Saree', description: 'Lightweight chiffon saree with modern floral prints, ideal for casual occasions', price: 499, originalPrice: 999, category: createdCats['sarees']._id, categoryName: 'Sarees', meeshoLink: 'https://www.meesho.com/chiffon-printed-saree/p/3', isFeatured: false, isTrending: true, badge: 'Sale', rating: 4.4, order: 3, images: ['https://images.unsplash.com/photo-1594938298603-c8148e30e7a1?w=500'], tags: ['chiffon', 'casual', 'printed'] },
            { name: 'Linen Cotton Saree', description: 'Handwoven linen cotton saree with natural dyeing, eco-friendly and comfortable', price: 699, originalPrice: 1299, category: createdCats['sarees']._id, categoryName: 'Sarees', meeshoLink: 'https://www.meesho.com/linen-cotton-saree/p/4', isFeatured: false, isTrending: true, badge: '', rating: 4.5, order: 4, images: ['https://images.unsplash.com/photo-1606293459339-2e05cf5c3e16?w=500'], tags: ['linen', 'cotton', 'handwoven'] },

            // Bridal Jewellery
            { name: 'Kundan Bridal Set', description: 'Royal Kundan necklace set with matching earrings and maang tikka for brides', price: 1899, originalPrice: 3499, category: createdCats['bridal-jewellery']._id, categoryName: 'Bridal Jewellery', meeshoLink: 'https://www.meesho.com/kundan-bridal-set/p/5', isFeatured: true, isTrending: true, badge: 'Hot', rating: 4.9, order: 1, images: ['https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=500'], tags: ['kundan', 'bridal', 'necklace'] },
            { name: 'Polki Diamond Necklace', description: 'Uncut Polki diamond necklace with 22k gold plating, heirloom quality', price: 2499, originalPrice: 4999, category: createdCats['bridal-jewellery']._id, categoryName: 'Bridal Jewellery', meeshoLink: 'https://www.meesho.com/polki-diamond-necklace/p/6', isFeatured: true, isTrending: false, badge: 'Premium', rating: 4.9, order: 2, images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500'], tags: ['polki', 'diamond', 'gold'] },
            { name: 'Temple Jewelry Set', description: 'Traditional South Indian temple jewellery set with antique gold finish', price: 1599, originalPrice: 2999, category: createdCats['bridal-jewellery']._id, categoryName: 'Bridal Jewellery', meeshoLink: 'https://www.meesho.com/temple-jewelry-set/p/7', isFeatured: false, isTrending: true, badge: 'New', rating: 4.7, order: 3, images: ['https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=500'], tags: ['temple', 'traditional', 'antique'] },

            // Daily Wear Jewellery
            { name: 'Rose Gold Hoop Earrings', description: 'Delicate rose gold hoop earrings, perfect for everyday elegance', price: 299, originalPrice: 599, category: createdCats['daily-wear-jewellery']._id, categoryName: 'Daily Wear Jewellery', meeshoLink: 'https://www.meesho.com/rose-gold-hoops/p/8', isFeatured: true, isTrending: true, badge: 'New', rating: 4.6, order: 1, images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500'], tags: ['rose gold', 'hoops', 'earrings'] },
            { name: 'Pearl Drop Necklace', description: 'Freshwater pearl drop necklace with 925 silver chain, minimalist and chic', price: 449, originalPrice: 899, category: createdCats['daily-wear-jewellery']._id, categoryName: 'Daily Wear Jewellery', meeshoLink: 'https://www.meesho.com/pearl-drop-necklace/p/9', isFeatured: true, isTrending: false, badge: '', rating: 4.5, order: 2, images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500'], tags: ['pearl', 'necklace', 'silver'] },
            { name: 'Boho Stack Bangles', description: 'Set of 6 oxidized silver bangles with intricate tribal patterns', price: 199, originalPrice: 399, category: createdCats['daily-wear-jewellery']._id, categoryName: 'Daily Wear Jewellery', meeshoLink: 'https://www.meesho.com/boho-bangles/p/10', isFeatured: false, isTrending: true, badge: 'Sale', rating: 4.3, order: 3, images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500'], tags: ['bangles', 'oxidized', 'boho'] },

            // Ethnic Sets
            { name: 'Embroidered Salwar Kameez', description: 'Elegant embroidered salwar kameez with dupatta, festive wear', price: 1099, originalPrice: 2199, category: createdCats['ethnic-sets']._id, categoryName: 'Ethnic Sets', meeshoLink: 'https://www.meesho.com/embroidered-salwar-kameez/p/11', isFeatured: true, isTrending: false, badge: 'New', rating: 4.6, order: 1, images: ['https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=500'], tags: ['salwar', 'embroidered', 'festive'] },
            { name: 'Anarkali Suit Set', description: 'Flowy Anarkali suit with intricate zari work and churidar', price: 1499, originalPrice: 2999, category: createdCats['ethnic-sets']._id, categoryName: 'Ethnic Sets', meeshoLink: 'https://www.meesho.com/anarkali-suit-set/p/12', isFeatured: true, isTrending: true, badge: 'Hot', rating: 4.7, order: 2, images: ['https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=500'], tags: ['anarkali', 'zari', 'churidar'] },
        ];

        await Product.insertMany(products);
        console.log(`✅ ${products.length} sample products seeded`);
    } catch (err) {
        console.error('Products seed error:', err);
    }
};
