const express = require('express');
const path = require('path');
const ejs = require('ejs');
const cors = require('cors');
const cookie = require('cookie-parser');
const multer = require('multer');
const session = require('express-session')
const { connectToDb } = require('./connectDB/connect'); // Updated import path
const routes = require('./routes/routes.js');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(session({
    secret: 'secret-key',
    resave: true,
    saveUninitialized: false
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));
app.use(cookie());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));



app.use('/', routes)


app.listen(PORT, () => {
    connectToDb();
    console.log(`Server is running on port ${PORT}`);
});