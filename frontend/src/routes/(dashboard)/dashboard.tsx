import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Target,
  Eye,
  EyeOff,
  TrendingUp,
  ShoppingCart,
  Utensils,
  Car,
  Home,
  Wifi,
  ChevronRight
} from "lucide-react";
import { Sidebar } from '#/components/Sidebar';
import { Header } from '#/components/Header';

const balanceHistory = [
  { month: "Jan", saldo: 12400 },
  { month: "Fev", saldo: 14200 },
  { month: "Mar", saldo: 13100 },
  { month: "Abr", saldo: 15800 },
  { month: "Mai", saldo: 14900 },
  { month: "Jun", saldo: 17300 },
  { month: "Jul", saldo: 19850 },
];

const spendingData = [
  { name: "Moradia", value: 2800, color: "#5ef08a" },
  { name: "Alimentação", value: 1200, color: "#3bc6f0" },
  { name: "Transporte", value: 680, color: "#f0c65e" },
  { name: "Lazer", value: 450, color: "#f0855e" },
  { name: "Outros", value: 320, color: "#b45ef0" },
];

const transactions = [
  { id: 1, desc: "Salário — Empresa XYZ", date: "11 Jul", amount: 7800, type: "credit", icon: TrendingUp },
  { id: 2, desc: "Supermercado Pão de Açúcar", date: "10 Jul", amount: -234.50, type: "debit", icon: ShoppingCart },
  { id: 3, desc: "Restaurante Bom Sabor", date: "10 Jul", amount: -89.90, type: "debit", icon: Utensils },
  { id: 4, desc: "Uber", date: "09 Jul", amount: -32.40, type: "debit", icon: Car },
  { id: 5, desc: "Aluguel — Julho", date: "08 Jul", amount: -2800, type: "debit", icon: Home },
  { id: 6, desc: "Freelance — Design", date: "07 Jul", amount: 1500, type: "credit", icon: TrendingUp },
  { id: 7, desc: "Netflix + Spotify", date: "06 Jul", amount: -79.90, type: "debit", icon: Wifi },
];

const goals = [
  { label: "Fundo de emergência", current: 8200, target: 15000, color: "#5ef08a" },
  { label: "Viagem para Europa", current: 3400, target: 12000, color: "#3bc6f0" },
  { label: "Notebook novo", current: 2100, target: 4500, color: "#f0c65e" },
];

export const Route = createFileRoute('/(dashboard)/dashboard')({
  component: Dashboard,
})

function Dashboard() {
  const fmt = (n: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [hideBalance, setHideBalance] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const mask = (val: string) => (hideBalance ? "R$ ••••••" : val);

  function handleLogout() {

  }

  return (
    <div className="min-h-screen bg-background flex">

      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        handleLogout={handleLogout}
        setSidebarOpen={setSidebarOpen}
      />
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm lg:hidden"
        />
      )}
      {/* Main */}
      <main className="flex-1 min-w-0 flex flex-col overflow-hidden">

        {/* Top bar */}
        <Header
          setSidebarOpen={setSidebarOpen}
        />

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 space-y-4 md:space-y-6 max-w-6xl w-full mx-auto">

            {/* KPI cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {/* Main balance — spans 2 cols from sm up */}
              <div className="sm:col-span-2 bg-card border border-border rounded-xl p-4 md:p-5 relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3 md:mb-4">
                    <p className="text-xs text-muted-foreground tracking-wider uppercase" style={{ fontFamily: "DM Mono, monospace" }}>
                      Saldo disponível
                    </p>
                    <button
                      onClick={() => setHideBalance(!hideBalance)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {hideBalance ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  <p
                    className="text-3xl sm:text-4xl text-foreground mb-1 break-all"
                    style={{ fontFamily: "Instrument Serif, serif" }}
                  >
                    {mask(fmt(19850))}
                  </p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="flex items-center gap-1 text-primary text-xs font-medium">
                      <TrendingUp size={12} />
                      +14.7%
                    </span>
                    <span className="text-muted-foreground text-xs">vs. mês anterior</span>
                  </div>
                </div>
              </div>

              {/* Income */}
              <div className="bg-card border border-border rounded-xl p-4 md:p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-muted-foreground tracking-wider uppercase" style={{ fontFamily: "DM Mono, monospace" }}>
                    Receitas
                  </p>
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <ArrowDownLeft size={15} className="text-primary" />
                  </div>
                </div>
                <p className="text-xl md:text-2xl font-light text-foreground" style={{ fontFamily: "DM Mono, monospace" }}>
                  {mask(fmt(9300))}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Este mês</p>
              </div>

              {/* Expenses */}
              <div className="bg-card border border-border rounded-xl p-4 md:p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-muted-foreground tracking-wider uppercase" style={{ fontFamily: "DM Mono, monospace" }}>
                    Gastos
                  </p>
                  <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                    <ArrowUpRight size={15} className="text-destructive" />
                  </div>
                </div>
                <p className="text-xl md:text-2xl font-light text-foreground" style={{ fontFamily: "DM Mono, monospace" }}>
                  {mask(fmt(5450))}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Este mês</p>
              </div>
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {/* Area chart — full width on mobile, 2/3 on lg+ */}
              <div className="md:col-span-2 bg-card border border-border rounded-xl p-4 md:p-5">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <div>
                    <p className="text-sm font-medium text-foreground">Evolução do saldo</p>
                    <p className="text-xs text-muted-foreground">Últimos 7 meses</p>
                  </div>
                  <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-md" style={{ fontFamily: "DM Mono, monospace" }}>
                    +60% YTD
                  </span>
                </div>
                {/* Mobile: taller chart, no Y axis */}
                <div className="block md:hidden">
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={balanceHistory} margin={{ top: 4, right: 4, left: -32, bottom: 0 }}>
                      <defs>
                        <linearGradient id="balGradMob" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#5ef08a" stopOpacity={0.35} />
                          <stop offset="100%" stopColor="#5ef08a" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="month"
                        tick={{ fill: "#6b9478", fontSize: 11, fontFamily: "DM Mono, monospace" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis hide />
                      <Tooltip
                        contentStyle={{ background: "#112418", border: "1px solid rgba(94,240,138,0.15)", borderRadius: 8, color: "#e8f0e9", fontSize: 12 }}
                        formatter={(v) => [fmt(parseInt(v?.toString() || '0')), "Saldo"]}
                      />
                      <Area type="monotone" dataKey="saldo" stroke="#5ef08a" strokeWidth={2.5} fill="url(#balGradMob)" dot={false} activeDot={{ r: 5, fill: "#5ef08a" }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                {/* Desktop: standard */}
                <div className="hidden md:block">
                  <ResponsiveContainer width="100%" height={160}>
                    <AreaChart data={balanceHistory} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#5ef08a" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="#5ef08a" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="month"
                        tick={{ fill: "#6b9478", fontSize: 10, fontFamily: "DM Mono, monospace" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: "#6b9478", fontSize: 9, fontFamily: "DM Mono, monospace" }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                      />
                      <Tooltip
                        contentStyle={{ background: "#112418", border: "1px solid rgba(94,240,138,0.15)", borderRadius: 8, color: "#e8f0e9", fontSize: 12 }}
                        formatter={(v) => [fmt(parseInt(v?.toString() || '0')), "Saldo"]}
                      />
                      <Area type="monotone" dataKey="saldo" stroke="#5ef08a" strokeWidth={2} fill="url(#balGrad)" dot={false} activeDot={{ r: 4, fill: "#5ef08a" }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pie chart */}
              <div className="bg-card border border-border rounded-xl p-4 md:p-5">
                <p className="text-sm font-medium text-foreground mb-1">Gastos por categoria</p>
                <p className="text-xs text-muted-foreground mb-3">Julho 2026</p>
                {/* Mobile: pie larger, legend below */}
                <div className="flex flex-col items-center gap-4 md:hidden">
                  <PieChart width={180} height={180}>
                    <Pie data={spendingData} cx={90} cy={90} innerRadius={52} outerRadius={80} paddingAngle={2} dataKey="value">
                      {spendingData.map((_entry, i) => (
                        <Cell key={`cell-mob-${i}`} fill={spendingData[i].color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: "#112418", border: "1px solid rgba(94,240,138,0.15)", borderRadius: 8, color: "#e8f0e9", fontSize: 11 }}
                      formatter={(v) => [fmt(parseInt(v?.toString() || '0')), "Saldo"]}
                    />
                  </PieChart>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 w-full px-2">
                    {spendingData.map((d) => (
                      <div key={d.name} className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                        <span className="text-xs text-muted-foreground truncate">{d.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Desktop: pie + legend side by side */}
                <div className="hidden md:flex items-center gap-4">
                  <div className="shrink-0">
                    <PieChart width={120} height={120}>
                      <Pie data={spendingData} cx={60} cy={60} innerRadius={36} outerRadius={54} paddingAngle={2} dataKey="value">
                        {spendingData.map((_entry, i) => (
                          <Cell key={`cell-${i}`} fill={spendingData[i].color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ background: "#112418", border: "1px solid rgba(94,240,138,0.15)", borderRadius: 8, color: "#e8f0e9", fontSize: 11 }}
                        formatter={(v) => [fmt(parseInt(v?.toString() || '0')), "Saldo"]}
                      />
                    </PieChart>
                  </div>
                  <div className="flex-1 space-y-2 min-w-0">
                    {spendingData.map((d) => (
                      <div key={d.name} className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: d.color }} />
                          <span className="text-xs text-muted-foreground truncate">{d.name}</span>
                        </div>
                        <span className="text-xs shrink-0" style={{ fontFamily: "DM Mono, monospace", color: d.color }}>
                          {fmt(d.value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom row */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 md:gap-4">
              {/* Transactions */}
              <div className="lg:col-span-3 bg-card border border-border rounded-xl p-4 md:p-5">
                <div className="flex items-center justify-between mb-4 md:mb-5">
                  <div>
                    <p className="text-sm font-medium text-foreground">Últimas transações</p>
                    <p className="text-xs text-muted-foreground">Julho 2026</p>
                  </div>
                  <button className="text-xs text-primary flex items-center gap-1 hover:text-primary/80 transition-colors">
                    Ver todas <ChevronRight size={12} />
                  </button>
                </div>
                <div className="space-y-0.5">
                  {transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-secondary/50 transition-colors"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${tx.type === "credit" ? "bg-primary/10" : "bg-secondary"}`}>
                        <tx.icon size={14} className={tx.type === "credit" ? "text-primary" : "text-muted-foreground"} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{tx.desc}</p>
                        <p className="text-xs text-muted-foreground">{tx.date}</p>
                      </div>
                      <span
                        className={`text-xs sm:text-sm font-medium shrink-0 ${tx.type === "credit" ? "text-primary" : "text-foreground"}`}
                        style={{ fontFamily: "DM Mono, monospace" }}
                      >
                        {tx.type === "credit" ? "+" : ""}{fmt(tx.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Goals */}
              <div className="lg:col-span-2 bg-card border border-border rounded-xl p-4 md:p-5">
                <div className="flex items-center justify-between mb-4 md:mb-5">
                  <div>
                    <p className="text-sm font-medium text-foreground">Metas financeiras</p>
                    <p className="text-xs text-muted-foreground">3 em progresso</p>
                  </div>
                  <Target size={16} className="text-muted-foreground" />
                </div>
                <div className="space-y-4 md:space-y-5">
                  {goals.map((g) => {
                    const pct = Math.round((g.current / g.target) * 100);
                    return (
                      <div key={g.label}>
                        <div className="flex items-center justify-between mb-1.5">
                          <p className="text-xs font-medium text-foreground">{g.label}</p>
                          <span className="text-xs" style={{ fontFamily: "DM Mono, monospace", color: g.color }}>
                            {pct}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${pct}%`, background: g.color }}
                          />
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-muted-foreground" style={{ fontFamily: "DM Mono, monospace" }}>
                            {fmt(g.current)}
                          </span>
                          <span className="text-xs text-muted-foreground" style={{ fontFamily: "DM Mono, monospace" }}>
                            {fmt(g.target)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-5 border border-dashed border-border rounded-lg p-4 flex items-center justify-between hover:border-primary/40 transition-colors cursor-pointer group">
                  <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">Nova meta</p>
                  <div className="w-6 h-6 rounded-full border border-border group-hover:border-primary group-hover:text-primary flex items-center justify-center text-muted-foreground transition-colors text-xs">
                    +
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

