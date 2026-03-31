import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [mobileSupportOpen, setMobileSupportOpen] = useState(false);
  const [logo, setLogo] = useState(null);
  const supportRef = useRef(null);

  // ✅ FIXED LOGO FETCH
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await api.get("logo/");
        if (response.data) {
          setLogo(response.data);
        }
      } catch (error) {
        console.log("Logo API error:", error);
      }
    };
    fetchLogo();
  }, []);

  // LOAD THEME
  useEffect(() => {
    const saved = localStorage.getItem("spa-theme");
    if (saved === "dark") {
      document.body.classList.add("dark-theme");
      setDark(true);
    }
  }, []);

  // CLOSE SUPPORT ON OUTSIDE CLICK
  useEffect(() => {
    const handler = (e) => {
      if (supportRef.current && !supportRef.current.contains(e.target)) {
        setSupportOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleTheme = () => {
    if (dark) {
      document.body.classList.remove("dark-theme");
      localStorage.setItem("spa-theme", "light");
    } else {
      document.body.classList.add("dark-theme");
      localStorage.setItem("spa-theme", "dark");
    }
    setDark(!dark);
  };

  return (
    <nav className="spa-navbar">
      {/* LOGO */}
      <Link to="/" className="spa-brand">
        {logo?.logo_url && (
          <img
            src={logo.logo_url}  // ✅ FIXED HERE
            alt={logo.alt_text || "Elegant Thai Spa Logo"}
            className="spa-logo-img"
          />
        )}
      </Link>

      <div
        className={`hamburger ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span />
        <span />
        <span />
      </div>

      {/* DESKTOP MENU */}
      <div className="spa-menu desktop-menu">
        <Link to="/">Home</Link>
        <Link to="/services">Services</Link>
        <Link to="/gallery">Gallery</Link>
        <Link to="/feedback">Feedback</Link>

        {/* SUPPORT */}
        <div className="support-wrapper" ref={supportRef}>
          <button
            className="support-btn"
            onClick={() => setSupportOpen(!supportOpen)}
          >
            Support ▾
          </button>

          {supportOpen && (
            <div className="support-panel">
              <Link to="/support" onClick={() => setSupportOpen(false)}>
                📩 Contact Us
              </Link>
              <Link to="/report-bug" onClick={() => setSupportOpen(false)}>
                🐞 Report a Bug
              </Link>
              <Link to="/ai" onClick={() => setSupportOpen(false)}>
                🤖 AI Assistant
              </Link>
            </div>
          )}
        </div>

        <Link to="/admin/dashboard" className="admin-btn">
          Admin
        </Link>

        <div className="theme-switch" onClick={toggleTheme}>
          <span className={`switch-thumb ${dark ? "dark" : ""}`} />
        </div>

        <Link to="/book" className="book-btn">
          Book Now
        </Link>
      </div>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${menuOpen ? "show" : ""}`}>
        <Link onClick={() => setMenuOpen(false)} to="/">Home</Link>
        <Link onClick={() => setMenuOpen(false)} to="/services">Services</Link>
        <Link onClick={() => setMenuOpen(false)} to="/gallery">Gallery</Link>
        <Link onClick={() => setMenuOpen(false)} to="/feedback">Feedback</Link>

        <div className="mobile-support">
          <button
            className="mobile-support-btn"
            onClick={() => setMobileSupportOpen(!mobileSupportOpen)}
          >
            Support
            <span className={mobileSupportOpen ? "rotate" : ""}>▾</span>
          </button>

          {mobileSupportOpen && (
            <div className="mobile-support-panel">
              <Link to="/support" onClick={() => setMenuOpen(false)}>
                📩 Contact Us
              </Link>
              <Link to="/report-bug" onClick={() => setMenuOpen(false)}>
                🐞 Report a Bug
              </Link>
              <Link to="/ai" onClick={() => setMenuOpen(false)}>
                🤖 AI Assistant
              </Link>
            </div>
          )}
        </div>

        <Link onClick={() => setMenuOpen(false)} to="/admin/dashboard">
          Admin
        </Link>

        <button onClick={toggleTheme}>
          {dark ? "Dark Mode" : "Light Mode"}
        </button>

        <Link onClick={() => setMenuOpen(false)} to="/book" className="book-btn">
          Book Now
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
