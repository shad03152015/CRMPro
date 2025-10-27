const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
}));

// Logging middleware (only in development)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'CRMPro API is running' });
});

// API Routes
app.use('/api/dashboard', require('./routes/dashboard.routes'));
app.use('/api/contacts', require('./routes/contacts.routes'));
app.use('/api/opportunities', require('./routes/opportunities.routes'));
app.use('/api/pipelines', require('./routes/pipelines.routes'));
app.use('/api/stages', require('./routes/stages.routes'));
app.use('/api/calendars', require('./routes/calendars.routes'));
app.use('/api/appointments', require('./routes/appointments.routes'));
app.use('/api/conversations', require('./routes/conversations.routes'));

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Route not found',
      statusCode: 404
    }
  });
});

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;
