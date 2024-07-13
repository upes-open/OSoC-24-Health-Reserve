const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const session = require('express-session')
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const userModel = require('../models/user.js')
const patientModel = require('../models/patient.js');

// const algorithm = 'aes-256-cbc';
// const key = crypto.randomBytes(32);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



// function encrypt(data) {
//     const iv = crypto.randomBytes(16); 
//     const cipher = crypto.createCipheriv(algorithm, key, iv);
//     let encrypted = cipher.update(data);
//     encrypted = Buffer.concat([encrypted, cipher.final()]);
//     return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
// }

// function decrypt(encryptedData, iv) {
//     const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));
//     let decrypted = decipher.update(Buffer.from(encryptedData, 'hex'));
//     decrypted = Buffer.concat([decrypted, decipher.final()]);
//     return decrypted;
// }



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


router.post('/upload', async (req, res) => {
    const { description, dateOfUpload, doctorName, hospitalName, image, email } = req.body;

    if (!image) {
        return res.status(400).send('No file uploaded');
    }
    try {
        // Save other data into MongoDB using Mongoose
        const saveItem = new patientModel({
            description: description,
            doctorName: doctorName,
            hospitalName: hospitalName,
            dateOfUpload: new Date(dateOfUpload),
            image: {
                data: image, // You can directly store the buffer if needed 
            },
            email: email
        });

        await saveItem.save(); // Save the document
        //console.log(image);
        console.log('Data registered');
        res.status(200).send('Data uploaded successfully!');
    } catch (err) {
        console.error('Error saving file or registering item:', err);
        res.status(500).send('Error saving file or registering item');
    }
});


router.get('/record/:email', async (req, res) => {
    const email = req.params.email;

    try {
        const patients = await patientModel.find({ email });
        res.json(patients);
    } catch (err) {
        res.status(500).json({ message: err.message });
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

            req.session.email = user.email;

            console.log(req.session.email)

            res.cookie("token", token, { httpOnly: true }).status(200).json({ message: "Login successful" });

            // res.status(200).json({ message: "Login successful" });
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

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
            role,
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
        console.log(req.session)
        res.send("Session is working")
        // res.redirect('dashboard/' + username);
    }
    else {
        res.json("Unauthorised")
    }

});

router.get('/user/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});



router.get('/getdata', async (req, res) => {
    try {
        const email = req.session.email;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});


router.put('/user/:email', async (req, res) => {
    const email = req.params.email;
    const updateData = req.body;

    try {
        // Find user by email
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user details
        // Only update fields that are present in the request body
        Object.keys(updateData).forEach(key => {
            if (updateData[key] !== undefined) {
                user[key] = updateData[key];
            }
        });

        // Save the updated user document
        const updatedUser = await user.save();

        // Return the updated user document
        res.status(200).json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/record/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedRecord = await patientModel.findByIdAndDelete(id);
        if (!deletedRecord) {
            return res.status(404).json({ error: 'Record not found' });
        }
        res.status(200).json({ message: 'Record deleted successfully' });
    } catch (err) {
        console.error('Error deleting record:', err);
        res.status(500).json({ error: 'Server error' });
    }
});


router.get('/usersdoc', async (req, res) => {
    const userEmail = req.session.email; // Retrieve email from session
    console.log("Received email in backend:", userEmail); // Log the received email

    try {
        const user = await userModel.findOne({ email: userEmail });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role === 'Doctor') {
            // Find patients whose sharedWith array contains the doctor's email
            const patients = await userModel.find({ sharedWith: userEmail });
            res.status(200).json(patients);
        } else if (user.role === 'Patient') {
            // Find doctors whose email is in the patient's sharedWith array
            const doctors = await userModel.find({ email: { $in: user.sharedWith } });
            res.status(200).json(doctors);
        } else {
            res.status(400).json({ message: 'Invalid user role' });
        }
    } catch (error) {
        console.error("Error fetching users:", error); // Log any errors
        res.status(500).json({ message: error.message });
    }
});


router.get('/getrecords/:username', async (req, res) => {
    const username = req.params.username;

    try {
        const user = await userModel.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const records = await patientModel.find({ email: user.email });
        res.json(records);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/user-role", async (req, res) => {

    // console.log(req.session)

    if (!req.session.email) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    try {
        const user = await userModel.findOne({ email: req.session.email });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ role: user.role });
    } catch (err) {
        console.error("Error fetching user role:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



router.post('/grant-access/:email', async (req, res) => {
    const { email } = req.params;
    const { selectedDoctor } = req.body;

    try {
        // Ensure that sharedWith is an array in case it's not initialized correctly
        const user = await userModel.findOneAndUpdate(
            { email },
            { $addToSet: { sharedWith: selectedDoctor } },
            { 
                new: true, // Return the updated document
                upsert: true // Create a new document if not found
            }
        );

        // Log the updated sharedWith array
        console.log('Updated sharedWith array:', user.sharedWith);

        res.status(200).json({ message: 'Access shared successfully' });
    } catch (error) {
        console.error('Error sharing access:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});









module.exports = router