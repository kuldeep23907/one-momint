<template>
  <section class="section">
    <div class="columns is-mobile">
      <card title="Free" icon="ethereum" class="">
        <b-button
          :disabled="isConnectDisabled"
          @click="$store.dispatch('connectToWallet')"
          >{{ selectedAccount ? 'Connected' : 'Connect' }}</b-button
        >
      </card>
    </div>
  </section>
</template>

<script>
// import Web3 from 'web3'
import { mapState } from 'vuex'
import Card from '~/components/Card'

export default {
  name: 'HomePage',

  components: {
    Card,
  },

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
          this.selectedAccount = accounts[0]
        }
      }

      if (!this.chainId && ethereum.chainId) {
        this.chainId = ethereum.chainId
      }

      ethereum.on('accountsChanged', (accounts) => {
        this.selectedAccount = accounts[0] || null
      })

      ethereum.on('connect', (connectInfo) => {
        const { chainId } = connectInfo
        this.chainId = chainId
      })

      ethereum.on('chainChanged', (chainId) => {
        console.log('CHAIN_CHANGED: ', chainId)
        this.$router.go()
      })

      ethereum.on('disconnect', (error) => {
        if (error) {
          console.error(error)
        }
        this.$store.commit('setChainId', null)
        this.$store.commit('setSelectedAccount', null)
        this.$store.commit('disableConnectButton', false)
      })
    } else {
      alert('MetaMask not found')
    }
  },

  destroyed() {
    if (window.ethereum) {
      window.ethereum.removeAllListeners()
    }
  },

  methods: {
    // async connectToWallet() {
    //   const { ethereum } = window
    //   if (!ethereum) {
    //     return alert('MetaMask was not found to be installed.')
    //   }
    //   if (ethereum.selectedAddress) {
    //     return alert("You're already connected to your wallet")
    //   }
    //   try {
    //     this.isConnectDisabled = true
    //     const accounts = await ethereum.request({
    //       method: 'eth_requestAccounts',
    //     })
    //     if (accounts && accounts.length) {
    //       this.selectedAccount = accounts[0]
    //       this.isConnectDisabled = !accounts
    //     }
    //   } catch (error) {
    //   } finally {
    //     this.isConnectDisabled = false
    //   }
    // },
  },
}
</script>
