// Alerts.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import './Alert.css';

function Alerts() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4000/api/alerts')
      .then(res => {
        setAlerts(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  const getTypeColor = (type) => {
    if (!type) return '#888';
    if (type.includes("Expired")) return '#d9534f';
    if (type.includes("Expiring")) return '#f0ad4e';
    if (type.includes("Excess")) return '#0275d8';
    return '#5bc0de';
  };

  return (
    <div className="alerts-container">
      <h2 className="alerts-heading">📢 Inventory Alerts</h2>

      {alerts.length === 0 ? (
        <p className="no-alerts">No alerts to show.</p>
      ) : (
        alerts.map((alert, index) => (
          <div key={index} className="alert-card">
            <div className="alert-top">
              {/* ✅ Product Image */}
              {alert.image && (
                <img
                  className="alert-image"
                  src={alert.image}
                  alt={alert.name}
                  onError={(e) => e.target.style.display = 'none'}
                />
              )}
              <div className="alert-header">
                <span className="alert-icon">🔔</span>
                <strong className="alert-product">{alert.productName || alert.name}</strong>
              </div>
            </div>

            <div className="alert-info"><span>📦 Stock:</span> {alert.stock}</div>
            <div className="alert-info">
              <span>⚠️ Alert Type:</span>{' '}
              <span style={{ color: getTypeColor(alert.type), fontWeight: 'bold' }}>
                {alert.type}
              </span>
            </div>
            <div className="alert-info">
              <span>📝 Message:</span>{' '}
              <span className="alert-message" style={{ color: getTypeColor(alert.type) }}>
                {alert.message}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Alerts;
