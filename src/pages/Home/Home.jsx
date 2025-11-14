import Card from "../../Components/Card.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import SideNavbar from "../../Components/SideNavbar.jsx";
import { useState, useEffect, useRef, useCallback } from "react";
import { API_URL } from "../../api";
import axios from "axios";
import "./Home.css";
import Cropper from "react-easy-crop";
import getCroppedImg from "../../utils/cropImage.js"; // use your util path

function Home() {
  const [users, setUsers] = useState([]);
  const [searched, setSearched] = useState("");
  const [posts, setPosts] = useState([]);

  const isFirstRun = useRef(true);
  const fileInputRef = useRef(null);

  // Inline post states
  const [inlineImageFile, setInlineImageFile] = useState(null); // final file to upload
  const [inlineImagePreview, setInlineImagePreview] = useState(null); // original picked preview
  const [croppedPreview, setCroppedPreview] = useState(null); // preview of cropped result
  const [inlineTitle, setInlineTitle] = useState("");
  const [inlineDesc, setInlineDesc] = useState("");
  const [inlinePrivacy, setInlinePrivacy] = useState("public");
  const [loadingPost, setLoadingPost] = useState(false);

  // Cropping states
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);


  // ✅ fetch home feed
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

  // ✅ fetch user suggestions
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let baseUrl = `${API_URL}/user/find`;
        if (searched.trim() !== "") {
          baseUrl = `${baseUrl}?username=${encodeURIComponent(searched.trim())}`;
        }
        const response = await fetch(baseUrl);
        const data = await response.json();
        setUsers(data.userList || []);
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
  }, [searched]);

  // ---------- Inline Crop + Upload Handlers ----------

  // Handle file picked for inline box: show preview and open cropper
  const handleInlineFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setInlineImageFile(null); // clear previous final file until crop confirm
    setCroppedPreview(null);
    setInlineImagePreview(URL.createObjectURL(file));
    setShowCropper(true);
  };

  // Crop completion callback from react-easy-crop
  const onCropComplete = useCallback((croppedArea, croppedAreaPx) => {
    setCroppedAreaPixels(croppedAreaPx);
  }, []);

  // Confirm crop -> produce blob, set final inlineImageFile and preview
  const handleCropConfirm = async () => {
    try {
      if (!inlineImagePreview || !croppedAreaPixels) {
        // fallback: just keep original file (no crop)
        setShowCropper(false);
        return;
      }
      // inlineImagePreview is an object URL of original picked file.
      // We need original File; we stored only preview. To ensure, we will fetch the original data
      // by converting the preview URL back to a blob via fetch (works with object URLs).
      const resp = await fetch(inlineImagePreview);
      const originalBlob = await resp.blob();
      const originalFile = new File([originalBlob], "inline.jpg", { type: originalBlob.type || "image/jpeg" });

      const croppedBlob = await getCroppedImg(originalFile, croppedAreaPixels);
      const croppedUrl = URL.createObjectURL(croppedBlob);
      setCroppedPreview(croppedUrl);

      // prepare final File to send to server
      const finalFile = new File([croppedBlob], "post.jpg", { type: "image/jpeg" });
      setInlineImageFile(finalFile);

      setShowCropper(false);
    } catch (err) {
      console.error("Crop confirm failed:", err);
      alert("Failed to crop image.");
    }
  };

  const handleCancelCrop = () => {
    // cancel cropping and remove preview
    setShowCropper(false);
    removeInlineImage();
  };

  const removeInlineImage = () => {
    setInlineImageFile(null);
    if (inlineImagePreview) URL.revokeObjectURL(inlineImagePreview);
    if (croppedPreview) URL.revokeObjectURL(croppedPreview);
    setInlineImagePreview(null);
    setCroppedPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
  };

  // Inline post submit: send multipart/form-data to /post/create
  const handleInlinePost = async (e) => {
    e.preventDefault();
    if (!inlineTitle.trim()) return alert("Please enter a title");
    if (inlineDesc.length > 300) return alert("Description must be 300 chars or less");

    setLoadingPost(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", inlineTitle);
      formData.append("description", inlineDesc);
      formData.append("privacy", inlinePrivacy);

      // if we have a final file (cropped or original), append as 'image' — backend expects this key
      if (inlineImageFile) {
        formData.append("image", inlineImageFile, inlineImageFile.name || "post.jpg");
      }

      // send multipart directly to create post endpoint (backend will upload to vercel blob)
      const res = await axios.post(`${API_URL}/post/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // do NOT set Content-Type here; axios will set it including boundary
        },
      });

      // Prepend new post to feed
      setPosts((p) => [res.data, ...p]);

      // notify other pages
      window.dispatchEvent(new CustomEvent("postCreated", { detail: res.data }));

      // reset inline form
      setInlineTitle("");
      setInlineDesc("");
      removeInlineImage();
      setInlinePrivacy("public");
    } catch (err) {
      console.error("Inline post failed:", err);
      alert(err?.response?.data?.message || "Failed to create post");
    } finally {
      setLoadingPost(false);
    }
  };

  // follow handler (unchanged)
  const handleFollow = async (targetId, idx) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_URL}/user/${targetId}/follow`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) =>
        prev.map((u, i) => (i === idx ? { ...u, followRequested: true } : u))
      );
    } catch (err) {
      console.error(err);
      alert("Could not send follow request");
    }
  };

  return (
    <div className="d-flex" style={{ height: "100vh", width: "100vw" }}>
      <div className="position-fixed top-0 start-0 vh-100 luxury-outline-black" style={{ width: "25%" }}>
        <SideNavbar />
      </div>

      <div className="overflow-auto d-flex flex-column" style={{ width: "80%", marginLeft: "25%", height: "100vh", background: "linear-gradient(135deg, #0f0f0f, #1a1a1a, #0d0d0d)" }}>
        <div className="d-flex" style={{ padding: "20px 20px", gap: 20 }}>
          <div className="d-flex flex-column luxury-outline-white" style={{ height: "100%", width: "70%" }}>
            <form onSubmit={handleInlinePost} className="p-3 rounded" style={{ backgroundColor: "#161616", color: "white" }}>
              <input
                placeholder="Title (short)"
                value={inlineTitle}
                onChange={(e) => setInlineTitle(e.target.value)}
                className="form-control mb-2"
                maxLength={60}
                style={{ backgroundColor: "#1b1b1b", border: "none", color: "white" }}
              />
              <div style={{ position: "relative" }}>
                <textarea
                  placeholder="What's happening?"
                  rows={4}
                  className="form-control"
                  value={inlineDesc}
                  onChange={(e) => setInlineDesc(e.target.value)}
                  style={{ backgroundColor: "#1b1b1b", border: "none", color: "white", paddingRight: 48 }}
                />
                <div style={{ position: "absolute", right: 8, top: 8, display: "flex", gap: 8 }}>
                  <label style={{ cursor: "pointer" }}>
                    <input type="file" accept="image/*" onChange={handleInlineFile} ref={fileInputRef} style={{ display: "none" }} />
                    <span className="material-symbols-outlined" style={{ fontSize: 24, color: "#fff" }}>photo_camera</span>
                  </label>
                </div>
              </div>

              {/* Inline Cropper overlay (5:7 aspect) */}
              {showCropper && inlineImagePreview && (
                <div className="mt-2 position-relative" style={{ height: 420, background: "#000", borderRadius: 8, overflow: "hidden" }}>
                  <Cropper
                    image={inlineImagePreview}
                    crop={crop}
                    zoom={zoom}
                    aspect={5 / 7}               /* IMPORTANT: 5:7 aspect as requested */
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                  <div style={{ position: "absolute", right: 12, bottom: 12, display: "flex", gap: 8 }}>
                    <button type="button" className="btn btn-sm btn-light" onClick={handleCropConfirm}>Crop</button>
                    <button type="button" className="btn btn-sm btn-danger" onClick={handleCancelCrop}>Cancel</button>
                  </div>
                </div>
              )}

              {/* Show cropped preview if available */}
              {croppedPreview && !showCropper && (
                <div className="mt-2 position-relative">
                  <img src={croppedPreview} alt="preview" style={{ maxWidth: "100%", borderRadius: 8, maxHeight: 420, objectFit: "cover" }} />
                  <button type="button" onClick={removeInlineImage} className="btn btn-sm btn-danger" style={{ position: "absolute", right: 8, top: 8 }}>Remove</button>
                </div>
              )}

              {/* If user skipped cropping but has original preview (small devices), show it */}
              {!croppedPreview && !showCropper && inlineImagePreview && (
                <div className="mt-2 position-relative">
                  <img src={inlineImagePreview} alt="preview" style={{ maxWidth: "100%", borderRadius: 8, maxHeight: 420, objectFit: "cover" }} />
                  <button type="button" onClick={removeInlineImage} className="btn btn-sm btn-danger" style={{ position: "absolute", right: 8, top: 8 }}>Remove</button>
                </div>
              )}

              <div className="d-flex align-items-center justify-content-between mt-2">
                <select
                  value={inlinePrivacy}
                  onChange={(e) => setInlinePrivacy(e.target.value)}
                  className="form-select w-auto"
                  style={{ backgroundColor: "#1b1b1b", border: "none", color: "white" }}
                >
                  <option value="public">Public (Explore)</option>
                  <option value="private">Private (Followers)</option>
                </select>
                <div>
                  <button type="submit" className="btn btn-primary" disabled={loadingPost}>
                    {loadingPost ? "Posting..." : "Post"}
                  </button>
                </div>
              </div>
            </form>

            {/* Posts feed */}
            <div className="mt-4">
              {posts.length === 0 ? (
                <p className="text-secondary">No posts yet</p>
              ) : (
                posts.map((p) => (
                  <div key={p._id} className="mb-3">
                    <Card title={p.title} img={p.imageUrl} description={p.description} post={p} />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right column */}
          <div className="luxury-outline-white" style={{ width: "30%", height: "100%", paddingLeft: 20 }}>
            <div className="position-sticky top-0" style={{zIndex:999}}>
              <div className="d-flex" style={{  width: "100%", paddingLeft: 15, paddingRight: 10 }}>
                <div className="position-relative">
                  <input
                    type="text"
                    className="form-control rounded-pill ps-5 custom-input"
                    placeholder="Search"
                    style={{ backgroundColor: "white", border: "none" }}
                    onChange={(e) => setSearched(e.target.value)}
                  />
                  <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ps-3" style={{ fontSize: "18px" }}></i>
                </div>
              </div><br />
              <div style={{ overflowY: "auto" }}>
                <h5 className="text-light">You might like...</h5>
                <hr className="text-light" />
                {users.length === 0 ? (
                  <p className="text-secondary">No users found</p>
                ) : (
                  users.map((u, idx) => (
                    <div key={idx} className="p-2 mb-2 rounded d-flex align-items-center justify-content-between" style={{ backgroundColor: "#212121", color: "white" }}>
                      <div className="d-flex align-items-center" style={{ gap: 12 }}>
                        <img src={u.profileImage || "/avatar1.jpg"} alt="dp" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} />
                        <div>
                          <div className="mb-0 fw-bold">{u.fullname || "Unnamed User"}</div>
                          <div className="small text-secondary">@{u.username || "user"}</div>
                        </div>
                      </div>
                      <div>
                        <button className="btn btn-outline-light btn-sm" onClick={() => handleFollow(u._id, idx)}>
                          {u.followRequested ? "Requested" : "Follow"}
                        </button>
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




