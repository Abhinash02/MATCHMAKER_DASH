// const express = require('express');
// const cors = require('cors');
// const morgan = require('morgan');

// const authRoutes = require('./routes/authRoutes');
// const customerRoutes = require('./routes/customerRoutes');
// const matchRoutes = require('./routes/matchRoutes');
// const noteRoutes = require('./routes/noteRoutes');
// const aiRoutes = require('./routes/aiRoutes');
// const statsRoutes = require('./routes/statsRoutes');
// const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// const app = express();

// app.get('/', (req, res) => {
//   res.json({
//     message: 'MATCHMAKER API is running'
//   });
// });
// const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
//   .split(',')
//   .map(o => o.trim())
//   .filter(Boolean);

// app.use(cors({
//   origin: (origin, cb) => {
//     if (!origin) return cb(null, true);
//     if (allowedOrigins.includes(origin)) return cb(null, true);
//     return cb(new Error(`Origin ${origin} not allowed by CORS`));
//   },
//   credentials: true,
// }));

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

// app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// app.use('/api/auth', authRoutes);
// app.use('/api/customers', customerRoutes);
// app.use('/api/matches', matchRoutes);
// app.use('/api/notes', noteRoutes);
// app.use('/api/ai', aiRoutes);
// app.use('/api/stats', statsRoutes);

// app.use(notFound);
// app.use(errorHandler);

// module.exports = app;


const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes');
const matchRoutes = require('./routes/matchRoutes');
const noteRoutes = require('./routes/noteRoutes');
const aiRoutes = require('./routes/aiRoutes');
const statsRoutes = require('./routes/statsRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// CORS
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173', 'https://perfectpair-five.vercel.app')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Root Route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'MATCHMAKER API is running',
  });
});

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    time: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/stats', statsRoutes);

// 404 Handler
app.use(notFound);

// Global Error Handler
app.use(errorHandler);

module.exports = app;