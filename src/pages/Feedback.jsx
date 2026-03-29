import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api/axios";
import "../styles/feedback.css";

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    message: "",
    profile_photo: null
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Load existing feedback
  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    setLoading(true);
    try {
      const response = await api.get("feedback/");
      setFeedbacks(response.data);
    } catch (error) {
      console.error("Error loading feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file");
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setFormData(prev => ({
        ...prev,
        profile_photo: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.message.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('message', formData.message.trim());
      if (formData.profile_photo) {
        formDataToSend.append('profile_photo', formData.profile_photo);
      }

      await api.post("feedback/", formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success("Thank you for your feedback!");
      setFormData({ name: "", message: "", profile_photo: null });
      // Reset file input
      const fileInput = document.getElementById('profile_photo');
      if (fileInput) fileInput.value = '';

      // Reload feedback
      loadFeedback();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="feedback-section">
      <div className="container">
        <h2 className="section-title">Share Your Feedback</h2>

        <div className="feedback-container">
          {/* Feedback Form */}
          <div className="feedback-form-card">
            <h3>Leave Your Feedback</h3>
            <form onSubmit={handleSubmit} className="feedback-form">
              <div className="form-group">
                <label htmlFor="name">Your Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  required
                  maxLength="100"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Your Feedback *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Share your thoughts, suggestions, or experience..."
                  required
                  rows="5"
                  maxLength="1000"
                />
              </div>

              <div className="form-group">
                <label htmlFor="profile_photo">Profile Photo (Optional)</label>
                <input
                  type="file"
                  id="profile_photo"
                  name="profile_photo"
                  onChange={handleFileChange}
                  accept="image/*"
                />
                <small className="file-hint">Max 5MB, JPG/PNG format</small>
              </div>

              <button
                type="submit"
                className="submit-feedback-btn"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Feedback"}
              </button>
            </form>
          </div>

          {/* Feedback Display */}
          <div className="feedback-display">
            <h3>Recent Feedback</h3>

            {loading ? (
              <div className="loading-feedback">
                <div className="spinner-border" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
                <p>Loading feedback...</p>
              </div>
            ) : feedbacks.length === 0 ? (
              <div className="no-feedback">
                <p>No feedback yet. Be the first to share your thoughts!</p>
              </div>
            ) : (
              <div className="feedback-list">
                {feedbacks.map((feedback) => (
                  <div key={feedback.id} className="feedback-item">
                    <div className="feedback-header">
                      <div className="feedback-user">
                        {feedback.profile_photo_url ? (
                          <img
                            src={feedback.profile_photo_url}
                            alt={feedback.name}
                            className="feedback-avatar"
                          />
                        ) : (
                          <div className="feedback-avatar-placeholder">
                            {feedback.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="feedback-user-info">
                          <h4>{feedback.name}</h4>
                          <span className="feedback-date">{feedback.created_at_formatted}</span>
                        </div>
                      </div>
                    </div>
                    <div className="feedback-content">
                      <p>{feedback.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </section>
  );
};

export default Feedback;