const mongoose=require('mongoose');

//database
mongoose.connect("mongodb+srv://Contributors:kj0zL1RFxCurMsm0@cluster0.mzvwlgt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

const userSchema=mongoose.Schema({
    username:String,
    email:String,
    password:String
})

module.exports=mongoose.model("user",userSchema);