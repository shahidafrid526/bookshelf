import React, { useState } from 'react';
import axios from "axios";
import { useCookies } from 'react-cookie';
import { Link, useNavigate } from 'react-router-dom';
import "./reg.css";

export const Signin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // New state for error message
  const [_, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();

  // New state for user input username
  const [userInputUsername, setUserInputUsername] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Check if username and password are not empty
    if (!username || !password) {
      setErrorMessage("Username and password are required");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/auth/login", {
        username,
        password,
      });

      // Check if the "username" property exists in the API response
      if (response?.data?.username) {
        // Store the "username" and "userID" in local storage from the API response
        window.localStorage.setItem("username", response.data.username);
        window.localStorage.setItem("userID", response.data.userID);
      } else {
        // If "username" is not available, use the user input username
        window.localStorage.setItem("username", userInputUsername);
        window.localStorage.setItem("userID", response.data.userID);
      }

      // Handle the response data here
      setCookies("access_token", response?.data?.token);

      navigate("/"); // Redirect to the home page or desired location
    } catch (err) {
      // Handle the error here
      if (err.response && err.response.data) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage("An error occurred");
      }
    }
  };

  return (
    <div className="register">
      <div className="login-div">
        <div className="logo"></div>
        <div className="title">Login</div>
        {errorMessage && <p style={{ color: "red", margin: "0", marginBottom: "-29px", textAlign: 'center' }}>{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="fields">
            <div className="username">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <input type="username" className="user-input" placeholder="Username" onChange={(e) => {setUsername(e.target.value); setUserInputUsername(e.target.value)}} />
            </div>
            <div className="password">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <input type="password" className="pass-input" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>
          <button className="signin-button" type="submit">Login</button>
        </form>
        <div className="link">
          <Link to="/auth">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};
