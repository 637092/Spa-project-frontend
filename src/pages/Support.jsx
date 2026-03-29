import { useState, useEffect } from "react";
import axios from "axios";


const Support = () => {
  /* ================= FORM STATE ================= */
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  /* ================= ADMIN CONTACT STATE ================= */
  const [contact, setContact] = useState({
    email: "",
    phone: "",
    address: "",
  });

  /* ================= LOAD ADMIN CONTACT ================= */
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/admin-contact/")
      .then((res) => setContact(res.data))
      .catch((err) => console.error(err));
  }, []);

  /* ================= FORM HANDLERS ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitForm = async (e) => {
    e.preventDefault();

    await axios.post("http://127.0.0.1:8000/api/contact/", {
      type: "contact",
      ...form,
    });

    alert("Message sent successfully ✅");
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  return (

    <div className="support-page">
      {/* PAGE TITLE */}
      <h2>Contact Us</h2>
      <p>We’re here to help you. Reach out anytime.</p>

      {/* ================= ADMIN CONTACT INFO ================= */}
      <div className="contact-info">
        <div>
          <strong>📧 Email</strong>
          <p>{contact.email || "Loading..."}</p>
        </div>

        <div>
          <strong>📞 Phone</strong>
          <p>{contact.phone || "Loading..."}</p>
        </div>

        <div>
          <strong>📍 Address</strong>
          <p>{contact.address || "Loading..."}</p>
        </div>
      </div>

      {/* ================= CONTACT FORM ================= */}
      <form onSubmit={submitForm}>
        <input
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
        />

        <textarea
          name="message"
          placeholder="Write your message..."
          value={form.message}
          onChange={handleChange}
          required
        />

        <button type="submit">Send Message</button>
      </form>
    </div>
  );
};

export default Support;
