// src/Components/NotificationsModal.jsx
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import { API_URL } from "../api";
Modal.setAppElement("#root");

export default function NotificationsModal({ isOpen: controlledOpen, onClose }) {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(()=>{ setIsOpen(!!controlledOpen); }, [controlledOpen]);

  useEffect(()=>{
    const handler = () => setIsOpen(true);
    window.addEventListener("openNotificationsModal", handler);
    return () => window.removeEventListener("openNotificationsModal", handler);
  },[]);

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/user/notifications`, { headers: { Authorization: `Bearer ${token}` }});
      setRequests(res.data.requests || []);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{ if(isOpen) fetchRequests(); }, [isOpen]);

  const closeAll = () => { setIsOpen(false); onClose && onClose(); };

  const accept = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_URL}/user/follow/${id}/accept`, {}, { headers: { Authorization: `Bearer ${token}` }});
      await fetchRequests();
      window.dispatchEvent(new CustomEvent("followUpdated"));
    } catch (err) {
      console.error(err);
      alert("Failed to accept");
    }
  };

  const acceptAndFollowBack = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_URL}/user/follow/${id}/accept-and-followback`, {}, { headers: { Authorization: `Bearer ${token}` }});
      await fetchRequests();
      window.dispatchEvent(new CustomEvent("followUpdated"));
    } catch (err) {
      console.error(err);
      alert("Failed");
    }
  };

  const decline = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_URL}/user/follow/${id}/decline`, {}, { headers: { Authorization: `Bearer ${token}` }});
      await fetchRequests();
      window.dispatchEvent(new CustomEvent("followUpdated"));
    } catch (err) {
      console.error(err);
      alert("Failed to decline");
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={closeAll} style={{
      overlay:{ backgroundColor:"rgba(0,0,0,0.6)", zIndex:2000 },
      content:{ top:"50%", left:"50%", transform:"translate(-50%,-50%)", maxWidth:900, width:"90%" , maxHeight:"80vh", padding:20, borderRadius:8}
    }}>
      <div style={{display:"flex", flexDirection:"column", gap:12}}>
        <div className="d-flex align-items-center justify-content-between">
          <h4 style={{margin:0}}>Notifications</h4>
          <button className="btn btn-light" onClick={closeAll}>Close</button>
        </div>

        <div style={{maxHeight:"60vh", overflowY:"auto"}}>
          {loading ? <div>Loading...</div> : (
            requests.length === 0 ? <div className="text-secondary">No follow requests</div> :
            requests.map(r => (
              <div key={r._id} className="d-flex align-items-center justify-content-between my-2" style={{gap:12}}>
                <div style={{display:"flex", gap:12, alignItems:"center", cursor:"pointer"}} onClick={()=> window.location.href = `/user/${r._id}`}>
                  <img src={r.profileImage || "/avatar1.jpg"} alt="p" style={{ width: 56, height: 56, borderRadius: 8, objectFit: "cover" }} />
                  <div>
                    <div style={{ fontWeight: 700 }}>{r.fullname}</div>
                    <div className="small text-secondary">@{r.username}</div>
                  </div>
                </div>
                <div style={{display:"flex", gap:8}}>
                  <button className="btn btn-success btn-sm" onClick={()=>accept(r._id)}>Accept</button>
                  <button className="btn btn-primary btn-sm" onClick={()=>acceptAndFollowBack(r._id)}>Accept & Follow Back</button>
                  <button className="btn btn-outline-secondary btn-sm" onClick={()=>decline(r._id)}>Decline</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
}
