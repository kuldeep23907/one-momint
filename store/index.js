export const state = () => ({
  isConnectDisabled: false,
  selectedAccount: null,
  chainId: null,
})

export const mutations = {
  setChainId(state, id) {
    state.chainId = id
  },
  disableConnectButton(state, bStatus) {
    state.isConnectDisabled = bStatus
  },
  setSelectedAccount(state, selectedAccount) {
    state.selectedAccount = selectedAccount
  },
}

export const actions = {
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
        commit('setSelectedAccount', account[0])
        commit('disableConnectButton', true)
      }
    } catch (error) {
      console.error(error)
    } finally {
      commit('disableConnectButton', false)
    }
  },
}
