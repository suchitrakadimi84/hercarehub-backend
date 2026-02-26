const Category = require('../models/Category');
const Product = require('../models/Product');

module.exports = async function seedProducts() {
    try {
        const count = await Product.countDocuments();
        if (count > 0) return;

        // Create categories
        const cats = [
            { name: 'Sarees', slug: 'sarees', description: 'Beautiful Indian sarees', order: 1 },
            { name: 'Jewellery', slug: 'jewellery', description: 'Stunning jewellery sets', order: 2 },
            { name: 'Ethnic Sets', slug: 'ethnic-sets', description: 'Coordinated ethnic wear sets', order: 3 },
            { name: 'Fashion', slug: 'fashion', description: 'Trendy dresses and fashion wear for women', order: 4 },
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

            // Jewellery
            { name: 'Kundan Bridal Set', description: 'Royal Kundan necklace set with matching earrings and maang tikka for brides', price: 1899, originalPrice: 3499, category: createdCats['jewellery']._id, categoryName: 'Jewellery', meeshoLink: 'https://www.meesho.com/kundan-bridal-set/p/5', isFeatured: true, isTrending: true, badge: 'Hot', rating: 4.9, order: 1, images: ['https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=500'], tags: ['kundan', 'bridal', 'necklace'] },
            { name: 'Polki Diamond Necklace', description: 'Uncut Polki diamond necklace with 22k gold plating, heirloom quality', price: 2499, originalPrice: 4999, category: createdCats['jewellery']._id, categoryName: 'Jewellery', meeshoLink: 'https://www.meesho.com/polki-diamond-necklace/p/6', isFeatured: true, isTrending: false, badge: 'Premium', rating: 4.9, order: 2, images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500'], tags: ['polki', 'diamond', 'gold'] },
            { name: 'Temple Jewelry Set', description: 'Traditional South Indian temple jewellery set with antique gold finish', price: 1599, originalPrice: 2999, category: createdCats['jewellery']._id, categoryName: 'Jewellery', meeshoLink: 'https://www.meesho.com/temple-jewelry-set/p/7', isFeatured: false, isTrending: true, badge: 'New', rating: 4.7, order: 3, images: ['https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=500'], tags: ['temple', 'traditional', 'antique'] },
            { name: 'Rose Gold Hoop Earrings', description: 'Delicate rose gold hoop earrings, perfect for everyday elegance', price: 299, originalPrice: 599, category: createdCats['jewellery']._id, categoryName: 'Jewellery', meeshoLink: 'https://www.meesho.com/rose-gold-hoops/p/8', isFeatured: true, isTrending: true, badge: 'New', rating: 4.6, order: 4, images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500'], tags: ['rose gold', 'hoops', 'earrings'] },
            { name: 'Pearl Drop Necklace', description: 'Freshwater pearl drop necklace with 925 silver chain, minimalist and chic', price: 449, originalPrice: 899, category: createdCats['jewellery']._id, categoryName: 'Jewellery', meeshoLink: 'https://www.meesho.com/pearl-drop-necklace/p/9', isFeatured: true, isTrending: false, badge: '', rating: 4.5, order: 5, images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500'], tags: ['pearl', 'necklace', 'silver'] },
            { name: 'Boho Stack Bangles', description: 'Set of 6 oxidized silver bangles with intricate tribal patterns', price: 199, originalPrice: 399, category: createdCats['jewellery']._id, categoryName: 'Jewellery', meeshoLink: 'https://www.meesho.com/boho-bangles/p/10', isFeatured: false, isTrending: true, badge: 'Sale', rating: 4.3, order: 6, images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500'], tags: ['bangles', 'oxidized', 'boho'] },

            // Ethnic Sets
            { name: 'Embroidered Salwar Kameez', description: 'Elegant embroidered salwar kameez with dupatta, festive wear', price: 1099, originalPrice: 2199, category: createdCats['ethnic-sets']._id, categoryName: 'Ethnic Sets', meeshoLink: 'https://www.meesho.com/embroidered-salwar-kameez/p/11', isFeatured: true, isTrending: false, badge: 'New', rating: 4.6, order: 1, images: ['https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=500'], tags: ['salwar', 'embroidered', 'festive'] },
            { name: 'Anarkali Suit Set', description: 'Flowy Anarkali suit with intricate zari work and churidar', price: 1499, originalPrice: 2999, category: createdCats['ethnic-sets']._id, categoryName: 'Ethnic Sets', meeshoLink: 'https://www.meesho.com/anarkali-suit-set/p/12', isFeatured: true, isTrending: true, badge: 'Hot', rating: 4.7, order: 2, images: ['https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=500'], tags: ['anarkali', 'zari', 'churidar'] },

            // Fashion — Dresses
            { name: 'Floral Wrap Midi Dress', description: 'Elegant floral printed wrap midi dress with flutter sleeves, perfect for brunch, parties and casual outings', price: 799, originalPrice: 1599, category: createdCats['fashion']._id, categoryName: 'Fashion', meeshoLink: 'https://www.meesho.com/floral-wrap-midi-dress/p/13', isFeatured: true, isTrending: true, badge: 'Trending', rating: 4.7, order: 1, images: ['https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=500'], tags: ['dress', 'floral', 'midi', 'wrap'] },
            { name: 'Black Bodycon Dress', description: 'Sleek black bodycon dress with off-shoulder neckline, ideal for evening events and parties', price: 699, originalPrice: 1399, category: createdCats['fashion']._id, categoryName: 'Fashion', meeshoLink: 'https://www.meesho.com/black-bodycon-dress/p/14', isFeatured: true, isTrending: true, badge: 'Hot', rating: 4.8, order: 2, images: ['https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=500'], tags: ['dress', 'black', 'bodycon', 'party'] },
            { name: 'Boho Maxi Sundress', description: 'Breezy bohemian maxi sundress with ethnic prints and adjustable straps, great for beach and vacation', price: 899, originalPrice: 1799, category: createdCats['fashion']._id, categoryName: 'Fashion', meeshoLink: 'https://www.meesho.com/boho-maxi-sundress/p/15', isFeatured: true, isTrending: false, badge: 'New', rating: 4.6, order: 3, images: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500'], tags: ['dress', 'maxi', 'boho', 'sundress'] },
            { name: 'Pastel A-Line Dress', description: 'Soft pastel A-line dress with lace trim and puff sleeves, a feminine must-have for any wardrobe', price: 649, originalPrice: 1299, category: createdCats['fashion']._id, categoryName: 'Fashion', meeshoLink: 'https://www.meesho.com/pastel-aline-dress/p/16', isFeatured: false, isTrending: true, badge: 'Sale', rating: 4.5, order: 4, images: ['https://images.unsplash.com/photo-1495385794356-15371f348c31?w=500'], tags: ['dress', 'pastel', 'aline', 'lace'] },
            { name: 'Dungaree Denim Dress', description: 'Casual denim dungaree dress with adjustable straps and front pockets, effortlessly stylish', price: 549, originalPrice: 1099, category: createdCats['fashion']._id, categoryName: 'Fashion', meeshoLink: 'https://www.meesho.com/dungaree-denim-dress/p/17', isFeatured: false, isTrending: true, badge: '', rating: 4.4, order: 5, images: ['https://images.unsplash.com/photo-1554412933-514a83d2f3c8?w=500'], tags: ['dress', 'denim', 'dungaree', 'casual'] },
            { name: 'Ethnic Print Shirt Dress', description: 'Vibrant ethnic block-print shirt dress with a relaxed fit and wooden-button front, kurta-meets-dress style', price: 749, originalPrice: 1499, category: createdCats['fashion']._id, categoryName: 'Fashion', meeshoLink: 'https://www.meesho.com/ethnic-shirt-dress/p/18', isFeatured: true, isTrending: false, badge: 'New', rating: 4.6, order: 6, images: ['https://images.unsplash.com/photo-1583744946564-b52d01a7b321?w=500'], tags: ['dress', 'ethnic', 'print', 'shirt dress'] },
            { name: 'Ruffle Hem Party Dress', description: 'Chic ruffle-hem mini dress in rich wine colour, perfect for cocktail nights and festivities', price: 849, originalPrice: 1699, category: createdCats['fashion']._id, categoryName: 'Fashion', meeshoLink: 'https://www.meesho.com/ruffle-party-dress/p/19', isFeatured: true, isTrending: true, badge: 'Hot', rating: 4.7, order: 7, images: ['https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=500'], tags: ['dress', 'ruffle', 'party', 'mini'] },
            { name: 'Co-ord Set Dress', description: 'Trendy matching co-ord set with a crop top and flared skirt in geometric print, complete the look effortlessly', price: 999, originalPrice: 1999, category: createdCats['fashion']._id, categoryName: 'Fashion', meeshoLink: 'https://www.meesho.com/coord-set-dress/p/20', isFeatured: true, isTrending: true, badge: 'Trending', rating: 4.8, order: 8, images: ['https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=500'], tags: ['dress', 'co-ord', 'set', 'crop top'] },
        ];

        await Product.insertMany(products);
        console.log(`✅ ${products.length} sample products seeded`);
    } catch (err) {
        console.error('Products seed error:', err);
    }
};
