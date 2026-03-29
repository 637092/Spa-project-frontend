import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "👋 Hi! I’m Elegant AI Assistant. I can help you with services, bookings, issues, or anything about Elegant International Thai Spa.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // ✅ ADDED (do not remove)

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/ai/chat/", {
        message: input,
      });

      // 🔹 KEEP BOTH content & data (do NOT remove anything)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: res.data.reply || "",
          data: res.data,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Sorry, something went wrong. Please try again later.",
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="ai-page">
      <h2>🤖 AI Assistant</h2>
      <p>Your personal assistant for Elegant Thai Spa</p>

      <div className="ai-chatbox">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`ai-message ${msg.role === "user" ? "user" : "assistant"}`}
          >
            {/* 🔹 TEXT MESSAGE (SAFE) */}
            {msg.content && (
              <div
                dangerouslySetInnerHTML={{
                  __html: msg.content.replace(
                    /(https?:\/\/[^\s]+)/g,
                    '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
                  ),
                }}
              />
            )}

            {/* 🔹 SERVICE CARDS */}
            {msg.data?.type === "services" && (
              <div className="service-cards">
                {msg.data.services.map((service) => (
                  <div key={service.id} className="service-card">
                    <h4>{service.name}</h4>
                    <p>💰 ₹{service.price}</p>
                    <p>⏱ {service.duration} mins</p>

                    <button
                      onClick={() => {
                        // ✅ keep chat behavior
                        setMessages((prev) => [
                          ...prev,
                          {
                            role: "assistant",
                            content: `📅 Redirecting you to **${service.name}** booking page…`,
                          },
                        ]);

                        // ✅ FIX: navigate to service detail page
                        navigate(`/services/${service.id}`);
                      }}
                    >
                      Book this service
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && <div className="ai-message assistant">Typing…</div>}
      </div>

      <div className="ai-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about services, booking, offers..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default AIAssistant;
