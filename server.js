import express from 'express';
import colors from 'colors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import connectionDB from './config/db.js';
import authRoutes from './routes/authRoute.js';


// Config .env
dotenv.config();

// Create Express app first
const app = express();

// Configure CORS properly
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));

// Database connection
connectionDB();

// Routes
app.use('/api/v1/auth', authRoutes);


// Test route
app.get('/', (req, res) => {
  res.send("<h1>Welcome to ecommerce project</h1>");
});

// Server configuration
const PORT = process.env.PORT || 9090;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(colors.green(`Server running in ${process.env.DEV_MODE} mode on port ${PORT}`));
});