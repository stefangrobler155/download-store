// src/pages/Auth.jsx
import { toast } from "react-toastify";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Auth.css';

export default function Auth({ handleLogin, handleSignup, handleLogout, isLoggedIn, userName }) {
  const [logInData, setLoginData] = useState({
    loginUsername: '',
    loginPassword: '',
  });
  const [signUpData, setSignUpData] = useState({
    signupName: '',
    signupEmail: '',
    signupUsername: '',
    signupPassword: '',
  });
  const navigate = useNavigate();

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleChangeSignup = (e) => {
    const { name, value } = e.target;
    setSignUpData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const loginSubmit = async (e) => {
    e.preventDefault();
    if (!logInData.loginUsername || !logInData.loginPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      await handleLogin(logInData.loginUsername, logInData.loginPassword);
      setLoginData({
        loginUsername: '',
        loginPassword: '',
      });
      navigate('/products');
    } catch (error) {
      console.error('Login failed:', {
        message: error.message,
        data: error.response?.data,
        status: error.response?.status,
      });
    }
  };

  const signupSubmit = async (e) => {
    e.preventDefault();
    if (
      !signUpData.signupName ||
      !signUpData.signupEmail ||
      !signUpData.signupUsername ||
      !signUpData.signupPassword
    ) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      await handleSignup({
        name: signUpData.signupName,
        email: signUpData.signupEmail,
        userName: signUpData.signupUsername,
        password: signUpData.signupPassword,
      });
      setSignUpData({
        signupName: '',
        signupEmail: '',
        signupUsername: '',
        signupPassword: '',
      });
      navigate('/products'); // Redirect after signup
    } catch (error) {
      console.error('Signup failed:', {
        message: error.message,
        data: error.response?.data,
        status: error.response?.status,
      });
    }
  };

  return (
    <div className="auth-page">
      <h1>Login / Signup</h1>
      <div className="auth-container">
        {!isLoggedIn ? (
          <>
            <div className="auth-form">
              <h2>Login</h2>
              <form onSubmit={loginSubmit}>
                <div className="form-group">
                  <label htmlFor="loginUsername">Username</label>
                  <input
                    type="text"
                    id="loginUsername"
                    name="loginUsername"
                    value={logInData.loginUsername}
                    className="form-input"
                    placeholder="Enter username"
                    onChange={handleLoginChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="loginPassword">Password</label>
                  <input
                    type="password"
                    id="loginPassword"
                    name="loginPassword"
                    value={logInData.loginPassword}
                    className="form-input"
                    placeholder="Enter password"
                    onChange={handleLoginChange}
                    required
                  />
                </div>
                <button type="submit" className="submit-btn">Login</button>
              </form>
            </div>
            <div className="auth-form">
              <h2>Signup</h2>
              <form onSubmit={signupSubmit}>
                <div className="form-group">
                  <label htmlFor="signupName">Name</label>
                  <input
                    type="text"
                    id="signupName"
                    name="signupName"
                    value={signUpData.signupName}
                    className="form-input"
                    placeholder="Enter name"
                    onChange={handleChangeSignup}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="signupEmail">Email</label>
                  <input
                    type="email"
                    id="signupEmail"
                    name="signupEmail"
                    value={signUpData.signupEmail}
                    className="form-input"
                    placeholder="Enter email"
                    onChange={handleChangeSignup}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="signupUsername">Username</label>
                  <input
                    type="text"
                    id="signupUsername"
                    name="signupUsername"
                    value={signUpData.signupUsername}
                    className="form-input"
                    placeholder="Enter username"
                    onChange={handleChangeSignup}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="signupPassword">Password</label>
                  <input
                    type="password"
                    id="signupPassword"
                    name="signupPassword"
                    value={signUpData.signupPassword}
                    className="form-input"
                    placeholder="Enter password"
                    onChange={handleChangeSignup}
                    required
                  />
                </div>
                <button type="submit" className="submit-btn">Signup</button>
              </form>
            </div>
          </>
        ) : (
          <div className="auth-welcome">
            <h2>Welcome, {userName || "User"}!</h2>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}