import { useEffect, useState } from "react";
import api from "../api/axios";

const Location = () => {
  const [contact, setContact] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    api.get("admin-contact/")
      .then(res => {
        setContact(res.data);
      })
      .catch(err => console.error("Contact info error:", err));

    api.get("location/")
      .then(res => {
        setLocation(res.data);
      })
      .catch(err => console.error("Location data error:", err));
  }, []);

  const addressText = location?.address || "K-5, Kalinga Vihar LIG, Kalinganagar, Bhubaneswar, Odisha – 751028";
  const openingDays = location?.opening_days || "Monday – Sunday";
  const openingTime = location?.opening_time || "10:00 AM";
  const closingTime = location?.closing_time || "9:00 PM";

  const mapEmbedUrl = location?.map_embed_url?.trim();
  const rawMapQuery = location?.map_query?.replace(/\s+/g, " ")?.trim() || "K-5, Kalinga Vihar LIG, Kalinganagar, Bhubaneswar, Odisha 751028";
  const mapQuery = rawMapQuery;
  const encodedMapQuery = encodeURIComponent(mapQuery);

  const buildEmbedUrl = (query) => `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;

  const normalizeMapEmbedUrl = (url, fallback) => {
    if (!url) return null;
    const trimmedUrl = url.trim();
    if (!trimmedUrl) return null;

    // Already embed URL exact match.
    if (/\/maps\/embed/i.test(trimmedUrl)) {
      return trimmedUrl;
    }

    // If it's an app short link, fallback to place query
    if (/goo\.gl\/maps|maps\.app\.goo\.gl/i.test(trimmedUrl)) {
      return fallback || null;
    }

    try {
      const parsed = new URL(trimmedUrl);

      // q or query query params
      const qParam = parsed.searchParams.get("q") || parsed.searchParams.get("query");
      if (qParam) {
        return buildEmbedUrl(qParam);
      }

      // Place or search style path
      const placeMatch = parsed.pathname.match(/\/maps\/(?:place|search)\/([^@/?]+)(?:[@/?].*)?/i);
      if (placeMatch && placeMatch[1]) {
        return buildEmbedUrl(decodeURIComponent(placeMatch[1]));
      }

      // Dir style path (destination final segment)
      const dirMatch = parsed.pathname.match(/\/maps\/dir\/(.+)/i);
      if (dirMatch && dirMatch[1]) {
        const segments = dirMatch[1].split("/");
        const destination = decodeURIComponent(segments[segments.length - 1]);
        return buildEmbedUrl(destination);
      }

      // If URL contains @lat,long, use coordinates
      const coordMatch = parsed.pathname.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (coordMatch) {
        return buildEmbedUrl(`${coordMatch[1]},${coordMatch[2]}`);
      }

      // fallback to generic location query as text if nothing else
      return buildEmbedUrl(trimmedUrl);
    } catch {
      // If not a valid URL, use as text query directly.
      return buildEmbedUrl(trimmedUrl);
    }
  };

  const spaEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4564.040741555301!2d85.75641914619625!3d20.241398951288737!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a19a97f8698f3b9%3A0x428e927f0718c703!2sElegant%20Thai%20Spa!5e0!3m2!1sen!2sin!4v1774779272630!5m2!1sen!2sin";

  const mapSrc = (() => {
    // If admin has a valid direct embed URL, use it - highest priority
    if (mapEmbedUrl && /\/maps\/embed/i.test(mapEmbedUrl)) {
      return mapEmbedUrl;
    }

    // If user requested the specific hard-coded spa location, force it
    if (mapEmbedUrl || mapQuery) {
      return spaEmbedUrl;
    }

    // Fallback generic query embed
    return buildEmbedUrl(mapQuery);
  })();

  console.log("Location map params:", { mapEmbedUrl, mapQuery, mapSrc });

  const directionsUrl = "https://www.google.com/maps/dir/?api=1&destination=Elegant+Thai+Spa,+Bhubaneswar";

  return (
    <section className="location-section">
      <h2 className="location-title">{location?.title || "Visit Us"}</h2>

      <p className="location-address">
        📍 {addressText}
      </p>

      <div className="location-info">
        <div className="location-hours">
          <h4>🕒 Opening Hours</h4>
          <p>{openingDays}</p>
          <p>{openingTime} – {closingTime}</p>
        </div>

        <div className="location-actions">
        <a
          href={contact?.phone ? `tel:${contact.phone}` : "#"}
          className="btn call-btn"
        >
          📞 Call Us
        </a>

        {contact?.phone && (
          <a
            href={`https://wa.me/${contact.phone.replace(/\D/g, "")}?text=Hello%20I%20would%20like%20to%20book%20a%20service`}
            target="_blank"
            rel="noreferrer"
            className="btn whatsapp-btn"
          >
            💬 WhatsApp
          </a>
        )}

        <a
          href="https://maps.app.goo.gl/xB9ib4K3MQWt1dhx7"
          target="_blank"
          rel="noreferrer"
          className="btn direction-btn"
        >
          🧭 Get Directions
        </a>
      </div>

      </div>

      <div className="map-container">
        <iframe
          title="Google Map Location"
          src={mapSrc}
          width="100%"
          height="360"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  );
};

export default Location;
