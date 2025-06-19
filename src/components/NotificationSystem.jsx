import React, { useState } from 'react';
import { useStudentContext } from '../contexts/StudentContext';

const Notification = ({ notification, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);
  
  const handleClose = () => {
    setIsExiting(true);
    // Attendre la fin de l'animation avant de fermer
    setTimeout(() => onClose(notification.id), 300);
  };
  
  // Formater la date et l'heure
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  };
  
  // Déterminer l'icône en fonction du type de notification
  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return 'fa-solid fa-check-circle';
      case 'warning':
        return 'fa-solid fa-exclamation-triangle';
      case 'error':
        return 'fa-solid fa-times-circle';
      default:
        return 'fa-solid fa-info-circle';
    }
  };

  return (
    <div className={`notification ${notification.type} ${isExiting ? 'exiting' : ''}`}>
      <div className="icon">
        <i className={getIcon(notification.type)}></i>
      </div>
      <div className="content">
        <div className="message">{notification.message}</div>
        <div className="timestamp">{formatTime(notification.timestamp)}</div>
      </div>
      <button className="close" onClick={handleClose}>
        <i className="fa-solid fa-times"></i>
      </button>
    </div>
  );
};

const NotificationSystem = () => {
  const { notifications, removeNotification } = useStudentContext();

  // Limiter le nombre de notifications affichées à 5
  const visibleNotifications = notifications.slice(0, 5);

  return (
    <div className="notifications-container">
      {visibleNotifications.map(notification => (
        <Notification 
          key={notification.id} 
          notification={notification} 
          onClose={removeNotification} 
        />
      ))}
    </div>
  );
};

export default NotificationSystem; 