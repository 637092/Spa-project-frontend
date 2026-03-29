import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* LOGOUT COMPONENT */
const AdminLogout = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("refreshToken");
    navigate("/admin/login");
  };

  return (
    <button className="admin-logout-btn" onClick={logout}>
      Logout
    </button>
  );
};

/* STAT CARD */
const StatCard = ({ title, value }) => (
  <div className="admin-stat-card">
    <span className="admin-stat-title">{title}</span>
    <strong className="admin-stat-value">{value}</strong>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    api.get("admin/dashboard/")
      .then(res => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);

        if (err.response?.status === 401) {
          localStorage.removeItem("adminToken");
          localStorage.removeItem("refreshToken");
          navigate("/admin/login");
          return;
        }

        setError(err.response?.data?.detail || "Unable to load dashboard. Please try again.");
      });
  }, [navigate]);

  // Auto-refresh dashboard every 90 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      api.get("admin/dashboard/")
        .then(res => setStats(res.data))
        .catch(err => console.error(err));
    }, 90000);

    return () => clearInterval(timer);
  }, []);

  // 🔥 ADDED: Handle status change with immediate local update + refetch
  const handleStatusChange = async (appointmentId, newStatus) => {
    setUpdatingId(appointmentId);
    try {
      await api.patch(`appointments/${appointmentId}/status/`, { status: newStatus });
      toast.success("✅ Status updated successfully!");

      setStats(prev => {
        if (!prev) return prev;

        const updatedRecent = prev.recent.map((item) =>
          item.id === appointmentId ? { ...item, status: newStatus } : item
        );

        return {
          ...prev,
          recent: updatedRecent,
        };
      });

      // Re-fetch and recalc totals in background
      api.get("admin/dashboard/")
        .then(res => setStats(res.data))
        .catch(err => console.error(err))
        .finally(() => setUpdatingId(null));
    } catch (error) {
      toast.error("❌ Failed to update status");
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading dashboard…</div>;
  }

  if (error) {
    return (
      <div className="admin-loading" style={{ color: 'red' }}>
        {error}
      </div>
    );
  }

  if (!stats) {
    return <div className="admin-loading">No dashboard data available.</div>;
  }

  const formatMoney = (value) => {
    try {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2,
      }).format(value);
    } catch {
      return `₹${value}`;
    }
  };

  return (
    <div className="admin-dashboard">

      {/* HEADER */}
      <div className="admin-header">
        <h1 className="admin-title">Admin Dashboard</h1>
        <AdminLogout />
      </div>

      {/* STATS */}
      <div className="admin-stats-grid">
        <StatCard title="Total Appointments" value={stats.total} />
        <StatCard title="Today" value={stats.today} />
        <StatCard title="Pending" value={stats.pending} />
        <StatCard title="Confirmed" value={stats.confirmed} />
        <StatCard title="Completed" value={stats.completed} />
        <StatCard title="Cancelled" value={stats.cancelled} />
        <StatCard title="Today Earnings" value={formatMoney(stats.today_earnings || 0)} />
        <StatCard title="Month Earnings" value={formatMoney(stats.month_earnings || 0)} />
        <StatCard title="Year Earnings" value={formatMoney(stats.year_earnings || 0)} />
        <StatCard title="Total Earnings" value={formatMoney(stats.total_earnings || 0)} />
      </div>

      {/* BUSINESS TREND */}
      <div className="admin-trend-card" style={{ margin: '20px 0', padding: '16px', borderRadius: '10px', background: '#fff9e6', border: '1px solid #ffd54f' }}>
        <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700' }}>Business Performance Insight</h2>
        <p style={{ marginTop: '8px', lineHeight: '1.5', color: '#444' }}>{stats.trend_message || 'No trend data available yet.'}</p>
      </div>

      {/* TREND CHART */}
      <div className="admin-trend-chart" style={{ margin: '20px 0', padding: '16px', borderRadius: '10px', background: 'white', border: '1px solid #ddd' }}>
        <h2 style={{ margin: '0 0 12px', fontSize: '1.1rem', fontWeight: '700' }}>Revenue Momentum</h2>

        {(() => {
          const trendData = stats.trend_data || {};
          const series = [
            { name: 'Daily', points: [{ label: 'Prev', value: trendData.previous_day || 0 }, { label: 'Now', value: trendData.today || 0 }], color: '#ff4d6d' },
            { name: 'Monthly', points: [{ label: 'Prev', value: trendData.previous_month || 0 }, { label: 'Now', value: trendData.month || 0 }], color: '#7c4dff' },
            { name: 'Yearly', points: [{ label: 'Prev', value: trendData.previous_year || 0 }, { label: 'Now', value: trendData.year || 0 }], color: '#4da6ff' },
          ];

          const allValues = series.flatMap(s => s.points.map(p => p.value));
          const maxValue = Math.max(1, ...allValues);
          const minValue = 0;
          const valueRange = maxValue - minValue || 1;

          const chartWidth = 340;
          const chartHeight = 180;
          const leftPadding = 40;
          const rightPadding = 20;
          const topPadding = 20;
          const bottomPadding = 30;
          const innerWidth = chartWidth - leftPadding - rightPadding;
          const innerHeight = chartHeight - topPadding - bottomPadding;

          const getX = index => leftPadding + (innerWidth * index) / (series[0].points.length - 1);
          const getY = value => topPadding + innerHeight - ((value - minValue) / valueRange) * innerHeight;

          return (
            <div style={{ position: 'relative', width: '100%', overflow: 'auto' }}>
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} width="100%" height="220">
                <line x1={leftPadding} y1={topPadding + innerHeight} x2={leftPadding + innerWidth} y2={topPadding + innerHeight} stroke="#ccc" strokeWidth="1" />
                <line x1={leftPadding} y1={topPadding} x2={leftPadding} y2={topPadding + innerHeight} stroke="#ccc" strokeWidth="1" />

                {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
                  const y = topPadding + innerHeight - t * innerHeight;
                  // 0 should be at the bottom, max at the top
                  const valueTick = (minValue + valueRange * t).toFixed(0);
                  return (
                    <g key={i}>
                      <line x1={leftPadding} y1={y} x2={leftPadding + innerWidth} y2={y} stroke="#f0f0f0" strokeWidth="1" />
                      <text x={leftPadding - 8} y={y + 4} textAnchor="end" fontSize="9" fill="#777">{valueTick}</text>
                    </g>
                  );
                })}

                {series.map(line => {
                  const d = line.points.map((point, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx)} ${getY(point.value)}`).join(' ');
                  return (
                    <g key={line.name}>
                      <path d={d} fill="none" stroke={line.color} strokeWidth="2.5" />
                      {line.points.map((point, idx) => (
                        <circle key={idx} cx={getX(idx)} cy={getY(point.value)} r="3.5" fill="white" stroke={line.color} strokeWidth="2" />
                      ))}
                    </g>
                  );
                })}

                {[{ label: 'Prev' }, { label: 'Now' }].map((point, idx) => (
                  <text key={idx} x={getX(idx)} y={chartHeight - 8} textAnchor="middle" fontSize="10" fill="#444">{point.label}</text>
                ))}
              </svg>

              <div style={{ marginTop: '12px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {series.map(item => (
                  <span key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#333' }}>
                    <span style={{ width: '12px', height: '12px', background: item.color, borderRadius: '3px', display: 'inline-block' }} />
                    {item.name}
                  </span>
                ))}
              </div>
            </div>
          );
        })()}
      </div>

      {/* DESKTOP TABLE */}
      <div className="admin-table-card desktop-only">
        <h2>Recent Appointments</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Service</th>
              <th>Date & Time</th>
              <th>Duration</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {stats.recent.map(a => {
              // Extract duration from notes
              let duration = "N/A";
              if (a.notes && a.notes.includes("min")) {
                try {
                  const durationPart = a.notes.split("Package:")[1]?.split("min")[0]?.trim();
                  duration = durationPart ? `${durationPart} min` : "N/A";
                } catch (e) {
                  duration = "N/A";
                }
              }
              
              return (
                <tr key={a.id}>
                  <td>{a.customer_name}</td>
                  <td>{a.phone}</td>
                  <td>{a.email}</td>
                  <td>{a.service__name}</td>
                  <td>{a.date} {a.time}</td>
                  <td>{duration}</td>
                  <td>
                    <select
                      value={a.status}
                      onChange={(e) => handleStatusChange(a.id, e.target.value)}
                      disabled={updatingId === a.id}
                      className="status-select"
                      style={{
                        padding: "6px 8px",
                        borderRadius: "4px",
                        border: "1px solid #ddd",
                        cursor: updatingId === a.id ? "not-allowed" : "pointer",
                        minWidth: "120px",
                      }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="admin-mobile-list mobile-only">
        {stats.recent.map(a => {
          // Extract duration from notes
          let duration = "N/A";
          if (a.notes && a.notes.includes("min")) {
            try {
              const durationPart = a.notes.split("Package:")[1]?.split("min")[0]?.trim();
              duration = durationPart ? `${durationPart} min` : "N/A";
            } catch (e) {
              duration = "N/A";
            }
          }

          return (
            <div key={a.id} className="admin-mobile-card">
              <h3>{a.customer_name}</h3>
              <p><strong>Phone:</strong> {a.phone}</p>
              <p><strong>Email:</strong> {a.email}</p>
              <p><strong>Service:</strong> {a.service__name}</p>
              <p><strong>Date:</strong> {a.date}</p>
              <p><strong>Time:</strong> {a.time}</p>
              <p><strong>Duration:</strong> {duration}</p>
              <div style={{ marginTop: "8px" }}>
                <label style={{ display: "block", marginBottom: "4px", fontWeight: "600" }}>Status:</label>
                <select
                  value={a.status}
                  onChange={(e) => handleStatusChange(a.id, e.target.value)}
                  disabled={updatingId === a.id}
                  className="status-select"
                  style={{
                    width: "100%",
                    padding: "8px 8px",
                    borderRadius: "4px",
                    border: "1px solid #ddd",
                    cursor: updatingId === a.id ? "not-allowed" : "pointer",
                  }}
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          );
        })}
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AdminDashboard;
