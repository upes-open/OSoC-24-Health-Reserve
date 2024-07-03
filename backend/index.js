const app = require('./app');

const path = require('path')
const ejs = require('ejs');
const jwt = require('jsonwebtoken');
const cookie = require('cookie-parser');
const bcrypt = require('bcrypt');
const multer = require('multer');
const cors = require('cors');
const userModel = require('./models/user');
const patientModel = require('./models/patient');


// app.set('view engine', 'ejs');
// change view engine acc to project req. here
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }))
// app.use(express.static(path.join(__dirname, '/public')))
app.use(cookie());

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true 
  }));


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




app.get("/", (req, res) => {
    res.render('homepage');
})


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

            res.status(200).json({ message: "Login successful" });
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
})


// app.get('/signup', (req, res) => {
//     res.render('signp');
// })

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
})

port = 3000

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});