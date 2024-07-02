const express = require('express');
const { connectToDb } = require('./connectDB/connect');
const path = require('path');
const ejs = require('ejs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const userModel = require('./models/user');

const app = express();
const port = 3000;

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));
app.use(cookieParser());

// Routes
app.get("/", (req, res) => {
    res.render('homepage'); // Render your homepage or serve static files
});

app.get('/login', (req, res) => {
    res.render('login'); // Render your login page or serve static files
});

// Login endpoint
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Compare hashed password
        bcrypt.compare(password, user.password, (err, result) => {
            if (err || !result) {
                return res.status(400).json({ message: "Invalid email or password" });
            }

            // Create JWT token
            const token = jwt.sign({ email: user.email, userId: user._id }, "yourSecretKeyHere", { expiresIn: '1h' });

            // Set token in cookie
            res.cookie("token", token, { httpOnly: true });

            // Respond with token and success message
            res.json({ message: "Login successful", token });
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

app.get('/signup', (req, res) => {
    res.render('signup'); // Render your signup page or serve static files
});

// Signup endpoint
app.post("/signup", async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;

        // Validate inputs
        if (!username || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = await userModel.create({
            username,
            email,
            password: hashedPassword
        });

        // Create JWT token
        const token = jwt.sign({ email: newUser.email, userId: newUser._id }, "yourSecretKeyHere", { expiresIn: '1h' });

        // Set token in cookie
        res.cookie("token", token, { httpOnly: true });

        // Respond with token and user info
        res.status(201).json({ message: 'User created', token, user: { username, email } });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Logout endpoint
app.get('/logout', (req, res) => {
    res.clearCookie("token"); // Clear token cookie
    res.json({ message: "Logged out successfully" });
});

// Start server
app.listen(port, () => {
    connectToDb();
    console.log(`Server is running at http://localhost:${port}`);
});