const express = require('express');
const app = express();

const path = require('path')
const ejs = require('ejs');
const jwt = require('jsonwebtoken');
const cookie = require('cookie-parser');
const bcrypt = require('bcrypt');
const multer = require('multer');
const userModel = require('./models/user');
const patientModel = require('./models/patient');

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, '..', 'frontend', 'public')));
app.use('/src', express.static(path.join(__dirname, '..', 'frontend', 'src')));


const storage = multer.memoryStorage();

const upload = multer({ storage: storage })
// const __filename = fileURLToPath(import.meta.url)
// const _dirname = path.dirname(_filename)


app.post('/upload', upload.single('image'), async (req, res) => {
    const { username, hospitalName, dateOfUpload } = req.body

    const saveitem = new patientModel({
        username: username,
        image: req.file.buffer,
        hospitalName: hospitalName,
        dateOfUpload: dateOfUpload,
    })

    await saveitem.save().then(() => (console.log('Data registered'))).catch((error) => (console.log('error registering item', error)))

})

app.get('/getrecords', async (req, res) => {
    try {
        // Fetch data from the database
        const records = await patientModel.find();

        // Convert buffer to base64 for each product and include all fields in the response
        const productsWithBase64 = records.map(record => {
            const base64Image = Buffer.from(record.image.buffer, 'binary').toString('base64');
            return {
                username: record.username,
                hospitalName: record.hospitalName,
                dateOfUpload: record.dateOfUpload,
                image: base64Image,
            };
        });
        console.log(productsWithBase64)
        res.json(productsWithBase64);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.get('/', (req, res) => {
    res.send('the landing page will be here. uncomment res.sendFile to see effects')
    // res.sendFile(path.join(__dirname, '..', 'frontend', 'public', 'index.html'));
});

app.get('/login', (req, res) => {
    res.send('the login page will be here. uncomment res.sendFile to see effects')
    // res.sendFile(path.join(__dirname, '..', 'frontend', 'public', 'login.html'));
});

app.post("/login", async (req, res) => {
    let user = await userModel.findOne({ email: req.body.email })
    if (!user)
        return res.send("something is wrong");
    else
        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (result) {
                let token = jwt.sign({ email: user.email }, "tokenGoesHere");
                res.cookie("token", token);
                return res.redirect('/');
            }
            else
                return res.send("something is wrong");
        })
})

app.get('/signup', (req, res) => {
    res.send('the signup page will be here. uncomment res.sendFile to see effects.create a basic form with post method to see results')
    // res.sendFile(path.join(__dirname, '..', 'frontend', 'public', 'login.html'));
});



app.post("/signup", (req, res) => {
    let { username, email, password } = req.body;

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            let u = await userModel.create({
                username,
                email,
                password: hash
            })
            res.redirect('dashboard/' + username);
        })
        let token = jwt.sign({ email }, "tokenGoesHere");
        res.cookie("token", token);
    })
})


app.get('/logout', (req, res) => {
    res.cookie("token", "");
})

app.listen(3000);