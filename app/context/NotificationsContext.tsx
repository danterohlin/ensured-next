'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

interface NotificationsContextType {
  isNotificationsOpen: boolean;
  openNotifications: () => void;
  closeNotifications: () => void;
  toggleNotifications: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const openNotifications = () => setIsNotificationsOpen(true);
  const closeNotifications = () => setIsNotificationsOpen(false);
  const toggleNotifications = () => setIsNotificationsOpen(!isNotificationsOpen);

  return (
    <NotificationsContext.Provider value={{ 
      isNotificationsOpen, 
      openNotifications, 
      closeNotifications, 
      toggleNotifications 
    }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
}
