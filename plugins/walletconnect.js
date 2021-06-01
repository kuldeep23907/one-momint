import WalletConnectProvider from '@walletconnect/web3-provider'

export default function (context, inject) {
  inject(
    'walletconnect',
    new WalletConnectProvider({
      infuraId: '07c05b5d099c4ad5b5d71ce38fc010e3', // Required
    })
  )
}
