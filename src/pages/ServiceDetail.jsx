import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios"; // ✅ use your axios instance
import Services from "./Services";

const ServiceDetail = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 PAGE ENTRY ANIMATION FLAG
  const [animate, setAnimate] = useState(false);

  // 🔥 NEW: selected option
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    setAnimate(false); // reset animation on route change
    setLoading(true);

    api
      .get(`services/${id}/`) // ✅ FIXED (no localhost)
      .then((res) => {
        setService(res.data);
        setLoading(false);

        // 🔥 set default option (first one)
        if (res.data.options && res.data.options.length > 0) {
          setSelectedOption(res.data.options[0]);
        }

        // 🔥 trigger animation smoothly after mount
        setTimeout(() => setAnimate(true), 100);
      })
      .catch((err) => {
        console.error("Error fetching service:", err); // ✅ DEBUG
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return <p style={{ textAlign: "center" }}>Loading service...</p>;

  if (!service)
    return <p style={{ textAlign: "center" }}>Service not found</p>;

  return (
    <>
      <section className="service-editorial">
        <div className="service-editorial-container">

          {/* IMAGE */}
          <div
            className={`service-editorial-image ${
              animate ? "enter" : ""
            }`}
          >
            <img
              src={service.image_url}
              alt={service.name}
            />

          </div>

          {/* CONTENT */}
          <div
            className={`service-editorial-content ${
              animate ? "enter" : ""
            }`}
          >
            <span className="editorial-label">
              Signature Wellness Therapy
            </span>

            <h1>{service.name}</h1>

            {/* META */}
            <div className="editorial-meta">
              <span>
                ₹ {selectedOption ? selectedOption.price : "—"}
              </span>
              <span>
                ⏱ {selectedOption ? selectedOption.duration : "—"} minutes
              </span>
            </div>

            {/* 🔥 DROPDOWN */}
            {service.options && service.options.length > 0 && (
              <div className="service-options">
                <select
                  className="option-dropdown"
                  value={selectedOption?.id || ""}
                  onChange={(e) => {
                    const selected = service.options.find(
                      (opt) => String(opt.id) === e.target.value
                    );
                    setSelectedOption(selected);
                  }}
                >
                  {service.options.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.duration} min - ₹{opt.price}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <p>
              {service.description ||
                "This thoughtfully designed therapy focuses on restoring balance, easing muscle tension, and promoting deep relaxation through skilled techniques and a serene spa environment."}
            </p>

            <a
              href={`/book?service=${service.id}&option=${selectedOption?.id}`}
              className="book-btn"
            >
              Book Appointment
            </a>

          </div>
        </div>
      </section>

      <section className="services-section">
        <Services />
      </section>
    </>
  );
};

export default ServiceDetail;
