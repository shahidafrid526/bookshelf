import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import "./reg.css";

export const Auth = () => {
  return (
    <div>
      <Register />
    </div>
  );
};

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/auth/register", { username, password });
      alert(response.data.message);
      navigate("/signin");
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("An error occurred");
      }
      console.error(error);
    }
  };

  return (
    <div className="register">
      <Form
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        label={"Register"}
        handleSubmit={handleSubmit}
      />
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
};

const Form = ({ username, setUsername, password, setPassword, label, handleSubmit }) => {
  return (
    <div className="login-div">
      <div className="logo"></div>
      <div className="title">{label}</div>
      <form onSubmit={handleSubmit}>
        <div className="fields">
          <div className="username">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <input type="username" className="user-input" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="password">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <input type="password" className="pass-input" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
          </div>
        </div>
        <button className="signin-button" type="submit">{label}</button>

        <div className='logli'>
          or
          <Link to="/signin" className="nav-link">Login</Link>
        </div>
      </form>
    </div>
  )    
};
