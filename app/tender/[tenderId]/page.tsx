'use client';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { useContext, useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  faPaperPlaneTop,
  faFire,
  faBurst,
  faHouseCrack,
} from '@fortawesome/pro-light-svg-icons';
import Image from 'next/image';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import InvoiceEditorSheet, {
  DraftInvoice,
} from '../../components/InvoiceEditorSheet';

export default function TenderPage() {
  const params = useParams<{ tenderId: string }>();
  const search = useSearchParams();
  const idNum = Number(params.tenderId);
  const router = useRouter();
  const { user, tenders, setTenders, addInvoice, invoices, setInvoices } =
    useContext(AppContext);
  const { openChat } = useAIChat();
  const { openModal } = useLogoutModal();
  const { toggleNotifications } = useNotifications();
  const { toggleSettings } = useSettings();

  const tender = useMemo(
    () => tenders.find((t) => t.id === idNum),
    [tenders, idNum]
  );

  const [comment, setComment] = useState('');

  const isContractor = user?.type === 3;
  const [isInvoiceEditorOpen, setIsInvoiceEditorOpen] = useState(false);
  const [draft, setDraft] = useState<DraftInvoice | null>(null);
  const [boot, setBoot] = useState<boolean>(false);

  // When navigating from sheet, show skeleton briefly
  useMemo(() => {
    if (search?.get('boot') === '1') {
      setBoot(true);
      setTimeout(() => setBoot(false), 900);
    }
  }, [search]);

  const createInvoiceForTender = () => {
    if (!tender) return;
    router.push(`/invoices/build/${tender.id}`);
  };

  if (!tender) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden bg-[#12031a] text-white">
        <main className="relative z-10 mx-auto max-w-[1280px] px-6 py-8">
          <p>Hittade inte ärendet.</p>
        </main>
      </div>
    );
  }

  // Hide tender for contractors before bidding has actually started
  const hasBiddingStarted = !!tender.phaseDates?.biddingStarted;
  const shouldHideTender = user?.type === 3 && !hasBiddingStarted;
  if (shouldHideTender) {
    return null;
  }

  const isNewTender =
    !tender.winningTender &&
    (!tender.comments || tender.comments.length === 0) &&
    (tender.documents || []).length <= 1;

  const claimDoc = (tender.documents || []).find(
    (d) => d.title === 'Skadeanmälan'
  );

  const tenderInvoices = useMemo(
    () => (invoices || []).filter((i) => i.tenderId === tender.id),
    [invoices, tender.id]
  );

  const hasSelectedContractor = useMemo(
    () =>
      !!tender.winningTender ||
      (tenderInvoices || []).some((i) => i.status === 2),
    [tender.winningTender, tenderInvoices]
  );

  // Derived progress stage for progress bar fill
  const progressStage = useMemo(() => {
    const isApproved = !!tender.phaseDates?.approved;
    if (isApproved) return 4;
    const awaiting = !!tender.phaseDates?.awaitingResponse;
    if (awaiting) return 3;
    const hasRegistered = !!tender.phaseDates?.registered;
    const startReached =
      hasRegistered &&
      ((tender.phaseDates?.biddingStarted && true) ||
        (tender.startingAt && new Date(tender.startingAt) <= new Date()));
    if (startReached) return 3;
    if (hasRegistered) return 2;
    return 1;
  }, [
    tender.phaseDates?.approved,
    tender.phaseDates?.awaitingResponse,
    tender.phaseDates?.registered,
    tender.phaseDates?.biddingStarted,
    tender.startingAt,
  ]);

  const canRegister = !!(
    tender.startingAt &&
    tender.endingAt &&
    new Date(tender.endingAt) > new Date(tender.startingAt)
  );

  const registerTender = () => {
    if (!canRegister) return;
    setTenders(
      tenders.map((t) =>
        t.id === tender.id
          ? {
              ...t,
              status: t.status < 2 ? 2 : t.status,
              // Keep status unchanged; registration just confirms setup
              phaseDates: {
                ...(t.phaseDates || {}),
                registered:
                  (t.phaseDates && t.phaseDates.registered) ||
                  new Date().toISOString(),
              },
              messages: [
                ...((t.messages as any) || []),
                {
                  author: {
                    name: user.display || `${user.firstName} ${user.lastName}`,
                    id: user.id,
                    profileImage: user.profileImage,
                  },
                  createdAt: new Date().toISOString(),
                  title: 'Anmälan registrerad',
                  message:
                    'Ärendet har registrerats av försäkringsbolaget. Start- och slutdatum är satta.',
                },
              ],
            }
          : t
      )
    );
  };

  // Auto-advance to bidding started (step 2) and into stage 3 when start date hits
  useEffect(() => {
    if (!tender) return;
    const hasRegistered = !!tender.phaseDates?.registered;
    const startDate = tender.startingAt ? new Date(tender.startingAt) : null;
    const now = new Date();
    if (
      hasRegistered &&
      startDate &&
      now >= startDate &&
      (!tender.phaseDates?.biddingStarted || tender.status < 3)
    ) {
      setTenders(
        tenders.map((t) =>
          t.id === tender.id
            ? {
                ...t,
                status: 3, // Progress moves to stage 3 once step 1 and 2 are fulfilled
                phaseDates: {
                  ...(t.phaseDates || {}),
                  biddingStarted:
                    (t.phaseDates && t.phaseDates.biddingStarted) ||
                    startDate.toISOString(),
                },
              }
            : t
        )
      );
    }
  }, [
    tender.startingAt,
    tender.phaseDates?.registered,
    tender.phaseDates?.biddingStarted,
    tender.status,
    setTenders,
    tenders,
    tender?.id,
  ]);

  const acceptInvoice = (invoiceNumber: number) => {
    setInvoices(
      (invoices || []).map((inv) =>
        inv.invoiceNumber === invoiceNumber ? { ...inv, status: 2 } : inv
      )
    );
    setTenders(
      tenders.map((t) =>
        t.id === tender.id
          ? {
              ...t,
              status: 4,
              phaseDates: {
                ...(t.phaseDates || {}),
                approved:
                  (t.phaseDates && t.phaseDates.approved) ||
                  new Date().toISOString(),
              },
              messages: [
                ...((t.messages as any) || []),
                {
                  author: {
                    name: user.display || `${user.firstName} ${user.lastName}`,
                    id: user.id,
                    profileImage: user.profileImage,
                  },
                  createdAt: new Date().toISOString(),
                  title: 'Faktura accepterad',
                  message: `Faktura #${invoiceNumber} har accepterats.`,
                },
              ],
            }
          : t
      )
    );
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background text-white">
      {/* background accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-[#6b1d7e]/25 blur-[140px]" />
        <div className="absolute -bottom-40 right-[-120px] h-[540px] w-[540px] rounded-full bg-[#2a0a35]/40 blur-[120px]" />
      </div>

      <PageScrollWrapper key={boot ? 'boot' : 'ready'} className="h-screen">
        <main className="relative z-10 max-w-[1400px] px-6 py-8 pl-34 pt-20">
          {boot && (
            <div className="animate-pulse">
              <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4 mt-10">
                  <div className="h-12 w-12 rounded-lg bg-white/10" />
                  <div>
                    <div className="h-6 w-60 rounded bg-white/10 mb-2" />
                    <div className="h-4 w-24 rounded bg-white/10" />
                  </div>
                </div>
              </div>
              <div className="bg-white/5 p-6 rounded-xl">
                <div className="h-4 w-32 bg-white/10 rounded mb-4" />
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-8 w-full bg-white/10 rounded mb-2"
                  />
                ))}
              </div>
              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="h-20 bg-white/10 rounded-xl" />
                <div className="h-20 bg-white/10 rounded-xl" />
                <div className="h-20 bg-white/10 rounded-xl" />
              </div>
            </div>
          )}
          {!boot && (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Left Column - Property Info */}
              <div
                className={`${
                  isContractor ? 'lg:col-span-3' : 'lg:col-span-2'
                } space-y-4`}
              >
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
                        {tender.po.name}
                      </h1>
                      <div className="text-sm text-white/60">#{tender.id}</div>
                    </div>
                  </div>
                  {/* Contractor Actions (moved into main content for contractors) */}
                  {isContractor && (
                    <div className="mt-6">
                      <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
                        <div className="text-sm font-light text-white/60 mb-3">
                          Entreprenörsåtgärder
                        </div>
                        <button
                          onClick={createInvoiceForTender}
                          className="rounded-lg bg-[#a145b7] cursor-pointer hover:bg-[#8d3aa0] transition-colors px-3 py-2 text-xs"
                        >
                          Generera kalkyl baserat på skadeanmälan
                        </button>
                      </div>
                    </div>
                  )}
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
                              {tender.po.address}, {tender.po.zip}{' '}
                              {tender.po.town}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-white/50">Telefon</div>
                            <div className="text-ensured-pink cursor-pointer hover:text-ensured-pink/80 text-sm transition-colors">
                              {tender.po.phone || '-'}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-white/50">E-post</div>
                            <div className="text-ensured-pink cursor-pointer hover:text-ensured-pink/80 text-sm transition-colors">
                              {tender.po.email || '-'}
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
                        <div className="font-medium">
                          {tender.property.name}
                        </div>
                        <div className="text-sm text-white/70">
                          {tender.property.address}, {tender.property.zip}{' '}
                          {tender.property.town}
                        </div>
                        <button className="text-ensured-pink text-sm hover:text-ensured-pink/80 cursor-pointer mt-2 transition-colors">
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
                          icon={
                            tender.damageType.value === 1
                              ? faDroplet
                              : tender.damageType.value === 2
                              ? faFire
                              : faHouseCrack
                          }
                          className={`h-4 w-4 ${
                            tender.damageType.value === 1
                              ? 'text-blue-400'
                              : tender.damageType.value === 2
                              ? 'text-red-400'
                              : 'text-yellow-400'
                          }`}
                        />
                        <span className="font-medium">
                          {tender.damageType.label}
                        </span>
                      </div>
                    </div>
                    {/* Description Section */}
                    <div className="col-span-3">
                      <h3 className="text-sm font-medium text-white/60 mb-3">
                        Beskrivning
                      </h3>
                      <div>
                        <p className="text-white/80 text-sm leading-relaxed">
                          Lorem ipsum dolor sit amet. Lorem ipsum dolor sit
                          amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor
                          sit amet.
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
                      <div className="font-medium">{tender.id}</div>
                    </div>
                    {claimDoc && (
                      <div className="">
                        <h4 className="text-sm font-medium text-white/60 mb-2">
                          Skadeanmälan (PDF)
                        </h4>
                        <Link
                          href={claimDoc.file || '/skadeanmalan.pdf'}
                          target="_blank"
                          className="text-ensured-pink hover:text-ensured-pink/80 transition-colors flex items-center gap-1 text-sm"
                        >
                          <FontAwesomeIcon
                            icon={faExternalLink}
                            className="h-3 w-3"
                          />
                          Visa
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  {/* Timeline Progress - dynamic per tender.status
                    New logic:
                    - Step 1: Registrerad (when phaseDates.registered exists)
                    - Step 2: Anbudsstart (when start date is reached; phaseDates.biddingStarted)
                    - Step 3: Väntar på svar (when an invoice is sent; awaitingResponse)
                  */}
                  <div className="grid grid-cols-3 min-h-[68px] overflow-hidden border border-white/10 gap-4  p-4 rounded-xl relative">
                    <div
                      className={`bg-gradient-to-r from-ensured-purple/70 to-[rgb(135,37,165)] absolute top-0 left-0 bottom-0 ${
                        progressStage === 1
                          ? 'right-[90%]'
                          : progressStage === 2
                          ? 'right-[70%]'
                          : progressStage === 3
                          ? 'right-[50%]'
                          : 'right-[0%]'
                      } z-[-1]`}
                    >
                      {tender.status < 4 && (
                        <div className="absolute text-center gap-1 flex flex-col -right-6 translate-x-full top-1/2 -translate-y-1/2 text-xs font-light">
                          <p>
                            {tender.status === 1
                              ? tender.phaseDates?.registered
                                ? 'Registrerad'
                                : 'Redigerar'
                              : tender.status === 2
                              ? 'Väntar på start'
                              : 'Anbudsfas startad'}
                          </p>
                          <p className="text-white/60">
                            {tender.status === 1 &&
                            tender.phaseDates?.registered
                              ? new Date(
                                  tender.phaseDates.registered
                                ).toLocaleDateString('sv-SE')
                              : tender.status === 2 && tender.startingAt
                              ? new Date(tender.startingAt).toLocaleDateString(
                                  'sv-SE'
                                )
                              : tender.startingAt
                              ? new Date(tender.startingAt).toLocaleDateString(
                                  'sv-SE'
                                )
                              : ''}
                          </p>
                        </div>
                      )}
                      {tender.status > 3 && tender.startingAt && (
                        <div className="top-1/2 text-center flex gap-1 flex-col -translate-y-1/2 left-1/2 -translate-x-1/2 text-xs font-light absolute">
                          <p>Anbudsfas startad</p>
                          <p className="text-white/60">
                            {tender.startingAt
                              ? new Date(tender.startingAt).toLocaleDateString(
                                  'sv-SE'
                                )
                              : ''}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="">
                      <div className="font-light text-xs">
                        {tender.phaseDates?.registered && 'Registrerad'}
                      </div>
                      <div className="text-xs text-white/60 mt-1">
                        {tender.phaseDates?.registered
                          ? new Date(
                              tender.phaseDates.registered
                            ).toLocaleDateString('sv-SE')
                          : ''}
                      </div>
                    </div>
                    <div className="rounded-xl text-center">
                      {/* <div
                        className={`font-light text-xs ${
                          tender.status < 2 ? 'text-white/60' : 'text-white'
                        }`}
                      >
                        Anbudsstart
                      </div>
                      <div
                        className={`text-xs text-white/60 mt-1 ${
                          tender.status < 2 ? 'text-white/60' : 'text-white'
                        }`}
                      >
                        {tender.phaseDates?.biddingStarted
                          ? new Date(
                              tender.phaseDates.biddingStarted
                            ).toLocaleDateString('sv-SE')
                          : tender.startingAt
                          ? new Date(tender.startingAt).toLocaleDateString(
                              'sv-SE'
                            )
                          : '-'}
                      </div> */}
                    </div>
                    <div className="rounded-xl text-right">
                      <div className="font-light text-xs">
                        {tender.status === 4 && 'Anbud godkänt'}
                      </div>
                      <div className="text-xs text-white/60 mt-1">
                        {tender.status === 4 && tender.phaseDates?.approved
                          ? new Date(
                              tender.phaseDates.approved
                            ).toLocaleDateString('sv-SE')
                          : tender.status === 3 &&
                            tender.phaseDates?.awaitingResponse
                          ? new Date(
                              tender.phaseDates.awaitingResponse
                            ).toLocaleDateString('sv-SE')
                          : ''}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Winning Company */}
                {tender.winningTender && (
                  <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <h4 className="text-sm font-light text-white/60 mb-1">
                          Vinnande bolag
                        </h4>
                        <div className="font-light text-sm">
                          {tender.winningTender.name}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-light text-white/60 mb-1">
                          Anbud (tkr)
                        </h4>
                        <div className="font-light text-sm">
                          {tender.winningTender.tenderPrice / 1000}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-light text-white/60 mb-1">
                          Kontaktperson
                        </h4>
                        <div className="font-light text-sm">
                          {tender.winningTender.contactPerson}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-light text-white/60 mb-1">
                          Telefonnummer
                        </h4>
                        <div className="font-light text-sm">
                          {tender.winningTender.phone}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* Documents Section - Full Width */}
                <div className="mt-8 rounded-xl ">
                  <h3 className="text-lg font-medium mb-4">Dokument</h3>
                  <div className="space-y-3 bg-white/5 p-6 ring-1 ring-white/10 rounded-xl">
                    {(tender.documents || []).length === 0 ? (
                      <div className="text-xs text-white/60">
                        Inga dokument ännu.
                      </div>
                    ) : (
                      (tender.documents || []).map((doc, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded-lg transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center">
                              <FontAwesomeIcon
                                icon={faFilePdf}
                                className="h-4 w-4 text-ensured-pink"
                              />
                            </div>
                            <div>
                              <div className="font-medium text-sm">
                                {doc.title}
                              </div>
                              <div className="text-xs text-white/60">
                                {new Date(doc.createdAt).toLocaleDateString(
                                  'sv-SE'
                                )}
                              </div>
                            </div>
                          </div>
                          {doc.file && (
                            <Link
                              href={doc.file}
                              target="_blank"
                              className="text-xs text-white/60 hover:text-white transition-colors"
                            >
                              Visa{' '}
                              <FontAwesomeIcon
                                icon={faExternalLink}
                                className="h-3 w-3 ml-1"
                              />
                            </Link>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Events Section - Full Width */}
                {tender.messages &&
                  tender.messages.length > 0 &&
                  hasSelectedContractor && (
                    <div className="mt-6 ">
                      <h3 className="text-lg font-medium mb-4">Händelser</h3>
                      <div className="space-y-4 rounded-xl bg-white/5 p-6 ring-1 ring-white/10">
                        {(tender.messages || []).map((m, idx) => (
                          <div key={idx} className="flex">
                            <div>
                              <h4 className="font-medium text-sm mb-2">
                                {m.title}
                              </h4>
                              <p className="text-sm text-white/70 mb-3">
                                {m.message}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
              {/* Right Column - Actions */}
              {!isContractor && (
                <div className="flex flex-col items-center gap-6 lg:col-span-1 mt-10">
                  {!isContractor && (
                    <div className="flex flex-col justify-between w-full ">
                      <div className="text-xs text-white mb-1 ml-1">
                        Ansvarig
                      </div>

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
                            <span className="text-xs font-light">Eric</span>
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
                  )}
                  <div className="space-y-6 w-full">
                    {user?.type === 1 && (
                      <div className="bg-white/5 p-4 ring-1 ring-white/10 rounded-xl">
                        <div className="text-sm font-light text-white/60 mb-3">
                          Försäkringsbolag
                        </div>
                        {!tender.phaseDates?.registered && canRegister && (
                          <button
                            onClick={registerTender}
                            className="rounded-lg bg-[#a145b7] hover:bg-[#8d3aa0] cursor-pointer transition-colors px-3 py-2 text-xs mb-3"
                          >
                            Registrera
                          </button>
                        )}
                        <div className="text-xs text-white/60 mb-2">
                          Inkomna fakturor
                        </div>
                        {(tenderInvoices || []).length === 0 ? (
                          <div className="text-xs text-white/50">
                            Inga fakturor ännu.
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {tenderInvoices.map((inv) => (
                              <div
                                key={inv.invoiceNumber}
                                className="flex items-center justify-between bg-white/5 p-3 rounded-lg"
                              >
                                <div className="text-xs">
                                  <Link
                                    className="underline underline-offset-2 hover:no-underline"
                                    href={`/invoices/${inv.invoiceNumber}`}
                                  >
                                    #{inv.invoiceNumber}
                                  </Link>{' '}
                                  • {inv.invoicingPart} •{' '}
                                  {new Intl.NumberFormat('sv-SE', {
                                    style: 'currency',
                                    currency: 'SEK',
                                  })
                                    .format(inv.amount)
                                    .replace('SEK', '')
                                    .trim()}
                                </div>
                                {inv.status !== 2 && (
                                  <button
                                    onClick={() =>
                                      acceptInvoice(inv.invoiceNumber)
                                    }
                                    className="rounded-md bg-white/10 hover:bg-white/15 px-2 py-1 text-xs"
                                  >
                                    Acceptera
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    {/* Dates Section */}
                    {!isContractor && (
                      <div className="grid grid-cols-2 gap-4 bg-white/5 p-4 ring-1 ring-white/10 rounded-xl ">
                        <div className="">
                          <h3 className="text-sm font-light text-white/60 mb-3">
                            Startdatum
                          </h3>
                          {user?.type === 1 ? (
                            <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/10">
                              <div className="h-3 w-3 rounded bg-[#a145b7]" />
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="h-8 px-2 text-xs"
                                  >
                                    {tender.startingAt
                                      ? new Date(
                                          tender.startingAt
                                        ).toLocaleDateString('sv-SE', {
                                          dateStyle: 'long',
                                        })
                                      : 'Välj datum'}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0"
                                  align="start"
                                >
                                  <Calendar
                                    mode="single"
                                    selected={
                                      tender.startingAt
                                        ? new Date(tender.startingAt)
                                        : undefined
                                    }
                                    onSelect={(date) => {
                                      setTenders(
                                        tenders.map((t) =>
                                          t.id === tender.id
                                            ? {
                                                ...t,
                                                startingAt: date
                                                  ? new Date(date).toISOString()
                                                  : null,
                                              }
                                            : t
                                        )
                                      );
                                    }}
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/10">
                              <div className="h-3 w-3 rounded bg-[#a145b7]" />
                              <span className="font-light text-xs">
                                {tender.startingAt
                                  ? new Date(
                                      tender.startingAt
                                    ).toLocaleDateString('sv-SE', {
                                      dateStyle: 'long',
                                    })
                                  : '-'}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="">
                          <h3 className="text-sm font-light text-white/60 mb-3">
                            Slutdatum
                          </h3>
                          {user?.type === 1 ? (
                            <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/10">
                              <div className="h-3 w-3 rounded bg-[#a145b7]" />
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="h-8 px-2 text-xs"
                                  >
                                    {tender.endingAt
                                      ? new Date(
                                          tender.endingAt
                                        ).toLocaleDateString('sv-SE', {
                                          dateStyle: 'long',
                                        })
                                      : 'Välj datum'}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0"
                                  align="start"
                                >
                                  <Calendar
                                    mode="single"
                                    selected={
                                      tender.endingAt
                                        ? new Date(tender.endingAt)
                                        : undefined
                                    }
                                    onSelect={(date) => {
                                      setTenders(
                                        tenders.map((t) =>
                                          t.id === tender.id
                                            ? {
                                                ...t,
                                                endingAt: date
                                                  ? new Date(date).toISOString()
                                                  : null,
                                              }
                                            : t
                                        )
                                      );
                                    }}
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/10">
                              <div className="h-3 w-3 rounded bg-[#a145b7]" />
                              <span className="font-light text-xs">
                                {tender.endingAt
                                  ? new Date(
                                      tender.endingAt
                                    ).toLocaleDateString('sv-SE', {
                                      dateStyle: 'long',
                                    })
                                  : '-'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Right Column - Comments */}
                  {!isContractor && (
                    <div className="space-y-6 lg:col-span-1 w-full">
                      {/* Comments Section */}
                      <div className="rounded-xl bg-white/5 w-full p-4 ring-1 ring-white/10">
                        <h3 className="text-xs font-light mb-4 w-full">
                          Kommentarer
                        </h3>
                        {/* Add Comment */}
                        <div className="flex items-center gap-2 mt-4 w-full mb-8">
                          <input
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Skriv en kommentar..."
                            className="flex-1 h-10 rounded-lg bg-white/10 px-3 text-sm text-white placeholder:text-white/50 ring-1 ring-white/10 outline-none"
                          />
                          <button
                            disabled={comment.trim().length === 0}
                            onClick={() => {
                              const text = comment.trim();
                              if (!text) return;
                              setTenders(
                                tenders.map((t) =>
                                  t.id === tender.id
                                    ? {
                                        ...t,
                                        comments: [
                                          ...((t.comments as any) || []),
                                          {
                                            author: user,
                                            comment: text,
                                            createdAt: new Date().toISOString(),
                                          },
                                        ],
                                      }
                                    : t
                                )
                              );
                              setComment('');
                            }}
                            className="grid h-10 w-10 place-items-center rounded-lg bg-[#a145b7] enabled:hover:bg-[#8d3aa0] transition-colors ring-1 ring-white/10 disabled:opacity-40"
                            title="Skicka kommentar"
                          >
                            <FontAwesomeIcon
                              icon={faPaperPlaneTop}
                              className="h-4 w-4"
                            />
                          </button>
                        </div>
                        {/* Comments List */}
                        <div className="space-y-3">
                          {(tender.comments || []).length > 0 ? (
                            (tender.comments || []).map((c, idx) => (
                              <CommentItem
                                key={idx}
                                author={
                                  c.author.display ||
                                  `${c.author.firstName} ${c.author.lastName}`
                                }
                                time={new Date(c.createdAt).toLocaleString(
                                  'sv-SE',
                                  {
                                    dateStyle: 'medium',
                                    timeStyle: 'short',
                                  }
                                )}
                                content={c.comment}
                                avatar={`${(c.author.firstName || 'A')[0]}${
                                  (c.author.lastName || 'B')[0]
                                }`}
                                profileImage={c.author.profileImage}
                              />
                            ))
                          ) : (
                            <div className="text-xs text-white/50">
                              Inga kommentarer ännu.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </PageScrollWrapper>
      {/* Invoice editor sheet replaced by dedicated builder page navigation */}
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
  profileImage,
}: {
  author: string;
  time: string;
  content: string;
  avatar: string;
  profileImage?: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0">
        {profileImage ? (
          <div className="h-6 w-6 rounded-full overflow-hidden bg-[#a145b7]">
            <Image src={profileImage} alt="avatar" width={36} height={36} />
          </div>
        ) : (
          <div className="h-6 w-6 rounded-full bg-[#a145b7] grid place-items-center text-xs font-semibold text-white">
            {avatar}
          </div>
        )}
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
