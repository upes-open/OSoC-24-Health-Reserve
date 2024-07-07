const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const { connectToDb } = require('./connectDB/connect'); // Updated import path
const routes = require('./routes/routes.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectToDb();

// Define mongoose schema and model
const userSchema = mongoose.Schema({
    username: { type: String, required: true },
    contact: { type: Number, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    license: { type: String, required: function() { return this.role === 'Doctor'; } },
});

const User = mongoose.model("User", userSchema);

// Session middleware
app.use(session({
    secret: 'secret-key',
    resave: true,
    saveUninitialized: false
}));

// Middleware
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from this origin
    credentials: true // Enable credentials (cookies, authorization headers) cross-origin
}));

// Routes
app.get('/user/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.use('/', routes);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
