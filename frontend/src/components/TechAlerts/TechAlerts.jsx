import { useState, useRef, useEffect } from 'react';
import './TechAlerts.css';

function TechAlerts({ techAlerts }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const buttonRef = useRef(null);
  const popupRef = useRef(null);

  // Filter out "No Alerts" messages and count real alerts
  const realAlerts = techAlerts?.filter(alert =>
    alert.message !== 'No Alerts',
  ) || [];
  const alertCount = realAlerts.length;

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      togglePopup();
    } else if (e.key === 'Escape' && isPopupOpen) {
      setIsPopupOpen(false);
      buttonRef.current?.focus();
    }
  };

  const handleClickOutside = (e) => {
    if (popupRef.current && !popupRef.current.contains(e.target) &&
        buttonRef.current && !buttonRef.current.contains(e.target)) {
      setIsPopupOpen(false);
    }
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsPopupOpen(false);
        buttonRef.current?.focus();
      }
    };

    if (isPopupOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isPopupOpen]);

  const formatDateTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short',
      });
    } catch (_error) {
      return dateString; // Fallback to original string if parsing fails
    }
  };

  // Don't render if no real alerts
  if (alertCount === 0) {
    return null;
  }

  return (
    <div className="tech-alerts-container">
      <button
        ref={buttonRef}
        className="tech-alerts-button"
        onClick={togglePopup}
        onKeyDown={handleKeyDown}
        aria-label={`${alertCount} tech alert${alertCount !== 1 ? 's' : ''}`}
        aria-expanded={isPopupOpen}
        aria-haspopup="dialog"
      >
        <svg
          className="alert-icon"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 2L1 21h22L12 2zm0 3.5L19.5 19h-15L12 5.5zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z"/>
        </svg>
        <span className="alert-badge">{alertCount}</span>
      </button>

      {isPopupOpen && (
        <div
          ref={popupRef}
          className="tech-alerts-popup"
          role="dialog"
          aria-label="Tech Alerts Details"
          aria-modal="true"
        >
          <div className="popup-header">
            <h3>Tech Alerts ({alertCount})</h3>
            <button
              className="close-button"
              onClick={() => setIsPopupOpen(false)}
              aria-label="Close alerts"
            >
              ×
            </button>
          </div>
          <div className="alerts-list">
            {realAlerts.map((alert, index) => (
              <div key={index} className="alert-item">
                <div className="alert-message">{alert.message}</div>
                <div className="alert-date">
                  {formatDateTime(alert.date_of_event)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TechAlerts;
