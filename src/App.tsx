
import React, { useMemo, useState } from "react";
import {
  LayoutDashboard,
  Smartphone,
  Wallet,
  History,
  Users,
  ShoppingBag,
  LogOut,
  Menu,
  X,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  MessageCircle,
  ShieldCheck,
  Zap,
  Copy,
  Check,
  TrendingUp,
  CreditCard,
  Banknote,
  QrCode,
  Crown,
  Package,
  AlertCircle,
  ChevronRight,
  Eye,
  EyeOff,
  Sparkles,
  CircleCheck,
  Bell,
} from "lucide-react";

// ==========================================
// HOKIBLAST CONFIGURATION
// ==========================================

type Page =
  | "dashboard"
  | "whatsapp"
  | "withdraw"
  | "history"
  | "metaone";

type Commission = {
  id: number;
  amount: number;
  phone: string;
  date: string;
};

type Device = {
  id: number;
  phone: string;
  name: string;
  date: string;
  status: string;
};

type Withdrawal = {
  id: number;
  method: string;
  account: string;
  amount: number;
  date: string;
  status: string;
};

const RATE = 1500;
const MIN_WITHDRAW = 50000;
const META_PRICE = 250000;

const money = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);

const dateNow = () =>
  new Date().toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const initialCommissions: Commission[] = Array.from(
  { length: 100 },
  (_, i) => ({
    id: i + 1,
    amount: RATE,
    phone: "08••••••" + String(1000 + i).slice(-4),
    date: new Date(Date.now() - i * 60000).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }),
  })
);

const initialDevices: Device[] = [
  {
    id: 1,
    phone: "08••••••1234",
    name: "WhatsApp Personal",
    date: "13 Nov 2026",
    status: "Aktif Disewa",
  },
];

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "whatsapp", label: "Hubungkan WA", icon: Smartphone },
  { id: "withdraw", label: "Tarik Saldo", icon: Wallet },
  { id: "history", label: "Riwayat & Referral", icon: History },
  { id: "metaone", label: "Beli Meta One", icon: ShoppingBag },
] as const;

const chartValues = [25, 35, 30, 55, 45, 75, 100];
const chartLabels = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

// ==========================================
// REUSABLE COMPONENTS
// ==========================================

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-slate-950">
        <Zap size={23} fill="currentColor" />
      </div>
      <span className="text-xl font-black tracking-tight text-white">
        Hoki<span className="text-emerald-400">Blast</span>
      </span>
    </div>
  );
}

function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
  disabled = false,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "gold" | "danger";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  const styles = {
    primary:
      "bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/10",
    secondary:
      "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700",
    gold:
      "bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold shadow-lg shadow-amber-500/10",
    danger:
      "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm transition-all disabled:cursor-not-allowed disabled:opacity-40 ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-300">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
      />
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  color = "emerald",
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  color?: "emerald" | "amber" | "blue" | "purple";
}) {
  const colors = {
    emerald: "bg-emerald-500/10 text-emerald-400",
    amber: "bg-amber-500/10 text-amber-400",
    blue: "bg-blue-500/10 text-blue-400",
    purple: "bg-purple-500/10 text-purple-400",
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-slate-700">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">{title}</p>
        <div className={`rounded-xl p-3 ${colors[color]}`}>
          <Icon size={20} />
        </div>
      </div>
      <h3 className="mt-4 text-2xl font-extrabold tracking-tight text-white">
        {value}
      </h3>
      <p className="mt-2 text-xs text-slate-500">{description}</p>
    </div>
  );
}

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ==========================================
// LANDING PAGE
// ==========================================

function Landing({
  onLogin,
  onRegister,
  onBuy,
}: {
  onLogin: () => void;
  onRegister: () => void;
  onBuy: () => void;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Logo />
        <div className="flex items-center gap-3">
          <button
            onClick={onLogin}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white"
          >
            Masuk
          </button>
          <Button onClick={onRegister}>Daftar Gratis</Button>
        </div>
      </nav>

      <main>
        <section className="relative overflow-hidden px-6 pb-20 pt-20">
          <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-400">
                <Sparkles size={14} />
                Platform Penghasilan Digital
              </div>

              <h1 className="max-w-2xl text-4xl font-black leading-tight tracking-tight md:text-6xl">
                Sewakan Akun WhatsApp Anda &{" "}
                <span className="text-emerald-400">
                  Dapatkan Komisi
                </span>{" "}
                Rp 1.500 / Pesan Terkirim
              </h1>

              <p className="mt-6 max-w-xl leading-8 text-slate-400">
                Hubungkan akun WhatsApp Anda melalui proses persetujuan,
                dapatkan komisi dari aktivitas yang memenuhi ketentuan,
                dan pantau penghasilan Anda dalam satu dashboard.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button onClick={onRegister} className="px-7 py-4">
                  Mulai Menghasilkan <ArrowUpRight size={18} />
                </Button>
                <Button onClick={onLogin} variant="secondary">
                  Masuk Akun
                </Button>
              </div>

              <div className="mt-8 flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2 text-slate-400">
                  <ShieldCheck className="text-emerald-400" size={18} />
                  Kontrol akun di tangan Anda
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Zap className="text-amber-400" size={18} />
                  Minimal Withdraw Rp50.000
                </div>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-md">
              <div className="rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl shadow-emerald-950/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">
                      Total Penghasilan
                    </p>
                    <h2 className="mt-2 text-4xl font-black text-white">
                      Rp150.000
                    </h2>
                  </div>
                  <div className="rounded-2xl bg-emerald-500/10 p-4 text-emerald-400">
                    <Wallet size={28} />
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">
                      Komisi per pesan
                    </span>
                    <span className="font-bold text-emerald-400">
                      +Rp1.500
                    </span>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full w-3/4 rounded-full bg-emerald-500" />
                  </div>
                  <p className="mt-3 text-xs text-slate-500">
                    Contoh ilustrasi penghasilan pengguna
                  </p>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-slate-800 p-4">
                    <MessageCircle className="mb-2 text-emerald-400" />
                    <p className="text-xl font-bold">100</p>
                    <p className="text-xs text-slate-500">
                      Pesan terkirim
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-800 p-4">
                    <Smartphone className="mb-2 text-amber-400" />
                    <p className="text-xl font-bold">01</p>
                    <p className="text-xs text-slate-500">
                      Akun terhubung
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-5 -right-4 rounded-2xl border border-slate-700 bg-slate-800 px-5 py-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-emerald-500/20 p-2 text-emerald-400">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">
                      Komisi diterima
                    </p>
                    <p className="font-bold text-emerald-400">
                      + Rp1.500
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-24">
          <div className="mb-8">
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400">
              <Crown size={16} /> Exclusive Store
            </div>
            <h2 className="text-3xl font-black">Etalase Khusus</h2>
            <p className="mt-2 text-sm text-slate-400">
              Penawaran eksklusif untuk pengguna HokiBlast.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-amber-400/30 bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950 p-7 md:p-10">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />

            <div className="relative grid items-center gap-8 md:grid-cols-2">
              <div>
                <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-amber-400 px-3 py-1.5 text-xs font-black text-slate-950">
                  <Crown size={14} /> SPECIAL OFFER
                </div>

                <h3 className="text-3xl font-black text-white md:text-4xl">
                  2 Nomor Meta One
                </h3>

                <p className="mt-3 text-slate-400">
                  Paket spesial untuk kebutuhan bisnis dan komunikasi digital.
                </p>

                <div className="mt-6 flex items-center gap-3">
                  <span className="text-4xl font-black text-amber-400">
                    Rp250.000
                  </span>
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
                    Stok Ready
                  </span>
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  2 nomor dalam satu paket. Ketersediaan perlu dikonfirmasi
                  saat checkout.
                </p>

                <Button
                  variant="gold"
                  onClick={onBuy}
                  className="mt-7 px-7"
                >
                  Beli Sekarang <ArrowUpRight size={17} />
                </Button>
              </div>

              <div className="flex justify-center">
                <div className="relative flex h-64 w-64 items-center justify-center rounded-full border border-amber-400/20 bg-amber-400/5">
                  <div className="absolute inset-5 rounded-full border border-amber-400/20" />
                  <div className="text-center">
                    <Crown size={64} className="mx-auto text-amber-400" />
                    <p className="mt-4 text-xl font-black text-amber-300">
                      META ONE
                    </p>
                    <p className="text-xs tracking-widest text-slate-400">
                      PREMIUM PACKAGE
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-800 bg-slate-900/40 px-6 py-14">
          <div className="mx-auto grid max-w-7xl gap-8 text-center md:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: "Transparan",
                desc: "Pantau setiap komisi dan transaksi.",
              },
              {
                icon: Zap,
                title: "Praktis",
                desc: "Kelola perangkat melalui satu dashboard.",
              },
              {
                icon: Wallet,
                title: "Fleksibel",
                desc: "Ajukan penarikan sesuai ketentuan.",
              },
            ].map((item) => (
              <div key={item.title}>
                <item.icon
                  className="mx-auto text-emerald-400"
                  size={30}
                />
                <h3 className="mt-4 font-bold">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-500">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800 px-6 py-7 text-center text-xs text-slate-500">
        © 2026 HokiBlast. All rights reserved.
      </footer>
    </div>
  );
}

// ==========================================
// LOGIN & REGISTER
// ==========================================

function AuthPage({
  mode,
  setMode,
  onSuccess,
}: {
  mode: "login" | "register";
  setMode: (v: "login" | "register") => void;
  onSuccess: (name: string) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess(name.trim() || email.split("@")[0] || "Pengguna");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-white">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
          <h1 className="text-2xl font-black">
            {mode === "login" ? "Selamat Datang!" : "Buat Akun Baru"}
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            {mode === "login"
              ? "Masuk ke dashboard HokiBlast Anda."
              : "Daftar sekarang dan mulai gunakan HokiBlast."}
          </p>

          <form onSubmit={submit} className="mt-7 space-y-5">
            {mode === "register" && (
              <Input
                label="Nama Lengkap"
                value={name}
                onChange={setName}
                placeholder="Masukkan nama Anda"
              />
            )}

            <Input
              label="Email"
              value={email}
              onChange={setEmail}
              placeholder="nama@email.com"
              type="email"
            />

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Password
              </label>

              <div className="relative">
                <input
                  required
                  minLength={6}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 pr-12 text-sm text-white outline-none focus:border-emerald-500"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3 text-slate-500"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full py-4">
              {mode === "login" ? "Masuk ke Dashboard" : "Buat Akun"}
              <ChevronRight size={17} />
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            {mode === "login" ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
            <button
              onClick={() =>
                setMode(mode === "login" ? "register" : "login")
              }
              className="font-bold text-emerald-400 hover:text-emerald-300"
            >
              {mode === "login" ? "Daftar sekarang" : "Masuk"}
            </button>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-slate-600">
          Prototype frontend HokiBlast · Data simulasi
        </p>
      </div>
    </div>
  );
}

// ==========================================
// SIDEBAR NAVIGATION
// ==========================================

function Sidebar({
  page,
  setPage,
  onLogout,
  mobileOpen,
  setMobileOpen,
}: {
  page: Page;
  setPage: (v: Page) => void;
  onLogout: () => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}) {
  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-800 bg-slate-900 transition-transform lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-slate-800 px-6">
          <Logo />
          <button
            className="text-slate-400 lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-4 py-6">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            Main Menu
          </p>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = page === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setPage(item.id);
                    setMobileOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    active
                      ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/10"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <item.icon size={19} />
                  {item.label}

                  {item.id === "metaone" && (
                    <span className="ml-auto rounded-md bg-amber-400 px-2 py-0.5 text-[9px] font-black text-slate-950">
                      NEW
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-4">
          <div className="mb-4 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4">
            <div className="flex items-center gap-2 text-amber-400">
              <Crown size={17} />
              <span className="text-xs font-bold">
                Meta One Special
              </span>
            </div>

            <p className="mt-2 text-xs leading-5 text-slate-400">
              Dapatkan paket 2 nomor Meta One.
            </p>

            <button
              onClick={() => {
                setPage("metaone");
                setMobileOpen(false);
              }}
              className="mt-3 text-xs font-bold text-amber-400"
            >
              Lihat Penawaran →
            </button>
          </div>

          <button
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-400 hover:bg-red-500/10"
          >
            <LogOut size={18} /> Keluar
          </button>

          <p className="mt-4 text-center text-[10px] text-slate-600">
            HokiBlast v1.0.0
          </p>
        </div>
      </aside>
    </>
  );
}

// ==========================================
// REVENUE CHART
// ==========================================

function RevenueChart({ total }: { total: number }) {
  const values = chartValues.map(
    (v) => (v / 100) * Math.max(total, 1000)
  );

  const max = Math.max(...values, 1);

  const points = values
    .map((v, i) => {
      const x = (i / 6) * 100;
      const y = 100 - (v / max) * 85;
      return `${x},${y}`;
    })
    .join(" ");

  const area = `0,100 ${points} 100,100`;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-white">
            Grafik Pendapatan
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            7 hari terakhir
          </p>
        </div>

        <span className="rounded-lg bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-400">
          <TrendingUp className="mr-1 inline" size={14} />
          Tren pendapatan
        </span>
      </div>

      <div className="mt-8">
        <svg
          viewBox="0 0 100 110"
          className="h-52 w-full overflow-visible"
        >
          {[20, 40, 60, 80].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="100"
              y2={y}
              stroke="#334155"
              strokeDasharray="1.5 2"
              strokeWidth="0.5"
            />
          ))}

          <defs>
            <linearGradient
              id="chartGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="#10b981"
                stopOpacity="0.35"
              />
              <stop
                offset="100%"
                stopColor="#10b981"
                stopOpacity="0"
              />
            </linearGradient>
          </defs>

          <polygon points={area} fill="url(#chartGradient)" />

          <polyline
            points={points}
            fill="none"
            stroke="#10b981"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />

          {values.map((v, i) => (
            <circle
              key={i}
              cx={(i / 6) * 100}
              cy={100 - (v / max) * 85}
              r="1.5"
              fill="#34d399"
            />
          ))}
        </svg>

        <div className="mt-2 flex justify-between text-[10px] text-slate-500">
          {chartLabels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// DASHBOARD HOME
// ==========================================

function DashboardHome({
  balance,
  devices,
  commissions,
  onSimulate,
  onPage,
}: {
  balance: number;
  devices: Device[];
  commissions: Commission[];
  onSimulate: () => void;
  onPage: (p: Page) => void;
}) {
  const [showBalance, setShowBalance] = useState(true);

  const activeDevices = devices.filter(
    (d) => d.status === "Aktif Disewa"
  ).length;

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-r from-emerald-950/70 to-slate-900 p-6 md:p-8">
        <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative flex flex-wrap items-center justify-between gap-5">
          <div>
            <p className="text-sm text-emerald-300">
              Total Penghasilan Anda
            </p>

            <div className="mt-3 flex items-center gap-3">
              <h2 className="text-3xl font-black text-white md:text-4xl">
                {showBalance ? money(balance) : "••••••••"}
              </h2>

              <button
                onClick={() => setShowBalance(!showBalance)}
                className="text-slate-400 hover:text-white"
              >
                {showBalance ? (
                  <Eye size={19} />
                ) : (
                  <EyeOff size={19} />
                )}
              </button>
            </div>

            <p className="mt-3 text-xs text-slate-400">
              Penghasilan dari aktivitas yang tercatat dalam simulasi.
            </p>
          </div>

          <Button
            onClick={() => onPage("withdraw")}
            className="px-6"
          >
            <Wallet size={17} /> Tarik Saldo
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Penghasilan"
          value={money(balance)}
          description="Saldo tersedia"
          icon={Wallet}
          color="emerald"
        />

        <StatCard
          title="Akun WA Aktif"
          value={String(activeDevices)}
          description="Perangkat terhubung"
          icon={Smartphone}
          color="blue"
        />

        <StatCard
          title="Total Pesan Terkirim"
          value={String(commissions.length)}
          description={`${money(commissions.length * RATE)} total komisi`}
          icon={MessageCircle}
          color="amber"
        />

        <StatCard
          title="Rate Komisi"
          value={money(RATE)}
          description="Per pesan memenuhi ketentuan"
          icon={TrendingUp}
          color="purple"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RevenueChart total={balance} />
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div>
            <div className="flex items-center gap-2 text-emerald-400">
              <Zap size={20} />
              <span className="text-sm font-bold">
                Simulasi Komisi
              </span>
            </div>

            <h3 className="mt-5 text-xl font-bold text-white">
              Tambahkan penghasilan
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Demonstrasikan satu aktivitas pesan yang memenuhi
              ketentuan untuk menambahkan komisi ke saldo.
            </p>

            <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <p className="text-xs text-slate-400">
                Komisi simulasi
              </p>
              <p className="mt-1 text-2xl font-black text-emerald-400">
                +Rp1.500
              </p>
            </div>
          </div>

          <Button onClick={onSimulate} className="mt-6 w-full">
            <Plus size={18} /> Simulasi Pesan Terkirim
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white">
              Aktivitas Terbaru
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Riwayat komisi terbaru Anda
            </p>
          </div>

          <button
            onClick={() => onPage("history")}
            className="text-xs font-bold text-emerald-400"
          >
            Lihat Semua →
          </button>
        </div>

        {commissions.slice(0, 4).map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border-t border-slate-800 py-4"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-400">
                <ArrowDownLeft size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  Komisi Pesan #{item.id}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {item.date}
                </p>
              </div>
            </div>

            <span className="text-sm font-bold text-emerald-400">
              +{money(item.amount)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// QR CODE ILLUSTRATION
// ==========================================

function FakeQR() {
  const cells = useMemo(
    () =>
      Array.from({ length: 225 }, (_, i) => {
        const x = i % 15;
        const y = Math.floor(i / 15);

        const inFinder = (ox: number, oy: number) =>
          x >= ox &&
          x < ox + 5 &&
          y >= oy &&
          y < oy + 5;

        if (
          inFinder(0, 0) ||
          inFinder(10, 0) ||
          inFinder(0, 10)
        ) {
          const ox = x < 5 ? 0 : x >= 10 && y < 5 ? 10 : 0;
          const oy = y < 5 ? 0 : 10;

          const dx = x - ox;
          const dy = y - oy;

          return (
            dx === 0 ||
            dx === 4 ||
            dy === 0 ||
            dy === 4 ||
            (dx === 2 && dy === 2)
          );
        }

        return (x * 7 + y * 13 + x * y) % 5 < 2;
      }),
    []
  );

  return (
    <div className="mx-auto grid h-52 w-52 grid-cols-[repeat(15,minmax(0,1fr))] grid-rows-[repeat(15,minmax(0,1fr))] gap-[2px] rounded-xl bg-white p-3">
      {cells.map((filled, i) => (
        <div
          key={i}
          className={`rounded-[1px] ${
            filled ? "bg-slate-950" : "bg-white"
          }`}
        />
      ))}
    </div>
  );
}

// ==========================================
// WHATSAPP CONNECTION PAGE
// ==========================================

function WhatsAppPage({
  devices,
  onAddDevice,
}: {
  devices: Device[];
  onAddDevice: (phone: string) => void;
}) {
  const [qrOpen, setQrOpen] = useState(false);
  const [simulatedPhone, setSimulatedPhone] =
    useState("081234567890");
  const [success, setSuccess] = useState(false);

  const scanSuccess = () => {
    onAddDevice(simulatedPhone);
    setSuccess(true);
    setQrOpen(false);
    setTimeout(() => setSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white">
            Hubungkan WhatsApp
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Kelola perangkat yang terhubung dengan persetujuan pemilik.
          </p>
        </div>

        <Button onClick={() => setQrOpen(true)}>
          <Plus size={18} /> Tambah Akun WA
        </Button>
      </div>

      {success && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-400">
          <CircleCheck size={20} />
          Simulasi koneksi berhasil. Perangkat ditambahkan ke daftar.
        </div>
      )}

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-bold text-white">Daftar Perangkat</h3>
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
            {devices.length} Perangkat
          </span>
        </div>

        {devices.length === 0 ? (
          <div className="py-14 text-center">
            <Smartphone
              className="mx-auto text-slate-600"
              size={42}
            />
            <p className="mt-4 font-semibold text-slate-300">
              Belum ada perangkat
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Klik Tambah Akun WA untuk mencoba simulasi.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead className="text-xs text-slate-500">
                <tr className="border-b border-slate-800">
                  <th className="pb-4">Perangkat</th>
                  <th className="pb-4">Nomor</th>
                  <th className="pb-4">Tanggal</th>
                  <th className="pb-4">Status</th>
                </tr>
              </thead>

              <tbody>
                {devices.map((device) => (
                  <tr
                    key={device.id}
                    className="border-b border-slate-800/70"
                  >
                    <td className="py-5 font-semibold text-white">
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-400">
                          <Smartphone size={19} />
                        </div>
                        {device.name}
                      </div>
                    </td>

                    <td className="py-5 text-slate-300">
                      {device.phone}
                    </td>

                    <td className="py-5 text-slate-400">
                      {device.date}
                    </td>

                    <td className="py-5">
                      <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                        {device.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {qrOpen && (
        <Modal
          title="Simulasi Hubungkan Perangkat"
          onClose={() => setQrOpen(false)}
        >
          <div className="text-center">
            <div className="mx-auto mb-4 w-fit rounded-full bg-emerald-500/10 p-4 text-emerald-400">
              <QrCode size={30} />
            </div>

            <h4 className="font-bold text-white">
              Simulasi QR Code
            </h4>

            <p className="mt-2 text-xs leading-5 text-slate-400">
              Visual QR berikut hanya ilustrasi dan tidak dapat
              digunakan untuk login ke WhatsApp.
            </p>

            <div className="my-6">
              <FakeQR />
            </div>

            <Input
              label="Nomor WhatsApp simulasi"
              value={simulatedPhone}
              onChange={setSimulatedPhone}
              placeholder="08xxxxxxxxxx"
            />

            <Button
              className="mt-5 w-full"
              disabled={
                simulatedPhone.replace(/\D/g, "").length < 10
              }
              onClick={scanSuccess}
            >
              <Check size={18} /> Simulasi Scan Berhasil
            </Button>

            <p className="mt-4 text-[10px] text-slate-500">
              Tidak membuat koneksi atau sesi WhatsApp sungguhan.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ==========================================
// WITHDRAW PAGE
// ==========================================

function WithdrawPage({
  balance,
  onWithdraw,
  withdrawals,
}: {
  balance: number;
  onWithdraw: (data: {
    method: string;
    account: string;
    amount: number;
  }) => void;
  withdrawals: Withdrawal[];
}) {
  const [category, setCategory] = useState("Bank");
  const [method, setMethod] = useState("BCA");
  const [account, setAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const numericAmount = Number(amount);

  const error =
    amount !== "" && numericAmount < MIN_WITHDRAW
      ? "Minimal penarikan adalah Rp50.000."
      : amount !== "" && numericAmount > balance
        ? "Saldo Anda tidak mencukupi."
        : "";

  const valid =
    amount !== "" &&
    Number.isFinite(numericAmount) &&
    numericAmount >= MIN_WITHDRAW &&
    numericAmount <= balance &&
    numericAmount % 1000 === 0 &&
    account.trim().length >= 5;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!valid) return;

    onWithdraw({
      method,
      account,
      amount: numericAmount,
    });

    setAmount("");
    setAccount("");
    setSubmitted(true);
  };

  const methods =
    category === "Bank"
      ? ["BCA", "BRI", "Mandiri"]
      : ["DANA", "GoPay", "OVO"];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-white">
          Tarik Saldo
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Cairkan penghasilan Anda melalui bank atau e-wallet.
        </p>
      </div>

      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
        <p className="text-sm text-slate-400">Saldo tersedia</p>
        <h3 className="mt-2 text-3xl font-black text-emerald-400">
          {money(balance)}
        </h3>
        <p className="mt-2 text-xs text-slate-500">
          Minimal penarikan: {money(MIN_WITHDRAW)}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-6"
        >
          <h3 className="font-bold text-white">
            Form Penarikan
          </h3>

          <div>
            <label className="mb-3 block text-sm font-medium text-slate-300">
              Jenis Penarikan
            </label>

            <div className="grid grid-cols-2 gap-3">
              {["Bank", "E-Wallet"].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => {
                    setCategory(v);
                    setMethod(v === "Bank" ? "BCA" : "DANA");
                  }}
                  className={`rounded-xl border p-3 text-sm font-semibold ${
                    category === v
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                      : "border-slate-700 text-slate-400"
                  }`}
                >
                  {v === "Bank" ? (
                    <Banknote
                      className="mx-auto mb-2"
                      size={20}
                    />
                  ) : (
                    <Wallet
                      className="mx-auto mb-2"
                      size={20}
                    />
                  )}
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">
              Pilih {category}
            </label>

            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-emerald-500"
            >
              {methods.map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </div>

          <Input
            label={
              category === "Bank"
                ? "Nomor Rekening"
                : "Nomor E-Wallet"
            }
            value={account}
            onChange={setAccount}
            placeholder="Masukkan nomor rekening"
          />

          <Input
            label="Nominal Penarikan (Rp)"
            value={amount}
            onChange={(v) => setAmount(v.replace(/\D/g, ""))}
            placeholder="Contoh: 50000"
            type="text"
          />

          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs leading-5 text-red-400">
              <AlertCircle size={17} className="shrink-0" />
              {error}
            </div>
          )}

          {amount !== "" &&
            !error &&
            numericAmount % 1000 !== 0 && (
              <div className="text-xs text-amber-400">
                Nominal harus merupakan kelipatan Rp1.000.
              </div>
            )}

          {amount !== "" &&
            !error &&
            numericAmount % 1000 === 0 && (
              <div className="rounded-xl bg-slate-800 p-3 text-xs text-slate-300">
                Nominal penarikan:{" "}
                <span className="font-bold text-white">
                  {money(numericAmount)}
                </span>
              </div>
            )}

          {submitted && (
            <div className="rounded-xl bg-emerald-500/10 p-3 text-xs text-emerald-400">
              Permintaan penarikan berhasil dicatat dalam simulasi.
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={!valid}
          >
            <ArrowUpRight size={18} /> Ajukan Penarikan
          </Button>

          <p className="text-center text-[10px] text-slate-600">
            Prototype: permintaan tidak dikirim ke bank atau penyedia
            pembayaran.
          </p>
        </form>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="mb-5 font-bold text-white">
            Riwayat Withdraw
          </h3>

          {withdrawals.length === 0 ? (
            <div className="py-12 text-center">
              <History
                className="mx-auto text-slate-600"
                size={36}
              />
              <p className="mt-3 text-sm text-slate-400">
                Belum ada penarikan.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {withdrawals.map((w) => (
                <div
                  key={w.id}
                  className="rounded-xl border border-slate-800 p-4"
                >
                  <div className="flex justify-between gap-3">
                    <div>
                      <p className="font-bold text-white">
                        {w.method}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {w.account}
                      </p>
                    </div>

                    <p className="font-bold text-white">
                      {money(w.amount)}
                    </p>
                  </div>

                  <div className="mt-3 flex justify-between text-xs text-slate-500">
                    <span>{w.date}</span>
                    <span className="text-amber-400">
                      {w.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// HISTORY & REFERRAL PAGE
// ==========================================

function HistoryPage({
  commissions,
  onCopy,
  copied,
}: {
  commissions: Commission[];
  onCopy: () => void;
  copied: boolean;
}) {
  const [filter, setFilter] = useState("Semua");

  const displayed = commissions.filter((item) => {
    if (filter === "Terbaru") {
      return item.id >= commissions.length - 9;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-white">
          Riwayat Komisi
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Pantau seluruh pemasukan dari aktivitas yang tercatat.
        </p>
      </div>

      <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-950/60 to-slate-900 p-6">
        <div className="flex items-center gap-2 text-emerald-400">
          <Users size={20} />
          <span className="font-bold">Program Referral</span>
        </div>

        <h3 className="mt-3 text-2xl font-black text-white">
          Dapatkan Komisi Tambahan 10%
        </h3>

        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
          Bagikan link referral Anda. Komisi referral pada prototype
          ini merupakan ilustrasi dan belum terhubung dengan sistem
          atribusi pengguna.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl border border-slate-700 bg-slate-950/70 p-3">
          <span className="min-w-0 flex-1 truncate text-xs text-slate-400">
            https://hokiblast.example/ref/USER2026
          </span>

          <Button onClick={onCopy} variant="secondary">
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "Tersalin" : "Salin Link"}
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-white">
              Riwayat Komisi Masuk
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Total {commissions.length} aktivitas
            </p>
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
          >
            <option>Semua</option>
            <option>Terbaru</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[580px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-xs text-slate-500">
                <th className="pb-4">ID</th>
                <th className="pb-4">Aktivitas</th>
                <th className="pb-4">Perangkat</th>
                <th className="pb-4">Tanggal</th>
                <th className="pb-4 text-right">Komisi</th>
              </tr>
            </thead>

            <tbody>
              {displayed.slice(0, 100).map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-slate-800/60"
                >
                  <td className="py-4 text-slate-500">
                    #{item.id}
                  </td>
                  <td className="py-4 font-semibold text-white">
                    Pesan terkirim
                  </td>
                  <td className="py-4 text-slate-400">
                    {item.phone}
                  </td>
                  <td className="py-4 text-slate-500">
                    {item.date}
                  </td>
                  <td className="py-4 text-right font-bold text-emerald-400">
                    +{money(item.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// META ONE STORE
// ==========================================

function MetaOnePage({ onBuy }: { onBuy: () => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-white">
          Meta One Store
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Paket nomor spesial HokiBlast.
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-amber-400/30 bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950">
        <div className="grid items-center gap-8 p-7 md:grid-cols-2 md:p-10">
          <div>
            <span className="rounded-full bg-amber-400 px-3 py-1.5 text-[10px] font-black text-slate-950">
              EXCLUSIVE PACKAGE
            </span>

            <h3 className="mt-6 text-4xl font-black text-white">
              2 Nomor
              <br />
              <span className="text-amber-400">Meta One</span>
            </h3>

            <p className="mt-4 text-sm leading-7 text-slate-400">
              Satu paket spesial berisi dua nomor. Detail ketersediaan,
              kelayakan, dan ketentuan produk harus dikonfirmasi sebelum
              transaksi sebenarnya.
            </p>

            <div className="mt-7 flex items-center gap-3">
              <span className="text-4xl font-black text-amber-400">
                Rp250.000
              </span>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm text-emerald-400">
              <CircleCheck size={17} />
              Stok ready (data demo)
            </div>

            <Button
              variant="gold"
              onClick={onBuy}
              className="mt-7 px-8"
            >
              <ShoppingBag size={18} /> Pesan Sekarang
            </Button>
          </div>

          <div className="flex justify-center">
            <div className="flex h-64 w-64 items-center justify-center rounded-full border border-amber-400/30 bg-amber-400/5">
              <div className="text-center">
                <Crown
                  size={70}
                  className="mx-auto text-amber-400"
                />
                <p className="mt-4 text-2xl font-black text-amber-300">
                  META ONE
                </p>
                <p className="mt-2 text-xs tracking-[0.3em] text-slate-400">
                  TWO NUMBERS
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            icon: Package,
            title: "2 Nomor",
            text: "Dua nomor dalam satu paket.",
          },
          {
            icon: CreditCard,
            title: "Pembayaran",
            text: "Simulasi QRIS atau konfirmasi.",
          },
          {
            icon: ShieldCheck,
            title: "Konfirmasi",
            text: "Detail produk perlu diverifikasi.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
          >
            <item.icon className="text-amber-400" size={23} />
            <h4 className="mt-4 font-bold text-white">
              {item.title}
            </h4>
            <p className="mt-2 text-xs text-slate-500">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// CHECKOUT MODAL
// ==========================================

function CheckoutModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const [method, setMethod] = useState("QRIS");
  const [paid, setPaid] = useState(false);
  const [contact, setContact] = useState("");

  return (
    <Modal title="Checkout Meta One" onClose={onClose}>
      {paid ? (
        <div className="py-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
            <CircleCheck size={35} />
          </div>

          <h3 className="mt-5 text-xl font-black text-white">
            Simulasi Berhasil!
          </h3>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            Permintaan checkout demo sudah dicatat. Belum ada pembayaran
            atau pesanan sungguhan yang dibuat.
          </p>

          <Button className="mt-6 w-full" onClick={onClose}>
            Selesai
          </Button>
        </div>
      ) : (
        <>
          <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-white">
                  2 Nomor Meta One
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Paket eksklusif
                </p>
              </div>
              <Crown className="text-amber-400" size={26} />
            </div>

            <div className="mt-4 border-t border-amber-400/10 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">
                  Total pembayaran
                </span>
                <span className="font-black text-amber-400">
                  {money(META_PRICE)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <label className="text-sm font-semibold text-slate-300">
              Metode Pembayaran
            </label>

            {["QRIS", "Konfirmasi WhatsApp"].map((v) => (
              <button
                key={v}
                onClick={() => setMethod(v)}
                className={`flex w-full items-center justify-between rounded-xl border p-4 text-sm ${
                  method === v
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                    : "border-slate-700 text-slate-400"
                }`}
              >
                <span className="flex items-center gap-3">
                  {v === "QRIS" ? (
                    <QrCode size={19} />
                  ) : (
                    <MessageCircle size={19} />
                  )}
                  {v}
                </span>

                {method === v && <Check size={18} />}
              </button>
            ))}
          </div>

          <div className="mt-5">
            <Input
              label="Nomor WhatsApp / Kontak"
              value={contact}
              onChange={setContact}
              placeholder="08xxxxxxxxxx"
            />
          </div>

          {method === "QRIS" && (
            <div className="mt-5 rounded-xl border border-slate-700 bg-slate-950 p-5 text-center">
              <QrCode
                className="mx-auto text-emerald-400"
                size={30}
              />

              <p className="mt-3 text-sm font-bold text-white">
                QRIS Demo
              </p>

              <div className="mx-auto mt-3 w-fit rounded-xl bg-white p-3">
                <FakeQR />
              </div>

              <p className="mt-3 text-[10px] text-slate-500">
                QR ilustrasi, bukan kode pembayaran aktif.
              </p>
            </div>
          )}

          {method === "Konfirmasi WhatsApp" && (
            <div className="mt-5 rounded-xl bg-slate-800 p-4 text-xs leading-6 text-slate-400">
              Permintaan konfirmasi hanya dicatat dalam simulasi.
              Tidak ada pesan WhatsApp yang dikirim otomatis.
            </div>
          )}

          <Button
            className="mt-6 w-full"
            disabled={
              contact.replace(/\D/g, "").length < 10
            }
            onClick={() => setPaid(true)}
          >
            {method === "QRIS" ? (
              <>
                <Check size={17} />
                Simulasikan Konfirmasi Pembayaran
              </>
            ) : (
              <>
                <MessageCircle size={17} />
                Simulasikan Permintaan
              </>
            )}
          </Button>
        </>
      )}
    </Modal>
  );
}

// ==========================================
// MAIN APPLICATION - HOKIBLAST
// ==========================================

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] =
    useState<"login" | "register">("login");

  const [userName, setUserName] = useState("Admin HokiBlast");
  const [page, setPage] = useState<Page>("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const [balance, setBalance] = useState(150000);
  const [devices, setDevices] =
    useState<Device[]>(initialDevices);
  const [commissions, setCommissions] =
    useState<Commission[]>(initialCommissions);
  const [withdrawals, setWithdrawals] =
    useState<Withdrawal[]>([]);

  const [copied, setCopied] = useState(false);

  // SIMULASI KOMISI PESAN
  const simulateMessage = () => {
    const item: Commission = {
      id: commissions.length + 1,
      amount: RATE,
      phone: "08••••••1234",
      date: dateNow(),
    };

    setCommissions((prev) => [item, ...prev]);
    setBalance((prev) => prev + RATE);
  };

  // TAMBAH PERANGKAT WHATSAPP
  const addDevice = (phone: string) => {
    const clean = phone.replace(/\D/g, "");

    const masked =
      clean.slice(0, 4) +
      "••••" +
      clean.slice(-4);

    setDevices((prev) => [
      ...prev,
      {
        id: Date.now(),
        phone: masked,
        name: "WhatsApp Personal",
        date: dateNow(),
        status: "Aktif Disewa",
      },
    ]);
  };

  // PROSES WITHDRAW
  const withdraw = (data: {
    method: string;
    account: string;
    amount: number;
  }) => {
    if (
      data.amount < MIN_WITHDRAW ||
      data.amount > balance ||
      data.amount % 1000 !== 0
    ) {
      return;
    }

    setBalance((prev) => prev - data.amount);

    setWithdrawals((prev) => [
      {
        id: Date.now(),
        method: data.method,
        account: data.account,
        amount: data.amount,
        date: dateNow(),
        status: "Menunggu (Demo)",
      },
      ...prev,
    ]);
  };

  // SALIN LINK REFERRAL
  const copyReferral = async () => {
    const link =
      "https://hokiblast.example/ref/USER2026";

    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Salin link referral:", link);
    }
  };

  // LOGOUT
  const logout = () => {
    setAuthenticated(false);
    setShowAuth(false);
    setPage("dashboard");
    setMobileOpen(false);
  };

  // LANDING PAGE / AUTHENTICATION
  if (!authenticated) {
    return (
      <>
        {showAuth ? (
          <AuthPage
            mode={authMode}
            setMode={setAuthMode}
            onSuccess={(name) => {
              setUserName(name);
              setAuthenticated(true);
              setShowAuth(false);
              setPage("dashboard");
            }}
          />
        ) : (
          <Landing
            onLogin={() => {
              setAuthMode("login");
              setShowAuth(true);
            }}
            onRegister={() => {
              setAuthMode("register");
              setShowAuth(true);
            }}
            onBuy={() => setCheckoutOpen(true)}
          />
        )}

        {checkoutOpen && (
          <CheckoutModal
            onClose={() => setCheckoutOpen(false)}
          />
        )}
      </>
    );
  }

  // MAIN DASHBOARD
  return (
    <>
      <div className="flex min-h-screen bg-slate-950 text-white">
        <Sidebar
          page={page}
          setPage={setPage}
          onLogout={logout}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        <div className="min-w-0 flex-1">
          {/* HEADER */}
          <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-800 bg-slate-950/90 px-5 backdrop-blur-xl md:px-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="rounded-xl border border-slate-800 p-2 text-slate-300 lg:hidden"
              >
                <Menu size={20} />
              </button>

              <div>
                <h1 className="text-sm font-bold md:text-base">
                  {
                    navItems.find(
                      (item) => item.id === page
                    )?.label
                  }
                </h1>

                <p className="hidden text-[10px] text-slate-500 sm:block">
                  Selamat datang di HokiBlast Dashboard
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-xs text-slate-500">
                  Total Penghasilan
                </p>
                <p className="text-sm font-black text-emerald-400">
                  {money(balance)}
                </p>
              </div>

              <button className="relative rounded-xl border border-slate-800 p-2.5 text-slate-400">
                <Bell size={18} />
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </button>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 font-black text-slate-950">
                {userName.charAt(0).toUpperCase()}
              </div>
            </div>
          </header>

          {/* CONTENT */}
          <main className="mx-auto max-w-[1500px] space-y-6 p-5 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">
                  Halo, {userName} 👋
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Kelola aktivitas dan penghasilan Anda hari ini.
                </p>
              </div>

              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-[10px] font-semibold text-emerald-400">
                FRONTEND DEMO
              </span>
            </div>

            {/* DASHBOARD */}
            {page === "dashboard" && (
              <DashboardHome
                balance={balance}
                devices={devices}
                commissions={commissions}
                onSimulate={simulateMessage}
                onPage={setPage}
              />
            )}

            {/* WHATSAPP */}
            {page === "whatsapp" && (
              <WhatsAppPage
                devices={devices}
                onAddDevice={addDevice}
              />
            )}

            {/* WITHDRAW */}
            {page === "withdraw" && (
              <WithdrawPage
                balance={balance}
                onWithdraw={withdraw}
                withdrawals={withdrawals}
              />
            )}

            {/* HISTORY & REFERRAL */}
            {page === "history" && (
              <HistoryPage
                commissions={commissions}
                onCopy={copyReferral}
                copied={copied}
              />
            )}

            {/* META ONE STORE */}
            {page === "metaone" && (
              <MetaOnePage
                onBuy={() => setCheckoutOpen(true)}
              />
            )}

            <footer className="border-t border-slate-800 pt-6 text-center text-[10px] text-slate-600">
              © 2026 HokiBlast · Frontend Prototype · Semua transaksi
              merupakan simulasi.
            </footer>
          </main>
        </div>
      </div>

      {/* CHECKOUT MODAL */}
      {checkoutOpen && (
        <CheckoutModal
          onClose={() => setCheckoutOpen(false)}
        />
      )}
    </>
  );
}
export default App;
