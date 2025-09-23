'use client';
import { useSettings } from '../context/SettingsContext';
import SettingsSheet from './SettingsSheet';

export default function SettingsWrapper() {
  const { isSettingsOpen, closeSettings } = useSettings();

  return <SettingsSheet isOpen={isSettingsOpen} onClose={closeSettings} />;
}
