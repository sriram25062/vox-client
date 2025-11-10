import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Register.css";
import { BrandLogo } from '../../assets';
import {Link} from "react-router-dom";
import api from '../../api';

function Register() {
    // form state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullname, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    // UI state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!acceptedTerms) {
            setError('Please accept the Terms of Service and Privacy Policy.');
            return;
        }

        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        if (!isEmail) {
            setError('Please enter a valid email');
            return;
        }

        const payload = {
            fullname,
            username,
            password,
        };

        if (isEmail) payload.email = email.trim();

        try {
            setLoading(true);
            const res = await api.post('/user/register', payload);
            // assume API returns message or user data
            setSuccess(res?.data?.message || 'Registration successful');
            // optionally clear form
            setEmail('');
            setPassword('');
            setFullName('');
            setUsername('');
            setAcceptedTerms(false);
        } catch (err) {
            // safe error reading
            const msg = err?.response?.data?.message || err.message || 'Registration failed';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='container-fluid vh-100 d-flex justify-content-center align-items-center '  style={{background: "linear-gradient(135deg, #0f0f0f, #1a1a1a, #0d0d0d)"}}>
            <div className='d-flex flex-column' style={{gap:"2rem"}}>
                <div className='card shadow  d-flex justify-content-center align-items-center' style={{background:"linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))", padding:"1rem", borderRadius: "1rem", backdropFilter: "blur(10px)",  WebkitBackdropFilter: "blur(10px)",  border: "1px solid rgba(255, 255, 255, 0.1)", boxShadow: "0 0 0 2px rgba(255,255,255,0.1), 0 0 0 6px rgba(255,255,255,0.05)", outline: "2px solid rgba(255, 255, 255, 0.05)", outlineOffset: "10px"}}>
                    <img src={BrandLogo} alt="Logo" style={{width:"6rem", height:"6rem"}}/>
                    <div className='d-flex flex-column justify-content-center align-items-center'>
                        {/* <span style={{font:"16px Roboto,sans-serif", color:"#9e9e9e"}}>Sign up to see posts and stories</span>
                        <span style={{font:"16px Roboto,sans-serif", color:"#9e9e9e"}}>from your friends.</span> */}
                    </div><br/>
                    <form onSubmit={handleSubmit} className='d-flex flex-column justify-content-center align-items-center w-100'>
                        <div className='d-flex flex-column' style={{width:"95%", gap:"8px"}}>
                            <div>
                                <input
                                    type="text"
                                    className="form-control text-white"
                                    placeholder="Email"
                                    style={{backgroundColor:"#1f1f1fff"}}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <input
                                    type="password"
                                    className="form-control text-white"
                                    placeholder="Password"
                                    style={{backgroundColor:"#1f1f1fff"}}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Full Name"
                                    style={{backgroundColor:"#1c1c1c", color:"#f0f0f3"}}
                                    value={fullname}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Username"
                                    style={{backgroundColor:"#1c1c1c", color:"#f0f0f3"}}
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                        </div><br/>
                        <div className='d-flex justify-content-center' style={{gap: "5px"}}>
                            <input
                                type="checkbox"
                                className="form-check-input"
                                checked={acceptedTerms}
                                onChange={(e) => setAcceptedTerms(e.target.checked)}
                            />
                            <p style={{font:"10px Roboto,sans-serif", color:"#9e9e9e", margin:"0.25rem 0 0 0"}}>By clicking "Next", I agree to the <Link to="/terms">Terms of Service</Link> and{" "}<Link to="/privacy">Privacy Policy</Link>.</p>
                        </div><br/>

                        {error && <div className="alert alert-danger" style={{width: '95%'}}>{error}</div>}
                        {success && <div className="alert alert-success" style={{width: '95%'}}>{success}</div>}

                        <button type="submit" className="btn btn-secondary" style={{width:"95%", font:"Roboto,sans-serif", backgroundColor:"#3958f5ff", color:"#f0f0f3"}} disabled={loading}>
                            {loading ? 'Signing up...' : 'Sign up'}
                        </button>
                    </form><br/>
                </div>
                <div className='card shadow d-flex justify-content-center align-items-center' style={{background:"linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))", padding:"1rem 2rem", borderRadius: "1rem", backdropFilter: "blur(10px)",  WebkitBackdropFilter: "blur(10px)",  border: "1px solid rgba(255, 255, 255, 0.1)", boxShadow: "0 0 0 2px rgba(255,255,255,0.1), 0 0 0 6px rgba(255,255,255,0.05)", outline: "2px solid rgba(255, 255, 255, 0.05)", outlineOffset: "10px"}}>
                    <span style={{font:"16px Roboto,sans-serif", color:"#9e9e9e"}}>Have an account? <Link to="/login" style={{textDecoration:'none', color:"#3958f5ff"}}>Log in</Link></span>
                </div>
            </div>
        </div>
    )
}

export default Register;