import {
  TrendingUp,
  ShoppingCart,
  Car,
  Home,
  Wifi,
} from "lucide-react";

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

export const formatMoney = (cents: number | BigInt, currency: string = "BRL") =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency }).format(Number(cents) / 100);

export const toCents = (amount: number): bigint => {
  return BigInt(Math.round(amount * 100));
};

export const toFloat = (cents: bigint): number => {
  return Number(cents) / 100;
};