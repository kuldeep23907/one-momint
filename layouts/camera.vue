<template>
  <div>
    <nuxt />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapState(['isConnectDisabled', 'selectedAccount', 'chainId']),
  },

  async mounted() {
    const { ethereum } = window

    if (ethereum) {
      if (!this.selectedAccount) {
        const accounts = await ethereum.request({
          method: 'eth_accounts',
        })

        if (accounts && accounts.length) {
          this.setSelectedAccount(accounts[0])
        }
      }

      if (!this.chainId && ethereum.chainId) {
        this.setChainId(ethereum.chainId)
      }

      ethereum.on('accountsChanged', (accounts) => {
        this.setSelectedAccount(accounts[0] || null)
      })

      ethereum.on('connect', ({ chainId }) => {
        this.setChainId(chainId)
      })

      ethereum.on('chainChanged', (chainId) => {
        console.log('CHAIN_CHANGED: ', chainId)
        this.$router.go()
      })

      ethereum.on('disconnect', (error) => {
        if (error) {
          console.error(error)
        }
        this.setChainId(null)
        this.setSelectedAccount(null)
        this.disableConnectButton(false)
      })
    } else {
      alert('MetaMask not found')
    }
  },

  methods: {
    ...mapMutations([
      'setChainId',
      'setSelectedAccount',
      'disableConnectButton',
    ]),
  },
}
</script>
