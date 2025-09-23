'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPersonToDoor } from '@fortawesome/pro-light-svg-icons';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutModal({
  isOpen,
  onClose,
  onConfirm,
}: LogoutModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-[#1a0b2e] px-6 py-4 text-white shadow-2xl">
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className="grid h-10 w-10 place-items-center rounded-full bg-white/10">
            <FontAwesomeIcon
              icon={faPersonToDoor}
              className="h-5 w-5 text-white/70"
            />
          </div>

          {/* Text */}
          <span className="text-sm">Logga ut?</span>

          {/* Buttons */}
          <div className="ml-4 flex gap-2">
            <button
              onClick={onConfirm}
              className="rounded-full bg-white/10 px-4 py-1.5 text-sm hover:bg-white/20 transition-colors"
            >
              Ja
            </button>
            <button
              onClick={onClose}
              className="rounded-full bg-[#a145b7] px-4 py-1.5 text-sm hover:bg-[#8d3aa0] transition-colors"
            >
              Avbryt
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
