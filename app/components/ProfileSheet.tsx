'use client';
import { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faUser,
  faCheck,
  faBuilding,
  faPhone,
  faEnvelope,
  faGlobe,
  faSignOut,
  faKey,
  faPalette,
  faEdit,
  faUnlock,
} from '@fortawesome/pro-light-svg-icons';
import OverlayScrollbarsWrapper from './OverlayScrollbarsWrapper';
import { AppContext } from '../context/AppContext';
import Image from 'next/image';

interface ProfileSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProfileItemProps {
  icon: any;
  text: string;
  value?: string;
  onClick?: () => void;
  isButton?: boolean;
  showEdit?: boolean;
  onEdit?: () => void;
}

function ProfileItem({
  icon,
  text,
  value,
  onClick,
  isButton = false,
  showEdit = false,
  onEdit,
}: ProfileItemProps) {
  return (
    <div
      className={`flex z-[110] items-center justify-between rounded-lg p-3 transition-colors ${
        isButton ? 'hover:bg-white/5 cursor-pointer' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="grid h-6 w-6 place-items-center">
          <FontAwesomeIcon icon={icon} className="h-3 w-3 text-white/70" />
        </div>
        <span className="text-sm text-white">{text}</span>
      </div>
      <div className="flex items-center gap-3">
        {value && <span className="text-sm text-white/60">{value}</span>}
        {showEdit && onEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="grid h-6 w-6 place-items-center rounded hover:bg-white/10 transition-colors"
          >
            <FontAwesomeIcon
              icon={faEdit}
              className="h-3 w-3 text-white/50 hover:text-white/80"
            />
          </button>
        )}
      </div>
    </div>
  );
}

export default function ProfileSheet({ isOpen, onClose }: ProfileSheetProps) {
  const { user } = useContext(AppContext);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Start animation after render
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      // Remove from DOM after animation completes
      setTimeout(() => setShouldRender(false), 300);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  const getUserTypeLabel = (type: number) => {
    switch (type) {
      case 1:
        return 'Försäkringsbolag';
      case 2:
        return 'Fastighetsägare';
      case 3:
        return 'Entreprenör';
      default:
        return 'Okänd';
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Profile Sheet */}
      <div
        className={`fixed right-0 top-0 z-[110] h-full w-[450px] bg-ensured-purple-dark text-white shadow-2xl transform transition-transform duration-300 ease-out ${
          isAnimating ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div>
              <div className="font-semibold">Konto</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
          </button>
        </div>

        {/* Profile Content */}
        <div className="flex h-[calc(100vh-80px)] flex-col">
          <OverlayScrollbarsWrapper>
            <div className="flex-1 overflow-y-auto p-4 pr-6">
              {/* User Info Section */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-16 w-16 rounded-full bg-white/10 overflow-hidden flex items-center justify-center">
                    <Image
                      src={'/eric_white.png'}
                      alt="User"
                      width={64}
                      height={64}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-base font-semibold text-white">
                      {user.firstName} {user.lastName}
                    </h2>
                    <p className="text-xs text-white/60 whitespace-nowrap">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Account Details Section */}
              <div className="mb-8">
                <h3 className="mb-4 text-xs font-medium uppercase tracking-wide text-white/50">
                  KONTOINFORMATION
                </h3>
                <div className="space-y-1">
                  <ProfileItem
                    icon={faUser}
                    text="Användarnamn"
                    value={`${user.firstName.toLowerCase()}.${user.lastName.toLowerCase()}`}
                    showEdit={true}
                    onEdit={() => {
                      console.log('Edit username clicked');
                      // Handle edit username
                    }}
                  />
                  {user.email && (
                    <ProfileItem
                      icon={faEnvelope}
                      text="E-post"
                      value={user.email}
                      showEdit={true}
                      onEdit={() => {
                        console.log('Edit email clicked');
                        // Handle edit email
                      }}
                    />
                  )}
                  <ProfileItem
                    icon={faBuilding}
                    text="Organisation"
                    value={user.organisation || 'Ej angiven'}
                    showEdit={true}
                    onEdit={() => {
                      console.log('Edit organisation clicked');
                      // Handle edit organisation
                    }}
                  />
                  {user.role && (
                    <ProfileItem
                      icon={faKey}
                      text="Roll"
                      value={user.role}
                      showEdit={true}
                      onEdit={() => {
                        console.log('Edit role clicked');
                        // Handle edit role
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Actions Section */}
              <div className="mb-8">
                <h3 className="mb-4 text-xs font-medium uppercase tracking-wide text-white/50">
                  ÅTGÄRDER
                </h3>
                <div className="space-y-1">
                  <ProfileItem
                    icon={faUser}
                    text="Redigera profil"
                    isButton={true}
                    onClick={() => {
                      // Handle edit profile
                      console.log('Edit profile clicked');
                    }}
                  />
                  <ProfileItem
                    icon={faKey}
                    text="Ändra lösenord"
                    isButton={true}
                    onClick={() => {
                      // Handle change password
                      console.log('Change password clicked');
                    }}
                  />
                  <ProfileItem
                    icon={faUnlock}
                    text="Återställ lösenord"
                    isButton={true}
                    onClick={() => {
                      // Handle reset password
                      console.log('Reset password clicked');
                    }}
                  />
                  <ProfileItem
                    icon={faPalette}
                    text="Utseende"
                    isButton={true}
                    onClick={() => {
                      // Handle appearance settings
                      console.log('Appearance settings clicked');
                    }}
                  />
                </div>
              </div>

              {/* Logout Section */}
              {/* <div className="mb-8">
                <h3 className="mb-4 text-xs font-medium uppercase tracking-wide text-white/50">
                  SESSION
                </h3>
                <div className="space-y-1">
                  <ProfileItem
                    icon={faSignOut}
                    text="Logga ut"
                    isButton={true}
                    onClick={() => {
                      // Handle logout
                      console.log('Logout clicked');
                    }}
                  />
                </div>
              </div> */}
            </div>
          </OverlayScrollbarsWrapper>
        </div>
      </div>
    </>
  );
}
