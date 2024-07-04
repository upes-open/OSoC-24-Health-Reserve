const express = require('express');
const path = require('path');
const ejs = require('ejs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookie = require('cookie-parser');
const bcrypt = require('bcrypt');
const multer = require('multer');
const session = require('express-session')
const userModel = require('./models/user');
const patientModel = require('./models/patient');
const { connectToDb } = require('./connectDB/connect'); // Updated import path

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectToDb();

app.use(session({
    secret: 'secret-key',
    resave: true,
    saveUninitialized: true,
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

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });




const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.email) {
        next();
    } else {
        res.status(401).json('Unauthorized');
    }
};

app.get('/main', isAuthenticated, async (req, res) => {
    if (req.session.email) {
        console.log("redirecting to dashboard")
        res.redirect('dashboard/' + username);
    }
    else {
        res.json("Unauthorised")
    }

})



app.post('/upload', upload.single('image'), async (req, res) => {
    try {

        console.log('Session:', req.session);

        console.log('Session email:', req.session.email); 

        const { description, doctorName, hospitalName, dateOfUpload } = req.body;

        if (!req.file) {
            throw new Error('No file uploaded');
        }

        // Creating a new instance of patientModel with data from request
        const saveItem = new patientModel({
            description: description,
            doctorName: doctorName,
            email: 'saga@gmail.com',
            hospitalName: hospitalName,
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
        const records = await patientModel.find({email: req.session.email});

        const productsWithBase64 = records.map(record => {
            const base64Image = Buffer.from(record.image.data).toString('base64');
            return {
                description: record.description,
                email: record.email,
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


app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        bcrypt.compare(password, user.password, (err, result) => {
            if (err || !result) {
                return res.status(401).json({ error: "Invalid credentials" });
            }
            const token = jwt.sign({ email: user.email }, "tokenGoesHere", { expiresIn: '1h' });

            res.cookie("token", token, { httpOnly: true });

            req.session.email = email;
            req.session.username = user.username;
            req.session.license = user.license;

            console.log(req.session.email, req.session.username, req.session.license)

            req.session.save(err => {
                if (err) {
                    console.error('Session save error:', err);
                }
                console.log('Session after login:', req.session);
            });

            res.status(200).json({ message: "Login successful" });
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.post("/signup", async (req, res) => {
    let { username, contact, email, password, role, license } = req.body;

    if (!username || !email || !password || !role || (role === 'Doctor' && !license)) {
        return res.status(400).send('All required fields must be filled');
    }

    console.log('Signup data:', req.body);

    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const user = await userModel.create({
            username,
            contact,
            email,
            password: hash,
            license: role === 'Doctor' ? license : undefined
        });

        const token = jwt.sign({ email }, "tokenGoesHere");
        res.cookie("token", token);

        // res.status(201).redirect('dashboard/' + username);
        res.status(201).json({ message: "User registered successfully" })
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get('/logout', (req, res) => {
    res.cookie("token", "");
    res.redirect('/login');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});