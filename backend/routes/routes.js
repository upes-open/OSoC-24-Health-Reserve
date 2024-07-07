const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const session = require('express-session')
const multer = require('multer');
const crypto = require('crypto');
const userModel = require('../models/user.js')
const patientModel = require('../models/patient.js');

const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);

const app = express();

app.use(session({
    secret: 'secret-key',
    resave: true,
    saveUninitialized: false
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



function encrypt(data) {
    const iv = crypto.randomBytes(16); 
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

function decrypt(encryptedData, iv) {
    const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(Buffer.from(encryptedData, 'hex'));
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted;
}



const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.email) {
        next();
    } else {
        res.status(401).json('Unauthorized');
    }
};

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(403).json({ error: "No token provided" });
    }

    jwt.verify(token, "tokenGoesHere", (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: "Failed to authenticate token" });
        }

        req.email = decoded.email;
        next();
    });
};


router.post('/upload', verifyToken, upload.single('image'), async (req, res) => {
    try {

        const { description, doctorName, hospitalName, dateOfUpload } = req.body;

        if (!req.file) {
            throw new Error('No file uploaded');
        }

        const encryptedImage = encrypt(req.file.buffer);

        const saveItem = new patientModel({
            description: description,
            doctorName: doctorName,
            email: req.email,
            // email: 'saga@gmail.com',
            hospitalName: hospitalName,
            dateOfUpload: new Date(dateOfUpload),
            image: {
                data: encryptedImage.encryptedData,
                contentType: req.file.mimetype,
                iv: encryptedImage.iv
            }
        });

        await saveItem.save();
        console.log('Data registered');
        res.send('Data registered successfully');
    } catch (error) {
        console.error('Error registering item:', error);
        res.status(500).send(`Internal Server Error: ${error.message}`);
    }
});



router.get('/getrecords', async (req, res) => {
    try {
        const records = await patientModel.find({ email: req.session.email });

        const productsWithBase64 = records.map(record => {
            const decryptedImage = decrypt(record.image.data, record.image.iv);
            const base64Image = decryptedImage.toString('base64');
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



router.post("/login", async (req, res) => {
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

            res.cookie("token", token, { httpOnly: true }).status(200).json({ message: "Login successful" });

            // res.status(200).json({ message: "Login successful" });
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// app.get('/user/:email', async (req, res) => {
//     try {
//       const email = req.params.email;
//       const user = await User.findOne({ email });
//       if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//       }
//       res.json(user);
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: 'Server error' });
//     }
//   });
  
    

router.post("/signup", async (req, res) => {
    let { username, contact, email, password, role, license } = req.body;

    if (!username || !email || !password || !role || (role === 'Doctor' && !license)) {
        return res.status(400).send('All required fields must be filled');
    }

    console.log('Signup data:', req.body);

    try {
        const existingUser = await userModel.findOne({ $or: [{ email }, { contact }] });
        if (existingUser) {
            return res.status(400).send('User with the same email or contact already exists');
        }

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

        // Instead of returning a static message, return req.body
        res.status(201).json(req.body);
    } catch (err) {
        res.status(500).send(err.message);
    }
});


router.get('/logout', (req, res) => {
    res.cookie("token", "");
    res.redirect('/login');
});


router.get('/main', isAuthenticated, async (req, res) => {
    if (req.session.email) {
        console.log("redirecting to dashboard")
        res.redirect('dashboard/' + username);
    }
    else {
        res.json("Unauthorised")
    }

})
// New route to fetch profile information of the currently logged-in user
router.get('/profile', isAuthenticated, async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.session.email });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({
            username: user.username,
            email: user.email,
            contact: user.contact,
            role: user.role,
            license: user.license,
            bio: user.bio // assuming you have a bio field in your user model
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).send('Internal Server Error');
    }
});





module.exports = router
