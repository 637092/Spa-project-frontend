import { useEffect, useState } from "react";
import api from "../api/axios";

const Gallery = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    api.get("gallery/").then(res => setImages(res.data));
  }, []);

  // ✅ SCROLL ANIMATION (SAME AS SERVICES)
  useEffect(() => {
    if (images.length === 0) return;

    const items = document.querySelectorAll(".gallery-item");

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

    items.forEach(item => observer.observe(item));
    return () => observer.disconnect();
  }, [images]);

  return (
    <div className="gallery-page">
      <div className="container">
        <h2 className="text-center mb-4">Our Gallery</h2>

        <div className="gallery-grid">
          {images.map((img, index) => (
            <div
              key={img.id}
              className={`gallery-item ${
                index % 3 === 0
                  ? "from-left"
                  : index % 3 === 1
                  ? "from-bottom"
                  : "from-right"
              }`}
            >
              <img src={img.image} alt="" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
