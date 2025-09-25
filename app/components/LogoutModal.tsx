'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPersonToDoor } from '@fortawesome/pro-light-svg-icons';
import { motion } from 'framer-motion';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  position: { x: number; y: number };
}

export default function LogoutModal({
  isOpen,
  onClose,
  onConfirm,
  position,
}: LogoutModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Modal */}
      <motion.div
        animate={{
          left: [position.x - 120, position.x - 20],
          opacity: [0, 1],
        }}
        className="fixed z-50 rounded-r-full bg-gradient-to-b from-ensured-purple to-ensured-purple-dark px-6 h-14 items-center justify-center text-white shadow-2xl pl-10"
        style={{
          left: position.x - 20,
          top: position.y,
        }}
      >
        <div className="flex items-center gap-4 h-full">
          {/* Text */}
          <span className="text-sm font-light">Logga ut?</span>

          {/* Buttons */}
          <div className="ml-4 flex gap-2">
            <button
              onClick={onConfirm}
              className="rounded-full cursor-pointer w-20 border border-ensured-pink/50 px-4 py-1.5 text-sm hover:bg-white/20 transition-colors"
            >
              Ja
            </button>
            <button
              onClick={onClose}
              className="rounded-full cursor-pointer w-20 bg-[#a145b7] px-4 py-1.5 text-sm hover:bg-[#8d3aa0] transition-colors"
            >
              Avbryt
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
