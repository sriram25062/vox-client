import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Login.css"
import { BrandLogo } from '../../assets';
import {Link, useNavigate} from "react-router-dom";
import api from '../../api';
import {useAuth} from "../../context/AuthContext";

function Login() {

  const [identifier, setIdentifier] = useState(""); // email | username
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!identifier || !password) {
      setError("Please enter both fields.");
      return;
    }

    try {
      setLoading(true);

            const res = await api.post('/user/login', {
        identifier,
        password,
      });

      setSuccess(res?.data?.message || "Login successful!");

      login(res.data.token);
      // Redirect to home/dashboard after success
      setTimeout(() => navigate("/home"), 1000);
    } catch (err) {
      const msg = err?.response?.data?.message || "Invalid credentials";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

    return (
        <div className='container-fluid vh-100 d-flex justify-content-center align-items-center '  style={{background: "linear-gradient(135deg, #0f0f0f, #1a1a1a, #0d0d0d)"}}>
            <div className='d-flex flex-column' style={{gap:"2rem"}}>
                <div className='card shadow d-flex justify-content-center align-items-center' style={{background:"linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))", padding:"1rem", borderRadius: "1rem", backdropFilter: "blur(10px)",  WebkitBackdropFilter: "blur(10px)",  border: "1px solid rgba(255, 255, 255, 0.1)", boxShadow: "0 0 0 2px rgba(255,255,255,0.1), 0 0 0 6px rgba(255,255,255,0.05)", outline: "2px solid rgba(255, 255, 255, 0.05)", outlineOffset: "10px"}}>
                    <img src={BrandLogo} alt="Logo" style={{width:"10rem", height:"10rem"}}/>
                    <form onSubmit={handleSubmit} className='d-flex flex-column justify-content-center align-items-center w-100'>
                        <div className='d-flex flex-column' style={{width:"90%", gap:"15px"}}>
                            <input 
                                type="text" 
                                className="form-control  text-white" 
                                placeholder="user name or email" 
                                style={{backgroundColor:"#1f1f1fff"}} 
                                value={identifier} 
                                onChange={(e) => setIdentifier(e.target.value)}
                            />
                            <input 
                                type="password" 
                                className="form-control" 
                                placeholder="Password" 
                                style={{backgroundColor:"#1c1c1c", color:"#f0f0f3"}} 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div><br/>

                        {error && (
                            <div className="alert alert-danger" style={{ width: "90%" }}>
                            {error}
                            </div>
                        )}
                        {success && (
                            <div className="alert alert-success" style={{ width: "90%" }}>
                            {success}
                            </div>
                        )}

                        <button 
                            type="submit" 
                            className="btn btn-secondary" 
                            style={{width:"90%", font:"Roboto,sans-serif", backgroundColor:"#3958f5ff", color:"#f0f0f3"}} 
                            disabled = {loading}
                        >
                            {loading ? "Logging in..." : "Log in"}
                        </button>
                    </form><br/>
                    <Link to="/forgot-password" className='underline'>Forgot Password?</Link>
                </div>
                <div className='card shadow' style={{background:"linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))", padding:"1rem 2rem", borderRadius: "1rem", backdropFilter: "blur(10px)",  WebkitBackdropFilter: "blur(10px)",  border: "1px solid rgba(255, 255, 255, 0.1)", boxShadow: "0 0 0 2px rgba(255,255,255,0.1), 0 0 0 6px rgba(255,255,255,0.05)", outline: "2px solid rgba(255, 255, 255, 0.05)", outlineOffset: "10px"}}>
                    <span style={{font:"16px Roboto,sans-serif", color:"white"}}>
                        Don't have an account? {" "} 
                        <Link to="/signup" style={{textDecoration: 'none', color:"#3958f5ff"}}>
                        Sign up
                        </Link>
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Login;