'use client';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useAIChat } from '../context/AIChatContext';
import { useLogoutModal } from '../context/LogoutModalContext';
import { useNotifications } from '../context/NotificationsContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faFileInvoice,
  faSignature,
  faCog,
  faPersonToDoor,
  faBell,
  faMessageBot,
  faTimes,
  faCheck,
  faUser,
  faBuilding,
  faPhone,
  faEnvelope,
  faGlobe,
} from '@fortawesome/pro-light-svg-icons';
import Link from 'next/link';

export default function SettingsPage() {
  const { user } = useContext(AppContext);
  const { openChat } = useAIChat();
  const { openModal } = useLogoutModal();
  const { toggleNotifications } = useNotifications();

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#12031a] text-white">
      {/* background accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-[#6b1d7e]/25 blur-[140px]" />
        <div className="absolute -bottom-40 right-[-120px] h-[540px] w-[540px] rounded-full bg-[#2a0a35]/40 blur-[120px]" />
      </div>

      <main className="relative z-10 mx-auto max-w-[1280px] px-6 py-8">
        {/* Top bar */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-md bg-[#a145b7] text-white shadow">
              <span className="text-sm font-extrabold">E</span>
            </div>
            <span className="text-lg font-semibold">Ensured</span>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <input
              placeholder="Sök efter ärende"
              className="h-10 w-full max-w-xl rounded-full bg-white/10 px-4 text-sm text-white placeholder:text-white/60 ring-1 ring-white/10 outline-none"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button onClick={toggleNotifications}>
                <FontAwesomeIcon
                  icon={faBell}
                  className="h-5 w-5 text-white/70 hover:text-white cursor-pointer"
                />
                <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500" />
              </button>
            </div>
            <div className="h-9 w-9 rounded-full bg-white/10" />
            <div className="text-sm opacity-80">{user.firstName}</div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Left Sidebar Menu */}
          <div className="w-64 space-y-6">
            <button className="flex w-full items-center justify-between rounded-lg bg-white/5 p-3 text-left hover:bg-white/10">
              <span className="text-sm font-medium">Inställningar</span>
              <FontAwesomeIcon
                icon={faTimes}
                className="h-4 w-4 text-white/50"
              />
            </button>

            {/* Service Section */}
            <div>
              <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-white/50">
                SERVICE
              </h3>
              <div className="space-y-1">
                <SettingsItem
                  icon={faCheck}
                  text="Jag vill få förhandsvisning av nya uppdateringar"
                  checked={true}
                />
                <SettingsItem
                  icon={faCheck}
                  text="Jag vill få förhandsvisning av nya grundfunktioner"
                  checked={true}
                />
                <SettingsItem
                  icon={faCheck}
                  text="Jag vill få förhandsvisning av nya användargränssnitt"
                  checked={true}
                />
                <SettingsItem
                  icon={faCheck}
                  text="Jag vill få förhandsvisning av nya funktioner"
                  checked={false}
                />
                <SettingsItem
                  icon={faCheck}
                  text="Jag vill få förhandsvisning av nya uppdateringar"
                  checked={true}
                />
                <SettingsItem
                  icon={faCheck}
                  text="Jag vill få förhandsvisning av nya uppdateringar"
                  checked={false}
                />
              </div>
            </div>

            {/* Platform Section */}
            <div>
              <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-white/50">
                PLATTFORM
              </h3>
              <div className="space-y-1">
                <SettingsItem
                  icon={faCheck}
                  text="Ny faktura via attestering"
                  checked={true}
                />
              </div>
            </div>

            {/* Summeringar Section */}
            <div>
              <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-white/50">
                SUMMERINGAR
              </h3>
              <div className="space-y-1">
                <SettingsItem
                  icon={faCheck}
                  text="Vill få sammanställt vad gäst/användare"
                  checked={true}
                />
              </div>
            </div>

            {/* Social Section */}
            <div>
              <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-white/50">
                SOCIAL
              </h3>
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-yellow-500" />
                <span className="text-sm">Avstängd</span>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="mb-8 flex items-center justify-between">
              <h1 className="text-4xl font-light tracking-tight">
                Kontoinställningar
              </h1>
              <button
                onClick={openChat}
                className="flex items-center gap-3 rounded-xl bg-[#a145b7]/20 px-4 py-3 text-sm ring-1 ring-[#a145b7]/30 transition hover:bg-[#a145b7]/30"
              >
                <span className="grid h-6 w-6 place-items-center rounded-md bg-[#a145b7]/50">
                  <FontAwesomeIcon
                    icon={faMessageBot}
                    className="h-3 w-3 text-white"
                  />
                </span>
                Vad kan jag assistera dig med idag?
              </button>
            </div>

            <div className="mb-6">
              <span className="text-sm opacity-70">Kontakt</span>
            </div>

            {/* Contact Form */}
            <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
              <div className="mb-6">
                <h2 className="text-lg font-medium">Markera/Demarkera din</h2>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Förnamn
                    </label>
                    <input
                      type="text"
                      defaultValue={user.firstName}
                      className="w-full rounded-lg bg-white/10 px-3 py-2 text-sm text-white ring-1 ring-white/20 focus:outline-none focus:ring-2 focus:ring-[#a145b7]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Efternamn
                    </label>
                    <input
                      type="text"
                      defaultValue={user.lastName}
                      className="w-full rounded-lg bg-white/10 px-3 py-2 text-sm text-white ring-1 ring-white/20 focus:outline-none focus:ring-2 focus:ring-[#a145b7]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Företag
                    </label>
                    <input
                      type="text"
                      defaultValue="Ensured AB"
                      className="w-full rounded-lg bg-white/10 px-3 py-2 text-sm text-white ring-1 ring-white/20 focus:outline-none focus:ring-2 focus:ring-[#a145b7]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      defaultValue="+46 70 123 45 67"
                      className="w-full rounded-lg bg-white/10 px-3 py-2 text-sm text-white ring-1 ring-white/20 focus:outline-none focus:ring-2 focus:ring-[#a145b7]"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      E-post
                    </label>
                    <input
                      type="email"
                      defaultValue={user.email}
                      className="w-full rounded-lg bg-white/10 px-3 py-2 text-sm text-white ring-1 ring-white/20 focus:outline-none focus:ring-2 focus:ring-[#a145b7]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Hemsida
                    </label>
                    <input
                      type="url"
                      defaultValue="https://ensured.se"
                      className="w-full rounded-lg bg-white/10 px-3 py-2 text-sm text-white ring-1 ring-white/20 focus:outline-none focus:ring-2 focus:ring-[#a145b7]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Adress
                    </label>
                    <input
                      type="text"
                      defaultValue="Storgatan 1, 111 22 Stockholm"
                      className="w-full rounded-lg bg-white/10 px-3 py-2 text-sm text-white ring-1 ring-white/20 focus:outline-none focus:ring-2 focus:ring-[#a145b7]"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button className="rounded-lg bg-[#a145b7] px-6 py-2 text-sm font-medium text-white hover:bg-[#8d3aa0] transition-colors">
                  Spara ändringar
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SettingsItem({
  icon,
  text,
  checked,
}: {
  icon: any;
  text: string;
  checked: boolean;
}) {
  return (
    <div className="flex items-center gap-3 py-1">
      <div
        className={`grid h-4 w-4 place-items-center rounded-sm ${
          checked ? 'bg-[#a145b7] text-white' : 'bg-white/10 text-white/30'
        }`}
      >
        <FontAwesomeIcon icon={icon} className="h-2 w-2" />
      </div>
      <span className="text-sm text-white/80">{text}</span>
    </div>
  );
}

function SidebarIcon({
  icon,
  href,
  active = false,
}: {
  icon: any;
  href?: string;
  active?: boolean;
}) {
  const className = `grid h-10 w-10 place-items-center rounded-2xl ring-1 transition-colors cursor-pointer ${
    active
      ? 'bg-[#a145b7] ring-[#a145b7]/50 text-white'
      : 'bg-white/5 ring-white/10 text-white/70 hover:bg-white/10 hover:text-white'
  }`;

  return (
    <Link href={href || '#'} className={className}>
      <FontAwesomeIcon icon={icon} className="h-4 w-4" />
    </Link>
  );
}
