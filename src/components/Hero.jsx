import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const heroImages = [
  "https://plus.unsplash.com/premium_photo-1661407350987-9e9319ac11e6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1696841212541-449ca29397cc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fG1hc3NhZ2UlMjB0aGVyYXB5fGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1591343395082-e120087004b4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fG1hc3NhZ2UlMjB0aGVyYXB5fGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1696841212541-449ca29397cc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fG1hc3NhZ2UlMjB0aGVyYXB5fGVufDB8fDB8fHww",
  "https://media.istockphoto.com/id/1285305565/photo/beautiful-couple-getting-a-back-massage-weekend-spa-for-couple-beautiful-mixed-race-woman-and.webp?a=1&b=1&s=612x612&w=0&k=20&c=skjHqS83j9DCGQZGawZHJEUp1K0fpfYc9EVryLrF6hw=",
  "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fG1hc3NhZ2UlMjB0aGVyYXB5fGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1552693673-1bf958298935?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fG1hc3NhZ2UlMjB0aGVyYXB5fGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fG1hc3NhZ2UlMjB0aGVyYXB5fGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjV8fG1hc3NhZ2UlMjB0aGVyYXB5fGVufDB8fDB8fHww",
  "https://unsplash.com/photos/man-lying-on-bed-dsy_ILnH69Ahttps://unsplash.com/photos/man-lying-on-bed-dsy_ILnH69A?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fG1hc3NhZ2UlMjB0aGVyYXB5fGVufDB8fDB8fHww",
];

const Hero = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="hero"
      style={{
        backgroundImage: `url(${heroImages[index]}?auto=format&fit=crop&w=1600&q=80)`
      }}
    >
      {/* 🌿 FLOATING STEAM */}
      <div className="steam s1" />
      <div className="steam s2" />
      <div className="steam s3" />
      <div className="steam s4" />

      {/* 🌑 FULL IMAGE OVERLAY */}
      <div className="hero-overlay">
        <div className="hero-content fade-text">
          <h1>Relax. Rejuvenate. Restore.</h1>
          <p>Experience the art of Thai wellness</p>

          <Link to="/book" className="book-btn">
            Book Appointment
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
