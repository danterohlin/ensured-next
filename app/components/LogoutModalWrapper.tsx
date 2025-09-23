'use client';
import { useLogoutModal } from '../context/LogoutModalContext';
import LogoutModal from './LogoutModal';

export default function LogoutModalWrapper() {
  const { isModalOpen, modalPosition, closeModal, confirmLogout } =
    useLogoutModal();

  return (
    <LogoutModal
      isOpen={isModalOpen}
      onClose={closeModal}
      onConfirm={confirmLogout}
      position={modalPosition}
    />
  );
}
