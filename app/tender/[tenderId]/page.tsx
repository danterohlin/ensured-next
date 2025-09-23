'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useContext, useMemo, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { useAIChat } from '../../context/AIChatContext';
import { useLogoutModal } from '../../context/LogoutModalContext';
import { useNotifications } from '../../context/NotificationsContext';
import { useSettings } from '../../context/SettingsContext';
import PageScrollWrapper from '../../components/PageScrollWrapper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faFileInvoice,
  faSignature,
  faCog,
  faPersonToDoor,
  faBell,
  faMessageBot,
  faBuildings,
  faMapMarkerAlt,
  faCalendar,
  faUser,
  faPhone,
  faEnvelope,
  faFileAlt,
  faComment,
  faExternalLink,
  faDroplet,
  faEllipsis,
  faChevronDown,
  faChevronRight,
  faChevronLeft,
  faFilePdf,
} from '@fortawesome/pro-light-svg-icons';
import Image from 'next/image';

export default function TenderPage() {
  const params = useParams<{ tenderId: string }>();
  const idNum = Number(params.tenderId);
  const { user, tenders } = useContext(AppContext);
  const { openChat } = useAIChat();
  const { openModal } = useLogoutModal();
  const { toggleNotifications } = useNotifications();
  const { toggleSettings } = useSettings();

  const tender = useMemo(
    () => tenders.find((t) => t.id === idNum),
    [tenders, idNum]
  );

  const [comment, setComment] = useState('');

  if (!tender) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden bg-[#12031a] text-white">
        <main className="relative z-10 mx-auto max-w-[1280px] px-6 py-8">
          <p>Hittade inte ärendet.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background text-white">
      {/* background accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-[#6b1d7e]/25 blur-[140px]" />
        <div className="absolute -bottom-40 right-[-120px] h-[540px] w-[540px] rounded-full bg-[#2a0a35]/40 blur-[120px]" />
      </div>

      <PageScrollWrapper className="h-screen">
        <main className="relative z-10 max-w-[1400px] px-6 py-8 pl-34 pt-20">
          {/* Top Header */}

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left Column - Property Info */}
            <div className="lg:col-span-2 space-y-4">
              <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4 mt-10">
                  <div className="">
                    <FontAwesomeIcon
                      icon={faBuildings}
                      className="text-5xl text-ensured-pink"
                    />
                  </div>
                  <div>
                    <h1 className="text-2xl font-base text-white">
                      PB Fastigheter
                    </h1>
                    <div className="text-sm text-white/60">#{tender.id}</div>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 p-6 rounded-xl">
                {/* Property Owner Section */}
                <div className="flex gap-4">
                  <div className="w-full">
                    <h3 className="text-sm font-medium text-white/60 mb-3">
                      Fastighetsägare
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="space-y-2 bg-white/5 p-4 rounded-xl w-full">
                        <div>
                          <div className="text-xs text-white/50">Namn</div>
                          <div className="font-medium">PB Fastigheter</div>
                        </div>
                        <div>
                          <div className="text-xs text-white/50">Adress</div>
                          <div className="text-sm">
                            Testgatan 2, 112 30 Stockholm
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-white/50">Telefon</div>
                          <div className="text-[#a145b7] text-sm">08643206</div>
                        </div>
                        <div>
                          <div className="text-xs text-white/50">E-post</div>
                          <div className="text-[#a145b7] text-sm">
                            mail@mail.com
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="w-full">
                    <h3 className="text-sm font-medium text-white/60 mb-3">
                      Fastighet
                    </h3>
                    <div className=" bg-white/5 p-4 rounded-xl">
                      <div className="font-medium">{tender.property.name}</div>
                      <div className="text-sm text-white/70">
                        {tender.property.address}, {tender.property.zip}{' '}
                        {tender.property.town}
                      </div>
                      <button className="text-[#a145b7] text-sm hover:text-[#8d3aa0] mt-2">
                        Öppna i Google Maps →
                      </button>
                    </div>
                  </div>
                </div>

                {/* Damage Type */}
                <div className="grid grid-cols-4 mt-6">
                  <div className="col-span-1">
                    <h3 className="text-sm font-medium text-white/60 mb-3">
                      Skadetyp
                    </h3>
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon
                        icon={faDroplet}
                        className="h-4 w-4 text-blue-400"
                      />
                      <span className="font-medium">Vattenskada</span>
                    </div>
                  </div>
                  {/* Description Section */}
                  <div className="col-span-3">
                    <h3 className="text-sm font-medium text-white/60 mb-3">
                      Beskrivning
                    </h3>
                    <div>
                      <p className="text-white/80 text-sm leading-relaxed">
                        Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.
                        Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Case Status */}
                <div className="grid grid-cols-4 mt-10">
                  <div className="rounded-xl">
                    <h3 className="text-sm font-medium text-white/60 mb-3">
                      Ärendestatus
                    </h3>
                    <div className="text-white/80">
                      <FontAwesomeIcon icon={faEllipsis} className="mr-2" />
                      Väntar
                    </div>
                  </div>
                  {/* Case Details - 3 column grid */}

                  <div className="">
                    <h4 className="text-sm font-medium text-white/60 mb-2">
                      Ärendenummer
                    </h4>
                    <div className="font-medium">45115223151</div>
                  </div>
                  <div className="">
                    <h4 className="text-sm font-medium text-white/60 mb-2">
                      Skadeanmälan (PDF)
                    </h4>
                    <button className="text-[#a145b7] hover:text-[#8d3aa0] flex items-center gap-1 text-sm">
                      <FontAwesomeIcon
                        icon={faExternalLink}
                        className="h-3 w-3"
                      />
                      Visa
                    </button>
                  </div>
                </div>
              </div>
              <div>
                {/* Timeline Progress - 3 colored boxes */}
                <div className="grid grid-cols-3 border border-white/10 gap-4 bg-gradient-to-r from-ensured-purple/70 to-[rgb(135,37,165)] p-4 rounded-xl">
                  <div className="">
                    <div className=" font-light text-sm">
                      Anmälan registrerad
                    </div>
                    <div className="text-xs text-white/60 mt-1">
                      3 sep, 10:30
                    </div>
                  </div>
                  <div className="rounded-xl text-center">
                    <div className=" font-light text-sm">Anbudsfas startad</div>
                    <div className="text-xs text-white/60 mt-1">
                      6 sep, 12:00
                    </div>
                  </div>
                  <div className="rounded-xl text-right">
                    <div className="font-light text-sm">Anbud godkänt</div>
                    <div className="text-xs text-white/60 mt-1">
                      12 sep, 12:00
                    </div>
                  </div>
                </div>
              </div>
              {/* Winning Company */}
              <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <h4 className="text-sm font-light text-white/60 mb-1">
                      Vinnande bolag
                    </h4>
                    <div className="font-light text-sm">Hans Bygg AB</div>
                  </div>
                  <div>
                    <h4 className="text-sm font-light text-white/60 mb-1">
                      Anbud (kr)
                    </h4>
                    <div className="font-light text-sm">100</div>
                  </div>
                  <div>
                    <h4 className="text-sm font-light text-white/60 mb-1">
                      Kontaktperson
                    </h4>
                    <div className="font-light text-sm">Anders Svensson</div>
                  </div>
                  <div>
                    <h4 className="text-sm font-light text-white/60 mb-1">
                      Telefonnummer
                    </h4>
                    <div className="font-light text-sm">073 401 52 42</div>
                  </div>
                </div>
              </div>
              {/* Documents Section - Full Width */}
              <div className="mt-8 rounded-xl ">
                <h3 className="text-lg font-medium mb-4">Dokument</h3>
                <div className="space-y-3 bg-white/5 p-6 ring-1 ring-white/10 rounded-xl">
                  <div className="flex items-center justify-between p-2 rounded-lg  transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center">
                        <FontAwesomeIcon
                          icon={faFilePdf}
                          className="h-4 w-4 text-ensured-pink"
                        />
                      </div>
                      <div>
                        <div className="font-medium text-sm">
                          Besiktningsprotokoll
                        </div>
                        <div className="text-xs text-white/60">
                          25 aug, 2025
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-white/60">
                      Ingen åtgärd krävs
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg  transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center">
                        <FontAwesomeIcon
                          icon={faFilePdf}
                          className="h-4 w-4 text-ensured-pink"
                        />
                      </div>
                      <div>
                        <div className="font-medium text-sm">Slutprotokoll</div>
                        <div className="text-xs text-white/60">
                          25 sep, 2025
                        </div>
                      </div>
                    </div>
                    <button className="text-xs text-white/60 cursor-pointer flex items-center gap-2 hover:text-white transition-colors">
                      Välj åtgärd{' '}
                      <FontAwesomeIcon
                        icon={faChevronDown}
                        className="text-ensured-pink"
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg  transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center">
                        <FontAwesomeIcon
                          icon={faFilePdf}
                          className="h-4 w-4 text-ensured-pink"
                        />
                      </div>
                      <div>
                        <div className="font-medium text-sm">Offert</div>
                        <div className="text-xs text-white/60">3 sep, 2025</div>
                      </div>
                    </div>
                    <div className="text-xs text-white/60">
                      Ingen åtgärd krävs
                    </div>
                  </div>
                </div>
              </div>
              {/* Events Section - Full Width */}
              <div className="mt-6 ">
                <h3 className="text-lg font-medium mb-4">Händelser</h3>
                <div className="space-y-4 rounded-xl bg-white/5 p-6 ring-1 ring-white/10">
                  <div className="flex">
                    <div>
                      <h4 className="font-medium text-sm mb-2">
                        Arbetet går fint framåt!
                      </h4>
                      <p className="text-sm text-white/70 mb-3">
                        Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.
                      </p>
                      <p className="text-sm text-white/70 mb-3">
                        Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.
                      </p>
                    </div>
                    <div className="aspect-video relative rounded-lg bg-white/10 overflow-hidden max-w-md">
                      <Image
                        src="/renovation.jpg"
                        alt="Work progress"
                        className="h-full w-full object-cover"
                        width={400}
                        height={250}
                      />
                      <div className="absolute bg-ensured-purple-dark/60 cursor-pointer hover:bg-ensured-purple-dark transition-all rounded-full w-8 h-8 flex items-center justify-center top-1/2 right-4 -translate-y-1/2">
                        <FontAwesomeIcon icon={faChevronRight} />
                      </div>
                      <div className="absolute bg-ensured-purple-dark/60 cursor-pointer hover:bg-ensured-purple-dark transition-all rounded-full w-8 h-8 flex items-center justify-center top-1/2 left-4 -translate-y-1/2">
                        <FontAwesomeIcon icon={faChevronLeft} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Right Column - Actions */}
            <div className="flex flex-col items-center gap-6 lg:col-span-1 mt-10">
              <div className="flex flex-col justify-between w-full ">
                <div className="text-xs text-white mb-1 ml-1">Ansvarig</div>

                <div className="flex items-center justify-between w-full gap-4">
                  <div className="text-right">
                    <div className="flex items-center gap-2 cursor-pointer hover:bg-white/10 transition-colors bg-white/5 px-2 py-1.5 rounded-xl border border-white/10">
                      <div className="rounded-full overflow-hidden w-6 h-6 flex items-center justify-center">
                        <Image
                          src="/eric_white.png"
                          alt="avatar"
                          width={24}
                          height={24}
                        />
                      </div>
                      <span className="text-xs font-light">Du</span>
                      <FontAwesomeIcon icon={faChevronDown} />
                    </div>
                  </div>
                  <div className="text-right">
                    <button className="text-sm text-[#a145b7] cursor-pointer hover:bg-white/10 transition-colors bg-white/5 hover:text-[#8d3aa0] p-2 rounded-xl border   border-white/10">
                      Åtgärder <FontAwesomeIcon icon={faChevronDown} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="space-y-6 w-full">
                {/* Dates Section */}
                <div className="grid grid-cols-2 gap-4 bg-white/5 p-4 ring-1 ring-white/10 rounded-xl ">
                  <div className="">
                    <h3 className="text-sm font-light text-white/60 mb-3">
                      Startdatum
                    </h3>
                    <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/10">
                      <div className="h-3 w-3 rounded bg-[#a145b7]" />
                      <span className="font-light text-xs">
                        8 september 2025
                      </span>
                    </div>
                  </div>
                  <div className="">
                    <h3 className="text-sm font-light text-white/60 mb-3">
                      Slutdatum
                    </h3>
                    <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/10">
                      <div className="h-3 w-3 rounded bg-[#a145b7]" />
                      <span className="font-light text-xs">8 oktober 2025</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Right Column - Comments */}
              <div className="space-y-6">
                {/* Comments Section */}
                <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
                  <h3 className="text-xs font-light mb-4">Kommentarer</h3>

                  {/* Comment Input */}
                  <div className="mb-8 flex gap-1">
                    <textarea
                      placeholder="Skriv en kommentar..."
                      className="w-full h-20 rounded-lg bg-white/10  px-3 py-2 text-sm text-white placeholder:text-white/60 placeholder:text-xs resize-none outline-none focus:border-[#a145b7]/50 focus:bg-white/15"
                    />
                    <button className="h-20 cursor-pointer rounded-lg bg-[#a145b7] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#8d3aa0] transition-colors">
                      Skicka →
                    </button>
                  </div>

                  {/* Comments List */}
                  <div className="space-y-3">
                    <CommentItem
                      author="Niklas Liljenadhl"
                      time="8 sep, 12:10"
                      content="Kan du kontakta vinnande bolaget?"
                      avatar="NL"
                    />
                    <CommentItem
                      author="Niklas Liljenadhl"
                      time="8 sep, 12:10"
                      content="Oj! Vad smidigt detta gick. Har kollat igenom offerten från det vinnande bolaget och det ser toppen ut!"
                      avatar="NL"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </PageScrollWrapper>
    </div>
  );
}

function InfoCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: any;
}) {
  return (
    <div className="rounded-xl bg-white/10 p-4 ring-1 ring-white/10 hover:bg-white/15 transition-colors">
      <div className="flex items-center gap-2 mb-2">
        {icon && (
          <FontAwesomeIcon icon={icon} className="h-3 w-3 text-[#a145b7]" />
        )}
        <div className="text-xs text-white/60 font-medium">{label}</div>
      </div>
      <div className="text-sm font-semibold text-white">{value}</div>
    </div>
  );
}

function TimelineItem({
  label,
  date,
  status,
  description,
}: {
  label: string;
  date: string;
  status: 'completed' | 'in_progress' | 'pending';
  description: string;
}) {
  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in_progress':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-white/10 text-white/60 border-white/20';
    }
  };

  const getIconColor = () => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in_progress':
        return 'bg-blue-500';
      default:
        return 'bg-white/30';
    }
  };

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className={`h-3 w-3 rounded-full ${getIconColor()} ring-2 ring-white/10`}
        />
        <div className="w-px h-12 bg-white/10 last:hidden" />
      </div>
      <div className="flex-1 pb-6">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-white">{label}</h4>
          <span className="text-xs text-white/60">{date}</span>
        </div>
        <p className="text-sm text-white/70 mb-3">{description}</p>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs border ${getStatusColor()}`}
        >
          <div className={`h-1.5 w-1.5 rounded-full ${getIconColor()}`} />
          {status === 'completed'
            ? 'Slutfört'
            : status === 'in_progress'
            ? 'Pågår'
            : 'Väntar'}
        </span>
      </div>
    </div>
  );
}

function DocumentItem({
  title,
  date,
  status,
  size,
  type,
}: {
  title: string;
  date: string;
  status: string;
  size: string;
  type: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-white/10 p-4 ring-1 ring-white/10 hover:bg-white/15 transition-colors group">
      <div className="flex items-center gap-4">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#a145b7] group-hover:bg-[#8d3aa0] transition-colors">
          <FontAwesomeIcon icon={faFileAlt} className="h-4 w-4 text-white" />
        </div>
        <div>
          <div className="text-sm font-semibold text-white mb-1">{title}</div>
          <div className="flex items-center gap-3 text-xs text-white/60">
            <span>{date}</span>
            <span>•</span>
            <span>{type}</span>
            <span>•</span>
            <span>{size}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1 rounded-full bg-green-500/20 text-green-400 px-2 py-1 text-xs">
          <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
          {status}
        </span>
        <button className="text-white/60 hover:text-white transition-colors">
          <FontAwesomeIcon icon={faExternalLink} className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function ActivityItem({
  type,
  description,
  time,
  avatar,
}: {
  type: string;
  description: string;
  time: string;
  avatar?: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0">
        {avatar ? (
          <div className="h-6 w-6 rounded-full bg-[#a145b7] grid place-items-center text-xs font-semibold text-white">
            {avatar}
          </div>
        ) : (
          <div className="mt-2 h-2 w-2 rounded-full bg-[#a145b7]" />
        )}
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium text-white mb-1">{type}</div>
        <div className="text-xs text-white/70 mb-2">{description}</div>
        <div className="text-xs text-white/50">{time}</div>
      </div>
    </div>
  );
}

function QuickActionButton({
  icon,
  label,
  onClick,
}: {
  icon: any;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-lg bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/15 transition-colors"
    >
      <FontAwesomeIcon icon={icon} className="h-4 w-4 text-[#a145b7]" />
      {label}
    </button>
  );
}

function CommentItem({
  author,
  time,
  content,
  avatar,
}: {
  author: string;
  time: string;
  content: string;
  avatar: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0">
        <div className="h-6 w-6 rounded-full overflow-hidden bg-[#a145b7] grid place-items-center text-xs font-semibold text-white">
          <Image src="/niklas_forest.jpg" alt="avatar" width={36} height={36} />
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-white">{author}</span>
          <span className="text-xs text-white/50">{time}</span>
        </div>
        <div className="text-xs text-white/80 font-light leading-relaxed">
          {content}
        </div>
      </div>
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
