const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const sequelize = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));

app.get('/', (req, res) => {
    res.json({ message: "Small Mountain API is running 🚀" });
});

// Error Handler
app.use(errorHandler);

// Database Sync & Server Start
const User = require('./models/User');

sequelize.sync({ force: false }) // Changed to false to preserve data after first run
  .then(async () => {
    console.log('Database synced successfully');
    
    // Simple Seeder for Admin (Change this in production!)
    const adminCount = await User.count();
    if (adminCount === 0) {
      await User.create({
        username: 'admin',
        password: 'password123' // This will be hashed by the model hook
      });
      console.log('Default admin created: admin / password123');
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
