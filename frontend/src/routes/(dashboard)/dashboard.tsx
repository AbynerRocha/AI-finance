import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react';
import {
  ArrowUpRight,
  ArrowDownLeft,
  Eye,
  EyeOff,
  TrendingUp,
  ShoppingCart,
  Car,
  Home,
  Wifi,
} from "lucide-react";
import { Sidebar } from '#/components/Sidebar';
import { Header } from '#/components/Header';
import { formatMoney } from '#/utils/formatCurrency.ts';
import { Goals } from '#/components/Dashboard/Goals.tsx';
import Transactions from '#/components/Dashboard/Transactions.tsx';
import AreaChartComponent from '#/components/Dashboard/Charts/Area.tsx';
import PieChartComponent from '#/components/Dashboard/Charts/Pie.tsx';

const balanceHistory = [
  { month: "Jan", balance: 12400 },
  { month: "Fev", balance: 14200 },
  { month: "Mar", balance: 13100 },
  { month: "Abr", balance: 15800 },
  { month: "Mai", balance: 14900 },
  { month: "Jun", balance: 17300 },
  { month: "Jul", balance: 19850 },
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
  { id: 3, desc: "Restaurante Bom Sabor", date: "10 Jul", amount: -89.90, type: "debit" },
  { id: 4, desc: "Uber", date: "09 Jul", amount: -32.40, type: "debit", icon: Car },
  { id: 5, desc: "Aluguel — Julho", date: "08 Jul", amount: -2800, type: "debit", icon: Home },
  { id: 6, desc: "Freelance — Design", date: "07 Jul", amount: 1500, type: "credit", icon: TrendingUp },
  { id: 7, desc: "Netflix + Spotify", date: "06 Jul", amount: -79.90, type: "debit", icon: Wifi },
];

const goals = [
  { label: "Fundo de emergência", current: 8200, goal: 15000, color: "#5ef08a" },
  { label: "Viagem para Europa", current: 3400, goal: 12000, color: "#3bc6f0" },
  { label: "Notebook novo", current: 2100, goal: 4500, color: "#f0c65e" },
];

export const Route = createFileRoute('/(dashboard)/dashboard')({
  component: Dashboard,
})

function Dashboard() {

  const [activeNav, setActiveNav] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

        
      </main>
    </div>
  );
}

