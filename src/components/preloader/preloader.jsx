"use client";
import React from "react";
import "./preloader.css";

const PreloaderPage = () => {
  return (
    <div className="preloader-container">
      <div className="spinner"></div>
      <h2 className="loading-text">
        Loading <span className="dots">...</span>
      </h2>
    </div>
  );
};

export default PreloaderPage;
