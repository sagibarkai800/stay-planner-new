const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { requireAuth } = require('../middleware/auth');
const { createDocument, listDocumentsByUser, deleteDocument } = require('../db');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create uploads directory for the user if it doesn't exist
    const userId = req.user.id;
    const uploadDir = path.join(__dirname, '..', 'uploads', userId.toString());
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const originalName = file.originalname;
    const extension = path.extname(originalName);
    const nameWithoutExt = path.basename(originalName, extension);
    
    // Create unique filename: originalname_timestamp.extension
    const uniqueFilename = `${nameWithoutExt}_${timestamp}${extension}`;
    cb(null, uniqueFilename);
  }
});

// File filter for allowed MIME types
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png'
  ];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Only PDF, JPG, and PNG files are allowed. Got: ${file.mimetype}`), false);
  }
};

// Configure multer with limits and file filter
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter
});

// POST /api/docs - Upload a document (auth required)
router.post('/', requireAuth, upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No file uploaded' 
      });
    }

    const { filename, path: filePath, mimetype, size } = req.file;
    const userId = req.user.id;

    // Save document record to database
    const result = createDocument(userId, filename, filePath);
    
    if (!result.success) {
      // Clean up uploaded file if database save failed
      fs.unlinkSync(filePath);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to save document record' 
      });
    }

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      document: {
        id: result.docId,
        filename: filename,
        mimetype: mimetype,
        size: size,
        uploadedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Document upload error:', error);
    
    // Clean up uploaded file if there was an error
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Failed to clean up file:', unlinkError);
      }
    }
    
    res.status(500).json({ 
      success: false, 
      error: 'Failed to upload document',
      details: error.message 
    });
  }
});

// GET /api/docs - List user's documents (auth required)
router.get('/', requireAuth, (req, res) => {
  try {
    const userId = req.user.id;
    const documents = listDocumentsByUser(userId);
    
    // Format documents for response
    const formattedDocs = documents.map(doc => ({
      id: doc.id,
      filename: doc.filename,
      path: doc.path,
      created_at: doc.created_at
    }));
    
    res.json({
      success: true,
      documents: formattedDocs,
      count: formattedDocs.length
    });
    
  } catch (error) {
    console.error('Error listing documents:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to list documents' 
    });
  }
});

// GET /api/docs/:id - Stream document file (auth required)
router.get('/:id', requireAuth, (req, res) => {
  try {
    const documentId = parseInt(req.params.id);
    const userId = req.user.id;
    
    if (isNaN(documentId)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid document ID' 
      });
    }
    
    // Get document from database
    const documents = listDocumentsByUser(userId);
    const document = documents.find(doc => doc.id === documentId);
    
    if (!document) {
      return res.status(404).json({ 
        success: false, 
        error: 'Document not found' 
      });
    }
    
    // Check if file exists on disk
    if (!fs.existsSync(document.path)) {
      return res.status(404).json({ 
        success: false, 
        error: 'Document file not found on disk' 
      });
    }
    
    // Get file stats
    const stats = fs.statSync(document.path);
    const fileSize = stats.size;
    
    // Determine content type based on file extension
    const ext = path.extname(document.filename).toLowerCase();
    let contentType = 'application/octet-stream';
    
    switch (ext) {
      case '.pdf':
        contentType = 'application/pdf';
        break;
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
      case '.png':
        contentType = 'image/png';
        break;
    }
    
    // Set appropriate headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', fileSize);
    res.setHeader('Content-Disposition', `inline; filename="${document.filename}"`);
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    
    // Stream the file
    const fileStream = fs.createReadStream(document.path);
    fileStream.pipe(res);
    
    // Handle stream errors
    fileStream.on('error', (error) => {
      console.error('File stream error:', error);
      if (!res.headersSent) {
        res.status(500).json({ 
          success: false, 
          error: 'Failed to stream document' 
        });
      }
    });
    
  } catch (error) {
    console.error('Error streaming document:', error);
    if (!res.headersSent) {
      res.status(500).json({ 
        success: false, 
        error: 'Failed to stream document' 
      });
    }
  }
});

// DELETE /api/docs/:id - Delete document (auth required)
router.delete('/:id', requireAuth, (req, res) => {
  try {
    const documentId = parseInt(req.params.id);
    const userId = req.user.id;
    
    if (isNaN(documentId)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid document ID' 
      });
    }
    
    // Get document from database
    const documents = listDocumentsByUser(userId);
    const document = documents.find(doc => doc.id === documentId);
    
    if (!document) {
      return res.status(404).json({ 
        success: false, 
        error: 'Document not found' 
      });
    }
    
    // Delete from database first
    const result = deleteDocument(documentId, userId);
    
    if (!result.success) {
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to delete document record' 
      });
    }
    
    // Delete file from disk
    try {
      if (fs.existsSync(document.path)) {
        fs.unlinkSync(document.path);
      }
    } catch (unlinkError) {
      console.error('Failed to delete file from disk:', unlinkError);
      // Don't fail the request if file deletion fails
    }
    
    res.json({
      success: true,
      message: 'Document deleted successfully',
      deletedId: documentId
    });
    
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete document' 
    });
  }
});

// Error handling middleware for multer errors
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File too large. Maximum size is 5MB.'
      });
    }
    return res.status(400).json({
      success: false,
      error: `Upload error: ${error.message}`
    });
  }
  
  if (error.message && error.message.includes('Invalid file type')) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
  
  next(error);
});

module.exports = router;
