'use client';
import { useParams, useRouter } from 'next/navigation';
import { useContext, useMemo } from 'react';
import PageScrollWrapper from '../../components/PageScrollWrapper';
import { AppContext } from '../../context/AppContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faFilePdf,
  faFileInvoice,
} from '@fortawesome/pro-light-svg-icons';

export default function InvoiceViewPage() {
  const params = useParams<{ invoiceNumber: string }>();
  const router = useRouter();
  const num = Number(params.invoiceNumber);
  const { invoices, tenders } = useContext(AppContext);

  const invoice = useMemo(
    () => invoices.find((i) => i.invoiceNumber === num),
    [invoices, num]
  );
  const tender = useMemo(
    () =>
      invoice ? tenders.find((t) => t.id === invoice.tenderId) : undefined,
    [tenders, invoice]
  );

  if (!invoice) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden bg-background text-white">
        <PageScrollWrapper className="h-screen">
          <main className="relative z-10 max-w-[1400px] px-6 py-8 pl-34 pt-20">
            <button
              onClick={() => router.back()}
              className="text-sm text-[#a145b7] hover:text-[#8d3aa0] cursor-pointer mb-6 flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <div>Faktura hittades inte.</div>
          </main>
        </PageScrollWrapper>
      </div>
    );
  }

  const currency = (n: number) =>
    new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: invoice.currency || 'SEK',
    })
      .format(n)
      .replace('SEK', '')
      .trim();

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-[#6b1d7e]/25 blur-[140px]" />
        <div className="absolute -bottom-40 right-[-120px] h-[540px] w-[540px] rounded-full bg-[#2a0a35]/40 blur-[120px]" />
      </div>
      <PageScrollWrapper className="h-screen">
        <main className="relative z-10 max-w-[1400px] px-6 py-8 pl-34 mt-10 pt-20">
          <button
            onClick={() => router.back()}
            className="text-sm text-[#a145b7] hover:text-[#8d3aa0] cursor-pointer mb-6 flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faChevronLeft} /> Tillbaka
          </button>

          <div className="mb-6 flex items-center justify-between mt-6">
            <div className="flex items-center gap-3">
              <FontAwesomeIcon
                icon={faFileInvoice}
                className="text-2xl text-ensured-pink"
              />
              <h1 className="text-3xl font-light">
                Faktura #{invoice.invoiceNumber}
              </h1>
            </div>
            <button className="rounded-lg bg-white/10 hover:bg-white/15 transition-colors px-4 py-2 text-sm flex items-center gap-2">
              <FontAwesomeIcon
                icon={faFilePdf}
                className="h-4 w-4 text-ensured-pink"
              />
              Hämta PDF (senare)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-6">
                <div className="grid grid-cols-11 text-xs font-light opacity-70 pb-2">
                  <div className="col-span-3">Moment</div>
                  <div className="col-span-1">Enhet</div>
                  <div className="col-span-1 text-right">Antal</div>
                  <div className="col-span-2 text-right">Á-pris</div>
                  <div className="col-span-3 text-right">Radbelopp</div>
                  <div />
                </div>
                <div className="divide-y divide-white/10">
                  {(invoice.items || []).map((it, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-11 py-3 text-sm items-center gap-2"
                    >
                      <div className="col-span-3">
                        <div className="font-medium">{it.title}</div>
                        <div className="text-xs opacity-60">{it.code}</div>
                      </div>
                      <div className="col-span-1">{it.unit}</div>
                      <div className="col-span-1 text-right">{it.qty}</div>
                      <div className="col-span-2 text-right">
                        {currency(it.unitPrice)}
                      </div>
                      <div className="col-span-3 text-right">
                        {currency((it.qty || 0) * (it.unitPrice || 0))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-6">
                <h3 className="text-sm font-medium text-white/80 mb-4">
                  Sammanställning
                </h3>
                <div className="space-y-2 text-sm">
                  <Row
                    label="Delsumma"
                    value={invoice.subTotal ?? 0}
                    currency={currency}
                  />
                  <Row
                    label={`Påslag adm (${Math.round(
                      (invoice.adminSurchargePct ?? 0) * 100
                    )}%)`}
                    value={Math.round(
                      (invoice.subTotal ?? 0) * (invoice.adminSurchargePct ?? 0)
                    )}
                    currency={currency}
                  />
                  <Row
                    label="Resor mm"
                    value={invoice.travelSurcharge ?? 0}
                    currency={currency}
                  />
                  <Divider />
                  <Row
                    label="Summa före moms"
                    value={invoice.beforeVat ?? 0}
                    currency={currency}
                  />
                  <Row
                    label={`Moms (${Math.round((invoice.vatPct ?? 0) * 100)}%)`}
                    value={invoice.vat ?? 0}
                    currency={currency}
                  />
                  <Row
                    label="Självrisk"
                    value={-(invoice.selfRisk ?? 0)}
                    currency={currency}
                  />
                  <Divider />
                  <Row
                    label="Att betala"
                    value={invoice.total ?? invoice.amount}
                    bold
                    currency={currency}
                  />
                </div>
              </div>

              <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-6 text-sm">
                <h3 className="text-sm font-medium text-white/80 mb-4">
                  Ärendeinformation
                </h3>
                <div className="space-y-2">
                  <InfoRow label="Ärende" value={`#${invoice.tenderId}`} />
                  {tender && (
                    <>
                      <InfoRow label="Fastighetsägare" value={tender.po.name} />
                      <InfoRow
                        label="Skadetyp"
                        value={tender.damageType.label}
                      />
                      <InfoRow
                        label="Försäkringsbolag"
                        value={tender.insurerName}
                      />
                    </>
                  )}
                  <InfoRow label="Fakturadatum" value={invoice.invoiceDate} />
                  <InfoRow
                    label="Förfallodatum"
                    value={invoice.invoiceDueDate}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </PageScrollWrapper>
    </div>
  );
}

function Row({
  label,
  value,
  currency,
  bold,
}: {
  label: string;
  value: number;
  currency: (n: number) => string;
  bold?: boolean;
}) {
  const formatted = currency(value);
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
