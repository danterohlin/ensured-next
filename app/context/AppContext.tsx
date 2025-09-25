'use client';
import React, { createContext, useMemo, useState } from 'react';

export type Invoice = {
  tenderId: number;
  invoicingPart: string;
  invoiceNumber: number;
  invoiceDate: string;
  invoiceDueDate: string;
  amount: number;
  currency: string;
  file?: string;
  actionTaken?: string | null;
  status: 1 | 2 | 3 | 4; // 1 waiting, 2 approved, 3 payed, 4 denied
  items?: Array<{
    code?: string;
    title: string;
    unit: string;
    qty: number;
    unitPrice: number;
  }>;
  vatPct?: number;
  adminSurchargePct?: number;
  travelSurcharge?: number;
  selfRisk?: number;
  subTotal?: number;
  beforeVat?: number;
  vat?: number;
  total?: number;
};

export type DocumentItem = {
  title: string;
  file?: string;
  createdAt: string;
  approvalNeeded: boolean;
  approvalStatus: 1 | 2 | 3 | null; // 1 waiting, 2 approved, 3 denied
};

export type Tender = {
  id: number;
  po: {
    name: string;
    address: string;
    zip: string;
    town: string;
    phone?: string;
    email?: string;
    state: { current: number; history: Record<string, string | null> };
  };
  property: {
    name: string;
    address: string;
    zip: string;
    town: string;
    mapUrl?: string;
  };
  winningTender: {
    name: string;
    tenderPrice: number;
    currency: string;
    contactPerson: string;
    phone: string;
    id: number;
  } | null;
  tenderType: number;
  damageType: { value: 1 | 2 | 3; label: string };
  description: string;
  file?: string;
  insurerName: string;
  documents: DocumentItem[];
  messages?: Array<{
    author: { name: string; id: number; profileImage?: string };
    createdAt: string;
    title: string;
    message: string;
    media?: Array<{ type: 'image' | 'video'; file: string }>;
  }>;
  status: number;
  startingAt?: string | null;
  endingAt?: string | null;
  comments?: Array<{ author: User; comment: string; createdAt: string }>;
  phaseDates?: {
    registered?: string;
    biddingStarted?: string;
    awaitingResponse?: string;
    approved?: string;
  };
};

export type Quote = {
  id: number;
  claimId: string;
  insurer: string;
  contractor: string;
  customer: string;
  quoteDate: string;
  selfRisk: number;
  vatPct: number;
  status: 1 | 2 | 3 | 4;
  rooms: Array<{
    name: string;
    items: Array<{
      code?: string;
      title: string;
      category?: string;
      unit: string;
      qty: number;
      unitPrice: number;
      year?: number;
      ageDeductionPct?: number;
    }>;
  }>;
  tenderId?: number;
};

export type User = {
  firstName: string;
  lastName: string;
  display?: string;
  email?: string;
  id: number;
  profileImage?: string;
  organisation?: string;
  role?: string;
  type: 1 | 2 | 3; // 1 insurer, 2 property owner, 3 contractor
  organisationTitle?: string;
};

type Ctx = {
  isLoggedIn: boolean;
  setIsLoggedIn: (v: boolean) => void;
  user: User;
  setUser: (u: User) => void;
  breadCrumbs: string[];
  setBreadCrumbs: (c: string[]) => void;
  invoices: Invoice[];
  setInvoices: (v: Invoice[]) => void;
  tenders: Tender[];
  setTenders: (v: Tender[]) => void;
  quotes: Quote[];
  setQuotes: (v: Quote[]) => void;
  addQuote: (
    q: Omit<Quote, 'id' | 'quoteDate' | 'status'> &
      Partial<Pick<Quote, 'status' | 'quoteDate'>>
  ) => Quote;
  addTender: (
    t: Omit<Tender, 'id' | 'status' | 'startingAt' | 'endingAt' | 'comments'> &
      Partial<Pick<Tender, 'status' | 'startingAt' | 'endingAt'>>
  ) => Tender;
  addInvoice: (
    i: Omit<Invoice, 'invoiceNumber' | 'status'> &
      Partial<Pick<Invoice, 'status'>>
  ) => Invoice;
  loginAs: (type: 1 | 2 | 3) => void;
};

export const AppContext = createContext<Ctx>({} as any);

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [breadCrumbs, setBreadCrumbs] = useState<string[]>([]);

  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      tenderId: 451152231151,
      invoicingPart: 'Anders Bygg AB',
      invoiceNumber: 1000,
      invoiceDate: '2024-04-09',
      invoiceDueDate: '2024-05-09',
      amount: 100000,
      currency: 'SEK',
      status: 1,
    },
    {
      tenderId: 451152231152,
      invoicingPart: 'Bygg Pelle AB',
      invoiceNumber: 1001,
      invoiceDate: '2024-04-10',
      invoiceDueDate: '2024-05-10',
      amount: 100000,
      currency: 'SEK',
      status: 2,
    },
    {
      tenderId: 451152231153,
      invoicingPart: 'Bröderna Bygg AB',
      invoiceNumber: 1002,
      invoiceDate: '2024-04-11',
      invoiceDueDate: '2024-05-11',
      amount: 100000,
      currency: 'SEK',
      status: 2,
    },
    {
      tenderId: 451152231154,
      invoicingPart: 'Byggarna AB',
      invoiceNumber: 1003,
      invoiceDate: '2024-04-11',
      invoiceDueDate: '2024-05-11',
      amount: 100000,
      currency: 'SEK',
      status: 1,
    },
    {
      tenderId: 451152231154,
      invoicingPart: 'Renoverare AB',
      invoiceNumber: 1004,
      invoiceDate: '2024-07-15',
      invoiceDueDate: '2024-08-15',
      amount: 85000,
      currency: 'SEK',
      status: 4,
    },
    {
      tenderId: 451152231154,
      invoicingPart: 'Tak & Bygg AB',
      invoiceNumber: 1005,
      invoiceDate: '2024-06-20',
      invoiceDueDate: '2024-07-20',
      amount: 150000,
      currency: 'SEK',
      status: 4,
    },
  ]);

  const [users] = useState<User[]>([
    {
      firstName: 'Eric',
      lastName: 'Andrén',
      display: 'Eric Andrén',
      email: 'eric@techtify.se',
      id: 101,
      profileImage: '/eric_white.png',
      organisation: 'all',
      role: 'admin',
      type: 1,
    },
    {
      firstName: 'Niklas',
      lastName: 'Liljendahl',
      display: 'Niklas Liljendahl',
      email: 'niklas@techtify.se',
      id: 102,
      profileImage: '/niklas_forest.jpg',
      organisation: 'all',
      role: 'viewer',
      type: 2,
    },
    {
      firstName: 'Dante',
      lastName: 'Rohlin',
      display: 'Dante Rohlin',
      email: 'dante@techtify.se',
      id: 103,
      profileImage: '/dante.png',
      organisation: 'all',
      role: 'viewer',
      type: 3,
    },
  ]);
  const [user, setUser] = useState<User>(users[0]);

  const [tenders, setTenders] = useState<Tender[]>([
    {
      id: 451152231151,
      po: {
        name: 'PB Fastigheter',
        address: 'Testgatan 2',
        zip: '112 40',
        town: 'Stockholm',
        phone: '085431266',
        email: 'mail@mail.com',
        state: {
          current: 5,
          history: {
            stepOne: '2023-05-23T10:30',
            stepTwo: null,
            stepThree: '2023-05-25T12:45',
            stepFour: null,
            stepFive: '2023-05-25T12:00',
          },
        },
      },
      property: {
        name: 'Skutan 10',
        address: 'Drottninggatan 36',
        zip: '114 86',
        town: 'Stockholm',
        mapUrl: 'https://maps.app.goo.gl/2HrvfvZaQ62GK2rr7',
      },
      winningTender: {
        name: 'Hans Bygg AB',
        tenderPrice: 100000,
        currency: 'SEK',
        contactPerson: 'Anders Svensson',
        phone: '0734015242',
        id: 1234,
      },
      tenderType: 1,
      damageType: { value: 1, label: 'Vattenskada' },
      description: 'Lorem ipsum dolor sit amet ...',
      insurerName: 'If Skadeförsäkring AB',
      documents: [
        {
          title: 'Besiktningsprotokoll',
          createdAt: '2023-03-24T12:00',
          approvalNeeded: false,
          approvalStatus: null,
        },
        {
          title: 'Slutprotokoll',
          createdAt: '2023-03-24T12:00',
          approvalNeeded: true,
          approvalStatus: 1,
        },
      ],
      status: 4,
      startingAt: '2025-05-01T10:30',
      endingAt: '2025-06-01T12:00',
      comments: [],
      phaseDates: {
        registered: '2025-04-28T10:30',
        biddingStarted: '2025-05-01T10:30',
        awaitingResponse: '2025-05-02T12:00',
        approved: '2025-05-02T12:00',
      },
    },
    {
      id: 451152231152,
      po: {
        name: 'PB Fastigheter',
        address: 'Testgatan 2',
        zip: '112 40',
        town: 'Stockholm',
        phone: '085431266',
        email: 'mail@mail.com',
        state: {
          current: 3,
          history: {
            stepOne: '2023-05-20T09:15',
            stepTwo: '2023-05-21T14:30',
            stepThree: '2023-05-22T11:45',
            stepFour: null,
            stepFive: null,
          },
        },
      },
      property: {
        name: 'Skutan 11',
        address: 'Drottninggatan 37',
        zip: '114 20',
        town: 'Stockholm',
      },
      tenderType: 2,
      damageType: { value: 2, label: 'Brand' },
      description: 'Brand i kök som orsakade rök- och sotskador...',
      insurerName: 'Länsförsäkringar Stockholm',
      documents: [
        {
          title: 'Besiktningsprotokoll',
          createdAt: '2023-05-20T12:00',
          approvalNeeded: false,
          approvalStatus: null,
        },
      ],
      status: 4,
      phaseDates: {
        registered: '2025-04-28T10:30',
        biddingStarted: '2025-05-01T10:30',
        approved: '2025-05-02T12:00',
      },
      winningTender: {
        name: 'Bygg Pelle AB',
        tenderPrice: 100000,
        currency: 'SEK',
        contactPerson: 'Anders Svensson',
        phone: '0734015242',
        id: 1001,
      },
      startingAt: '2025-09-02T12:00',
      endingAt: '2025-09-12T12:00',
      comments: [],
    },
    {
      id: 451152231153,
      po: {
        name: 'PB Fastigheter',
        address: 'Testgatan 2',
        zip: '112 40',
        town: 'Stockholm',
        phone: '085431266',
        email: 'mail@mail.com',
        state: {
          current: 2,
          history: {
            stepOne: '2023-05-18T08:45',
            stepTwo: '2023-05-19T16:20',
            stepThree: null,
            stepFour: null,
            stepFive: null,
          },
        },
      },
      property: {
        name: 'Skutan 12',
        address: 'Drottninggatan 38',
        zip: '114 20',
        town: 'Stockholm',
      },
      winningTender: {
        name: 'Bröderna Bygg AB',
        tenderPrice: 100000,
        currency: 'SEK',
        contactPerson: 'Anders Svensson',
        phone: '0734015242',
        id: 1002,
      },
      tenderType: 2,
      damageType: { value: 3, label: 'Skadegörelse' },
      description: 'Skadegörelse på fasad och fönster...',
      insurerName: 'Trygg-Hansa',
      documents: [
        {
          title: 'Polisanmälan',
          createdAt: '2023-05-18T10:00',
          approvalNeeded: false,
          approvalStatus: null,
        },
        {
          title: 'Besiktningsprotokoll',
          createdAt: '2023-05-19T14:00',
          approvalNeeded: false,
          approvalStatus: null,
        },
      ],
      status: 4,
      startingAt: '2025-05-01T10:30',
      endingAt: '2025-05-12T12:00',
      comments: [],
      phaseDates: {
        registered: '2025-04-28T10:30',
        biddingStarted: '2025-05-01T10:30',
        awaitingResponse: '2025-05-02T12:00',
        approved: '2025-05-02T12:00',
      },
    },
    {
      id: 451152231154,
      po: {
        name: 'Fastighets AB Centrum',
        address: 'Kungsgatan 15',
        zip: '111 43',
        town: 'Stockholm',
        phone: '084521337',
        email: 'info@centrum.se',
        state: {
          current: 4,
          history: {
            stepOne: '2023-05-15T11:30',
            stepTwo: '2023-05-16T13:15',
            stepThree: '2023-05-17T09:45',
            stepFour: '2023-05-18T15:30',
            stepFive: null,
          },
        },
      },
      property: {
        name: 'Centrum 5',
        address: 'Vasagatan 22',
        zip: '111 20',
        town: 'Stockholm',
      },
      winningTender: {
        name: 'Bygg & Fix AB',
        tenderPrice: 85000,
        currency: 'SEK',
        contactPerson: 'Maria Andersson',
        phone: '0708123456',
        id: 1235,
      },
      tenderType: 1,
      damageType: { value: 1, label: 'Vattenskada' },
      description: 'Vattenläcka från våning ovanför...',
      insurerName: 'Folksam',
      documents: [
        {
          title: 'Besiktningsprotokoll',
          createdAt: '2023-05-16T10:00',
          approvalNeeded: false,
          approvalStatus: null,
        },
        {
          title: 'Slutprotokoll',
          createdAt: '2023-05-18T16:00',
          approvalNeeded: true,
          approvalStatus: 2,
        },
      ],
      status: 2,
      startingAt: '2024-05-20T08:00',
      endingAt: '2024-06-15T17:00',
      comments: [],
      phaseDates: {
        registered: '2024-05-15T11:30:00',
        biddingStarted: '2024-05-16T13:15:00',
      },
    },
    {
      id: 451152231155,
      po: {
        name: 'Bostadsrättsföreningen Tornet',
        address: 'Storgatan 8',
        zip: '114 51',
        town: 'Stockholm',
        phone: '087654321',
        email: 'styrelsen@tornet.se',
        state: {
          current: 2,
          history: {
            stepOne: '2023-05-10T14:20',
            stepTwo: '2023-05-12T10:15',
            stepThree: null,
            stepFour: null,
            stepFive: null,
          },
        },
      },
      property: {
        name: 'Tornet 3',
        address: 'Storgatan 8',
        zip: '114 51',
        town: 'Stockholm',
      },
      winningTender: null,
      tenderType: 1,
      damageType: { value: 2, label: 'Brand' },
      description: 'Mindre brand i tvättstuga som orsakade rökskador...',
      insurerName: 'If Skadeförsäkring AB',
      documents: [
        {
          title: 'Brandutredning',
          createdAt: '2023-05-11T09:00',
          approvalNeeded: false,
          approvalStatus: null,
        },
        {
          title: 'Besiktningsprotokoll',
          createdAt: '2023-05-12T11:00',
          approvalNeeded: false,
          approvalStatus: null,
        },
      ],
      status: 1,
      startingAt: null,
      endingAt: '2024-08-15T12:00',
      comments: [],
      phaseDates: {},
    },
  ]);

  const [quotes, setQuotes] = useState<Quote[]>([]);

  const addQuote: Ctx['addQuote'] = (quote) => {
    const nextId =
      quotes.length > 0 ? Math.max(...quotes.map((q) => q.id)) + 1 : 10000;
    const prepared: Quote = {
      ...quote,
      id: nextId,
      quoteDate: quote.quoteDate || new Date().toISOString(),
      status: quote.status || 1,
    } as Quote;
    setQuotes([prepared, ...quotes]);
    return prepared;
  };

  const addTender: Ctx['addTender'] = (tenderInput) => {
    const nextId =
      tenders.length > 0
        ? Math.max(...tenders.map((t) => t.id)) + 1
        : 451152200000;
    const prepared: Tender = {
      ...tenderInput,
      id: nextId,
      status: tenderInput.status ?? 1,
      startingAt: tenderInput.startingAt ?? null,
      endingAt: tenderInput.endingAt ?? null,
      comments: [],
      phaseDates: (tenderInput as any).phaseDates || {},
    } as Tender;
    setTenders([prepared, ...tenders]);
    return prepared;
  };

  const addInvoice: Ctx['addInvoice'] = (invoiceInput) => {
    const nextNumber =
      invoices.length > 0
        ? Math.max(...invoices.map((i) => i.invoiceNumber)) + 1
        : 1000;
    const prepared: Invoice = {
      ...invoiceInput,
      invoiceNumber: nextNumber,
      status: invoiceInput.status ?? 1,
    } as Invoice;
    setInvoices([prepared, ...invoices]);
    return prepared;
  };

  const value = useMemo<Ctx>(
    () => ({
      isLoggedIn,
      setIsLoggedIn,
      user,
      setUser,
      breadCrumbs,
      setBreadCrumbs,
      invoices,
      setInvoices,
      tenders,
      setTenders,
      quotes,
      setQuotes,
      addQuote,
      addTender,
      addInvoice,
      loginAs: (type: 1 | 2 | 3) => {
        const found = users.find((u) => u.type === type);
        if (found) {
          setUser(found);
          setIsLoggedIn(true);
        }
      },
    }),
    [isLoggedIn, user, breadCrumbs, invoices, tenders, quotes]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
