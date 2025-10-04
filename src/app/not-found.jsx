"use client";
import { useRouter } from "next/navigation";
import "./not-found.css";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="notfound-container">
      <h1 className="notfound-title">404</h1>
      <h2 className="notfound-subtitle">Oops! Page Not Found</h2>
      <p className="notfound-message">
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>
      <button className="notfound-button" onClick={() => router.push("/")}>
        Go Back Home
      </button>
      <div className="notfound-animation">
        <span className="circle"></span>
        <span className="circle"></span>
        <span className="circle"></span>
      </div>
    </div>
  );
}
