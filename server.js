const express = require('express');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Note: No logs directory creation for serverless compatibility

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.jsdelivr.net"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"]
    }
  }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// General middleware
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
// In serverless environments like Vercel, use console logging
if (NODE_ENV === 'production') {
  // Use console logging for production (works in Vercel)
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  const pageData = {
    title: 'Aram Algorithm - AI Red Teaming & EU AI Act Compliance',
    description: 'Red teaming services for AI safety, security, and EU AI Act Article 5 compliance. Turn AI risk into AI readiness.',
    canonical: req.protocol + '://' + req.get('host') + req.originalUrl,
    ogImage: req.protocol + '://' + req.get('host') + '/images/og-image.jpg',
    year: new Date().getFullYear(),
    env: NODE_ENV
  };
  
  res.render('index', pageData);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    uptime: process.uptime()
  });
});

// API endpoint for contact form (placeholder)
app.post('/api/contact', (req, res) => {
  // TODO: Implement contact form handling
  console.log('Contact form submission:', req.body);
  res.status(200).json({ 
    success: true, 
    message: 'Thank you for your interest! We will contact you soon.' 
  });
});

// Article 5 card download endpoint
app.get('/download/article5-card', (req, res) => {
  // TODO: Implement PDF generation or serve static PDF
  res.status(200).json({ 
    message: 'Article 5 card download will be implemented soon.' 
  });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).render('404', {
    title: 'Page Not Found - Aram Algorithm',
    url: req.originalUrl
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  if (NODE_ENV === 'production') {
    res.status(500).render('error', {
      title: 'Server Error - Aram Algorithm',
      message: 'Something went wrong. Please try again later.'
    });
  } else {
    res.status(500).json({
      error: err.message,
      stack: err.stack
    });
  }
});

// For local development, start the server
if (require.main === module) {
  const server = app.listen(PORT, () => {
    console.log(`🚀 Aram Algorithm server running on port ${PORT}`);
    console.log(`🌐 Environment: ${NODE_ENV}`);
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`⏰ Started at: ${new Date().toISOString()}`);
  });

  // Graceful shutdown for local development
  process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
      console.log('Process terminated');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    server.close(() => {
      console.log('Process terminated');
      process.exit(0);
    });
  });
}

// Export the Express app for Vercel
module.exports = app;
