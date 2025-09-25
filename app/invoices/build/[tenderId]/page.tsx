'use client';
import { useParams, useRouter } from 'next/navigation';
import { useContext, useMemo, useState, useEffect } from 'react';
import PageScrollWrapper from '../../../components/PageScrollWrapper';
import { AppContext } from '../../../context/AppContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileInvoice,
  faChevronLeft,
  faFilePdf,
  faTimes,
  faPlus,
  faWrench,
  faFloppyDisk,
  faTrash,
} from '@fortawesome/pro-light-svg-icons';

type LineItem = {
  code?: string;
  title: string;
  unit: string;
  qty: number;
  unitPrice: number;
  category?: string;
};

type MomentTemplateItem = {
  code?: string;
  title: string;
  unit: string;
  unitPrice: number;
  qtyPerKvm?: number; // factor multiplied by input kvm to compute qty
  fixedQty?: number; // absolute quantity; used when qtyMode is fixed
  qtyMode?: 'perKvm' | 'fixed';
};

type MomentTemplate = {
  id: string;
  name: string;
  group: 'MEPS' | 'Custom';
  items: MomentTemplateItem[];
};

export default function InvoiceBuilderPage() {
  const params = useParams<{ tenderId: string }>();
  const router = useRouter();
  const tenderIdNum = Number(params.tenderId);
  const { user, tenders, setTenders, addInvoice } = useContext(AppContext);

  const tender = useMemo(
    () => tenders.find((t) => t.id === tenderIdNum),
    [tenders, tenderIdNum]
  );

  const [items, setItems] = useState<LineItem[]>([
    {
      code: 'MWU-101',
      title: 'Riv gipsvägg',
      unit: 'm²',
      qty: 10,
      unitPrice: 220,
    },
    {
      code: 'MWU-205',
      title: 'Torka konstruktion',
      unit: 'dygn',
      qty: 5,
      unitPrice: 450,
    },
    {
      code: 'MAT-301',
      title: 'Nytt parkettgolv',
      unit: 'm²',
      qty: 15,
      unitPrice: 380,
    },
    {
      code: 'ARB-010',
      title: 'Arbete snickare',
      unit: 'tim',
      qty: 24,
      unitPrice: 520,
    },
  ]);

  // Templates state
  const [templates, setTemplates] = useState<MomentTemplate[]>([]);
  const [areaKvm, setAreaKvm] = useState<number>(10);
  const [isManageOpen, setIsManageOpen] = useState<boolean>(false);

  const userKey = `ensured.templates.user.${user?.id || 'guest'}`;

  const defaultMepTemplates = useMemo<MomentTemplate[]>(
    () => [
      {
        id: 'mep-parkett',
        name: 'Golv – Parkett (läggning)',
        group: 'MEPS',
        items: [
          {
            title: 'Nytt parkettgolv',
            code: 'MAT-301',
            unit: 'm²',
            unitPrice: 380,
            qtyPerKvm: 1,
            qtyMode: 'perKvm',
          },
          {
            title: 'Underarbete snickare',
            code: 'ARB-010',
            unit: 'tim',
            unitPrice: 520,
            qtyPerKvm: 0.3,
            qtyMode: 'perKvm',
          },
        ],
      },
      {
        id: 'mep-riv-gips',
        name: 'Vägg – Riv gipsvägg',
        group: 'MEPS',
        items: [
          {
            title: 'Riv gipsvägg',
            code: 'MWU-101',
            unit: 'm²',
            unitPrice: 220,
            qtyPerKvm: 1,
            qtyMode: 'perKvm',
          },
        ],
      },
      {
        id: 'mep-malning',
        name: 'Vägg – Målning (2 strykningar)',
        group: 'MEPS',
        items: [
          {
            title: 'Målning väggar',
            code: 'MAL-201',
            unit: 'm²',
            unitPrice: 150,
            qtyPerKvm: 1,
            qtyMode: 'perKvm',
          },
          {
            title: 'Maskering/beredning',
            code: 'MAL-050',
            unit: 'tim',
            unitPrice: 500,
            qtyPerKvm: 0.15,
            qtyMode: 'perKvm',
          },
        ],
      },
    ],
    []
  );

  // Load custom templates from localStorage and merge with defaults
  useEffect(() => {
    try {
      const raw =
        typeof window !== 'undefined' ? localStorage.getItem(userKey) : null;
      const parsed: MomentTemplate[] = raw ? JSON.parse(raw) : [];
      // Ensure MEPS defaults are present and deduped by id
      const map = new Map<string, MomentTemplate>();
      defaultMepTemplates.forEach((t) => map.set(t.id, t));
      (parsed || []).forEach((t) => map.set(t.id, t));
      setTemplates(Array.from(map.values()));
    } catch (e) {
      setTemplates(defaultMepTemplates);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userKey]);

  const persistCustomTemplates = (next: MomentTemplate[]) => {
    const customs = next.filter((t) => t.group === 'Custom');
    try {
      localStorage.setItem(userKey, JSON.stringify(customs));
    } catch {}
  };

  const addTemplateToItems = (templateId: string) => {
    const t = templates.find((x) => x.id === templateId);
    if (!t) return;
    const newItems: LineItem[] = t.items.map((it) => ({
      code: it.code,
      title: it.title,
      unit: it.unit,
      unitPrice: it.unitPrice,
      qty:
        it.qtyMode === 'fixed' && typeof it.fixedQty === 'number'
          ? Number((it.fixedQty || 0).toFixed(2))
          : Number(((it.qtyPerKvm || 1) * (Number(areaKvm) || 0)).toFixed(2)),
    }));
    setItems((prev) => [...prev, ...newItems]);
  };

  const saveSingleLineAsTemplate = (line: LineItem) => {
    const name = prompt('Namn på standardmoment?');
    if (!name) return;
    const id = `custom-${Date.now()}`;
    // Default new single-line template as fixed quantity using current qty
    const qtyPerKvm = undefined;
    const fixedQty = Number(line.qty || 1);
    const next: MomentTemplate = {
      id,
      name,
      group: 'Custom',
      items: [
        {
          title: line.title,
          code: line.code,
          unit: line.unit,
          unitPrice: line.unitPrice,
          qtyPerKvm,
          fixedQty,
          qtyMode: 'fixed',
        },
      ],
    };
    setTemplates((prev) => {
      const combined = [...prev, next];
      persistCustomTemplates(combined);
      return combined;
    });
  };

  // Manage overlay local state
  type DraftItem = MomentTemplateItem & { id: string };
  const [draftName, setDraftName] = useState<string>('');
  const [draftItems, setDraftItems] = useState<DraftItem[]>([]);
  const resetDraft = () => {
    setDraftName('');
    setDraftItems([]);
  };
  const addDraftRow = () => {
    setDraftItems((d) => [
      ...d,
      {
        id: `${Date.now()}-${Math.random()}`,
        title: 'Nytt moment',
        unit: 'm²',
        unitPrice: 0,
        qtyPerKvm: 1,
        fixedQty: 1,
        qtyMode: 'perKvm',
      },
    ]);
  };
  const updateDraftRow = (id: string, field: keyof DraftItem, value: any) => {
    setDraftItems((d) =>
      d.map((row) =>
        row.id === id
          ? {
              ...row,
              [field]:
                field === 'unitPrice' ||
                field === 'qtyPerKvm' ||
                field === 'fixedQty'
                  ? Number(value || 0)
                  : value,
            }
          : row
      )
    );
  };
  const removeDraftRow = (id: string) => {
    setDraftItems((d) => d.filter((r) => r.id !== id));
  };
  const saveDraftTemplate = () => {
    if (!draftName || draftItems.length === 0) return;
    const id = `custom-${Date.now()}`;
    const prepared: MomentTemplate = {
      id,
      name: draftName,
      group: 'Custom',
      items: draftItems.map(({ id: _id, ...rest }) => rest),
    };
    setTemplates((prev) => {
      const combined = [...prev, prepared];
      persistCustomTemplates(combined);
      return combined;
    });
    resetDraft();
    setIsManageOpen(false);
  };
  const deleteTemplate = (id: string) => {
    setTemplates((prev) => {
      const next = prev.filter((t) => t.id !== id);
      persistCustomTemplates(next);
      return next;
    });
  };

  const vatPct = 0.25;
  const adminSurchargePct = 0.06;
  const travelSurcharge = 750; // SEK flat
  const selfRisk = 3000; // SEK example
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<null | 'boot' | 'saving' | 'sending'>(
    'boot'
  );

  useEffect(() => {
    const id = setTimeout(() => setLoading(null), 900);
    return () => clearTimeout(id);
  }, []);

  const subTotal = items.reduce((sum, it) => sum + it.qty * it.unitPrice, 0);
  const surcharges = Math.round(subTotal * adminSurchargePct) + travelSurcharge;
  const beforeVat = subTotal + surcharges;
  const vat = Math.round(beforeVat * vatPct);
  const total = beforeVat + vat - selfRisk;

  const updateItem = (
    index: number,
    field: keyof LineItem,
    value: string | number
  ) => {
    setItems((prev) => {
      const next = [...prev];
      const updated: LineItem = { ...next[index] };
      if (field === 'qty' || field === 'unitPrice') {
        const num = typeof value === 'number' ? value : Number(value);
        (updated as any)[field] = Number.isFinite(num) ? num : 0;
      } else {
        (updated as any)[field] = value as any;
      }
      next[index] = updated;
      return next;
    });
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { code: '', title: 'Nytt moment', unit: 'st', qty: 1, unitPrice: 0 },
    ]);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  if (!tender) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden bg-background text-white">
        <PageScrollWrapper className="h-screen">
          <main className="relative z-10 max-w-[1400px] px-6 py-8 pl-34 pt-20 ">
            <button
              onClick={() => router.back()}
              className="text-sm text-[#a145b7] hover:text-[#8d3aa0] cursor-pointer mb-6 flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faChevronLeft} /> Tillbaka
            </button>
            <div>Ärendet hittades inte.</div>
          </main>
        </PageScrollWrapper>
      </div>
    );
  }

  // Contractors are allowed to access the builder regardless of tender phase

  const saveAsDraft = () => {
    setLoading('saving');
    const today = new Date();
    const due = new Date(Date.now() + 14 * 24 * 3600 * 1000);
    const saved = addInvoice({
      tenderId: tender.id,
      invoicingPart: tender.winningTender?.name || 'Entreprenör AB',
      invoiceDate: today.toISOString().slice(0, 10),
      invoiceDueDate: due.toISOString().slice(0, 10),
      amount: total,
      currency: tender.winningTender?.currency || 'SEK',
      file: '/file.svg',
      status: 1,
      items: items,
      vatPct,
      adminSurchargePct,
      travelSurcharge,
      selfRisk,
      subTotal,
      beforeVat,
      vat,
      total,
    });
    // Add tender message
    setTenders(
      tenders.map((t) =>
        t.id === tender.id
          ? {
              ...t,
              messages: [
                ...((t.messages as any) || []),
                {
                  author: {
                    name: user.display || `${user.firstName} ${user.lastName}`,
                    id: user.id,
                    profileImage: user.profileImage,
                  },
                  createdAt: new Date().toISOString(),
                  title: 'Faktura sparad som utkast',
                  message: `Utkast #${saved.invoiceNumber} sparad.`,
                },
              ],
            }
          : t
      )
    );
    setTimeout(() => router.push('/invoices'), 900);
  };

  const sendInvoice = () => {
    setLoading('sending');
    const today = new Date();
    const due = new Date(Date.now() + 14 * 24 * 3600 * 1000);
    const sent = addInvoice({
      tenderId: tender.id,
      invoicingPart: tender.winningTender?.name || 'Entreprenör AB',
      invoiceDate: today.toISOString().slice(0, 10),
      invoiceDueDate: due.toISOString().slice(0, 10),
      amount: total,
      currency: tender.winningTender?.currency || 'SEK',
      file: '/file.svg',
      status: 1,
      items: items,
      vatPct,
      adminSurchargePct,
      travelSurcharge,
      selfRisk,
      subTotal,
      beforeVat,
      vat,
      total,
    });
    // Move tender to waiting-for-response phase and log message + date stamp
    setTenders(
      tenders.map((t) =>
        t.id === tender.id
          ? {
              ...t,
              status: t.status < 3 ? 3 : t.status,
              phaseDates: {
                ...(t.phaseDates || {}),
                awaitingResponse:
                  (t.phaseDates && t.phaseDates.awaitingResponse) ||
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
                  title: 'Ny faktura inskickad',
                  message: `Faktura #${sent.invoiceNumber} har skickats in för granskning`,
                },
              ],
            }
          : t
      )
    );
    setTimeout(() => router.push(`/tender/${tender.id}?boot=1`), 1000);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-[#6b1d7e]/25 blur-[140px]" />
        <div className="absolute -bottom-40 right-[-120px] h-[540px] w-[540px] rounded-full bg-[#2a0a35]/40 blur-[120px]" />
      </div>
      <PageScrollWrapper key={loading ? 'boot' : 'ready'} className="h-screen">
        <main className="relative z-10 max-w-[1400px] px-6 py-8 pl-34 mt-10 pt-20">
          <button
            onClick={() => router.back()}
            className="text-sm text-[#a145b7] hover:text-[#8d3aa0] cursor-pointer mb-6 flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faChevronLeft} /> Tillbaka
          </button>

          {loading === 'boot' ? (
            <div className="animate-pulse grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-6">
                  <div className="h-4 w-40 bg-white/10 rounded mb-4" />
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-8 w-full bg-white/10 rounded mb-2"
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-6">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-4 ${
                        i % 2 ? 'w-2/3' : 'w-1/2'
                      } bg-white/10 rounded mb-3`}
                    />
                  ))}
                </div>
                <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-4 ${
                        i % 2 ? 'w-2/3' : 'w-1/2'
                      } bg-white/10 rounded mb-3`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-6 text-sm">
                  <h3 className="text-sm font-medium text-white/80 mb-4">
                    Ärendeinformation
                  </h3>
                  <div className="space-y-2">
                    <InfoRow label="Fastighetsägare" value={tender.po.name} />
                    <InfoRow
                      label="Fastighet"
                      value={`${tender.property.name}, ${tender.property.address}`}
                    />
                    <InfoRow label="Skadetyp" value={tender.damageType.label} />
                    <InfoRow
                      label="Försäkringsbolag"
                      value={tender.insurerName}
                    />
                  </div>
                </div>
                <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-6">
                  <div className="grid grid-cols-11 text-xs font-light opacity-70 pb-2">
                    <div className="col-span-3">Moment</div>
                    <div className="col-span-1">Enhet</div>
                    <div className="col-span-1 text-right">Antal</div>
                    <div className="col-span-2 text-right">Á-pris</div>
                    <div className="col-span-3 text-right">Radbelopp</div>
                    {isEditing && <div className="col-span-1 text-right"></div>}
                  </div>
                  <div className="divide-y divide-white/10">
                    {items.map((it, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-11 py-3 text-sm items-center gap-2"
                      >
                        <div className="col-span-3">
                          {isEditing ? (
                            <>
                              <input
                                value={it.title}
                                onChange={(e) =>
                                  updateItem(idx, 'title', e.target.value)
                                }
                                className="w-full h-9 rounded-md bg-white/10 px-2 text-sm text-white placeholder:text-white/50 ring-1 ring-white/10 outline-none"
                              />
                              <input
                                value={it.code || ''}
                                onChange={(e) =>
                                  updateItem(idx, 'code', e.target.value)
                                }
                                placeholder="Kod"
                                className="mt-2 w-full h-8 rounded-md bg-white/10 px-2 text-xs text-white placeholder:text-white/50 ring-1 ring-white/10 outline-none"
                              />
                            </>
                          ) : (
                            <>
                              <div className="font-medium">{it.title}</div>
                              <div className="text-xs opacity-60">
                                {it.code}
                              </div>
                            </>
                          )}
                        </div>
                        <div className="col-span-1">
                          {isEditing ? (
                            <input
                              value={it.unit}
                              onChange={(e) =>
                                updateItem(idx, 'unit', e.target.value)
                              }
                              className="w-full h-9 rounded-md bg-white/10 px-2 text-sm text-white placeholder:text-white/50 ring-1 ring-white/10 outline-none"
                            />
                          ) : (
                            <span>{it.unit}</span>
                          )}
                        </div>
                        <div className="col-span-1 text-right">
                          {isEditing ? (
                            <input
                              type="number"
                              inputMode="decimal"
                              value={isNaN(it.qty as any) ? '' : it.qty}
                              onChange={(e) =>
                                updateItem(idx, 'qty', e.target.value)
                              }
                              className="w-full h-9 rounded-md bg-white/10 px-2 text-right text-sm text-white placeholder:text-white/50 ring-1 ring-white/10 outline-none"
                            />
                          ) : (
                            <span>{it.qty}</span>
                          )}
                        </div>
                        <div className="col-span-2 text-right">
                          {isEditing ? (
                            <input
                              type="number"
                              inputMode="decimal"
                              value={
                                isNaN(it.unitPrice as any) ? '' : it.unitPrice
                              }
                              onChange={(e) =>
                                updateItem(idx, 'unitPrice', e.target.value)
                              }
                              className="w-full h-9 rounded-md bg-white/10 px-2 text-right text-sm text-white placeholder:text-white/50 ring-1 ring-white/10 outline-none"
                            />
                          ) : (
                            <span>
                              {new Intl.NumberFormat('sv-SE', {
                                style: 'currency',
                                currency: 'SEK',
                              })
                                .format(it.unitPrice)
                                .replace('SEK', '')
                                .trim()}
                            </span>
                          )}
                        </div>
                        <div
                          className={`${
                            isEditing ? 'col-span-3' : 'col-span-3'
                          } text-right`}
                        >
                          {new Intl.NumberFormat('sv-SE', {
                            style: 'currency',
                            currency: 'SEK',
                          })
                            .format((it.qty || 0) * (it.unitPrice || 0))
                            .replace('SEK', '')
                            .trim()}
                        </div>
                        {isEditing && (
                          <div className="col-span-1 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => saveSingleLineAsTemplate(it)}
                                className="grid h-8 w-8 place-items-center rounded-md bg-white/10 hover:bg-white/15 ring-1 ring-white/10"
                                title="Spara som standard"
                              >
                                <FontAwesomeIcon
                                  icon={faFloppyDisk}
                                  className="h-3 w-3 text-white/70"
                                />
                              </button>
                              <button
                                onClick={() => removeItem(idx)}
                                className="grid h-8 w-8 place-items-center rounded-md bg-white/10 hover:bg-white/15 ring-1 ring-white/10"
                                title="Ta bort moment"
                              >
                                <FontAwesomeIcon
                                  icon={faTimes}
                                  className="h-3 w-3 text-white/70"
                                />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {isEditing && (
                    <div className="pt-4">
                      <button
                        onClick={addItem}
                        className="rounded-lg bg-white/10 hover:bg-white/15 transition-colors px-4 py-2 text-sm"
                      >
                        Lägg till moment
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 justify-end">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="rounded-lg bg-white/10 hover:bg-white/15 cursor-pointer transition-colors px-4 py-2 text-sm"
                  >
                    {isEditing ? 'Klar' : 'Redigera'}
                  </button>
                  <button
                    onClick={saveAsDraft}
                    className="rounded-lg bg-[#a145b7] hover:bg-[#8d3aa0] cursor-pointer transition-colors px-4 py-2 text-sm"
                  >
                    Spara som utkast
                  </button>
                  <button
                    onClick={sendInvoice}
                    className="rounded-lg bg-ensured-pink hover:bg-[#8d3aa0] cursor-pointer transition-colors px-4 py-2 text-sm"
                  >
                    Skicka
                  </button>
                </div>
                {/* Quick templates panel */}
                <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-white/80">
                      Snabbmoment
                    </h3>
                    <button
                      onClick={() => setIsManageOpen(true)}
                      className="rounded-md bg-white/10 hover:bg-white/15 transition-colors px-3 py-1.5 text-xs"
                      title="Hantera standarder"
                    >
                      <FontAwesomeIcon
                        icon={faWrench}
                        className="h-3 w-3 text-ensured-pink mr-2"
                      />
                      Hantera
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                    <label className="col-span-1 text-white/60 self-center">
                      Yta (kvm)
                    </label>
                    <input
                      type="number"
                      inputMode="decimal"
                      value={isNaN(areaKvm as any) ? '' : areaKvm}
                      onChange={(e) => setAreaKvm(Number(e.target.value || 0))}
                      className="col-span-2 h-9 rounded-md bg-white/10 px-2 text-right text-sm text-white placeholder:text-white/50 ring-1 ring-white/10 outline-none"
                    />
                  </div>
                  <div className="mb-2 text-xs text-white/60">MEPS</div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {templates
                      .filter((t) => t.group === 'MEPS')
                      .map((t) => (
                        <button
                          key={t.id}
                          onClick={() => addTemplateToItems(t.id)}
                          className="rounded-full bg-white/10 hover:bg-white/15 ring-1 ring-white/10 px-3 py-1.5 text-xs"
                        >
                          <FontAwesomeIcon
                            icon={faPlus}
                            className="h-3 w-3 mr-2 text-ensured-pink"
                          />
                          {t.name}
                        </button>
                      ))}
                  </div>
                  <div className="mb-2 text-xs text-white/60">Egna</div>
                  <div className="flex flex-wrap gap-2">
                    {templates.filter((t) => t.group === 'Custom').length ===
                      0 && (
                      <div className="text-xs text-white/40">
                        Inga egna standarder än.
                      </div>
                    )}
                    {templates
                      .filter((t) => t.group === 'Custom')
                      .map((t) => (
                        <button
                          key={t.id}
                          onClick={() => addTemplateToItems(t.id)}
                          className="rounded-full bg-white/10 hover:bg-white/15 ring-1 ring-white/10 px-3 py-1.5 text-xs"
                        >
                          <FontAwesomeIcon
                            icon={faPlus}
                            className="h-3 w-3 mr-2 text-ensured-pink"
                          />
                          {t.name}
                        </button>
                      ))}
                  </div>
                </div>
                <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-6">
                  <h3 className="text-sm font-medium text-white/80 mb-4">
                    Sammanställning
                  </h3>
                  <div className="space-y-2 text-sm">
                    <Row label="Delsumma" value={subTotal} />
                    <Row
                      label={`Påslag adm (${Math.round(
                        adminSurchargePct * 100
                      )}%)`}
                      value={Math.round(subTotal * adminSurchargePct)}
                    />
                    <Row label="Resor mm" value={travelSurcharge} />
                    <Divider />
                    <Row label="Summa före moms" value={beforeVat} />
                    <Row
                      label={`Moms (${Math.round(vatPct * 100)}%)`}
                      value={vat}
                    />
                    <Row label="Självrisk" value={-selfRisk} />
                    <Divider />
                    <Row label="Att betala" value={total} bold />
                  </div>
                  <button className="mt-4 w-full rounded-lg bg-white/10 hover:bg-white/15 transition-colors px-4 py-2 text-sm flex items-center justify-center gap-2">
                    <FontAwesomeIcon
                      icon={faFilePdf}
                      className="h-4 w-4 text-ensured-pink"
                    />
                    Generera PDF (kommer snart)
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </PageScrollWrapper>
      {loading && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60">
          <div className="rounded-xl bg-background ring-1 ring-white/10 px-6 py-5 text-sm text-white flex items-center gap-3">
            <div className="h-6 w-6 rounded-full border-2 border-white/20 border-t-ensured-pink animate-spin" />
            {loading === 'boot' && (
              <span>Räkngar ut kalkyl baserat på skadeanmälan…</span>
            )}
            {loading === 'saving' && <span>Sparar utkast…</span>}
            {loading === 'sending' && <span>Skickar offert…</span>}
          </div>
        </div>
      )}
      {isManageOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60">
          <div className="w-[760px] max-w-[95vw] rounded-xl bg-background ring-1 ring-white/10 text-sm text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 p-4">
              <div>
                <div className="font-semibold">Hantera standardmoment</div>
                <div className="text-xs text-white/60 mt-1">
                  Skapa egna mallar eller ta bort befintliga
                </div>
              </div>
              <button
                onClick={() => setIsManageOpen(false)}
                className="rounded-lg p-2 hover:bg-white/10"
              >
                <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
              </button>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
              <div className="rounded-lg bg-white/5 ring-1 ring-white/10 p-3">
                <div className="text-xs font-medium text-white/80 mb-2">
                  Dina standarder
                </div>
                <div className="space-y-2">
                  {templates.filter((t) => t.group === 'Custom').length ===
                    0 && (
                    <div className="text-xs text-white/40">
                      Inga egna standarder.
                    </div>
                  )}
                  {templates
                    .filter((t) => t.group === 'Custom')
                    .map((t) => (
                      <div
                        key={t.id}
                        className="flex items-center justify-between rounded-md bg-white/5 ring-1 ring-white/10 px-3 py-2"
                      >
                        <div>
                          <div className="text-sm">{t.name}</div>
                          <div className="text-[11px] text-white/60">
                            {t.items.length} rader
                          </div>
                        </div>
                        <button
                          onClick={() => deleteTemplate(t.id)}
                          className="grid h-8 w-8 place-items-center rounded-md bg-white/10 hover:bg-white/15 ring-1 ring-white/10"
                          title="Ta bort"
                        >
                          <FontAwesomeIcon
                            icon={faTrash}
                            className="h-3 w-3 text-white/70"
                          />
                        </button>
                      </div>
                    ))}
                </div>
              </div>
              <div className="rounded-lg bg-white/5 ring-1 ring-white/10 p-3">
                <div className="text-xs font-medium text-white/80 mb-2">
                  Skapa ny standard
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-white/60">Namn</label>
                    <input
                      value={draftName}
                      onChange={(e) => setDraftName(e.target.value)}
                      className="mt-1 w-full h-9 rounded-md bg-white/10 px-2 text-sm text-white ring-1 ring-white/10 outline-none"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs text-white/60">Rader</label>
                      <button
                        onClick={addDraftRow}
                        className="rounded-md bg-white/10 hover:bg-white/15 transition-colors px-3 py-1 text-xs"
                      >
                        <FontAwesomeIcon
                          icon={faPlus}
                          className="h-3 w-3 mr-2 text-ensured-pink"
                        />{' '}
                        Lägg till rad
                      </button>
                    </div>
                    <div className="space-y-2">
                      {draftItems.map((row) => (
                        <div
                          key={row.id}
                          className="grid grid-cols-12 gap-2 items-center"
                        >
                          <input
                            value={row.title}
                            onChange={(e) =>
                              updateDraftRow(row.id, 'title', e.target.value)
                            }
                            placeholder="Moment"
                            className="col-span-4 h-8 rounded-md bg-white/10 px-2 text-xs text-white ring-1 ring-white/10 outline-none"
                          />
                          <input
                            value={row.code || ''}
                            onChange={(e) =>
                              updateDraftRow(row.id, 'code', e.target.value)
                            }
                            placeholder="Kod"
                            className="col-span-2 h-8 rounded-md bg-white/10 px-2 text-xs text-white ring-1 ring-white/10 outline-none"
                          />
                          <input
                            value={row.unit}
                            onChange={(e) =>
                              updateDraftRow(row.id, 'unit', e.target.value)
                            }
                            placeholder="Enhet"
                            className="col-span-2 h-8 rounded-md bg-white/10 px-2 text-xs text-white ring-1 ring-white/10 outline-none"
                          />
                          <input
                            type="number"
                            inputMode="decimal"
                            value={
                              isNaN(row.unitPrice as any) ? '' : row.unitPrice
                            }
                            onChange={(e) =>
                              updateDraftRow(
                                row.id,
                                'unitPrice',
                                e.target.value
                              )
                            }
                            placeholder="Á-pris"
                            className="col-span-2 h-8 rounded-md bg-white/10 px-2 text-xs text-white ring-1 ring-white/10 outline-none text-right"
                          />
                          <div className="col-span-12 grid grid-cols-12 gap-2 items-center">
                            <div className="col-span-4 text-[11px] text-white/60">
                              Kvantitetsläge
                            </div>
                            <div className="col-span-8 flex gap-2">
                              <button
                                onClick={() =>
                                  updateDraftRow(
                                    row.id,
                                    'qtyMode',
                                    'perKvm' as any
                                  )
                                }
                                className={`px-2 py-1 rounded-md text-[11px] ring-1 ring-white/10 ${
                                  row.qtyMode !== 'fixed'
                                    ? 'bg-white/15'
                                    : 'bg-white/5'
                                }`}
                              >
                                per kvm
                              </button>
                              <button
                                onClick={() =>
                                  updateDraftRow(
                                    row.id,
                                    'qtyMode',
                                    'fixed' as any
                                  )
                                }
                                className={`px-2 py-1 rounded-md text-[11px] ring-1 ring-white/10 ${
                                  row.qtyMode === 'fixed'
                                    ? 'bg-white/15'
                                    : 'bg-white/5'
                                }`}
                              >
                                fast antal
                              </button>
                            </div>
                            {row.qtyMode === 'fixed' ? (
                              <>
                                <div className="col-span-10 text-[11px] text-white/60">
                                  Fast antal
                                </div>
                                <input
                                  type="number"
                                  inputMode="decimal"
                                  value={
                                    isNaN(row.fixedQty as any)
                                      ? ''
                                      : row.fixedQty ?? 1
                                  }
                                  onChange={(e) =>
                                    updateDraftRow(
                                      row.id,
                                      'fixedQty',
                                      e.target.value
                                    )
                                  }
                                  placeholder="Antal"
                                  className="col-span-2 h-8 rounded-md bg-white/10 px-2 text-xs text-white ring-1 ring-white/10 outline-none text-right"
                                />
                              </>
                            ) : (
                              <>
                                <div className="col-span-10 text-[11px] text-white/60">
                                  Faktor × kvm
                                </div>
                                <input
                                  type="number"
                                  inputMode="decimal"
                                  value={
                                    isNaN(row.qtyPerKvm as any)
                                      ? ''
                                      : row.qtyPerKvm ?? 1
                                  }
                                  onChange={(e) =>
                                    updateDraftRow(
                                      row.id,
                                      'qtyPerKvm',
                                      e.target.value
                                    )
                                  }
                                  placeholder="Faktor"
                                  className="col-span-2 h-8 rounded-md bg-white/10 px-2 text-xs text-white ring-1 ring-white/10 outline-none text-right"
                                />
                              </>
                            )}
                          </div>
                          <div className="col-span-12 text-right">
                            <button
                              onClick={() => removeDraftRow(row.id)}
                              className="inline-grid h-7 w-7 place-items-center rounded-md bg-white/10 hover:bg-white/15 ring-1 ring-white/10"
                              title="Ta bort rad"
                            >
                              <FontAwesomeIcon
                                icon={faTimes}
                                className="h-3 w-3 text-white/70"
                              />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={saveDraftTemplate}
                      className="rounded-md bg-[#a145b7] hover:bg-[#8d3aa0] transition-colors px-4 py-2 text-sm"
                    >
                      Spara standard
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Floating bar removed per request */}
    </div>
  );
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: number;
  bold?: boolean;
}) {
  const formatted = new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
  })
    .format(value)
    .replace('SEK', '')
    .trim();
  return (
    <div className="flex items-center justify-between">
      <div
        className={`text-white/70 ${bold ? 'font-semibold text-white' : ''}`}
      >
        {label}
      </div>
      <div
        className={`text-white/80 ${bold ? 'font-semibold text-white' : ''}`}
      >
        {formatted}
      </div>
    </div>
  );
}

function Divider() {
  return <div className="h-px w-full bg-white/10 my-2" />;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-white/60">{label}</div>
      <div className="text-white/80">{value}</div>
    </div>
  );
}
