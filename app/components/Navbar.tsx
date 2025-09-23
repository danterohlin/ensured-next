'use client';

import { faBell, faChevronDown } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useNotifications } from '../context/NotificationsContext';
import { useScroll } from '../context/ScrollContext';
import { useProfile } from '../context/ProfileContext';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { toggleNotifications } = useNotifications();
  const { toggleProfile } = useProfile();
  const { user } = useContext(AppContext);
  const { isVisible, scrollY } = useScroll();
  const url = usePathname();

  if (url === '/login') {
    return null;
  }

  return (
    <div
      className={`fixed z-[99] w-full top-0 mb-6 flex items-center justify-between gap-4 px-10 transition-all duration-300 ease-out ${
        isVisible ? 'translate-y-0' : '-translate-y-[100px]'
      } ${
        scrollY > 50 && isVisible
          ? 'backdrop-blur-md bg-background/90  shadow-lg py-4 mt-0'
          : 'mt-10 py-0'
      }`}
    >
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-3 mr-10">
          <Image src="/logo.png" alt="Ensured" width={128} height={37} />
        </Link>
        <div className="flex flex-1 items-center justify-center">
          <input
            placeholder="Sök efter ärende"
            className="h-10 w-[300px] max-w-xl rounded-full bg-white/10 px-4 text-sm text-white placeholder:text-white/60 ring-1 ring-white/10 outline-none"
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <button onClick={toggleNotifications}>
            <FontAwesomeIcon
              icon={faBell}
              className="h-5 w-5 text-white/70 hover:text-white cursor-pointer group"
            />
            <div className="absolute -top-0 -right-0 h-2 w-2 rounded-full bg-ensured-pink" />
          </button>
        </div>
        <button
          onClick={toggleProfile}
          className="flex items-center gap-3  rounded-lg p-2 -m-2 cursor-pointer transition-colors group"
        >
          <div className="h-9 w-9 rounded-full bg-white/10 overflow-hidden flex transition-opacity duration-300 group-hover:opacity-100 opacity-80 items-center justify-center object-cover">
            <Image src={'/eric_white.png'} alt="User" width={34} height={34} />
          </div>
          <div className="text-sm opacity-80 group-hover:opacity-100 transition-opacity duration-300">
            {user.firstName}
          </div>
          <div>
            <FontAwesomeIcon
              icon={faChevronDown}
              className="text-ensured-pink"
            />
          </div>
        </button>
      </div>
    </div>
  );
}
