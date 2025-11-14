import React, { useEffect, useState } from "react";
import Button from "../../Components/Button.jsx";
import Card from "../../Components/Card.jsx";
import SideNavbar from "../../Components/SideNavbar.jsx";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { API_URL } from "../../api";
import 'bootstrap/dist/css/bootstrap.min.css';
import EditProfileModal from "../../Components/EditProfileModal.jsx";

function Profile() {
  const { user: tokenUser, loading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [deletePopupId, setDeletePopupId] = useState(null); // ✅ delete popup

  const token = localStorage.getItem("token");

  // ---------------- FETCH PROFILE & POSTS ----------------
  useEffect(() => {
    if (loading) return;
    if (!token) { setProfile(null); return; }

    const fetchData = async () => {
      try {
        setFetching(true);
        const resProfile = await axios.get(`${API_URL}/user/profile`, { headers: { Authorization: `Bearer ${token}` }});
        const userId = resProfile.data.user._id;
        const resPosts = await axios.get(`${API_URL}/post/user/${userId}`, { headers: { Authorization: `Bearer ${token}` }});
        setProfile(resProfile.data.user);
        setPosts(resPosts.data || []);
      } catch (err) {
        console.error(err);
        setProfile(null);
      } finally { setFetching(false); }
    };

    fetchData();
  }, [loading, tokenUser, token]);

  // ---------------- HANDLERS ----------------
  const handleProfileUpdated = (patch) => setProfile(prev => ({...prev, ...patch}));

  // ----- DELETE POST -----
  const handleDeleteClick = (postId) => setDeletePopupId(postId);
  const cancelDelete = () => setDeletePopupId(null);
  const confirmDeletePost = async (postId) => {
    try {
      await axios.delete(`${API_URL}/post/delete/${postId}`, { headers: { Authorization: `Bearer ${token}` }});
      setPosts(prev => prev.filter(post => post._id !== postId));
      setProfile(prev => ({ ...prev, postsCount: (prev.postsCount ?? 1) - 1 }));
    } catch (err) {
      console.error("Failed to delete post:", err);
      alert("Failed to delete post. Try again.");
    } finally {
      setDeletePopupId(null);
    }
  };

  if (loading || fetching) return <div style={{padding:20}}>Loading...</div>;
  if (!profile) return <div style={{padding:20}}>Please login to view profile.</div>;

  return (
    <div className="d-flex">
      <div className="luxury-outline-black"><SideNavbar/></div>
      <div className="overflow-auto" style={{height:"100vh", width:"100%"}}>
        <div style={{ background: "linear-gradient(135deg, #0f0f0f, #1a1a1a, #0d0d0d)", width:"100%", height:"255px" }}></div>
        <div className="container">
          <div className="d-flex flex-column" style={{ width:"100%", padding:"0% 16%", gap:"1rem", transform:"translateY(-80px)" }}>
            <div style={{display:"flex", gap:20, alignItems:"center"}}>
              <img className="luxury-outline-black" src={profile.profileImage || "/avatar1.jpg"} alt="profile" style={{height:250, width:250, borderRadius:16, objectFit:"cover", cursor:"pointer", border:"2px solid #fff"}} onClick={()=>setOpenEdit(true)} />
              <div style={{flex:1}}>
                <h3 style={{margin:0}}>{profile.fullname}</h3>
                <div className="text-secondary">@{profile.username}</div>
                <p style={{color:"#9E9E9E"}}>{profile.bio}</p>
              </div>
              <div><Button label={"Edit Profile"} onClick={()=>setOpenEdit(true)} style={{backgroundColor:"#212121"}} bootstrap="btn btn-dark"/></div>
            </div>

            <div className="d-flex flex-wrap" style={{gap:"20px"}}>
              <div className="d-flex" style={{gap:"10px", font:"16px Roboto,sans-serif"}}><strong>{profile.postsCount ?? 0}</strong><span style={{color:"#9E9E9E"}}>Posts</span></div>
              <div className="d-flex" style={{gap:"10px", font:"16px Roboto,sans-serif"}}><strong>{profile.followersCount ?? 0}</strong><span style={{color:"#9E9E9E"}}>Followers</span></div>
              <div className="d-flex" style={{gap:"10px", font:"16px Roboto,sans-serif"}}><strong>{profile.followingCount ?? 0}</strong><span style={{color:"#9E9E9E"}}>Following</span></div>
            </div>
          </div>

          <div className="container my-5">
            <h3 className="fw-semibold" style={{font:"30px Roboto,sans-serif", color:"black"}}>Latest posts</h3>
            <div className="row g-4">
              {posts.length === 0 ? (
                <div className="col-12">
                  <div className="d-flex flex-column justify-content-center h-100" style={{backgroundColor:"black", color:"white", padding:"24px", gap:"20px", borderRadius:"8px"}}>
                    <h3>No posts yet</h3>
                    <p>Start sharing posts.</p>
                  </div>
                </div>
              ) : posts.map((post, idx) => (
                <div className="col-12 col-md-6 col-lg-3 mb-5" key={idx}>
                  <Card post={post} />
                  {/* ---------- DELETE BUTTON ---------- */}
                  <div className="mt-3 d-flex justify-content-end position-relative">
                    <button 
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDeleteClick(post._id)}
                      style={{borderRadius: "6px", fontWeight: "600"}}
                    >
                      Delete
                    </button>

                    {deletePopupId === post._id && (
                      <div
                        className="position-absolute start-50 translate-middle-x p-3 rounded shadow"
                        style={{
                          bottom: "110%",
                          width: "12rem",
                          backgroundColor: "#2b2b2b",
                          color: "white",
                          zIndex: 100,
                          border: "1px solid rgba(255,255,255,0.1)",
                          textAlign: "center"
                        }}
                      >
                        <p className="mb-2 text-light small">Delete this post?</p>
                        <div className="d-flex gap-2">
                          <button className="btn btn-danger btn-sm flex-1" onClick={() => confirmDeletePost(post._id)}>Yes</button>
                          <button className="btn btn-secondary btn-sm flex-1" onClick={cancelDelete}>No</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <EditProfileModal isOpen={openEdit} onClose={()=>setOpenEdit(false)} initialBio={profile.bio} onUpdated={handleProfileUpdated} />
    </div>
  );
}

export default Profile;


