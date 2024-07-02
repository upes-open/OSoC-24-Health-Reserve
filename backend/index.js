const express=require('express');
const app=express();

const path = require('path')
const ejs = require('ejs');
const jwt = require('jsonwebtoken');
const cookie = require('cookie-parser');
const bcrypt = require('bcrypt');
const userModel = require('./models/user');

// app.set('view engine', 'ejs');
// change view engine acc to project req. here
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, '/public')))

app.get("/",(req,res)=>{
    res.render('homepage');
})

app.get('/login', (req, res) => {
    res.render('login');
})

app.post("/login", async (req, res) => {
    let user=await userModel.findOne({email:req.body.email})
    if(!user)
        return res.send("something is wrong");
    else
    bcrypt.compare(req.body.password,user.password,(err,result)=>{
        if(result){
            let token=jwt.sign({email:user.email},"boyismine");
            res.cookie("token",token);
            return res.redirect('/');    
        }
        else
        return res.send("something is wrong");
    })
})


app.get('/signup', (req, res) => {
    res.render('signp');
})

app.post("/signup", (req, res) => {
    let { username, email, password } = req.body;

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            let u = await userModel.create({
                username,
                email,
                password: hash
            })
            res.redirect('dashboard/'+username);
        })
        let token=jwt.sign({email},"tokenGoesHere");
        res.cookie("token",token) ;  
    })
})


app.get('/logout',(req,res)=>{
    res.cookie("token","");
})

app.listen(3000);