import { useEffect, useState, useRef } from "react";
import api from "../api/axios";

const AboutSection = () => {
  const [aboutList, setAboutList] = useState([]);
  const sectionRefs = useRef([]);

  useEffect(() => {
    api.get("about/")
      .then(res => setAboutList(res.data))
      .catch(err => console.error(err));
  }, []);

  // 🔥 SCROLL ANIMATION OBSERVER
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.25 }
    );

    sectionRefs.current.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, [aboutList]);

  if (aboutList.length === 0) return null;

  return (
    <section className="about-section">
      <div className="container">
        {aboutList.map((about, index) => (
          <div
            key={about.id}
            ref={el => (sectionRefs.current[index] = el)}
            className={`about-grid fade-in ${
              index % 2 !== 0 ? "reverse about-reverse" : ""
            }`}
          >
            <div className="about-text slide-left">
              {about.subtitle && (
                <span className="about-label">{about.subtitle}</span>
              )}
              <h2>{about.title}</h2>
              <p>{about.description}</p>
            </div>

            <div className="about-image slide-right">
              <img
                src={about.image_url}
                alt={`About Spa ${index + 1}`}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AboutSection;
