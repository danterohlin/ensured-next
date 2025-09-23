'use client';
import { useNotifications } from '../context/NotificationsContext';
import NotificationsPanel from './NotificationsSheet';

export default function NotificationsWrapper() {
  const { isNotificationsOpen, closeNotifications } = useNotifications();

  return (
    <NotificationsPanel
      isOpen={isNotificationsOpen}
      onClose={closeNotifications}
    />
  );
}
