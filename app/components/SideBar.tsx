'use client';

import {
  faCog,
  faFileInvoice,
  faHome,
  faPersonToDoor,
  faSignature,
} from '@fortawesome/pro-light-svg-icons';
import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { useLogoutModal } from '../context/LogoutModalContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SideBar() {
  const { toggleSettings } = useSettings();
  const { openModal } = useLogoutModal();
  const { isModalOpen } = useLogoutModal();
  const url = usePathname();

  if (url === '/login') {
    return null;
  }

  return (
    <aside className="fixed left-10 h-[calc(100%-250px)]  rounded-full top-1/2 z-[99] -translate-y-1/2 space-y-3 flex flex-col justify-between">
      <div className="flex flex-col bg-ensured-purple/20 rounded-full">
        <SidebarIcon
          icon={faHome}
          href="/"
          active={url === '/' || url.startsWith('/tender/')}
        />
        <SidebarIcon
          icon={faFileInvoice}
          href="/invoices"
          active={url === '/invoices'}
        />
        <SidebarIcon
          icon={faSignature}
          href="/protocols"
          active={url === '/protocols'}
        />
      </div>
      <div className="flex flex-col bg-ensured-purple/20 rounded-full">
        <SidebarIcon icon={faCog} onClick={toggleSettings} />
        <SidebarIcon
          icon={faPersonToDoor}
          active={isModalOpen}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const rect = e.currentTarget.getBoundingClientRect();
            openModal(rect.right, rect.top);
          }}
        />
      </div>
    </aside>
  );
}

function SidebarIcon({
  icon,
  href,
  onClick,
  active = false,
}: {
  icon: any;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  active?: boolean;
}) {
  const className = `grid h-14 w-14 place-items-center rounded-full transition-colors cursor-pointer ${
    active
      ? 'bg-gradient-to-b from-white/80 to-white/50 text-ensured-black'
      : ' text-white/70 hover:text-white'
  }`;

  if (onClick) {
    return (
      <button onClick={onClick} className={className}>
        <FontAwesomeIcon icon={icon} className="h-4 w-4" />
      </button>
    );
  }

  if (!href) {
    return (
      <div className={className}>
        <FontAwesomeIcon icon={icon} className="h-4 w-4" />
      </div>
    );
  }

  return (
    <Link href={href} className={className}>
      <FontAwesomeIcon icon={icon} className="h-4 w-4" />
    </Link>
  );
}
