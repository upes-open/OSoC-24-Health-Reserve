const express = require("express");
const { connectToDb } = require("./connectDB/connect");
//const path = require('path');

const app = express();
// const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Start the server
// app.listen(port, () => {
connectToDb();
//     console.log(`Server is running at http://localhost:${port}`);
// });

module.exports = app;
