import Button from "./Button"
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrandLogo } from '../assets';
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";

function SideNavbar() {

    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);
    const popupRef = useRef(null);

    const navData = [
        {label:"Home", path:"/home", icon: "cottage"},
        {label: "Explore", path:"/explore", icon: "explore"},
        {label: "Notifications", path:"/notifications", icon: "favorite"},
        {label: "Messages", path:"/messages", icon: "send"},
        {label: "Communities", path:"/communities", icon: "communities"},
        {label: "Profile", path:"/profile", isProfile: true},
    ]

    const handleLogout = () => {
    logout();
    navigate("/login");
    };

    const togglePopup = () => {
        setShowPopup((prev) => !prev);
    };

  // 👇 Detect clicks outside popup
    useEffect(() => {
        const handleClickOutside = (event) => {
        if (popupRef.current && !popupRef.current.contains(event.target)) {
            setShowPopup(false);
        }
        };

        if (showPopup) {
        document.addEventListener("mousedown", handleClickOutside);
        } else {
        document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showPopup]);

    return(
        <div className="navbar d-flex flex-column" style={{height:'100vh', width:'100%', background: "linear-gradient(135deg, #0f0f0f, #1a1a1a, #0d0d0d)", backgroundAttachment: "fixed"}}>
            <div className="container flex-column">
                <div>
                        <img src={BrandLogo} alt="Logo" style={{width:"6rem", height:"6rem"}}/>
                </div>
                <div className="d-flex flex-column justify-content-center align-items-start" style={{gap:"8px"}}>
                    {navData.map((value) => (
                        <Link to={value.path} key={value.label} style={{textDecoration:"none"}}> 
                        <Button
                        label={
                          <div className="d-flex align-items-center" style={{ gap: "8px" }}>
                            {value.isProfile ? (
                                <img
                                    src={user ?. profilePicUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                                    alt="Profile"
                                    style={{
                                    width: "28px",
                                    height: "28px",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                    border: "2px solid white"
                                    }}
                                />
                            ) : (
                               <span class="material-symbols-outlined">{value.icon}</span>
                             )}
                            {value.label}    
                          </div>
                        }
                        style={{fontSize:"20px", fontWeight:"600", color:"white", backgroundColor: "#212121"}} 
                        bootstrap= "btn btn-dark"
                        />
                        </Link>
                    ))}
                </div><br/>
                <Link to="/signup">
                    <Button label={"Post"} style={{fontSize:"20px", width:"15rem", fontWeight:"600", backgroundColor: "white", color: "black"}} bootstrap= "btn btn-dark"/>
                </Link>
            </div>
            <div className="mt-auto mb-4 text-center position-relative" ref={popupRef}>
                <button
                className="btn btn-dark d-flex align-items-center justify-content-between"
                style={{
                    width: "15rem",
                    fontWeight: "600",
                    fontSize:"20px",
                    backgroundColor: "white",
                    color: "black"
                }}
                onClick={togglePopup}
                >
                    {user ? `${user.fullname} (@${user.username})` : "Account"}
                    <span className="material-symbols-outlined">more_vert</span>
                </button>

                {showPopup && (
                <div
                    className="position-absolute start-50 translate-middle-x p-3 rounded shadow"
                    style={{
                    bottom: "110%", // popup above the button
                    width: "12rem",
                    backgroundColor: "#2b2b2b",
                    color: "white",
                    zIndex: 100,
                    border: "1px solid rgba(255,255,255,0.1)",
                    }}
                >
                    <p className="mb-2 text-light small">Want to log out?</p>
                    <button className="btn btn-danger btn-sm w-100" onClick={handleLogout}>
                    Logout
                    </button>
                </div>
                )}
            </div>
            {/* <Link to="/" className="mt-auto mb-4">
                <Button label={"Log out"} style={{width:"15rem", fontWeight:"600", backgroundColor: "white", color: "black"}} bootstrap= "btn btn-dark"/>
            </Link> */}
       </div>
    )
}

export default SideNavbar;