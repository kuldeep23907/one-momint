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
}
</script>
