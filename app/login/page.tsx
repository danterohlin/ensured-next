'use client';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AppContext } from '../context/AppContext';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const { setIsLoggedIn, setBreadCrumbs } = useContext(AppContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setBreadCrumbs([]);
  }, [setBreadCrumbs]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    // Fake delay to mimic request
    await new Promise((r) => setTimeout(r, 500));
    setIsLoggedIn(true);
    router.push('/');
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <div className="absolute left-0 top-0 right-0 bottom-0">
        <Image
          src="/bg_login.png"
          alt="Login background"
          fill
          className="object-contain scale-130 opacity-5 w-full h-full"
        />
      </div>
      {/* soft vignette */}
      {/* <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#6b1d7e]/30 blur-[120px]" />
        <div className="absolute bottom-[-200px] right-[-100px] h-[500px] w-[500px] rounded-full bg-[#2a0a35]/50 blur-[120px]" />
      </div> */}

      {/* subtle diagonal pills */}
      {/* <div className="pointer-events-none absolute inset-0 opacity-20">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-24 w-3 rounded-full bg-white/10"
            style={{
              left: `${(i * 10) % 100}%`,
              top: `${(i * 13) % 100}%`,
              transform: `rotate(35deg)`,
            }}
          />
        ))}
      </div> */}

      {/* center card */}
      <motion.div
        initial={{
          y: 10,
          opacity: 0,
        }}
        animate={{
          y: [10, 0],
          opacity: [0, 1],
        }}
        className="relative z-10 flex min-h-screen items-center justify-center p-6"
      >
        <div className="w-full max-w-md rounded-2xl bg-gradient-to-b from-[rgba(52,14,63,0.6)] to-[rgba(255,230,232,0)] p-8 shadow-2xl ring-1 ring-white/10">
          {/* brand */}
          <div className="mb-6 flex items-center gap-3">
            <div className="grid h-7 w-7 place-items-center rounded-md bg-[#a145b7] text-white shadow">
              <span className="text-lg font-extrabold">E</span>
            </div>
            <span className="text-xl font-semibold text-white">Ensured</span>
          </div>

          <form onSubmit={onSubmit} className="grid gap-4">
            {/* <label className="text-sm text-white/70">Användarnamn</label> */}
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Användarnamn"
              className="h-11 rounded-xl border border-white/10 bg-white/90 px-4 text-[#1a1a1a] outline-none placeholder:text-[#6b6b6b]"
            />

            {/* <label className="mt-2 text-sm text-white/70">Lösenord</label> */}
            <div className="flex items-center gap-3">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Lösenord"
                className="h-11 flex-1 rounded-xl border border-white/10 bg-white/90 px-4 text-[#1a1a1a] outline-none placeholder:text-[#6b6b6b]"
              />
              <button
                type="submit"
                disabled={loading}
                className="h-11 rounded-xl bg-[#a145b7] px-6 font-semibold text-white shadow-md transition-colors hover:bg-[#8d3aa0] disabled:opacity-50"
              >
                {loading ? 'Loggar in...' : 'Logga in'}
              </button>
            </div>
          </form>

          <div className="mt-6 flex items-center justify-between text-xs text-white/80">
            <Link href="#" className="hover:underline">
              Glömt lösenord?
            </Link>
            <Link href="#" className="hover:underline">
              Inte kund än?
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
