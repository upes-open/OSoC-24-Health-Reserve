const express = require('express');
const { connectToDb } = require('./connectDB/connect');
//const path = require('path');

const app = express();
const port = 3000;












const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // For password hashing

app.use(express.json());

// Mock user data (replace with database queries in a real application)
const users = [
    { id: 1, username: 'user1', password: '$2a$10$9w.mqF01H1CEU.6OfeYRbOd3ZceAqgjSxTz6rZAV5u.Z06GqoF5dO' } // Password is "password"
];

// Login endpoint
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // Find user based on username (mock implementation)
    const user = users.find(u => u.username === username);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Validate password
    bcrypt.compare(password, user.password, (err, result) => {
        if (err || !result) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Password is correct, generate token
        const token = jwt.sign({ username: user.username }, 'your_secret_key', { expiresIn: '1h' });

        res.json({ token });
    });
});

// Signup endpoint
app.post('/api/signup', (req, res) => {
    const { username, password } = req.body;

    // Hash password before storing it (mock implementation)
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ message: 'Internal server error' });
        }

        // Store the new user (mock implementation)
        users.push({ id: users.length + 1, username, password: hashedPassword });

        res.status(201).json({ message: 'User created successfully' });
    });
});












app.get('/', (req, res) => {
    res.send("Hello World");
});

// Start the server
app.listen(port, () => {
    connectToDb();
    console.log(`Server is running at http://localhost:${port}`);
});