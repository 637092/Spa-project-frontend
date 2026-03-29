import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

import Base from "./layout/Base";

import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import BookAppointment from "./pages/BookAppointment";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminRoute from "./components/AdminRoute";
import Support from "./pages/Support";
import ReportBug from "./pages/ReportBug";
import AIAssistant from "./pages/AIAssistant";
import Feedback from "./pages/Feedback";

/* ✅ GLOBAL SCROLL HANDLER (REAL FIX) */
const ScrollToHash = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.replace("#", ""));
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 100); // small delay ensures DOM ready
      }
    }
  }, [location]);

  return null;
};

function App() {
  return (
    <BrowserRouter>
      {/* ✅ ADD THIS */}
      <ScrollToHash />

      <Base>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:id" element={<ServiceDetail />} />
          <Route path="/support" element={<Support />} />
          <Route path="/report-bug" element={<ReportBug />} />
          <Route path="/ai" element={<AIAssistant />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/book" element={<BookAppointment />} />

          {/* 🔐 ADMIN LOGIN */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* 🔐 PROTECTED ADMIN DASHBOARD */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
        </Routes>
      </Base>
    </BrowserRouter>
  );
}

export default App;