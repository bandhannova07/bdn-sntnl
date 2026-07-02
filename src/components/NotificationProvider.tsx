/** @jsxImportSource react */
import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (type: NotificationType, message: string, duration?: number) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((
    type: NotificationType,
    message: string,
    duration: number = 4000
  ) => {
    const id = `${Date.now()}-${Math.random()}`;
    const notification: Notification = { id, type, message, duration };
    
    setNotifications(prev => [...prev, notification]);
    
    if (duration > 0) {
      setTimeout(() => removeNotification(id), duration);
    }
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed bottom-4 right-4 z-[9999] space-y-3 max-w-sm">
      {notifications.map(notification => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};

const NotificationItem: React.FC<{
  notification: Notification;
  onClose: () => void;
}> = ({ notification, onClose }) => {
  const baseClasses = 'flex items-center gap-3 px-4 py-3 rounded-lg backdrop-blur-lg border animate-in slide-in-from-right-4 duration-300';
  
  const typeConfig = {
    success: {
      bg: 'bg-emerald-500/20 border-emerald-500/50',
      icon: <CheckCircle size={18} className="text-emerald-400 shrink-0" />,
      text: 'text-emerald-300',
    },
    error: {
      bg: 'bg-red-500/20 border-red-500/50',
      icon: <AlertCircle size={18} className="text-red-400 shrink-0" />,
      text: 'text-red-300',
    },
    warning: {
      bg: 'bg-amber-500/20 border-amber-500/50',
      icon: <AlertTriangle size={18} className="text-amber-400 shrink-0" />,
      text: 'text-amber-300',
    },
    info: {
      bg: 'bg-blue-500/20 border-blue-500/50',
      icon: <Info size={18} className="text-blue-400 shrink-0" />,
      text: 'text-blue-300',
    },
  };

  const config = typeConfig[notification.type];

  return (
    <div className={`${baseClasses} ${config.bg}`}>
      {config.icon}
      <p className={`text-sm font-medium flex-1 ${config.text}`}>
        {notification.message}
      </p>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-white transition-colors shrink-0"
      >
        <X size={16} />
      </button>
    </div>
  );
};
