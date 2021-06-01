<template>
  <div>
    <h1>Wallet Connect</h1>
    <b-button @click.native="connect">Connect</b-button>
  </div>
</template>
<script>
export default {
  layout: 'camera',
  data() {
    return {}
  },
  methods: {
    // async connect() {
    //   let provider = await this.$walletconnect.enable()
    //   console.log('Setting provider', await this.$web3.setProvider(provider))
    // },
  },
}
</script>
