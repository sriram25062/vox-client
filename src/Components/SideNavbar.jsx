import Button from "./Button";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrandLogo } from "../assets";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../api";

function SideNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);
  const [profileSrc, setProfileSrc] = useState("/avatar1.jpg");

  // 👉 Update profile image when user changes
  useEffect(() => {
    if (!user) {
      setProfileSrc("/avatar1.jpg");
      return;
    }

    // Try to get user image field (backend may use different keys)
    const imagePath =
      user.profileImage ||
      user.profilePic ||
      user.image ||
      user.avatar ||
      "";

    if (!imagePath) {
      setProfileSrc("/avatar1.jpg");
    } else if (imagePath.startsWith("http")) {
      setProfileSrc(imagePath);
    } else {
      // Assume image is saved on server (e.g., "uploads/xyz.jpg")
      setProfileSrc(`${API_URL}/${imagePath.replace(/^\/+/, "")}`);
    }
  }, [user]);

  // 👉 Logout logic
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // 👉 Popup visibility toggle
  const togglePopup = () => setShowPopup((prev) => !prev);

  // 👉 Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 👉 Navigation items
  const navData = [
    { label: "Home", path: "/home", icon: "cottage" },
    { label: "Explore", path: "/explore", icon: "explore" },
    { label: "Notifications", path: "/notifications", icon: "favorite" },
    { label: "Messages", path: "/messages", icon: "send" },
    { label: "Communities", path: "/communities", icon: "groups" },
    { label: "Profile", path: "/profile", isProfile: true },
  ];

  // 👉 Trigger post modal
  const openPostModal = () => {
    window.dispatchEvent(new CustomEvent("openPostModal"));
  };

  return (
    <div
      className="navbar d-flex flex-column"
      style={{
        height: "100vh",
        width: "100%",
        background: "linear-gradient(135deg, #0f0f0f, #1a1a1a, #0d0d0d)",
      }}
    >
      <div className="container flex-column">
        {/* Brand Logo */}
        <div>
          <img src={BrandLogo} alt="Logo" style={{ width: "6rem", height: "6rem" }} />
        </div>

        {/* Navigation buttons */}
        <div
          className="d-flex flex-column justify-content-center align-items-start"
          style={{ gap: "8px" }}
        >
          {navData.map((value) => (
            <Link to={value.path} key={value.label} style={{ textDecoration: "none" }}>
              <Button
                label={
                  <div className="d-flex align-items-center" style={{ gap: "8px" }}>
                    {value.isProfile ? (
                      <img
                        src={profileSrc}
                        alt="Profile"
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: "2px solid white",
                        }}
                      />
                    ) : (
                      <span className="material-symbols-outlined">{value.icon}</span>
                    )}
                    {value.label}
                  </div>
                }
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  color: "white",
                  backgroundColor: "#212121",
                }}
                bootstrap="btn btn-dark"
              />
            </Link>
          ))}
        </div>

        {/* Post Button */}
        <div onClick={openPostModal} style={{ cursor: "pointer", marginTop: "1rem" }}>
          <Button
            label="Create"
            style={{
              fontSize: "20px",
              width: "15rem",
              fontWeight: "600",
              backgroundColor: "white",
              color: "black",
            }}
            bootstrap="btn btn-dark"
          />
        </div>
      </div>

      {/* User info + logout */}
      <div className="mt-auto mb-4 text-center position-relative" ref={popupRef}>
        <div
          onClick={togglePopup}
          className="d-flex align-items-center justify-content-between"
          style={{
            width: "15rem",
            backgroundColor: "white",
            borderRadius: "10px",
            padding: "6px 10px",
            cursor: "pointer",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          }}
        >
          <div className="d-flex align-items-center" style={{ gap: 10 }}>
            <img
              src={profileSrc}
              alt="Profile"
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            <div d-flex justify-content="center" align-items="center" className="text-start">
              <div className="fw-bold" style={{ fontSize: "0.95rem", color: "black" }}>
                {user?.fullname || "User"}
              </div>
              <div className="small text-secondary">@{user?.username || "user"}</div>
            </div>
          </div>
          <span className="material-symbols-outlined" style={{ color: "black" }}>
            more_vert
          </span>
        </div>

        {showPopup && (
          <div
            className="position-absolute start-50 translate-middle-x p-3 rounded shadow"
            style={{
              bottom: "110%",
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
    </div>
  );
}

export default SideNavbar;
