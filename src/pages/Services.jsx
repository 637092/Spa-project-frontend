import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const Services = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    api.get("services/").then(res => setServices(res.data));
  }, []);

  // 🔥 SCROLL ANIMATION (SAFE)
  useEffect(() => {
    if (services.length === 0) return;

    const cards = document.querySelectorAll(".service-card");

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.2 }
    );

    cards.forEach(card => observer.observe(card));
    return () => observer.disconnect();
  }, [services]);

  return (
    <section className="services-section">
      <div className="container">
        <h2 className="services-title">Our Services</h2>

        <div className="services-grid">
          {services.map((service, index) => {
            // 🔥 Get lowest price option
            const lowestOption =
              service.options && service.options.length > 0
                ? service.options.reduce((min, opt) =>
                    opt.price < min.price ? opt : min
                  )
                : null;

            return (
              <Link
                key={service.id}
                to={`/services/${service.id}`}
                className={`service-card ${
                  index % 3 === 0
                    ? "from-left"
                    : index % 3 === 1
                    ? "from-bottom"
                    : "from-right"
                }`}
              >
              <img
                src={service.image_url}
                alt={service.name}
                loading="lazy"
              />
                <div className="service-overlay">
                  <h3>{service.name}</h3>

                  {/* 🔥 Show starting price */}
                  {lowestOption && (
                    <p className="price">
                      Starting from ₹{lowestOption.price}
                    </p>
                  )}

                  {/* 🔥 Show durations */}
                  {service.options && (
                    <p className="duration">
                      {service.options.map(opt => opt.duration).join(" / ")} mins
                    </p>
                  )}

                  <span>View Details</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
