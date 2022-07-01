// express-nodejs server
const express = require('express');
const cors = require('cors');

// routes for sign in and register
const authRoutes = require("./routes/auth.js")


// make instance of express
const app = express();
const PORT = process.env.PORT || 5000;

// call environment variables inside node
require('dotenv').config();

// middleware
app.use(cors());

// pass JSON from backend to front end
app.use(express.json());


app.use(express.urlencoded());

app.get('/', (req, res) => {
    res.send('Hello, world!')
})

// use routes for entire server
app.use('/auth', authRoutes)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
