'use client';

import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/pro-light-svg-icons';
import OverlayScrollbarsWrapper from './OverlayScrollbarsWrapper';

export type DraftInvoice = {
  invoicingPart: string;
  invoiceNumber: number;
  invoiceDate: string; // YYYY-MM-DD
  invoiceDueDate: string; // YYYY-MM-DD
  amount: number;
  currency: string;
};

export default function InvoiceEditorSheet({
  isOpen,
  onClose,
  initial,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  initial: DraftInvoice;
  onSave: (draft: DraftInvoice) => void;
}) {
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const [form, setForm] = useState<DraftInvoice>(initial);

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
    setForm(initial);
  }, [initial]);

  if (!shouldRender) return null;

  return (
    <>
      <div
        className={`fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed right-0 top-0 z-[110] h-screen w-[520px] bg-ensured-purple-dark text-white shadow-2xl transform transition-transform duration-300 ease-out ${
          isAnimating ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          <div>
            <div className="font-semibold">Skapa faktura</div>
            <div className="text-xs text-white/60 mt-1">
              Granska och justera fält innan sparande
            </div>
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
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="col-span-2">
                  <label className="text-xs text-white/60">Avsändare</label>
                  <input
                    className="w-full rounded-md bg-white/10 px-3 py-2 border border-white/10"
                    value={form.invoicingPart}
                    onChange={(e) =>
                      setForm({ ...form, invoicingPart: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-xs text-white/60">Fakturanummer</label>
                  <input
                    type="number"
                    className="w-full rounded-md bg-white/10 px-3 py-2 border border-white/10"
                    value={form.invoiceNumber}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        invoiceNumber: Number(e.target.value || 0),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-xs text-white/60">Belopp</label>
                  <input
                    type="number"
                    className="w-full rounded-md bg-white/10 px-3 py-2 border border-white/10"
                    value={form.amount}
                    onChange={(e) =>
                      setForm({ ...form, amount: Number(e.target.value || 0) })
                    }
                  />
                </div>
                <div>
                  <label className="text-xs text-white/60">Fakturadatum</label>
                  <input
                    type="date"
                    className="w-full rounded-md bg-white/10 px-3 py-2 border border-white/10"
                    value={form.invoiceDate}
                    onChange={(e) =>
                      setForm({ ...form, invoiceDate: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-xs text-white/60">Förfallodatum</label>
                  <input
                    type="date"
                    className="w-full rounded-md bg-white/10 px-3 py-2 border border-white/10"
                    value={form.invoiceDueDate}
                    onChange={(e) =>
                      setForm({ ...form, invoiceDueDate: e.target.value })
                    }
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-white/60">Valuta</label>
                  <input
                    className="w-full rounded-md bg-white/10 px-3 py-2 border border-white/10"
                    value={form.currency}
                    onChange={(e) =>
                      setForm({ ...form, currency: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          </OverlayScrollbarsWrapper>

          <div className="p-4 border-t border-white/10 flex justify-end gap-2">
            <button
              onClick={() => onSave(form)}
              className="rounded-md bg-[#a145b7] hover:bg-[#8d3aa0] transition-colors px-4 py-2 text-sm"
            >
              Spara faktura
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

