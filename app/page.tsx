'use client';
import Link from 'next/link';
import { useContext, useMemo, useState } from 'react';
import { AppContext } from './context/AppContext';
import { useAIChat } from './context/AIChatContext';
import { useLogoutModal } from './context/LogoutModalContext';
import { useNotifications } from './context/NotificationsContext';
import { useSettings } from './context/SettingsContext';
import PageScrollWrapper from './components/PageScrollWrapper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessageBot } from '@fortawesome/pro-solid-svg-icons';
import {
  faHome,
  faFileInvoice,
  faSignature,
  faCog,
  faPersonToDoor,
  faUpload,
  faBell,
  faCircleCheck,
  faTimes,
  faPaperPlane,
  faExternalLink,
  faChartLine,
  faChevronDown,
  faChevronRight,
  faFire,
  faHouseCrack,
  faDroplet,
} from '@fortawesome/pro-light-svg-icons';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import MessageBot from './components/MessageBot';
import { motion } from 'framer-motion';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const formatDate = (iso?: string | null) =>
  iso
    ? new Date(iso).toLocaleString('sv-SE', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : '';

const getDamageTypeIcon = (damageType: string) => {
  const type = damageType.toLowerCase();
  if (type.includes('brand')) return faFire;
  if (type.includes('skadegörelse')) return faHouseCrack;
  if (type.includes('vatten')) return faDroplet;
  return faHome; // default
};

export default function Home() {
  const { user, tenders, invoices } = useContext(AppContext);
  const { openChat } = useAIChat();
  const { openModal } = useLogoutModal();
  const { toggleNotifications } = useNotifications();
  const { toggleSettings } = useSettings();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const pendingCount = useMemo(
    () => invoices.filter((i) => i.status === 1).length,
    [invoices]
  );
  const protocolsToReview = useMemo(
    () =>
      tenders.filter((t) =>
        (t.documents || []).some(
          (d) => d.title === 'Slutprotokoll' && d.approvalStatus === 1
        )
      ).length,
    [tenders]
  );

  // Pagination calculations
  const totalPages = Math.ceil(tenders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTenders = tenders.slice(startIndex, endIndex);

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background text-white">
      {/* background accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-[#6b1d7e]/25 blur-[140px]" />
        <div className="absolute -bottom-40 right-[-120px] h-[540px] w-[540px] rounded-full bg-[#2a0a35]/40 blur-[120px]" />
      </div>

      {/* Sidebar */}

      <PageScrollWrapper className="h-screen">
        <main className="relative z-10 px-6 py-8 pt-20 pl-34 max-w-[1400px]">
          {/* Top section with greeting and assistant pill */}
          <div className="mb-8 flex items-center mt-10 justify-between">
            <h1 className="text-7xl  font-light tracking-tight">
              Godmorgon {user.firstName}
            </h1>
            <MessageBot />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left: task pills */}
            <div className="space-y-3">
              <div className="mb-4 text-sm font-medium opacity-70">
                Hårt sedan sist
              </div>
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
              >
                <DashboardPill
                  icon={faFileInvoice}
                  href="/invoices"
                  text={`Du har ${pendingCount} st fakturor att attestera.`}
                />
              </motion.div>
              <motion.div
                initial={{
                  y: 10,
                  opacity: 0.3,
                }}
                animate={{
                  y: [10, 0],
                  opacity: [0, 1],
                  transition: {
                    delay: 0.4,
                  },
                }}
              >
                <DashboardPill
                  icon={faCircleCheck}
                  href={`/${tenders[1]?.id || '#'}`}
                  text={`Anbudet för ${
                    tenders[1]?.property.name || 'Skutan 11'
                  } är avslutat.`}
                />
              </motion.div>
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
              >
                <DashboardPill
                  icon={faSignature}
                  href="/protocols"
                  text={`Du har ${protocolsToReview} st slutprotokoll att granska.`}
                />
              </motion.div>
            </div>

            {/* Middle: stats */}
            <div className="flex flex-col h-full">
              <div className="mb-4 flex items-center justify-between">
                <div className="text-sm opacity-70">Avslutade anbud</div>
                <div className="text-xs opacity-80 cursor-pointer hover:opacity-70 transition-opacity">
                  Senaste 7 dagarna{' '}
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className="text-ensured-pink"
                  />
                </div>
              </div>
              <motion.div
                animate={{
                  y: [10, 0],
                  opacity: [0, 1],
                  transition: {
                    delay: 0.8,
                  },
                }}
                className="flex h-full w-full items-center justify-between rounded-2xl bg-ensured-purple/70 p-6 "
              >
                <div className="w-1/3">
                  <div className="text-7xl font-bold leading-none">32</div>
                  <div className="text-xs opacity-70 ">(5 st idag)</div>
                </div>
                {/* Chart representation */}
                <div className="w-2/3">
                  <div className="h-full w-full bg-ensured-purple rounded-xl p-4">
                    <Line
                      data={{
                        labels: ['', '', '', '', '', '', '', ''],
                        datasets: [
                          {
                            data: [5, 9, 10, 8, 8, 10, 9, 6],
                            fill: true,
                            backgroundColor: (context) => {
                              const ctx = context.chart.ctx;
                              const gradient = ctx.createLinearGradient(
                                0,
                                0,
                                0,
                                ctx.canvas.height
                              );
                              gradient.addColorStop(
                                0,
                                'rgba(161, 69, 183, 0.8)'
                              );
                              gradient.addColorStop(
                                1,
                                'rgba(161, 69, 183, 0.2)'
                              );
                              return gradient;
                            },

                            borderWidth: 0,
                            pointRadius: 0,
                            pointHoverRadius: 0,
                            tension: 0.4,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false,
                          },
                          tooltip: {
                            enabled: false,
                          },
                        },
                        scales: {
                          x: {
                            display: false,
                            grid: {
                              display: false,
                            },
                          },
                          y: {
                            display: true,
                            grid: {
                              display: false,
                            },
                            min: 0,
                            max: 15,
                          },
                        },
                        elements: {
                          line: {
                            borderJoinStyle: 'round',
                          },
                        },
                        interaction: {
                          intersect: false,
                        },
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right: upload */}
            <div className="rounded-2xl flex flex-col">
              <div className="mb-4 text-sm opacity-70">
                Skapa anbudsförfrågan
              </div>
              <motion.div
                animate={{
                  y: [10, 0],
                  opacity: [0, 1],
                  transition: {
                    delay: 1,
                  },
                }}
                className="grid bg-ensured-purple/70 h-full   place-items-center rounded-xl border border-dashed border-white/15  text-center text-sm opacity-90"
              >
                <div>
                  <FontAwesomeIcon
                    icon={faUpload}
                    className="mb-2 h-6 w-6 text-white/50"
                  />
                  <div>Dra och släpp en fil</div>
                  <div className="mt-1 text-xs opacity-70">
                    eller ladda upp från enheten
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Filters & table */}
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <div className="mb-4 text-lg font-semibold">Anbud</div>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <FilterChip label="Alla skadetyper" />
                <FilterChip label="Alla ärendetyper" />
                <FilterChip label="Alla statusar" />
              </div>
            </div>
            <motion.div
              initial={{
                y: 10,
                opacity: 0,
              }}
              animate={{
                y: [10, 0],
                opacity: [0, 1],
                transition: {
                  delay: 1.2,
                },
              }}
              className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10"
            >
              <div className="overflow-hidden rounded-xl ring-1 ring-white/10">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-white/5 text-white/80">
                    <tr>
                      {[
                        'Ärendenummer',
                        'Försäkringstagare',
                        'Fastighet',
                        'Fastighetsadress',
                        'Ärendetyp',
                        'Skadetyp',
                        'Status',
                        'Avslutas',
                      ].map((h) => (
                        <th key={h} className="px-4 py-3 font-medium">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentTenders.map((t) => (
                      <tr
                        key={t.id}
                        className="border-t border-white/10 hover:bg-white/5"
                      >
                        <td className="px-4 py-3">
                          <Link
                            href={`/tender/${t.id}`}
                            className="underline-offset-2 hover:underline"
                          >
                            {t.id}
                          </Link>
                        </td>
                        <td className="px-4 py-3">{t.po.name}</td>
                        <td className="px-4 py-3">{t.property.name}</td>
                        <td className="px-4 py-3">
                          {t.property.address}, {t.property.zip}{' '}
                          {t.property.town}
                        </td>
                        <td className="px-4 py-3">
                          {t.tenderType === 1 ? 'Återställande' : 'Förarbete'}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <FontAwesomeIcon
                              icon={getDamageTypeIcon(t.damageType.label)}
                              className={`h-4 w-4 ${
                                t.damageType.label === 'Brand'
                                  ? 'text-red-500'
                                  : t.damageType.label === 'Skadegörelse'
                                  ? 'text-yellow-500'
                                  : t.damageType.label === 'Vattenskada'
                                  ? 'text-blue-500'
                                  : 'text-white/70'
                              }`}
                            />
                            {t.damageType.label}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {t.status === 1
                            ? 'Väntar'
                            : t.status === 2
                            ? 'Anbudsprocess'
                            : t.status === 3
                            ? 'Arbete pågår'
                            : 'Ej startad'}
                        </td>
                        <td className="px-4 py-3">{formatDate(t.endingAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="mt-4 flex items-center justify-between text-sm">
                <div className="opacity-70">
                  Sidan {currentPage} av {totalPages} ({tenders.length} anbud
                  totalt)
                </div>
                <div className="flex gap-2 items-center">
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className={`rounded-lg px-3 py-1.5 ring-1 ring-white/10 transition-colors ${
                      currentPage === 1
                        ? 'bg-white/5 text-white/30 cursor-not-allowed'
                        : 'bg-white/5 hover:bg-white/10 text-white'
                    }`}
                  >
                    ‹
                  </button>

                  {/* Page numbers */}
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                            currentPage === pageNum
                              ? 'bg-ensured-pink text-white'
                              : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`rounded-lg px-3 py-1.5 ring-1 ring-white/10 transition-colors ${
                      currentPage === totalPages
                        ? 'bg-white/5 text-white/30 cursor-not-allowed'
                        : 'bg-white/5 hover:bg-white/10 text-white'
                    }`}
                  >
                    ›
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </PageScrollWrapper>
    </div>
  );
}

function DashboardPill({
  icon,
  href,
  onClick,
  text,
  variant = 'default',
}: {
  icon: any;
  href?: string;
  onClick?: () => void;
  text: string;
  variant?: 'default' | 'assistant';
}) {
  const className =
    variant === 'assistant'
      ? 'flex items-center gap-3 rounded-full hover:bg-[#a145b7]/20 px-6 pr-10 py-3 text-sm transition bg-[#a145b7]/30 cursor-pointer'
      : 'flex items-center justify-between rounded-xl bg-ensured-purple/70 px-4 py-3 text-sm transition hover:bg-ensured-purple/80 cursor-pointer';

  const content =
    variant === 'assistant' ? (
      <>
        <span className="grid h-6 w-6 place-items-center rounded-md ">
          <FontAwesomeIcon
            icon={icon}
            className="h-3 w-3 text-ensured-pink text-xl"
          />
        </span>
        {text}
      </>
    ) : (
      <>
        <span className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-md">
            <FontAwesomeIcon
              icon={icon}
              className="text-xl text-ensured-pink"
            />
          </span>
          {text}
        </span>
        <span className="opacity-70">
          <FontAwesomeIcon
            icon={faChevronRight}
            className="text-ensured-pink"
          />
        </span>
      </>
    );

  if (onClick) {
    return (
      <button onClick={onClick} className={className}>
        {content}
      </button>
    );
  }

  return (
    <Link href={href || '#'} className={className}>
      {content}
    </Link>
  );
}

function FilterChip({ label }: { label: string }) {
  return (
    <div className="rounded-lg bg-white/5 gap-3 flex px-5 py-3 text-sm ">
      <button className="text-xs font-light">{label}</button>
      <div className="border-l border-ensured-purple-light pl-2">
        <FontAwesomeIcon icon={faChevronDown} className="text-ensured-pink" />
      </div>
    </div>
  );
}
