const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();

//Connect to MongoDB
connectDB();

//Middleware
app.use(cors());
app.use(express.json());

//Test Route
app.get('/', (req, res) => {
    res.json({ message: 'Omniserve API is running successfully!' });
});

//Set port and start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});






