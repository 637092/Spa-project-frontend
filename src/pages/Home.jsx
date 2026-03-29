import Hero from "../components/Hero";
import AboutSection from "../components/AboutSection";
import Services from "./Services";
import Gallery from "./Gallery";
import Location from "../components/Location";
import Testimonials from "../components/Testimonials";

import { useEffect } from "react";

const Home = () => {

  // ✅ FINAL SCROLL LOGIC (SESSION STORAGE BASED)
  useEffect(() => {
    const target = sessionStorage.getItem("scrollTo");

    if (target === "testimonials") {
      const el = document.getElementById("testimonials");

      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }

      // cleanup after scroll
      sessionStorage.removeItem("scrollTo");
    }
  }, []);

  return (
    <>
      <Hero />
      <AboutSection />
      <Services />

      <Testimonials />

      <Gallery />
      <Location />
    </>
  );
};

export default Home;