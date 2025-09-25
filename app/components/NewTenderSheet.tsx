'use client';

import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/pro-light-svg-icons';
import OverlayScrollbarsWrapper from './OverlayScrollbarsWrapper';

type Defaults = {
  poName?: string;
  propertyName?: string;
  address?: string;
  zip?: string;
  town?: string;
  damageType?: 'Vattenskada' | 'Brand' | 'Skadegörelse';
  fileName?: string | null;
};

export default function NewTenderSheet({
  isOpen,
  onClose,
  defaults,
  onCreate,
}: {
  isOpen: boolean;
  onClose: () => void;
  defaults?: Defaults;
  onCreate: (data: {
    poName: string;
    propertyName: string;
    address: string;
    zip: string;
    town: string;
    damageType: 'Vattenskada' | 'Brand' | 'Skadegörelse';
  }) => void;
}) {
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const [poName, setPoName] = useState(defaults?.poName || 'PB Fastigheter');
  const [propertyName, setPropertyName] = useState(
    defaults?.propertyName || 'Ny Fastighet'
  );
  const [address, setAddress] = useState(defaults?.address || 'Nygatan 1');
  const [zip, setZip] = useState(defaults?.zip || '111 11');
  const [town, setTown] = useState(defaults?.town || 'Stockholm');
  const [damageType, setDamageType] = useState<
    'Vattenskada' | 'Brand' | 'Skadegörelse'
  >(defaults?.damageType || 'Vattenskada');

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      setTimeout(() => setShouldRender(false), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    // update fields if defaults change (new file uploaded)
    setPoName(defaults?.poName || 'PB Fastigheter');
    setPropertyName(defaults?.propertyName || 'Ny Fastighet');
    setAddress(defaults?.address || 'Nygatan 1');
    setZip(defaults?.zip || '111 11');
    setTown(defaults?.town || 'Stockholm');
    setDamageType(defaults?.damageType || 'Vattenskada');
  }, [defaults]);

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

      {/* Creation Sheet */}
      <div
        className={`fixed right-0 top-0 z-[110] h-screen w-[520px] bg-ensured-purple-dark text-white shadow-2xl transform transition-transform duration-300 ease-out ${
          isAnimating ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          <div>
            <div className="font-semibold">Skapa nytt ärende</div>
            {defaults?.fileName && (
              <div className="text-xs text-white/60 mt-1">
                Bifogad fil: {defaults.fileName}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-white/10"
          >
            <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
          </button>
        </div>

        <div className="flex h-[calc(100vh-60px)] flex-col">
          <OverlayScrollbarsWrapper>
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="col-span-2">
                  <label className="text-xs text-white/60">
                    Fastighetsägare
                  </label>
                  <input
                    className="w-full rounded-md bg-white/10 px-3 py-2 border border-white/10"
                    value={poName}
                    onChange={(e) => setPoName(e.target.value)}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-white/60">Fastighet</label>
                  <input
                    className="w-full rounded-md bg-white/10 px-3 py-2 border border-white/10"
                    value={propertyName}
                    onChange={(e) => setPropertyName(e.target.value)}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-white/60">Adress</label>
                  <input
                    className="w-full rounded-md bg-white/10 px-3 py-2 border border-white/10"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs text-white/60">Postnummer</label>
                  <input
                    className="w-full rounded-md bg-white/10 px-3 py-2 border border-white/10"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs text-white/60">Stad</label>
                  <input
                    className="w-full rounded-md bg-white/10 px-3 py-2 border border-white/10"
                    value={town}
                    onChange={(e) => setTown(e.target.value)}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-white/60">Skadetyp</label>
                  <select
                    className="w-full rounded-md bg-white/10 px-3 py-2 border border-white/10"
                    value={damageType}
                    onChange={(e) => setDamageType(e.target.value as any)}
                  >
                    <option>Vattenskada</option>
                    <option>Brand</option>
                    <option>Skadegörelse</option>
                  </select>
                </div>
              </div>
            </div>
          </OverlayScrollbarsWrapper>

          <div className="p-4 border-t border-white/10 flex justify-end mb-10">
            <button
              onClick={() =>
                onCreate({
                  poName,
                  propertyName,
                  address,
                  zip,
                  town,
                  damageType,
                })
              }
              className="rounded-md bg-[#a145b7] cursor-pointer mx-auto hover:bg-[#8d3aa0] transition-colors px-20 py-3 text-sm"
            >
              Skapa ärende
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
