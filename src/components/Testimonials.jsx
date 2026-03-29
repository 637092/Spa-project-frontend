import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/testimonials.css";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/testimonials/")
      .then((res) => setTestimonials(res.data))
      .catch((err) => console.log(err));
  }, []);

  // ✅ auto slide every 5 seconds
  useEffect(() => {
    if (testimonials.length === 0) return;

    const interval = setInterval(() => {
      setCurrent((prev) =>
        prev === testimonials.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials]);

  // ✅ fix image URL
  const getImageUrl = (image) => {
    if (!image) return "";
    if (image.startsWith("http")) return image;
    return `http://127.0.0.1:8000${image}`;
  };

  return (
    // 🔥🔥🔥 THIS IS THE ONLY CRITICAL FIX
    <section id="testimonials" className="testimonial-section">
      <h2 className="title">
        Don't take our word for it! <br />
        Hear it from our partners.
      </h2>

      <div className="slider">
        {testimonials.map((item, index) => {
          let position = "nextSlide";

          if (index === current) {
            position = "activeSlide";
          } else if (
            index === current - 1 ||
            (current === 0 && index === testimonials.length - 1)
          ) {
            position = "prevSlide";
          }

          return (
            <article className={`testimonial-card ${position}`} key={index}>
              <p className="message">"{item.message}"</p>

              <div className="user">
                <img
                  src={getImageUrl(item.image)}
                  alt={item.name}
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/50?text=User";
                  }}
                />
                <div>
                  <h4>{item.name}</h4>
                  <p>{item.role}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default Testimonials;