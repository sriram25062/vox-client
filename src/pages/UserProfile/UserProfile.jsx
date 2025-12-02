// src/pages/UserProfile/UserProfile.jsx
import { useEffect, useState } from "react";
import SideNavbar from "../../Components/SideNavbar.jsx";
import Card from "../../Components/Card.jsx";
import axios from "axios";
import { API_URL } from "../../api";
import { useParams, useNavigate } from "react-router-dom";

function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/user/${id}`, { headers: { Authorization: `Bearer ${token}` }});
        setProfile(res.data.user);
        // fetch posts (getPostsByUser uses auth to determine visibility)
        const postsRes = await axios.get(`${API_URL}/post/user/${id}`, { headers: { Authorization: `Bearer ${token}` }});
        setPosts(postsRes.data || []);
      } catch (err) {
        console.error(err);
        alert("Could not load profile");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, token]);

  const handleFollowToggle = async () => {
    try {
      await axios.post(`${API_URL}/user/${id}/follow`, {}, { headers: { Authorization: `Bearer ${token}` }});
      // refresh profile flags
      const res = await axios.get(`${API_URL}/user/${id}`, { headers: { Authorization: `Bearer ${token}` }});
      setProfile(res.data.user);
      window.dispatchEvent(new CustomEvent("followUpdated"));
    } catch (err) {
      console.error(err);
      alert("Action failed");
    }
  };

  if (loading) return <div style={{padding:20}}>Loading...</div>;
  if (!profile) return <div style={{padding:20}}>Profile not found</div>;

  return (
    <div className="d-flex" style={{ height: "100vh" }}>
      <div className="luxury-outline-black" style={{ width: "25%" }}><SideNavbar/></div>
      <div className="overflow-auto" style={{ width: "75%" }}>
        <div style={{ background: "linear-gradient(135deg, #0f0f0f, #1a1a1a, #0d0d0d)", width:"100%", height:"255px" }}></div>
        <div className="container">
          <div className="d-flex flex-column" style={{ width:"100%", padding:"0% 10%", gap:"1rem", transform:"translateY(-80px)" }}>
            <div style={{display:"flex", gap:20, alignItems:"center"}}>
              <img src={profile.profileImage || "/avatar1.jpg"} alt="profile" style={{height:200, width:200, borderRadius:16, objectFit:"cover", cursor:"pointer", border:"2px solid #fff"}} />
              <div style={{flex:1}}>
                <h3 style={{margin:0}}>{profile.fullname}</h3>
                <div className="text-secondary">@{profile.username}</div>
                <p style={{color:"#9E9E9E"}}>{profile.bio}</p>

                <div className="d-flex" style={{gap:"10px", marginTop:8}}>
                  {profile.isFollowing ? (
                    <button className="btn btn-outline-light" onClick={handleFollowToggle}>Unfollow</button>
                  ) : profile.hasRequested ? (
                    <button className="btn btn-outline-light" onClick={handleFollowToggle}>Requested</button>
                  ) : (
                    <button className="btn btn-primary" onClick={handleFollowToggle}>Follow</button>
                  )}

                  <button className="btn btn-light" onClick={() => navigate(`/messages?to=${profile._id}`)}>Message</button>
                </div>
              </div>

              <div style={{display:"flex", flexDirection:"column", gap:8, alignItems:"flex-end"}}>
                <div><strong>{profile.postsCount ?? 0}</strong><div style={{fontSize:12,color:"#9E9E9E"}}>Posts</div></div>
                <div><strong>{profile.followersCount ?? 0}</strong><div style={{fontSize:12,color:"#9E9E9E"}}>Followers</div></div>
                <div><strong>{profile.followingCount ?? 0}</strong><div style={{fontSize:12,color:"#9E9E9E"}}>Following</div></div>
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
                  <div className="col-12 col-md-6 col-lg-3 mb-5" key={post._id}>
                    <Card post={post} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
