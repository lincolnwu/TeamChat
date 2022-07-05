import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';

import signinImage from '../assets/signup3.png';

const initialState = {
    fullName: '',
    username: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    avatarURL: '',
}

const cookies = new Cookies()

const Auth = () => {

    const [form, setForm] = useState(initialState);

    // variable to know if we're on the sign-in or sign-up form
    const [isSignup, setIsSignup] = useState(false);

    const [errorCode, setErrorCode] = useState('');

    
    // handle all input from input fields
    const handleChange = (e) => {
        // the form is NOT a single text field, it's an OBJECT
        // spread all other items/inputs from the form
        // since we only change one, we want to keep all other ones
        // to change a SPECIFIC one, use e.target.name in [], since that is the object key
        setForm({ ...form, [e.target.name]: e.target.value})
    }

    // second, go to handleSubmit
    // Login/register button
    const handleSubmit = async (e) => {
        e.preventDefault();

        // third, get all data from the form
        // pass form data to backend
        // @@ if user is logging in, they won't need to type in their full name,
        // so it'll remain as an empty string
        const { username, password, phoneNumber, avatarURL } = form;

        // fourth, set the base URL
        // specify the URL the request is made to
        const URL = 'https://team-chat-app1.herokuapp.com/auth';

        // fifth, make the appropriate request to the backend URL depending on signup/login 
        // sixth, pass all the form data and get the token, userId, hashedPassword back from the backend
            
        // make axios call, plus whether it's a signup or login
        // we pass the data from the front end to backend
        // but we also destructure to get data back from it (use these to add to browser cookies)
        // @@ so instead, we need to get the fullname from the database instead
        try {
            const {data: { token, userId, hashedPassword, fullName } } = await axios.post(`${URL}/${isSignup ? 'signup' : 'login'}`, 
            // pass object in with all the data
            // @@ so on signup, we need to take the fullName from our signup form to send to the database
            {
                username, 
                fullName: form.fullName, 
                password, 
                phoneNumber, 
                avatarURL
        })
            // seventh, store all this information in our cookies
            // store all of this data inside of cookies
            cookies.set('token', token);
            cookies.set('username', username);
            cookies.set('fullName', fullName);
            cookies.set('userId', userId);

            // // if creating the account, include the other data
            if (isSignup) {
                cookies.set('phoneNumber', phoneNumber);
                cookies.set('avatarURL', avatarURL);
                cookies.set('hashedPassword', hashedPassword);
            }

            // eigth, reload the application so the authToken is filled, so we won't hit <Auth/> again
            // instead, it will go to the chat as a logged in user
            // after setting the cookies, reload the browser
            window.location.reload();

        } catch (error) {
            console.log(error.response.data)
            console.log(error.response.request.status)
            console.log("error code: ", errorCode)
            if (error.response.request.status === 400) {
                setErrorCode('400')
            } else if (error.response.request.status === 500){
                setErrorCode('500')
            }
            else if (error.response.request.status === 600) {
                setErrorCode('600')
            }
        }
    }

    // Change state depending on previous state
    const switchMode = () => {
        setIsSignup((previousIsSignup) => !previousIsSignup)
        setErrorCode((previousErrorCode) => '')
    }

    // first, fill in all the data from the inputs    
    return (
        <div className="auth__form-container">
            <div className="auth__form-container_image">
                <img src={signinImage} alt="sign in"></img>
                
            </div>
            <div className="auth__form-container_fields">
                
                <div className="auth__form-container_fields-content">
                    <p>
                        {isSignup ? 'Sign Up' : 'Sign In'}
                        <form onSubmit={handleSubmit}>
                            {isSignup && (
                                <div className="auth__form-container_fields-content_input">
                                    <label htmlFor="FullName">Full Name</label>
                                    <input 
                                        name="fullName"
                                        type="text"
                                        placeholder="Full Name"
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            )}
                            <div className="auth__form-container_fields-content_input">
                                    <label htmlFor="FullName">Username</label>
                                    <input 
                                        name="username"
                                        type="text"
                                        placeholder="Username"
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            {/* {isSignup && (
                                <div className="auth__form-container_fields-content_input">
                                    <label htmlFor="phoneNumber">Phone Number</label>
                                    <input 
                                        name="phoneNumber"
                                        type="text"
                                        placeholder="Phone Number"
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            )}
                            {isSignup && (
                                <div className="auth__form-container_fields-content_input">
                                    <label htmlFor="avatarURL">Avatar URL</label>
                                    <input 
                                        name="avatarURL"
                                        type="text"
                                        placeholder="Avatar URL"
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            )} */}
                            <div className="auth__form-container_fields-content_input">
                                    <label htmlFor="password">Password</label>
                                    <input 
                                        name="password"
                                        type="password"
                                        placeholder="Password"
                                        onChange={handleChange}
                                        required
                                    />
                            </div>
                            {errorCode === '400' && (
                                <div>
                                    <p style={{color: "red", fontSize:"14px", }}>User not found. Please try again or sign up.</p>
                                </div>
                            )}
                            {errorCode === '500' && (
                                <div>
                                    <p style={{color: "red", fontSize:"14px", }}>Incorrect username/password. Please try again.</p>
                                </div>
                            )}

                            {/* Confirm password during account creation */}
                            {isSignup && (
                                <div className="auth__form-container_fields-content_input">
                                    <label htmlFor="confirmPassword">Confirm Password</label>
                                    <input 
                                        name="confirmPassword"
                                        type="password"
                                        placeholder="Confirm Password"
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            )}
                            {isSignup && errorCode === '600' && (
                                <div>
                                    <p style={{color: "red", fontSize:"14px", }}>Error: Username already taken.</p>
                                </div>
                            )}
                            <div classNem="auth__form-container_fields-content_button">
                                <button>{isSignup ? "Sign Up" : "Sign in"}</button>
                            </div>
                        </form>
                        <div className="auth__form-container_fields-account">
                            {/* Show diff msg depending on sign up or not */}
                            <p>
                                {isSignup ? "Already have an account? " : "Don't have an account? "}
                                <span onClick={switchMode}>
                                    {isSignup ? "Sign in" : "Sign up"}
                                </span>
                            </p>
                        </div>
                    </p>
                </div>
            </div>
            
        </div>
    )
}

export default Auth
