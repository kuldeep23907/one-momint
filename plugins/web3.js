import Web3 from 'web3'
import WalletConnectProvider from '@walletconnect/web3-provider'

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
export default async function (context, inject) {
  //  Create WalletConnect Provider
  const provider = new WalletConnectProvider({
    infuraId: '07c05b5d099c4ad5b5d71ce38fc010e3', // Required
  })

  //Workaround for issue reported here: https://github.com/ChainSafe/web3.js/issues/3891
  delete provider.__proto__.request
  provider.hasOwnProperty('request') && delete provider.request

  //  Enable session (triggers QR Code modal)
  await provider.enable()

  const web3 = new Web3(provider)

  inject('web3', web3)
}
