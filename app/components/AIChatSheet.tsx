'use client';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faPaperPlane,
  faExternalLink,
  faChartLine,
  faMessageBot,
  faEdit,
  faCopy,
} from '@fortawesome/pro-light-svg-icons';

interface AIChatSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIChatSheet({ isOpen, onClose }: AIChatSheetProps) {
  const [message, setMessage] = useState('');
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

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Chat Sheet */}
      <div
        className={`fixed right-0 top-0 z-[110] h-full w-[450px] bg-gradient-to-b from-[rgba(66,31,77,1)] to-[rgba(34,2,38,1)] text-white shadow-2xl transform transition-transform duration-300 ease-out ${
          isAnimating ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div>
              <div className="font-semibold">Ensured AI</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-lg p-2 hover:bg-white/10">
              <FontAwesomeIcon icon={faCopy} className="h-4 w-4" />
            </button>
            <button className="rounded-lg p-2 hover:bg-white/10">
              <FontAwesomeIcon icon={faEdit} className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-2 hover:bg-white/10"
            >
              <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Chat Content */}
        <div className="flex h-[calc(100vh-80px)] flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 px-6">
            {/* Question */}
            <div className="mb-4 w-3/4 ml-auto font-light rounded-2xl bg-[rgba(96,31,116,1)] p-3 text-sm ring-1 ring-[#a145b7]/30">
              Hur många bolag är det i snitt som svarar på mina
              anbudsförfrågningar?
            </div>

            {/* Answer */}
            <div className="mb-6 w-3/4 mr-auto">
              <div className="text-sm font-light leading-relaxed rounded-2xl bg-[#a145b7]/10 p-3 ring-1 ring-[#a145b7]/20">
                <span className="font-light">Bra fråga.</span> Du har skapat{' '}
                <span className="font-bold text-[#a145b7]">
                  82 st anbudsförfrågningar
                </span>{' '}
                och det är{' '}
                <span className="font-bold">totalt 242 st bolag</span> som
                svarat på dessa. Det betyder att det är{' '}
                <span className="font-bold text-[#a145b7]">
                  223/82 = 3 svar
                </span>{' '}
                i snitt per förfrågan.
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t border-white/10 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ställ en fråga om din data"
                className="flex-1 rounded-full bg-white/10 px-4 py-2 text-sm text-white placeholder:text-white/60 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-[#a145b7]"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && message.trim()) {
                    // Handle send message
                    setMessage('');
                  }
                }}
              />
              <button
                className="grid h-10 w-10 place-items-center rounded-full bg-[#a145b7] text-white hover:bg-[#8d3aa0] disabled:opacity-50"
                disabled={!message.trim()}
                onClick={() => {
                  if (message.trim()) {
                    // Handle send message
                    setMessage('');
                  }
                }}
              >
                <FontAwesomeIcon icon={faPaperPlane} className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
