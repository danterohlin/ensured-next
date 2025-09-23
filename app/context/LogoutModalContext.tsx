'use client';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useState, ReactNode } from 'react';

interface LogoutModalContextType {
  isModalOpen: boolean;
  modalPosition: { x: number; y: number };
  openModal: (x: number, y: number) => void;
  closeModal: () => void;
  confirmLogout: () => void;
}

const LogoutModalContext = createContext<LogoutModalContextType | undefined>(
  undefined
);

export function LogoutModalProvider({ children }: { children: ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const router = useRouter();
  const openModal = (x: number, y: number) => {
    setModalPosition({ x, y });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const confirmLogout = () => {
    // Handle logout logic here
    console.log('Logging out...');
    setIsModalOpen(false);
    router.push('/login');
    // Redirect to login or handle logout
  };

  return (
    <LogoutModalContext.Provider
      value={{
        isModalOpen,
        modalPosition,
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
