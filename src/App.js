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

function App() {
  const [showGlobalPostModal, setShowGlobalPostModal] = useState(false);

  // Listen for event from anywhere (like SideNavbar)
  useEffect(() => {
    const openHandler = () => setShowGlobalPostModal(true);
    window.addEventListener("openPostModal", openHandler);
    return () => window.removeEventListener("openPostModal", openHandler);
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
          </Route>
        </Routes>

        {/* ✅ Global Post Modal (works on every page) */}
        <PostModal
          isOpen={showGlobalPostModal}
          onClose={() => setShowGlobalPostModal(false)}
          onPosted={(newPost) => {
            // broadcast event to refresh posts on any page
            window.dispatchEvent(
              new CustomEvent("postCreated", { detail: newPost })
            );
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

