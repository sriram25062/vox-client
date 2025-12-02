// src/App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import Register from "./pages/Register/Register.jsx";
import Login from "./pages/Login/Login.jsx";
import Landing from "./pages/Landing/Landing.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import Template from "./pages/Template/Template.jsx";
import ProtectedLayout from "./routes/ProtectedLayout.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import React, { useEffect, useState } from "react";
import PostModal from "./Components/PostModal.jsx";
import NotificationsModal from "./Components/NotificationsModal.jsx";
import UserProfile from "./pages/UserProfile/UserProfile.jsx";
import Explore from "./pages/Explore/Explore.jsx";

function App() {
  const [showGlobalPostModal, setShowGlobalPostModal] = useState(false);
  const [showGlobalNotifModal, setShowGlobalNotifModal] = useState(false);

  useEffect(() => {
    const openHandler = () => setShowGlobalPostModal(true);
    const openNotif = () => setShowGlobalNotifModal(true);
    window.addEventListener("openPostModal", openHandler);
    window.addEventListener("openNotificationsModal", openNotif);
    return () => {
      window.removeEventListener("openPostModal", openHandler);
      window.removeEventListener("openNotificationsModal", openNotif);
    };
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/template" element={<Template />} />

          <Route element={<ProtectedLayout />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/home" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/user/:id" element={<UserProfile />} />
          </Route>
        </Routes>

        <PostModal
          isOpen={showGlobalPostModal}
          onClose={() => setShowGlobalPostModal(false)}
          onPosted={(newPost) => {
            window.dispatchEvent(new CustomEvent("postCreated", { detail: newPost }));
          }}
        />

        <NotificationsModal
          isOpen={showGlobalNotifModal}
          onClose={() => setShowGlobalNotifModal(false)}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
