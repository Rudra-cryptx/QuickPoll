
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}));
app.use(express.json());

// Test route
app.get('/', (req, res) => {
    res.send('QuickPoll API is running!');
});

app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'QuickPoll backend is working'
    });
});

// Start server
const startServer = async () => {
    await connectDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();

const pollRoutes = require('./routes/poll.routes');

app.use('/api/polls', pollRoutes);