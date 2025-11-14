import React, { useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import { API_URL } from "../api";
Modal.setAppElement("#root");

export default function EditProfileModal({ isOpen, onClose, initialBio, onUpdated }) {
  const [bio, setBio] = useState(initialBio || "");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  useEffect(()=>{ setBio(initialBio || ""); setFile(null); setPreview(null); }, [initialBio, isOpen]);

  const handleFile = (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    setFile(f); setPreview(URL.createObjectURL(f));
  };

  const removeCurrentPhoto = async () => {
    const token = localStorage.getItem("token");
    try { setLoading(true); await axios.delete(`${API_URL}/user/profile/photo`, { headers: { Authorization: `Bearer ${token}` } }); onUpdated && onUpdated({ profileImage: "" }); onClose(); }
    catch(e){ alert("Could not remove photo"); console.error(e); } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (file) {
        const fd = new FormData(); fd.append("image", file);
        const resFile = await axios.post(`${API_URL}/user/profile/photo`, fd, { headers: { Authorization: `Bearer ${token}`, "Content-Type":"multipart/form-data" } });
        onUpdated && onUpdated({ profileImage: resFile.data.profileImage });
      }
      await axios.put(`${API_URL}/user/profile`, { bio }, { headers: { Authorization: `Bearer ${token}` } });
      onUpdated && onUpdated({ bio });
      onClose();
    } catch (err) { console.error(err); alert("Failed to update"); } finally { setLoading(false); }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} style={{ overlay:{background:"rgba(0,0,0,0.6)"}, content:{maxWidth:600, margin:"auto"} }}>
      <h4>Edit profile</h4>
      <form onSubmit={handleSubmit}>
        <div style={{display:"flex", gap:12, alignItems:"center"}}>
          <img src={preview || undefined} alt="preview" style={{width:72, height:72, borderRadius:8, objectFit:"cover"}} />
          <div>
            <label className="btn btn-outline-secondary">Upload photo <input type="file" accept="image/*" onChange={handleFile} style={{display:"none"}} ref={fileRef}/></label>
            <button type="button" className="btn btn-outline-danger ms-2" onClick={removeCurrentPhoto} disabled={loading}>Remove</button>
          </div>
        </div>
        <div className="mt-3"><textarea className="form-control" rows={4} value={bio} onChange={e=>setBio(e.target.value)} placeholder="Short bio"/></div>
        <div className="d-flex justify-content-end gap-2 mt-3">
          <button type="button" className="btn btn-light" onClick={onClose} disabled={loading}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading?"Saving...":"Save"}</button>
        </div>
      </form>
    </Modal>
  );
}

