import { useEffect } from 'react';
import './Toast.css';

function Toast({ message, isVisible, onClose, duration = 4000 }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, duration]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="toast-container">
      <div className="toast">
        <div className="toast-icon">🏆</div>
        <div className="toast-message">{message}</div>
        <button className="toast-close" onClick={onClose}>×</button>
      </div>
    </div>
  );
}

export default Toast;
