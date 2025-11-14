import React from "react";

function Card({ title, img, description, post }) {
  const p = post || {};
  const displayTitle = p.title || title;
  const displayImg = p.imageUrl || img;
  const displayDesc = p.description || description;
  const user = p.userId || p.user || {};

  return (
    <div className="card h-100 shadow-sm" style={{ borderRadius: "12px", overflow: "hidden" }}>
      {/* Post Image */}
      {displayImg && (
        <div style={{ width: "100%" }}>
          <img
            src={displayImg}
            alt="Post"
            style={{
              width: "100%",       // full container width
              height: "auto",      // auto height
              display: "block",    // remove inline gap
              objectFit: "contain", // show full image without cropping
            }}
          />
        </div>
      )}

      {/* Card Body */}
      <div className="card-body">
        {/* User Info */}
        <div className="d-flex align-items-center mb-2" style={{ gap: 12 }}>
          <img
            src={user.profileImage || "/avatar1.jpg"}
            alt="dp"
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
          <div>
            <div style={{ fontWeight: 700 }}>
              {user.fullname || user.username || "Unknown"}
            </div>
            <div style={{ fontSize: 12, color: "#666" }}>
              @{user.username}
            </div>
          </div>
        </div>

        {/* Post Title & Description */}
        <h5 className="card-title">{displayTitle}</h5>
        <p className="card-text">{displayDesc}</p>

        {/* Buttons */}
        <div className="d-flex" style={{ gap: 12 }}>
          <button className="btn btn-sm btn-outline-primary">
            👍 {p.likes ? p.likes.length : 0}
          </button>
          <button className="btn btn-sm btn-outline-secondary">
            💬 {p.commentsCount || 0}
          </button>
          <button className="btn btn-sm btn-outline-secondary">
            🔁 Share
          </button>
        </div>
      </div>
    </div>
  );
}

export default Card;

