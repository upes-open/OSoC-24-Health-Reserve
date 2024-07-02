const mongoose=require('mongoose');

const connectToDb = async () => {
    try {
        await mongoose.connect("mongodb+srv://Contributors:kj0zL1RFxCurMsm0@cluster0.mzvwlgt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
        console.log("Connected to Database successfully")
    } catch (error) {
        console.log("Error in connecting to database", error)
    }
}

module.exports = { connectToDb };