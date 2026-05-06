const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Ensure upload directory exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Memory storage to hold file in buffer for hashing
const memoryUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only images (JPEG, PNG, WEBP) are allowed'), false);
    }
  }
});

// Smart Deduplicator middleware wrapped to look like Multer's single()
const upload = {
  single: (fieldName) => {
    return [
      memoryUpload.single(fieldName),
      (req, res, next) => {
        if (!req.file) {
          return next();
        }

        try {
          // Calculate SHA-256 hash of the file buffer
          const hash = crypto.createHash('sha256').update(req.file.buffer).digest('hex');
          const ext = path.extname(req.file.originalname).toLowerCase();
          const filename = `${hash}${ext}`;
          const filePath = path.join(uploadDir, filename).replace(/\\/g, '/');

          // Check if file already exists on disk
          if (!fs.existsSync(filePath)) {
            // Write to disk only if it does not exist
            fs.writeFileSync(filePath, req.file.buffer);
            console.log(`[SmartUpload] Written new deduplicated file: ${filePath}`);
          } else {
            console.log(`[SmartUpload] File already exists, reusing: ${filePath}`);
          }

          // Overwrite properties so controllers think it was disk-stored by default
          req.file.path = filePath;
          req.file.filename = filename;

          next();
        } catch (err) {
          next(err);
        }
      }
    ];
  }
};

module.exports = upload;
