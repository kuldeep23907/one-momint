import { GetterTree, ActionTree, MutationTree } from 'vuex'
import ENS, { getEnsAddress } from '@ensdomains/ensjs'
import detectEthereumProvider from '@metamask/detect-provider'

export const state = () => ({
  isConnectDisabled: false,
  selectedAccount: null,
  selectedAccountEnsName: null,
  chainId: null,
})

export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {}

export const mutations: MutationTree<RootState> = {
  setChainId(state, id) {
    state.chainId = id
  },
  disableConnectButton(state, bStatus) {
    state.isConnectDisabled = bStatus
  },
  setSelectedAccount(state, selectedAccount) {
    state.selectedAccount = selectedAccount
  },
  setSelectedAccountEnsName(state, ensName) {
    state.selectedAccountEnsName = ensName
  },
}

export const actions: ActionTree<RootState, RootState> = {
  async reverseResolveAddress({ commit }, address) {
    if (!address) return null

    const ens = new ENS({
      provider: await detectEthereumProvider(),
      ensAddress: getEnsAddress('4'),
    })

    const ensName = await ens.getName(address)
    const checked = await ens.name(ensName.name).getAddress()
    if (address.toLowerCase() !== checked.toLowerCase()) {
      commit('setSelectedAccountEnsName', null)
    } else {
      commit('setSelectedAccountEnsName', ensName.name)
    }
  },
  async connectToWallet({ commit }) {
    const { ethereum } = window

    if (!ethereum) {
      return alert('MetaMask was not found to be installed.')
    }

    if (ethereum.selectedAddress) {
      return alert("You're already connected to your wallet")
    }

    commit('disableConnectButton', true)

    try {
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      })

      if (accounts && accounts.length) {
        commit('setSelectedAccount', accounts[0])
        commit('disableConnectButton', true)
      }
    } catch (error) {
      console.error(error)
    } finally {
      commit('disableConnectButton', false)
    }
  },
}
