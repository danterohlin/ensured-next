'use client';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faCog,
  faCheck,
  faUser,
  faBuilding,
  faPhone,
  faEnvelope,
  faGlobe,
  faChevronDown,
} from '@fortawesome/pro-light-svg-icons';
import OverlayScrollbarsWrapper from './OverlayScrollbarsWrapper';
import {
  useSettings,
  availableLanguages,
  Language,
} from '../context/SettingsContext';

interface SettingsSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SettingsItemProps {
  icon: any;
  text: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

function SettingsItem({
  icon,
  text,
  checked = false,
  onChange,
}: SettingsItemProps) {
  return (
    <div className="flex z-[110] items-center justify-between rounded-lg p-1 hover:bg-white/5 transition-colors">
      <div className="flex gap-3">
        <button
          onClick={() => onChange?.(!checked)}
          className={`h-5 w-5 flex items-center justify-center rounded border-2 transition-colors ${
            checked
              ? 'bg-[#a145b7] border-[#a145b7]'
              : 'border-white/30 hover:border-white/50'
          }`}
        >
          {checked && (
            <FontAwesomeIcon
              icon={faCheck}
              className="text-xs text-ensured-purple-dark"
            />
          )}
        </button>
        <span className="text-sm font-light text-white">{text}</span>
      </div>
    </div>
  );
}

function LanguageSelector() {
  const { selectedLanguage, setSelectedLanguage } = useSettings();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center gap-3 rounded-lg p-3 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2 flex-1">
          <span className="text-lg">{selectedLanguage.flag}</span>
          <span className="text-sm text-white">{selectedLanguage.name}</span>
        </div>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`h-3 w-3 text-white/50 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop to close dropdown */}
          <div className=" inset-0 z-[105]" onClick={() => setIsOpen(false)} />

          {/* Dropdown */}
          <div className="top-full left-0 right-0 z-[120] mt-1 bg-ensured-purple-dark border border-white/10 rounded-lg shadow-lg overflow-hidden">
            {availableLanguages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageSelect(language)}
                className={`flex w-full items-center gap-3 px-3 py-2 hover:bg-white/10 transition-colors ${
                  selectedLanguage.code === language.code ? 'bg-white/5' : ''
                }`}
              >
                <span className="text-lg">{language.flag}</span>
                <span className="text-sm text-white">{language.name}</span>
                {selectedLanguage.code === language.code && (
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="h-3 w-3 text-[#a145b7] ml-auto"
                  />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function SettingsSheet({ isOpen, onClose }: SettingsSheetProps) {
  const [settings, setSettings] = useState({
    previewUpdates: true,
    previewFeatures: true,
    previewUI: true,
    previewNew: false,
    previewGeneral: true,
    previewExtra: false,
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  const updateSetting = (key: string, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

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

      {/* Settings Sheet */}
      <div
        className={`fixed left-0 top-0 z-[110] h-screen w-[450px] bg-ensured-purple-dark text-white shadow-2xl transform transition-transform duration-300 ease-out ${
          isAnimating ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div>
              <div className="font-semibold">Inställningar</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-white/10"
          >
            <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
          </button>
        </div>

        {/* Settings Content */}

        <div className="flex h-[calc(100vh-80px)] flex-col">
          <OverlayScrollbarsWrapper>
            {/* Settings List */}
            <div className="flex-1 overflow-y-auto p-4 px-6 pr-6">
              {/* Service Section */}
              <h2 className="text-base font-light mb-4">Notiser</h2>
              <div className="bg-white/5 rounded-lg p-4 ">
                <div className="mb-8">
                  <h3 className="mb-4 text-xs font-medium uppercase tracking-wide text-white/50">
                    ÄRENDE
                  </h3>
                  <div className="space-y-1">
                    <SettingsItem
                      icon={faCheck}
                      text="När ett ärende startar"
                      checked={settings.previewUpdates}
                      onChange={(checked) =>
                        updateSetting('previewUpdates', checked)
                      }
                    />
                    <SettingsItem
                      icon={faCheck}
                      text="När ett ärende är avslutat"
                      checked={settings.previewFeatures}
                      onChange={(checked) =>
                        updateSetting('previewFeatures', checked)
                      }
                    />
                    <SettingsItem
                      icon={faCheck}
                      text="Statusuppdatering vid aktiv anbudsprocess"
                      checked={settings.previewUI}
                      onChange={(checked) =>
                        updateSetting('previewUI', checked)
                      }
                    />
                    <SettingsItem
                      icon={faCheck}
                      text="Nytt meddelande i ett ärende du skapat"
                      checked={settings.previewExtra}
                      onChange={(checked) =>
                        updateSetting('previewExtra', checked)
                      }
                    />
                    <SettingsItem
                      icon={faCheck}
                      text="När någon nämner dig i ett ärende"
                      checked={settings.previewNew}
                      onChange={(checked) =>
                        updateSetting('previewNew', checked)
                      }
                    />
                    <SettingsItem
                      icon={faCheck}
                      text="När du blir tilldelad ett ärende"
                      checked={settings.previewGeneral}
                      onChange={(checked) =>
                        updateSetting('previewGeneral', checked)
                      }
                    />
                  </div>
                </div>

                {/* Preferences Section */}
                <div className="mb-8">
                  <h3 className="mb-4 text-xs font-medium uppercase tracking-wide text-white/50">
                    FAKTUROR
                  </h3>
                  <div className="space-y-1">
                    <SettingsItem
                      icon={faCheck}
                      text="Ny faktura att attestera"
                      checked={true}
                      onChange={() => {}}
                    />
                  </div>
                </div>

                {/* Subscriptions Section */}
                <div className="mb-8">
                  <h3 className="mb-4 text-xs font-medium uppercase tracking-wide text-white/50">
                    SLUTPROTOKOLL
                  </h3>
                  <div className="space-y-1">
                    <SettingsItem
                      icon={faCheck}
                      text="Nytt slutprotokoll att godkänna"
                      checked={true}
                      onChange={() => {}}
                    />
                  </div>
                </div>
              </div>

              {/* Language Section */}
              <div className="my-8">
                <h3 className="text-xs font-medium uppercase tracking-wide text-white/50">
                  SPRÅK
                </h3>
                <div className="space-y-1">
                  <LanguageSelector />
                </div>
              </div>
            </div>
          </OverlayScrollbarsWrapper>
        </div>
      </div>
    </>
  );
}
