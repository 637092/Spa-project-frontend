import { useEffect } from "react";

/**
 * Reusable scroll animation hook
 * Usage:
 *   useScrollReveal(".service-card");
 *   useScrollReveal(".gallery-item");
 */
const useScrollReveal = (selector, options = {}) => {
  useEffect(() => {
    const elements = document.querySelectorAll(selector);
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target); // animate only once
          }
        });
      },
      {
        threshold: options.threshold || 0.2,
      }
    );

    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [selector, options.threshold]);
};

export default useScrollReveal;
