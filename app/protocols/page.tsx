'use client';
import { useContext, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import { useAIChat } from '../context/AIChatContext';
import { useLogoutModal } from '../context/LogoutModalContext';
import { useNotifications } from '../context/NotificationsContext';
import { useSettings } from '../context/SettingsContext';
import PageScrollWrapper from '../components/PageScrollWrapper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessageBot } from '@fortawesome/pro-solid-svg-icons';
import {
  faHome,
  faFileInvoice,
  faSignature,
  faCog,
  faPersonToDoor,
  faBell,
  faFilePdf,
  faChevronRight,
  faChevronDown,
  faLongArrowRight,
  faLongArrowLeft,
} from '@fortawesome/pro-light-svg-icons';
import Link from 'next/link';
import MessageBot from '../components/MessageBot';
import { motion } from 'framer-motion';

export default function ProtocolsPage() {
  const { user, tenders } = useContext(AppContext);
  const { openChat } = useAIChat();
  const { openModal } = useLogoutModal();
  const { toggleNotifications } = useNotifications();
  const { toggleSettings } = useSettings();

  const { waiting, approved, denied } = useMemo(() => {
    const pick = (status: 1 | 2 | 3) =>
      tenders.filter((t) =>
        (t.documents || []).some(
          (d) => d.title === 'Slutprotokoll' && d.approvalStatus === status
        )
      );
    return { waiting: pick(1), approved: pick(2), denied: pick(3) };
  }, [tenders]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('sv-SE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background text-white">
      {/* background accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-[#6b1d7e]/25 blur-[140px]" />
        <div className="absolute -bottom-40 right-[-120px] h-[540px] w-[540px] rounded-full bg-[#2a0a35]/40 blur-[120px]" />
      </div>

      <PageScrollWrapper className="h-screen">
        <main className="relative z-10 max-w-[1400px] px-6 py-8 pl-34 pt-20">
          {/* Page header */}
          <div className="mb-8 flex items-center justify-between mt-10">
            <h1 className="text-4xl font-light tracking-tight">
              Dina slutprotokoll
            </h1>
            <MessageBot />
          </div>

          {/* Filter */}
          <div className="mb-6">
            <span className="text-sm opacity-70 font-light">
              Väntar på godkännande
            </span>
          </div>

          {/* Waiting for approval section */}
          <div className="mb-8">
            <motion.div
              initial={{
                y: 10,
                opacity: 0,
              }}
              animate={{
                y: [10, 0],
                opacity: [0, 1],
                transition: {
                  delay: 0.2,
                },
              }}
              className="mb-4 rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 overflow-hidden"
            >
              <table className="w-full">
                <thead className="mb-4">
                  <tr className="text-xs opacity-70">
                    <th className="font-light text-xs text-left pb-4">
                      Fastighet
                    </th>
                    <th className="font-light text-xs text-left pb-4">
                      Skickat den
                    </th>
                    <th className="font-light text-xs text-left pb-4">Bolag</th>
                    <th className="font-light text-xs text-left pb-4">
                      Kontaktperson
                    </th>
                    <th className="font-light text-xs text-left pb-4">
                      Telefonnummer
                    </th>
                    <th className="font-light text-xs text-center pb-4">
                      Åtgärd
                    </th>
                    <th className="font-light text-xs text-center pb-4">
                      Dokument
                    </th>
                    <th className="font-light text-xs text-center pb-4">
                      Till ärende
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/10">
                    <td className="py-3 font-light text-sm">Skutan 10</td>
                    <td className="py-3 text-xs">8 sep 2025, 14:03</td>
                    <td className="py-3 text-xs">Anders Bygg AB</td>
                    <td className="py-3 text-xs">Anders Svensson</td>
                    <td className="py-3 text-xs">2024-05-09</td>
                    <td className="py-3 text-xs text-center">
                      Välj åtgärd{' '}
                      <FontAwesomeIcon
                        icon={faChevronDown}
                        className="text-ensured-pink ml-1"
                      />
                    </td>
                    <td className="py-3 text-center">
                      <button className="grid h-8 w-8 place-items-center mx-auto">
                        <FontAwesomeIcon
                          icon={faFilePdf}
                          className="h-3 w-3 text-ensured-pink"
                        />
                      </button>
                    </td>
                    <td className="py-3 text-xs text-center">
                      Visa{' '}
                      <FontAwesomeIcon
                        icon={faChevronRight}
                        className="text-ensured-pink"
                      />
                    </td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-3 font-light text-sm">Skutan 11</td>
                    <td className="py-3 text-xs">8 sep 2025, 14:03</td>
                    <td className="py-3 text-xs">Bygg Pelle AB</td>
                    <td className="py-3 text-xs">Pelle Hansson</td>
                    <td className="py-3 text-xs">2024-05-10</td>
                    <td className="py-3 text-xs text-center">
                      Välj åtgärd{' '}
                      <FontAwesomeIcon
                        icon={faChevronDown}
                        className="text-ensured-pink ml-1"
                      />
                    </td>
                    <td className="py-3 text-center">
                      <button className="grid h-8 w-8 place-items-center mx-auto">
                        <FontAwesomeIcon
                          icon={faFilePdf}
                          className="h-3 w-3 text-ensured-pink"
                        />
                      </button>
                    </td>
                    <td className="py-3 text-xs text-center">
                      Visa{' '}
                      <FontAwesomeIcon
                        icon={faChevronRight}
                        className="text-ensured-pink"
                      />
                    </td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-3 font-light text-sm">Skutan 12</td>
                    <td className="py-3 text-xs">8 sep 2025, 14:03</td>
                    <td className="py-3 text-xs">Byggarna AB</td>
                    <td className="py-3 text-xs">Bob Olsson</td>
                    <td className="py-3 text-xs">2024-05-11</td>
                    <td className="py-3 text-xs text-center">
                      Välj åtgärd{' '}
                      <FontAwesomeIcon
                        icon={faChevronDown}
                        className="text-ensured-pink ml-1"
                      />
                    </td>
                    <td className="py-3 text-center">
                      <button className="grid h-8 w-8 place-items-center mx-auto">
                        <FontAwesomeIcon
                          icon={faFilePdf}
                          className="h-3 w-3 text-ensured-pink"
                        />
                      </button>
                    </td>
                    <td className="py-3 text-xs text-center">
                      Visa{' '}
                      <FontAwesomeIcon
                        icon={faChevronRight}
                        className="text-ensured-pink"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="flex items-center text-white/20 text-xs justify-end gap-4 pt-6">
                <p>Sidan 1 av 1</p>
                <div className="flex items-center gap-5">
                  <FontAwesomeIcon icon={faLongArrowLeft} />
                  <FontAwesomeIcon icon={faLongArrowRight} />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Approved section */}
          <div className="mb-8">
            <h3 className="mb-4 text-sm opacity-70 font-light">Godkända</h3>
            <motion.div
              initial={{
                y: 10,
                opacity: 0,
              }}
              animate={{
                y: [10, 0],
                opacity: [0, 1],
                transition: {
                  delay: 0.6,
                },
              }}
              className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 overflow-hidden"
            >
              <table className="w-full">
                <thead>
                  <tr className="text-xs opacity-70">
                    <th className="font-light text-xs text-left pb-4">
                      Fastighet
                    </th>
                    <th className="font-light text-xs text-left pb-4">
                      Skickat den
                    </th>
                    <th className="font-light text-xs text-left pb-4">Bolag</th>
                    <th className="font-light text-xs text-left pb-4">
                      Kontaktperson
                    </th>
                    <th className="font-light text-xs text-left pb-4">
                      Telefonnummer
                    </th>
                    <th className="font-light text-xs text-center pb-4">
                      Åtgärd utförd
                    </th>
                    <th className="font-light text-xs text-center pb-4">
                      Dokument
                    </th>
                    <th className="font-light text-xs text-center pb-4">
                      Till ärende
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/10">
                    <td className="py-3 font-light text-sm">Skutan 13</td>
                    <td className="py-3 text-xs">8 sep 2025, 14:03</td>
                    <td className="py-3 text-xs">Broderna Bygg AB</td>
                    <td className="py-3 text-xs">Bror Karlsson</td>
                    <td className="py-3 text-xs">2024-05-09</td>
                    <td className="py-3 text-xs text-center">
                      8 sep 2025, 14:02
                    </td>
                    <td className="py-3 text-center">
                      <button className="grid h-8 w-8 place-items-center mx-auto">
                        <FontAwesomeIcon
                          icon={faFilePdf}
                          className="h-3 w-3 text-ensured-pink"
                        />
                      </button>
                    </td>
                    <td className="py-3 text-xs text-center">
                      Visa{' '}
                      <FontAwesomeIcon
                        icon={faChevronRight}
                        className="text-ensured-pink"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="flex items-center text-white/20 text-xs justify-end gap-4 pt-6">
                <p>Sidan 1 av 1</p>
                <div className="flex items-center gap-5">
                  <FontAwesomeIcon icon={faLongArrowLeft} />
                  <FontAwesomeIcon icon={faLongArrowRight} />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Denied section */}
          <div className="mb-8">
            <h3 className="mb-4 text-sm opacity-70 font-light">Nekade</h3>

            <motion.div
              initial={{
                y: 10,
                opacity: 0,
              }}
              animate={{
                y: [10, 0],
                opacity: [0, 1],
                transition: {
                  delay: 1,
                },
              }}
              className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 overflow-hidden"
            >
              <table className="w-full">
                <thead>
                  <tr className="text-xs opacity-70">
                    <th className="font-light text-xs text-left pb-4">
                      Fastighet
                    </th>
                    <th className="font-light text-xs text-left pb-4">
                      Skickat den
                    </th>
                    <th className="font-light text-xs text-left pb-4">Bolag</th>
                    <th className="font-light text-xs text-left pb-4">
                      Kontaktperson
                    </th>
                    <th className="font-light text-xs text-left pb-4">
                      Telefonnummer
                    </th>
                    <th className="font-light text-xs text-center pb-4">
                      Åtgärd utförd
                    </th>
                    <th className="font-light text-xs text-center pb-4">
                      Dokument
                    </th>
                    <th className="font-light text-xs text-center pb-4">
                      Till ärende
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/10">
                    <td className="py-3 font-light text-sm">Skutan 14</td>
                    <td className="py-3 text-xs">8 sep 2025, 14:03</td>
                    <td className="py-3 text-xs">Renoverare AB</td>
                    <td className="py-3 text-xs">Reno Andersson</td>
                    <td className="py-3 text-xs">2024-05-12</td>
                    <td className="py-3 text-xs text-center">
                      15 jul 2024, 09:30
                    </td>
                    <td className="py-3 text-center">
                      <button className="grid h-8 w-8 place-items-center mx-auto">
                        <FontAwesomeIcon
                          icon={faFilePdf}
                          className="h-3 w-3 text-ensured-pink"
                        />
                      </button>
                    </td>
                    <td className="py-3 text-xs text-center">
                      Visa{' '}
                      <FontAwesomeIcon
                        icon={faChevronRight}
                        className="text-ensured-pink"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="flex items-center text-white/20 text-xs justify-end gap-4 pt-6">
                <p>Sidan 1 av 1</p>
                <div className="flex items-center gap-5">
                  <FontAwesomeIcon icon={faLongArrowLeft} />
                  <FontAwesomeIcon icon={faLongArrowRight} />
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </PageScrollWrapper>
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
