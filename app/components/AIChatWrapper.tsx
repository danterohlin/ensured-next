'use client';
import { useAIChat } from '../context/AIChatContext';
import AIChatSheet from './AIChatSheet';

export default function AIChatWrapper() {
  const { isChatOpen, closeChat } = useAIChat();

  return <AIChatSheet isOpen={isChatOpen} onClose={closeChat} />;
}
