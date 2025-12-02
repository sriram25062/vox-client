// src/pages/Home/Home.jsx
import Card from "../../Components/Card.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import SideNavbar from "../../Components/SideNavbar.jsx";
import { useState, useEffect, useRef } from "react";
import { API_URL } from "../../api";
import axios from "axios";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Home() {
  const [users, setUsers] = useState([]);
  const [searched, setSearched] = useState("");
  const [posts, setPosts] = useState([]);

  const navigate = useNavigate();
  const isFirstRun = useRef(true);
  const fileInputRef = useRef(null);

  const [inlineImageFile, setInlineImageFile] = useState(null);
  const [inlineImagePreview, setInlineImagePreview] = useState(null);
  const [croppedPreview, setCroppedPreview] = useState(null);
  const [inlineTitle, setInlineTitle] = useState("");
  const [inlineDesc, setInlineDesc] = useState("");
  const [inlinePrivacy, setInlinePrivacy] = useState("public");

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

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/post/home`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data || []);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
    const refreshHandler = () => fetchPosts();
    window.addEventListener("postCreated", refreshHandler);
    return () => window.removeEventListener("postCreated", refreshHandler);
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let baseUrl = `${API_URL}/user/find`;
        if (searched.trim() !== "") {
          baseUrl = `${baseUrl}?username=${encodeURIComponent(searched.trim())}`;
        }

        const response = await fetch(baseUrl, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const data = await response.json();
        const filteredUsers = (data.userList || []).filter(
          (u) => u._id !== loggedInUserId
        );
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (isFirstRun.current) {
      fetchUsers();
      isFirstRun.current = false;
      return;
    }

    const handler = setTimeout(() => fetchUsers(), 500);
    return () => clearTimeout(handler);
  }, [searched, loggedInUserId]);

  const removeInlineImage = () => {
    setInlineImageFile(null);
    if (inlineImagePreview) URL.revokeObjectURL(inlineImagePreview);
    if (croppedPreview) URL.revokeObjectURL(croppedPreview);
    setInlineImagePreview(null);
    setCroppedPreview(null);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleInlinePost = async (e) => {
    e.preventDefault();

    if (!inlineTitle.trim()) return alert("Please enter a title");
    if (inlineDesc.length > 300)
      return alert("Description must be 300 chars or less");

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append("title", inlineTitle);
      formData.append("description", inlineDesc);
      formData.append("privacy", inlinePrivacy);

      if (inlineImageFile) {
        formData.append(
          "image",
          inlineImageFile,
          inlineImageFile.name || "post.jpg"
        );
      }

      const res = await axios.post(`${API_URL}/post/create`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPosts((p) => [res.data, ...p]);
      window.dispatchEvent(
        new CustomEvent("postCreated", { detail: res.data })
      );

      setInlineTitle("");
      setInlineDesc("");
      removeInlineImage();
      setInlinePrivacy("public");
    } catch (err) {
      console.error("Inline post failed:", err);
      alert(err?.response?.data?.message || "Failed to create post");
    }
  };

  const openUserProfile = (userId) => {
    if (userId === loggedInUserId) navigate("/profile");
    else navigate(`/user/${userId}`);
  };

  const handleFollowToggle = async (targetId, idx) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${API_URL}/user/${targetId}/follow`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updated = await axios.get(`${API_URL}/user/${targetId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const newUser = updated.data.user;

      setUsers((prev) =>
        prev.map((u, i) => (i === idx ? { ...u, ...newUser } : u))
      );
    } catch (err) {
      console.error("Follow toggle failed", err);
      alert(err?.response?.data?.message || "Could not perform action");
    }
  };

  return (
    <div
      className="d-flex"
      style={{ height: "100vh", width: "100vw" }}
    >
      <div
        className="position-fixed top-0 start-0 vh-100 luxury-outline-black"
        style={{ width: "25%" }}
      >
        <SideNavbar />
      </div>

      <div
        className="overflow-auto d-flex flex-column"
        style={{
          width: "75%",
          marginLeft: "25%",
          height: "100vh",
          background: "linear-gradient(135deg, #0f0f0f, #1a1a1a, #0d0d0d)",
        }}
      >
        <div className="d-flex" style={{ padding: "20px 20px", gap: 20 }}>
          <div
            className="d-flex flex-column luxury-outline-white"
            style={{ height: "100%", width: "70%" }}
          >
            <form
              onSubmit={handleInlinePost}
              className="p-3 rounded"
              style={{ backgroundColor: "#161616", color: "white" }}
            >
              {/* Your inline post form UI here */}
            </form>

            <div className="mt-4">
              {posts.length === 0 ? (
                <p className="text-secondary">No posts yet</p>
              ) : (
                posts.map((p) => (
                  <div key={p._id} className="mb-3">
                    <Card
                      post={p}
                      onUserClick={() => openUserProfile(p.userId._id)}
                    />
                  </div>
                ))
              )}
            </div>
          </div>

          <div
            className="luxury-outline-white"
            style={{ width: "30%", height: "100%", paddingLeft: 20 }}
          >
            <div className="position-sticky top-0" style={{ zIndex: 999 }}>
              <div
                className="d-flex"
                style={{ width: "100%", paddingLeft: 15, paddingRight: 10 }}
              >
                <div className="position-relative">
                  <input
                    type="text"
                    className="form-control rounded-pill ps-5 custom-input"
                    placeholder="Search"
                    style={{ backgroundColor: "white", border: "none" }}
                    onChange={(e) => setSearched(e.target.value)}
                  />
                  <i
                    className="bi bi-search position-absolute top-50 start-0 translate-middle-y ps-3"
                    style={{ fontSize: "18px" }}
                  ></i>
                </div>
              </div>

              <br />

              <div style={{ overflowY: "auto" }}>
                <h5 className="text-light">You might like...</h5>
                <hr className="text-light" />

                {users.length === 0 ? (
                  <p className="text-secondary">No users found</p>
                ) : (
                  users.map((u, idx) => (
                    <div
                      key={u._id || idx}
                      className="p-2 mb-2 rounded d-flex align-items-center justify-content-between"
                      style={{ backgroundColor: "#212121", color: "white" }}
                    >
                      <div
                        className="d-flex align-items-center"
                        style={{ gap: 12, cursor: "pointer" }}
                        onClick={() => openUserProfile(u._id)}
                      >
                        <img
                          src={u.profileImage || "/avatar1.jpg"}
                          alt="dp"
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                        <div>
                          <div className="mb-0 fw-bold">
                            {u.fullname || "Unnamed User"}
                          </div>
                          <div className="small text-secondary">
                            @{u.username || "user"}
                          </div>
                        </div>
                      </div>

                      <div>
                        {u.isFollowing ? (
                          <button
                            className="btn btn-outline-light btn-sm"
                            onClick={() => handleFollowToggle(u._id, idx)}
                          >
                            Unfollow
                          </button>
                        ) : u.hasRequested ? (
                          <button
                            className="btn btn-outline-light btn-sm"
                            onClick={() => handleFollowToggle(u._id, idx)}
                          >
                            Requested
                          </button>
                        ) : (
                          <button
                            className="btn btn-outline-light btn-sm"
                            onClick={() => handleFollowToggle(u._id, idx)}
                          >
                            Follow
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
