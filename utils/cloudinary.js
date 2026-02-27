const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Cloudinary credentials from environment
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Returns true only when all three Cloudinary env vars are set
 * and are not the placeholder values.
 */
const isCloudinaryConfigured = () => {
    const { cloud_name, api_key, api_secret } = cloudinary.config();
    return (
        cloud_name && cloud_name !== 'your_cloudinary_cloud_name' &&
        api_key && api_key !== 'your_cloudinary_api_key' &&
        api_secret && api_secret !== 'your_cloudinary_api_secret'
    );
};

/**
 * Cloudinary-backed multer storage.
 * Images are uploaded to the "hercarehub/products" folder on Cloudinary
 * and stored as WebP for optimal size/quality.
 */
const cloudinaryStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'hercarehub/products',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ quality: 'auto', fetch_format: 'webp' }],
        // Generate a unique public_id so re-uploads don't collide
        public_id: (req, file) => {
            const name = path.parse(file.originalname).name.replace(/\s+/g, '-');
            return `${Date.now()}-${name}`;
        }
    }
});

/**
 * Local disk storage fallback (used when Cloudinary is NOT configured).
 */
const localStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`);
    }
});

/**
 * Smart multer uploader:
 * - Uses Cloudinary if configured (production)
 * - Falls back to local disk otherwise (development)
 */
const upload = multer({
    storage: isCloudinaryConfigured() ? cloudinaryStorage : localStorage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB (Cloudinary can handle larger files)
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp'];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Unsupported image format. Use JPG, PNG, or WebP.'), false);
        }
    }
});

/**
 * Given a multer file object, returns the permanent URL regardless of storage backend.
 * - Cloudinary: file.path is the secure HTTPS URL
 * - Local disk: file.filename gives us the relative /uploads/... path
 */
const getFileUrl = (file) => {
    if (!file) return null;
    // Cloudinary storage sets file.path to the full HTTPS URL
    if (file.path && (file.path.startsWith('http://') || file.path.startsWith('https://'))) {
        return file.path;
    }
    // Local disk
    return `/uploads/${file.filename}`;
};

/**
 * Deletes a Cloudinary asset by its public_id.
 * Extracted from the URL: .../hercarehub/products/<public_id>.webp
 * No-op if Cloudinary is not configured or the URL is not a Cloudinary URL.
 */
const deleteFromCloudinary = async (url) => {
    if (!isCloudinaryConfigured()) return;
    if (!url || !url.includes('cloudinary.com')) return;
    try {
        // Extract public_id: everything after /upload/[optional version]/ up to the extension
        const matches = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/i);
        if (matches && matches[1]) {
            await cloudinary.uploader.destroy(matches[1]);
        }
    } catch (err) {
        console.error('Cloudinary delete error:', err.message);
    }
};

module.exports = { upload, getFileUrl, deleteFromCloudinary, isCloudinaryConfigured, cloudinary };
