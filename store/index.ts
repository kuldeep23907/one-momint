import { ActionTree, MutationTree } from 'vuex'
import ENS, { getEnsAddress } from '@ensdomains/ensjs'
import detectEthereumProvider from '@metamask/detect-provider'
import { SnackbarProgrammatic as Snackbar } from 'buefy'

const stringifyState = (state: any) => {
  return JSON.stringify({ ...state })
}

const syncStateToStorage = (state: any) => {
  if (state.selectedAccount !== null) {
    localStorage.setItem(state.selectedAccount, stringifyState(state))
  }
}

export const state = () => ({
  isConnectDisabled: false,
  selectedAccount: null,
  selectedAccountEnsName: null,
  chainId: null,
  nftCollection: [],
  gallery: [],
})

export const getDefaultState = () => ({
  isConnectDisabled: false,
  selectedAccount: null,
  selectedAccountEnsName: null,
  chainId: null,
  nftCollection: [],
  gallery: [],
})

export type RootState = ReturnType<typeof state>

export const mutations: MutationTree<RootState> = {
  recoverStateFromStorage(state, selectedAccount) {
    Object.assign(
      state,
      JSON.parse(String(localStorage.getItem(selectedAccount)))
    )
  },
  resetState(state) {
    Object.assign(state, getDefaultState())
    syncStateToStorage(state)
  },
  setChainId(state, id) {
    state.chainId = id
    syncStateToStorage(state)
  },
  disableConnectButton(state, bStatus) {
    state.isConnectDisabled = bStatus
    syncStateToStorage(state)
  },
  setSelectedAccount(state, selectedAccount) {
    state.selectedAccount = selectedAccount
    syncStateToStorage(state)
  },
  setSelectedAccountEnsName(state, ensName) {
    state.selectedAccountEnsName = ensName
    syncStateToStorage(state)
  },
  setNFTCollection(state, collection) {
    state.nftCollection = collection
    syncStateToStorage(state)
  },
  pushToNFTCollection(
    state: { selectedAccount: string | null; nftCollection: any[] },
    nft
  ) {
    state.nftCollection = state.nftCollection.concat([nft])
    syncStateToStorage(state)
  },
  removeFromNFTCollectionByIndex(state, index) {
    state.nftCollection.splice(index, 1)
    syncStateToStorage(state)
  },
}

export const actions: ActionTree<RootState, RootState> = {
  async reverseResolveAddress({ commit }, address) {
    if (!address) return commit('setSelectedAccount', null)
    if (window.ethereum.networkVersion !== String(4)) {
      return commit('setSelectedAccountEnsName', null)
    }

    console.log(address)

    const ens = new ENS({
      provider: await detectEthereumProvider(),
      ensAddress: getEnsAddress(4),
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

    if (ethereum.networkVersion !== String(4)) {
      return Snackbar.open({
        message: 'Please connect to Rinkeby',
        type: 'is-warning',
        position: 'is-top',
      })
    }

    if (ethereum.selectedAddress) {
      return Snackbar.open({
        actionText: 'OK',
        message: `Connected as: \n\n ${ethereum.selectedAddress}`,
        type: 'is-success',
        position: 'is-top',
        duration: 6000,
        queue: false,
      })
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
