import 'bootstrap/dist/css/bootstrap.min.css';
import './Landing.css'
import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';

function Landing() {
    
    const [loadLogo, setloadLogo] = useState(() => true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setloadLogo(false);
        }, 2500);
        return () => clearTimeout(timer);
    }, []);
    
    if (loadLogo) {
        return (
            <div className='d-flex justify-content-center align-items-center' style={{ height: "100vh", width: "100vw", background: "linear-gradient(135deg, #0f0f0f, #1a1a1a, #0d0d0d)" }}>
                <img src="/Brand.png" alt="Logo" style={{width:"10rem", height:"10rem"}}/>
            </div>
        );
    }
    return (
  
        <div className='container-fluid min-vh-100 d-flex flex-column justify-content-center align-items-center flex-lg-row'  style={{margin:0, padding:0, background: "linear-gradient(135deg, #0f0f0f, #1a1a1a, #0d0d0d)"}}>
            <div className='col-6 d-flex justify-content-center align-items-center'>
                <img src="/Brand.png" alt="Logo" style={{width:"50%", height:"auto"}}/>
            </div>
            <div className='col-6 d-flex flex-column justify-content-center align-items-start'>
                <span className='caprasimo-regular' style={{fontSize:"clamp(2rem, 5vw, 4rem)", color:"white"}}>Happenning now</span><br/>
                <span className='caprasimo-regular' style={{fontSize:"clamp(1rem, 3vw, 2rem)", color:"white"}}>Join today.</span><br/><br/>
                <Link to="/signup">
                    <button className="btn btn-primary rounded-pill">
                        Create account
                    </button>
                </Link><br/>
                <span style={{font:"16px Roboto,sans-serif", color:"white"}}>Have an account? <Link to="/login" style={{textDecoration:'none', color:"#3958f5ff"}}>Log in</Link></span>
            </div>
        </div>
    )
}

export default Landing;