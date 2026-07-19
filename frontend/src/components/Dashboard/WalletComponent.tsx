import type { WalletData } from "#/schemas/wallet/index.ts";
import type React from "react";

type WalletComponentProps = {
    icon: React.ReactNode,
    walletData: WalletData
}

export default function WalletComponent() {
  return (
    <div className="bg-card border border-border h-30 w-60">

    </div>
  )
}
