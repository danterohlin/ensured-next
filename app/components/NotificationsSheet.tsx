'use client';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faBell } from '@fortawesome/pro-light-svg-icons';
import OverlayScrollbarsWrapper from './OverlayScrollbarsWrapper';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationsPanel({
  isOpen,
  onClose,
}: NotificationsPanelProps) {
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

  const notifications = [
    {
      id: 1,
      type: 'Idag',
      time: '16:43',
      title:
        'Anbudsprocessen för ditt ärende för Skutan 11 på Drottninggatan 42 har startat.',
      subtitle: 'Ängelo har nämnt dig i ett av dina ärenden.',
      timeAgo: '16:43',
    },
    {
      id: 2,
      type: 'Idag',
      time: '14:22',
      title:
        'Ny faktura har mottagits från Byggare Bygg AB för projektet på Vasagatan 15.',
      subtitle: 'Faktura 2024-0892 på 127 500 kr väntar på attestering.',
      timeAgo: '14:22',
    },
    {
      id: 3,
      type: 'Idag',
      time: '11:15',
      title: 'Slutprotokoll för Skutan 12 har godkänts av alla parter.',
      subtitle: 'Projektet är nu klart för slutfakturering.',
      timeAgo: '11:15',
    },
    {
      id: 4,
      type: 'Igår',
      time: '16:43',
      title:
        'Anbudsprocessen för ditt ärende för Skutan 11 på Drottninggatan 42 har startat.',
      subtitle: 'Ängelo har nämnt dig i ett av dina ärenden.',
      timeAgo: '16:02',
    },
    {
      id: 5,
      type: 'Igår',
      time: '13:28',
      title: 'Dokument har laddats upp till ärendet för Kungsgatan 25.',
      subtitle: 'Anders Svensson har lagt till 3 nya bilder från besiktningen.',
      timeAgo: '13:28',
    },
    {
      id: 6,
      type: 'Fredag',
      time: '16:43',
      title:
        'Anbudsprocessen för ditt ärende för Skutan 11 på Drottninggatan 42 har startat.',
      subtitle: 'Ängelo har nämnt dig i ett av dina ärenden.',
      timeAgo: '16:02',
    },
    {
      id: 7,
      type: 'Fredag',
      time: '09:45',
      title: 'Påminnelse: Besiktning schemalagd för måndag 25 september.',
      subtitle: 'Skutan 13 - Kontrollbesiktning kl. 10:00 med Pelle Hansson.',
      timeAgo: '09:45',
    },
    {
      id: 8,
      type: '24 augusti',
      time: '16:43',
      title:
        'Anbudsprocessen för ditt ärende för Skutan 11 på Drottninggatan 42 har startat.',
      subtitle: 'Ängelo har nämnt dig i ett av dina ärenden.',
      timeAgo: '16:02',
    },
    {
      id: 9,
      type: '24 augusti',
      time: '12:30',
      title: 'Offert från Renoverare AB har mottagits för badrumsrenovering.',
      subtitle: 'Totalt belopp: 89 750 kr. Granskning krävs innan godkännande.',
      timeAgo: '12:30',
    },
    {
      id: 10,
      type: '23 augusti',
      time: '15:20',
      title: 'Försäkringsärende för vattenskada på Storgatan 8 har avslutats.',
      subtitle: 'Ersättning på 245 000 kr har överförts till ditt konto.',
      timeAgo: '15:20',
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Notifications Panel */}
      <div
        className={`fixed right-0 top-0 z-[110] h-full w-[450px] bg-ensured-purple-dark text-white shadow-2xl transform transition-transform duration-300 ease-out ${
          isAnimating ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div>
              <div className="font-semibold">Notiser</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-white/10"
          >
            <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
          </button>
        </div>

        {/* Notifications Content */}
        <div className="flex h-[calc(100vh-80px)] flex-col">
          <OverlayScrollbarsWrapper>
            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto p-4 px-6">
              {notifications.map((notification, index) => (
                <div key={notification.id}>
                  {/* Day Header */}
                  {(index === 0 ||
                    notifications[index - 1].type !== notification.type) && (
                    <div className="mb-3 mt-6 first:mt-0">
                      <h3 className="text-xs font-light text-white/70">
                        {notification.type}
                      </h3>
                    </div>
                  )}

                  {/* Notification Item */}
                  <div className="mb-4 rounded-2xl bg-[#a145b7]/10 p-3 ring-1 ring-[#a145b7]/20 hover:bg-[#a145b7]/15 transition-colors">
                    <div className="mb-2 flex items-start justify-between">
                      <p className="text-xs font-light leading-relaxed">
                        {notification.title}
                      </p>
                      <span className="ml-2 text-xs text-white/50 shrink-0">
                        {notification.timeAgo}
                      </span>
                    </div>
                    <p className="text-xs text-white/60">
                      {notification.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </OverlayScrollbarsWrapper>
        </div>
      </div>
    </>
  );
}
