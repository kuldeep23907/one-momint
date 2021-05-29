<template>
  <div>
    <nav
      class="navbar header has-shadow is-primary"
      role="navigation"
      aria-label="main navigation"
    >
      <div class="navbar-brand">
        <a class="navbar-item" href="/">
          <img src="~assets/buefy.png" alt="Buefy" height="28" />
        </a>

        <div class="navbar-burger">
          <span />
          <span />
          <span />
        </div>
      </div>
    </nav>

    <section class="main-content columns">
      <aside class="column is-2 section">
        <p class="menu-label is-hidden-touch">General</p>
        <ul class="menu-list">
          <li v-for="(item, key) of items" :key="key">
            <nuxt-link :to="item.to" exact-active-class="is-active">
              <b-icon :icon="item.icon" /> {{ item.title }}
            </nuxt-link>
          </li>
        </ul>
      </aside>

      <div class="container column is-10">
        <nuxt />
      </div>
    </section>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
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
