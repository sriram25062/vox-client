// src/pages/Explore/Explore.jsx
import SideNavbar from "../../Components/SideNavbar.jsx";
import Card from "../../Components/Card.jsx";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../api";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Explore() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  let loggedInUserId = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      loggedInUserId = decoded.id;
    } catch (err) {
      console.error("Failed to decode token", err);
    }
  }

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/post/explore`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, []);

  const openUser = (id) => {
    if (id === loggedInUserId) navigate("/profile");
    else navigate(`/user/${id}`);
  };

  return (
    <div className="d-flex" style={{ height: "100vh" }}>
      <div style={{ width: "25%" }}>
        <SideNavbar />
      </div>
      <div style={{ width: "75%", overflow: "auto", padding: 24 }}>
        <h3 style={{ color: "black" }}>Explore</h3>
        <div className="container">
          <div className="row g-4">
            {posts.length === 0 ? (
              <div className="col-12">No public posts yet</div>
            ) : (
              posts.map((p) => (
                <div className="col-12 col-md-6 col-lg-3" key={p._id}>
                  <Card
                    post={p}
                    onUserClick={() => openUser(p.userId._id)}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Explore;
