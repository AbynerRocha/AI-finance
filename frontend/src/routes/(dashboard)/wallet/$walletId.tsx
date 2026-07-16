import { getUserWallet } from '#/services/wallet/index.ts';
import { formatMoney } from '#/utils/formatCurrency.ts';
import { createFileRoute } from '@tanstack/react-router'
import { AxiosError } from 'axios';

export const Route = createFileRoute('/(dashboard)/wallet/$walletId')({
  loader: {
    handler: async ({ params, context }) => {
      try {
        const wallet = await getUserWallet(params.walletId)

        return wallet
      } catch (error) {
        if (error instanceof AxiosError) {
          const err = error.response?.data.error

          if (err === 'EXPIRED_TOKEN') {
            context.auth?.requestNewAccessToken()
          }
        }
      }
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const wallet = Route.useLoaderData()

  if(!wallet) {
    return <h1>404</h1>
  }

  return (
    <>
      <p>{wallet.name}</p>
      <p>{formatMoney(wallet.amountCent)}</p>
    </>
  )
}
