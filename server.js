const express = require('express');
const dotenv = require('dotenv');
// const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
// const userRoutes = require('./routes/userRoutes');
const bodyParser = require('body-parser');
const EventRoutes=require('./routes/EventRoutes');
// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const cors = require("cors");
app.use(cors({ origin: "http://127.0.0.1:5502", credentials: true }));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
// app.use('/', userRoutes);
app.use('/',EventRoutes);
app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT||5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
