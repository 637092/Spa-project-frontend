import { useState } from "react";
import axios from "axios";

const ReportBug = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitForm = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://127.0.0.1:8000/api/contact/", {
        type: "bug",
        ...form,
      });

      alert("Bug reported successfully 🐞");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      alert("Something went wrong 😓");
      console.error(err);
    }
  };

  return (
    <div className="support-page">
      <h2>Report a Bug</h2>
      <p>Found something broken? Help us fix it faster 🚀</p>

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

        <textarea
          name="message"
          placeholder="Describe the bug clearly..."
          value={form.message}
          onChange={handleChange}
          required
        />

        <button type="submit">Submit Bug</button>
      </form>
    </div>
  );
};

export default ReportBug;
