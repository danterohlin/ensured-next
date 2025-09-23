'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

interface LogoutModalContextType {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  confirmLogout: () => void;
}

const LogoutModalContext = createContext<LogoutModalContextType | undefined>(
  undefined
);

export function LogoutModalProvider({ children }: { children: ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const confirmLogout = () => {
    // Handle logout logic here
    console.log('Logging out...');
    setIsModalOpen(false);
    // Redirect to login or handle logout
  };

  return (
    <LogoutModalContext.Provider
      value={{
        isModalOpen,
        openModal,
        closeModal,
        confirmLogout,
      }}
    >
      {children}
    </LogoutModalContext.Provider>
  );
}

export function useLogoutModal() {
  const context = useContext(LogoutModalContext);
  if (context === undefined) {
    throw new Error('useLogoutModal must be used within a LogoutModalProvider');
  }
  return context;
}
