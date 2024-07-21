const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../models/user.js')
const patientModel = require('../models/patient.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const router = express.Router();


router.post('/upload', async (req, res) => {
    const { description, dateOfUpload, doctorName, hospitalName, image } = req.body;
    const email = req.session.email;

    if (!image) {
        return res.status(400).send('No file uploaded');
    }

    if (!email) {
        return res.status(400).send('User not authenticated');
    }

    try {
        const saveItem = new patientModel({
            description: description,
            doctorName: doctorName,
            hospitalName: hospitalName,
            dateOfUpload: new Date(dateOfUpload),
            image: {
                data: image,
            },
            email: email
        });

        await saveItem.save();

        console.log('Data registered');
        res.status(200).send('Data uploaded successfully!');
    } catch (err) {
        console.error('Error saving file or registering item:', err);
        res.status(500).send('Error saving file or registering item');
    }
});


router.post('/revoke-access', async (req, res) => {
    const { revokeDoctor } = req.body;
    const userEmail = req.session.email;

    try {
        const user = await userModel.findOne({ email: userEmail });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.sharedWith.includes(revokeDoctor)) {
            return res.status(400).json({ message: "Doctor's email not found in sharedWith array" });
        }

        user.sharedWith = user.sharedWith.filter(email => email !== revokeDoctor);

        await user.save();

        res.status(200).json({ message: "Access revoked successfully" });
    } catch (error) {
        console.error('Error revoking access:', error.message);
        res.status(500).json({ message: "Error revoking access" });
    }
});


router.get('/getrecords', async (req, res) => {
    const email = req.session.email;

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

        res.status(201).json(req.body);
    } catch (err) {
        res.status(500).send(err.message);
    }
});


router.get('/logout', (req, res) => {
    res.clearCookie("token");
    req.session.destroy((err) => {
        if (err) {
            console.log("Error clearing session:", err);
            res.status(500).send("Error clearing session");
        } else {
            console.log("Session cleared successfully");
            res.status(200).send("Logged out successfully");
        }
    });
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
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        Object.keys(updateData).forEach(key => {
            if (updateData[key] !== undefined) {
                user[key] = updateData[key];
            }
        });

        const updatedUser = await user.save();

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


router.post('/grant-access', async (req, res) => {
    const email = req.session.email; // Fetch email from session
    const { selectedDoctor } = req.body;

    try {
        if (!email) {
            return res.status(400).json({ message: 'Email not found in session' });
        }

        // Ensure that sharedWith is an array in case it's not initialized correctly
        const user = await userModel.findOneAndUpdate(
            { email }, // Find user by email
            { $addToSet: { sharedWith: selectedDoctor } },
            {
                new: true, // Return the updated document
                upsert: false // Do not create a new document if not found
            }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('Updated sharedWith array:', user.sharedWith);

        res.status(200).json({ message: 'Access shared successfully' });
    } catch (error) {
        console.error('Error sharing access:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Endpoint to show patient details if a doctor is logged in
router.get('/doctor/patients', async (req, res) => {
    const userEmail = req.session.email;
    console.log("Received email in backend:", userEmail);

    try {
        const user = await userModel.findOne({ email: userEmail });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role === 'Doctor') {
            const patients = await userModel.find({ sharedWith: userEmail });
            return res.status(200).json(patients);
        } else {
            return res.status(403).json({ message: 'Unauthorized access' });
        }
    } catch (error) {
        console.error("Error fetching patients:", error);
        return res.status(500).json({ message: error.message });
    }
});


// Endpoint to show doctor details if a patient is logged in
router.get('/patient/doctors', async (req, res) => {
    const userEmail = req.session.email;
    console.log("Received email in backend:", userEmail);

    try {
        const user = await userModel.findOne({ email: userEmail });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role === 'Patient') {
            const doctors = await userModel.find({ email: { $in: user.sharedWith } });
            return res.status(200).json(doctors);
        } else {
            return res.status(403).json({ message: 'Unauthorized access' });
        }
    } catch (error) {
        console.error("Error fetching doctors:", error);
        return res.status(500).json({ message: error.message });
    }
});








module.exports = router