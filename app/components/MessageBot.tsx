import { faMessageBot } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useAIChat } from '../context/AIChatContext';

export default function MessageBot() {
  const { openChat } = useAIChat();
  return (
    <div
      onClick={openChat}
      className="flex items-center justify-between rounded-full gap-4 bg-ensured-purple/70 px-5 pr-8 py-3 text-xs transition hover:bg-ensured-purple/80 cursor-pointer font-extralight hover:text-white/80"
    >
      <span className="grid h-6 w-6 place-items-center rounded-md ">
        <FontAwesomeIcon
          icon={faMessageBot}
          className="h-3 w-3 text-white text-xl"
        />
      </span>
      Vad kan jag assistera dig med idag?
    </div>
  );
}
