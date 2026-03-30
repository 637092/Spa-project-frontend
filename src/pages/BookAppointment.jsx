import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const BookAppointment = () => {
  const [searchParams] = useSearchParams();
  const serviceFromUrl = searchParams.get("service");

  // 🔥 ADDED (GET OPTION FROM URL)
  const optionFromUrl = searchParams.get("option");

  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);

  const [formData, setFormData] = useState({
    category: "",
    service: "",
    service_option: "",
    date: "",
    time: "",
    name: "",
    phone: "",
    email: "",
    notes: "",
    payment_method: "PAY_AT_SERVICE", // 🔴 ADDED
  });

  const [selectedService, setSelectedService] = useState(null);

  // 🔥 ADDED (SELECTED OPTION STATE)
  const [selectedOption, setSelectedOption] = useState(null);

  const [loading, setLoading] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    api.get("categories/")
      .then(res => setCategories(res.data))
      .catch(() => setCategories([]));

    api.get("services/")
      .then(res => setServices(res.data))
      .catch(() => setServices([]));
  }, []);

  /* ================= AUTO SELECT SERVICE ================= */

  useEffect(() => {
    if (!serviceFromUrl || services.length === 0) return;

    const found = services.find(
      s => String(s.id) === String(serviceFromUrl)
    );

    if (found) {
      setFormData(prev => ({
        ...prev,
        service: found.id,
      }));
      setSelectedService(found);

      // 🔥 ADDED (SET OPTION FROM URL)
      if (optionFromUrl && found.options) {
        const opt = found.options.find(
          o => String(o.id) === String(optionFromUrl)
        );
        if (opt) {
  setSelectedOption(opt);
  setFormData(prev => ({
    ...prev,
    service_option: opt.id,
  }));
}
      } else if (found.options?.length > 0) {
        setSelectedOption(found.options[0]);
      }
    }
  }, [serviceFromUrl, services, optionFromUrl]);

  /* ================= HANDLERS ================= */

  const handleChange = e => {
    const { name, value } = e.target;

    if (name === "phone") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 10) return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (name === "service") {
      const srv = services.find(
        s => String(s.id) === String(value)
      );
      setSelectedService(srv || null);

      if (srv?.options?.length > 0) {
        const firstOption = srv.options[0];
        setSelectedOption(firstOption);
        setFormData(prev => ({
          ...prev,
          service_option: firstOption.id,
        }));
      } else {
        setSelectedOption(null);
        setFormData(prev => ({
          ...prev,
          service_option: "",
        }));
      }

      return;
    }

    if (name === "service_option") {
      const option = selectedService?.options?.find(
        o => String(o.id) === String(value)
      );
      setSelectedOption(option || null);
      setFormData(prev => ({
        ...prev,
        service_option: value,
      }));
      return;
    }
  };

  // 🔴 ADDED — Razorpay handler (does NOT touch existing logic)
const openRazorpay = async () => {
  setLoading(true);
  const loaded = await loadRazorpay();
  if (!loaded) {
    toast.error("Razorpay failed to load");
    setLoading(false);
    return;
  }

  if (!selectedService) {
    toast.error("❌ Please select a service");
    setLoading(false);
    return;
  }

  // 🔥 ADDED (VALIDATE OPTION)
  if (!selectedOption) {
    toast.error("❌ Please select duration");
    setLoading(false);
    return;
  }

  try {
    const { data } = await api.get("razorpay-key/");

    const options = {
      key: data.key,

      // 🔥 UPDATED (USE OPTION PRICE)
      amount: selectedOption.price * 100,

      currency: "INR",
      name: "Spa & Salon",
      description: selectedService.name,

      handler: function (response) {
        setLoading(true);

        const optionText = selectedOption
          ? `Package: ${selectedOption.duration} min - ₹${selectedOption.price}`
          : "";
        const notesText = formData.notes
          ? `${formData.notes}\n${optionText}`
          : optionText;

        api.post("appointments/", {
          service: formData.service,
          service_option: selectedOption?.id,
          date: formData.date,
          time: formData.time,
          customer_name: formData.name,
          phone: `+91${formData.phone}`,
          email: formData.email,
          notes: notesText,
          payment_method: "ONLINE",
          transaction_id: response.razorpay_payment_id,
        })
        .then(() => {
          toast.success("🎉 Payment successful! Appointment booked.");
          setConfirmMessage("🎉 Booking confirmed! Your appointment is saved.");
          setFormData({ ...formData, category: "", service: "", service_option: "", date: "", time: "", notes: "" });
        })
        .catch(() => {
          toast.error("❌ Booking failed after payment");
        })
        .finally(() => setLoading(false));
      },

      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.phone,
      },
      modal: {
        ondismiss: () => setLoading(false),
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (err) {
    console.error(err);
    toast.error("Failed to initiate payment");
    setLoading(false);
  }
};

  const handleSubmit = e => {
    e.preventDefault();

    setConfirmMessage("");

    if (formData.phone.length !== 10) {
      toast.error("❌ Mobile number must be exactly 10 digits");
      return;
    }

    if (formData.payment_method === "ONLINE") {
      openRazorpay();
      return;
    }

    setLoading(true);

    const optionText = selectedOption
      ? `Package: ${selectedOption.duration} min - ₹${selectedOption.price}`
      : "";
    const notesText = formData.notes
      ? `${formData.notes}\n${optionText}`
      : optionText;

    api.post("appointments/", {
      service: formData.service,
      service_option: selectedOption?.id,
      date: formData.date,
      time: formData.time,
      customer_name: formData.name,
      phone: `+91${formData.phone}`,
      email: formData.email,
      notes: notesText,
      payment_method: formData.payment_method,
    })
    .then(() => {
      toast.success("✅ Appointment booked successfully!");
      setConfirmMessage("🎉 Booking confirmed! Your appointment is saved.");
      setFormData({ ...formData, category: "", service: "", service_option: "", date: "", time: "", notes: "" });
    })
    .catch(err => {
      console.error(err);
      toast.error("❌ Something went wrong");
    })
    .finally(() => setLoading(false));
  };

  /* ================= UI ================= */

  return (
    <section className="service-detail">
      <div className="container">
        <h2 className="services-title">Book Appointment</h2>

        <form className="booking-form" onSubmit={handleSubmit}>

          {confirmMessage && (
            <div className="booking-confirm" style={{
              marginBottom: "16px",
              padding: "12px 16px",
              border: "1px solid #43a047",
              background: "#e8f5e9",
              color: "#1b5e20",
              borderRadius: "8px",
              fontWeight: "600",
            }}>
              {confirmMessage}
            </div>
          )}

          {/* CATEGORY */}
          <div className="form-group">
            <label>Category <span style={{ color: "red" }}>*</span></label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* SERVICE */}
          <div className="form-group">
            <label>Service <span style={{ color: "red" }}>*</span></label>
            <select
              name="service"
              value={formData.service}
              onChange={handleChange}
              required
            >
              <option value="">Select Service</option>
              {services.map(service => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>

          {/* DURATION/PRICE OPTION */}
          {selectedService?.options?.length > 0 && (
            <div className="form-group">
              <label>Duration & Price <span style={{ color: "red" }}>*</span></label>
              <select
                name="service_option"
                value={formData.service_option}
                onChange={handleChange}
                required
              >
                <option value="">Select duration/price</option>
                {selectedService.options.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.duration} min - ₹{option.price}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* 🔥 UPDATED SERVICE INFO (NO REMOVAL, ONLY ADDED CONDITION) */}
          {selectedService && selectedOption && (
            <div className="service-summary">
              <p><strong>⏱️ Duration:</strong> {selectedOption.duration} mins</p>
              <p><strong>💰 Price:</strong> ₹{selectedOption.price}</p>
            </div>
          )}

          {/* DATE */}
          <div className="form-group">
            <label>Date <span style={{ color: "red" }}>*</span></label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          {/* TIME */}
          <div className="form-group">
            <label>Time <span style={{ color: "red" }}>*</span></label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>

          {/* NAME */}
          <div className="form-group">
            <label>Your Name <span style={{ color: "red" }}>*</span></label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* PHONE 🇮🇳 */}
          <div className="form-group">
            <label>Phone <span style={{ color: "red" }}>*</span></label>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  padding: "12px 14px",
                  borderRadius: "12px",
                  border: "1px solid #ddd",
                  background: "#f5f5f5",
                  fontWeight: "600",
                }}
              >
                🇮🇳 +91
              </div>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                required
                inputMode="numeric"
                pattern="\d{10}"
              />
            </div>
          </div>

          {/* EMAIL */}
          <div className="form-group">
            <label>Email <span style={{ color: "red" }}>*</span></label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* NOTES */}
          <div className="form-group">
            <label>Special Notes (Optional)</label>
            <textarea
              name="notes"
              rows="4"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          {/* PAYMENT METHOD */}
          <div className="form-group">
            <label>Payment Method <span style={{ color: "red" }}>*</span></label>

            <div style={{ display: "flex", gap: "16px" }}>
              <label>
                <input
                  type="radio"
                  name="payment_method"
                  value="PAY_AT_SERVICE"
                  checked={formData.payment_method === "PAY_AT_SERVICE"}
                  onChange={handleChange}
                />
                Pay at Service
              </label>

              <label>
                <input
                  type="radio"
                  name="payment_method"
                  value="ONLINE"
                  checked={formData.payment_method === "ONLINE"}
                  onChange={handleChange}
                />
                Pay Online
              </label>
            </div>
          </div>

          {/* SUBMIT */}
          <button type="submit" className="book-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm" style={{ marginRight: "8px" }} role="status" aria-hidden="true"></span>
                Processing...
              </>
            ) : (
              "Confirm Booking"
            )}
          </button>

        </form>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </section>
  );
};

export default BookAppointment;
