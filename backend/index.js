const express = require('express');
const path = require('path');
const ejs = require('ejs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookie = require('cookie-parser');
const bcrypt = require('bcrypt');
const multer = require('multer');
const userModel = require('./models/user');
const patientModel = require('./models/patient');
const { connectToDb } = require('./connectDB/connect'); // Updated import path

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectToDb();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));
app.use(cookie());
app.use(cors());

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Routes
app.post('/upload', upload.single('image'), async (req, res) => {
    try {
        const { description, username, hospitalName, dateOfUpload } = req.body;

        if (!req.file) {
            throw new Error('No file uploaded');
        }

        // Creating a new instance of patientModel with data from request
        const saveItem = new patientModel({
            description,
            username,
            hospitalName,
            dateOfUpload: new Date(dateOfUpload),
            image: {
                data: req.file.buffer,
                contentType: req.file.mimetype
            }
        });

        // Saving the new patient record to the database
        await saveItem.save();
        console.log('Data registered');
        res.send('Data registered successfully');
    } catch (error) {
        console.error('Error registering item:', error);
        res.status(500).send(`Internal Server Error: ${error.message}`);
    }
});

app.get('/getrecords', async (req, res) => {
    try {
        const records = await patientModel.find();

        const productsWithBase64 = records.map(record => {
            const base64Image = Buffer.from(record.image.data).toString('base64');
            return {
                description: record.description,
                username: record.username,
                hospitalName: record.hospitalName,
                dateOfUpload: record.dateOfUpload,
                image: base64Image,
                contentType: record.image.contentType,
            };
        });
        console.log(productsWithBase64);
        res.json(productsWithBase64);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get("/", (req, res) => {
    res.render('homepage');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post("/login", async (req, res) => {
    let user = await userModel.findOne({ email: req.body.email });
    if (!user)
        return res.send("something is wrong");
    else
        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (result) {
                let token = jwt.sign({ email: user.email }, "boyismine");
                res.cookie("token", token);
                return res.redirect('/');
            } else
                return res.send("something is wrong");
        });
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.post("/signup", (req, res) => {
    let { username, email, password } = req.body;

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            let u = await userModel.create({
                username,
                email,
                password: hash
            });
            res.redirect('dashboard/' + username);
        });
        let token = jwt.sign({ email }, "tokenGoesHere");
        res.cookie("token", token);
    });
});

app.get('/logout', (req, res) => {
    res.cookie("token", "");
    res.redirect('/login');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});