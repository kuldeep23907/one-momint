<template>
  <div>
    <section class="main-content">
      <navbar />
      <div class="container column is-10">
        <nuxt />
      </div>
    </section>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import Navbar from '~/components/Navbar'

export default {
  components: { Navbar },
  data() {
    return {
      items: [
        {
          title: 'Home',
          icon: 'home',
          to: { name: 'index' },
        },
        {
          title: 'Camera',
          icon: 'camera',
          to: { name: 'Camera' },
        },
      ],
    }
  },

  computed: {
    ...mapState(['isConnectDisabled', 'selectedAccount', 'chainId']),
  },

  watch: {
    async selectedAccount(newAccount, oldAccount) {
      if (newAccount !== oldAccount) {
        await this.$store.dispatch('reverseResolveAddress', newAccount)
      }
    },
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
      })
    } else {
      alert('MetaMask not found')
    }
  },

  methods: {
    ...mapMutations([
      'setChainId',
      'setSelectedAccount',
      'recoverStateFromStorage',
      'setSelectedAccountEnsName',
      'disableConnectButton',
      'resetState',
    ]),
  },
}
</script>
