'use client';
import { useContext, useEffect, useMemo, useState } from 'react';
import { AppContext } from '../context/AppContext';

type Item = {
  title: string;
  unit: string;
  qty: number;
  unitPrice: number;
  year?: number;
  ageDeductionPct?: number;
  generated?: boolean;
};
type Room = { name: string; items: Item[] };

const currency = (n: number) =>
  new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK' }).format(
    n || 0
  );

export default function QuoteBuilderPage() {
  const { addQuote, setBreadCrumbs, user, tenders } = useContext(AppContext);
  const [claimId, setClaimId] = useState('');
  const [insurer, setInsurer] = useState('');
  const [contractor, setContractor] = useState('');
  const [customer, setCustomer] = useState('');
  const [selfRisk, setSelfRisk] = useState(0);
  const [vatPct, setVatPct] = useState(0.25);
  const [rooms, setRooms] = useState<Room[]>([
    { name: 'Nytt utrymme', items: [] },
  ]);

  useEffect(() => {
    setBreadCrumbs(['Offertbyggare']);
    setInsurer(user?.display || `${user.firstName} ${user.lastName}`);
  }, [user]);

  const totals = useMemo(() => {
    const base = rooms.reduce((accRoom, room) => {
      const roomSum = room.items.reduce((accItem, it) => {
        const line = (it.unitPrice || 0) * (it.qty || 0);
        const age = line * (it.ageDeductionPct || 0);
        return accItem + (line - age);
      }, 0);
      return accRoom + roomSum;
    }, 0);
    const afterSelfRisk = Math.max(0, base - (selfRisk || 0));
    const vat = afterSelfRisk * (vatPct || 0);
    const totalWithVat = afterSelfRisk + vat;
    return { base, afterSelfRisk, vat, totalWithVat };
  }, [rooms, selfRisk, vatPct]);

  const addItem = (roomIdx: number) => {
    const next = [...rooms];
    next[roomIdx].items.push({
      title: '',
      unit: 'st',
      qty: 1,
      unitPrice: 0,
      year: new Date().getFullYear(),
      ageDeductionPct: 0,
      generated: false,
    });
    setRooms(next);
  };

  const updateItem = (
    roomIdx: number,
    itemIdx: number,
    key: keyof Item,
    value: any
  ) => {
    const next = [...rooms];
    (next[roomIdx].items[itemIdx] as any)[key] = value;
    setRooms(next);
  };

  const addRoom = () =>
    setRooms([...rooms, { name: 'Nytt utrymme', items: [] }]);

  const saveQuote = () => {
    const prepared = {
      claimId,
      insurer,
      contractor,
      customer,
      selfRisk: Number(selfRisk) || 0,
      vatPct: Number(vatPct) || 0,
      rooms,
    } as any;
    addQuote(prepared);
  };

  return (
    <main style={{ padding: 20 }}>
      <h1>Offertbyggare</h1>
      <section>
        <h2>Parter</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 8,
          }}
        >
          <label>Skadenummer</label>
          <input value={claimId} onChange={(e) => setClaimId(e.target.value)} />
          <span />
          <label>Försäkringsbolag</label>
          <input value={insurer} onChange={(e) => setInsurer(e.target.value)} />
          <span />
          <label>Entreprenör</label>
          <input
            value={contractor}
            onChange={(e) => setContractor(e.target.value)}
          />
          <span />
          <label>Kund</label>
          <input
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
          />
        </div>
      </section>

      {rooms.map((room, rIdx) => (
        <section key={rIdx} style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              value={room.name}
              onChange={(e) => {
                const next = [...rooms];
                next[rIdx].name = e.target.value;
                setRooms(next);
              }}
            />
            <button onClick={() => addItem(rIdx)}>Lägg till rad</button>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr',
              gap: 6,
              marginTop: 8,
            }}
          >
            <b>Benämning</b>
            <b>Enhet</b>
            <b>Mängd</b>
            <b>à-pris</b>
            <b>År</b>
            <b>Åldersavdrag %</b>
            {room.items.map((it, iIdx) => {
              const line = (it.unitPrice || 0) * (it.qty || 0);
              const age = line * (it.ageDeductionPct || 0);
              const rowTotal = line - age;
              return (
                <>
                  <input
                    value={it.title}
                    onChange={(e) =>
                      updateItem(rIdx, iIdx, 'title', e.target.value)
                    }
                  />
                  <input
                    value={it.unit}
                    onChange={(e) =>
                      updateItem(rIdx, iIdx, 'unit', e.target.value)
                    }
                  />
                  <input
                    type="number"
                    value={it.qty}
                    onChange={(e) =>
                      updateItem(rIdx, iIdx, 'qty', parseFloat(e.target.value))
                    }
                  />
                  <input
                    type="number"
                    value={it.unitPrice}
                    onChange={(e) =>
                      updateItem(
                        rIdx,
                        iIdx,
                        'unitPrice',
                        parseFloat(e.target.value)
                      )
                    }
                  />
                  <input
                    type="number"
                    value={it.year || new Date().getFullYear()}
                    onChange={(e) =>
                      updateItem(rIdx, iIdx, 'year', parseInt(e.target.value))
                    }
                  />
                  <input
                    type="number"
                    step="0.01"
                    value={it.ageDeductionPct || 0}
                    onChange={(e) =>
                      updateItem(
                        rIdx,
                        iIdx,
                        'ageDeductionPct',
                        parseFloat(e.target.value)
                      )
                    }
                  />
                  <span style={{ gridColumn: '1 / -1', textAlign: 'right' }}>
                    {currency(rowTotal)}
                  </span>
                </>
              );
            })}
          </div>
        </section>
      ))}

      <div style={{ marginTop: 16 }}>
        <button onClick={addRoom}>Lägg till utrymme</button>
      </div>

      <section style={{ marginTop: 24 }}>
        <h2>Sammanfattning</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            maxWidth: 480,
          }}
        >
          <span>Summa efter åldersavdrag</span>
          <b>{currency(totals.afterSelfRisk)}</b>
          <span>Självrisk</span>
          <input
            type="number"
            value={selfRisk}
            onChange={(e) => setSelfRisk(parseFloat(e.target.value))}
          />
          <span>Moms</span>
          <b>{currency(totals.vat)}</b>
          <span>Total inkl. moms</span>
          <b>{currency(totals.totalWithVat)}</b>
        </div>
        <button onClick={saveQuote} style={{ marginTop: 8 }}>
          Spara offert
        </button>
      </section>
    </main>
  );
}
