import React, { useCallback, useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/cropImage";
import axios from "axios";
import { API_URL } from "../api";
Modal.setAppElement("#root");

export default function PostModal({ isOpen: controlledOpen, onClose, onPosted }) {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(()=>{ setIsOpen(!!controlledOpen); }, [controlledOpen]);

  // listen to global event so modal can open from anywhere
  useEffect(()=>{
    const handler = () => setIsOpen(true);
    window.addEventListener("openPostModal", handler);
    return ()=>window.removeEventListener("openPostModal", handler);
  },[]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [file, setFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x:0, y:0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const fileRef = useRef();

  const onCropComplete = useCallback((_, croppedPixels) => setCroppedAreaPixels(croppedPixels), []);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setImageSrc(URL.createObjectURL(f));
  };

  const removeImage = () => {
    setFile(null);
    setImageSrc(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const closeAll = () => { setIsOpen(false); onClose && onClose(); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("Please enter title");
    if (description.length > 300) return alert("Description max 300 chars");
    try {
      let blobToUpload = null;
      if (file && croppedAreaPixels) blobToUpload = await getCroppedImg(file, croppedAreaPixels);
      else if (file) blobToUpload = file;

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("privacy", privacy);
      if (blobToUpload) formData.append("image", blobToUpload, "post.jpg");

      const token = localStorage.getItem("token");
      const res = await axios.post(`${API_URL}/post/create`, formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` }
      });

      onPosted && onPosted(res.data);
      // reset
      setTitle(""); setDescription(""); setPrivacy("public"); removeImage();
      closeAll();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Upload failed");
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={closeAll} style={{
      overlay:{ backgroundColor:"rgba(0,0,0,0.6)", zIndex:2000 },
      content:{ top:"50%", left:"50%", transform:"translate(-50%,-50%)", maxWidth:900, width:"90%" , height:"80vh", padding:20, borderRadius:8}
    }}>
      <div className="d-flex gap-3">
        <div style={{flex:1}}>
          {imageSrc ? (
            <div style={{position:"relative", width:"100%", height:420, background:"#222"}}>
              <Cropper image={imageSrc} crop={crop} zoom={zoom} aspect={5/7} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={onCropComplete} />
            </div>
          ) : (
            <div style={{width:"100%", height:420, display:"flex", alignItems:"center", justifyContent:"center", border:"2px dashed #333", borderRadius:8}}>
              <label style={{cursor:"pointer", color:"#aaa"}}>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} style={{display:"none"}} />
                <div style={{textAlign:"center"}}><div>Choose image</div><div style={{color:"#777"}}>Square/landscape recommended</div></div>
              </label>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} style={{width:360, display:"flex", flexDirection:"column", gap:12}}>
          <input placeholder="Title (short)" className="form-control" value={title} onChange={e=>setTitle(e.target.value)} maxLength={60} required />
          <textarea placeholder="Description (max 300 chars)" className="form-control" value={description} onChange={e=>setDescription(e.target.value)} maxLength={300} rows={6} />
          <select className="form-select" value={privacy} onChange={e=>setPrivacy(e.target.value)}><option value="public">Public</option><option value="private">Private (Followers)</option></select>
          <div className="d-flex gap-2 mt-auto">
            {imageSrc && <button type="button" className="btn btn-outline-secondary" onClick={removeImage}>Remove Image</button>}
            <button type="submit" className="btn btn-primary ms-auto">Post</button>
            <button type="button" className="btn btn-light" onClick={closeAll}>Cancel</button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

