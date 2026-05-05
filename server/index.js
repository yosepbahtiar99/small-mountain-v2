const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.json({ message: "Game Studio API is running 🚀" });
});

// Basic routing placeholder
// app.use('/api/games', require('./routes/gameRoutes'));
// app.use('/api/feedback', require('./routes/feedbackRoutes'));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
