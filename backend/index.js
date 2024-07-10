const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const { connectToDb } = require('./connectDB/connect'); // Updated import path
const routes = require('./routes/routes.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectToDb();

// Session middleware
app.use(session({
  secret: 'your secret key',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: 'mongodb+srv://Contributors:kj0zL1RFxCurMsm0@cluster0.mzvwlgt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster03',
    collectionName: 'sessions' 
  }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
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

app.use('/', routes);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});