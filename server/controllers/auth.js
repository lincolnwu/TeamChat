const { connect } = require('getstream');
const bcrypt = require('bcrypt');
const StreamChat = require('stream-chat').StreamChat; // create instance of StreamChat
const crypto = require('crypto');

// require environment variables and values from .env vile
require('dotenv').config();

// store values in api
const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;
const app_id = process.env.STREAM_APP_ID;

// controllers will be functions that handle login and signup
const signup = async (req, res) => {
    try {
        // we want to query all users from database that match this username
        const client = StreamChat.getInstance(api_key, api_secret)

        // things we get from frontend
        // destructure everything we get from request.body
        const { fullName, username, password, phoneNumber } = req.body;
        
        // check if username already exists
        const { users } = await client.queryUsers({ name: username });
        // console.log("signup username ", username)
        // console.log("users signup", users)
        if(users.length !== 0) {
            return res.status(600).json({ message: 'Error. Username already taken.' })
        } 

        // create random userID for each user
        // create random sequence of 16 hexadecimal digits
        const userId = crypto.randomBytes(16).toString('hex')
        
        // environment variables
        const serverClient = connect( api_key, api_secret, app_id);

        // hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create user token
        const token = serverClient.createUserToken(userId);

        // return all data to front end
        // more secure getting data from backend
        res.status(200).json({token, fullName, username, userId, hashedPassword, phoneNumber})

    } catch (error) {
        console.log(error)
        res.status(500).json({message: error}) 
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const serverClient = connect(api_key, api_secret, app_id);

        // we want to query all users from database that match this username
        const client = StreamChat.getInstance(api_key, api_secret)

        // we're taking the username, query all users from database to see if anyone matches
        const { users } = await client.queryUsers({ name: username });
        console.log("users login", users)

        // if no users match
        if(!users.length) return res.status(400).json({ message: 'User not found' })

        // if users match, check password encryption
        const success = await bcrypt.compare(password, users[0].hashedPassword)

        // create new user token
        // pass that user's specific id
        const token = serverClient.createUserToken(users[0].id)

        // if success send it back
        if (success) {
            res.status(200).json({ token, fullName: users[0].fullName, username, userId: users[0].id })
        } else {
            res.status(500).json({ message: "Incorrect password."})
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({message: error}) 
    }
};


module.exports = { signup, login }