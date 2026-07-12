export const formatMoney = (cents: number, currency: string = "BRL") =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency }).format(Number(cents) /100);

export const toCents = (amount: number): bigint => {
  return BigInt(Math.round(amount * 100));
};

export const toFloat = (cents: bigint): number => {
  return Number(cents) / 100;
};