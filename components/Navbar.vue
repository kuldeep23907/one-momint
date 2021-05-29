<template>
  <b-navbar :mobile-burger="false">
    <template #brand>
      <b-navbar-item
        tag="router-link"
        :to="{ path: '/' }"
        :style="{ 'background-color': 'white' }"
      >
        <img :src="require('~/assets/brand-logo.png')" />
      </b-navbar-item>
    </template>
    <template #start>
      <b-navbar-item tag="nuxt-link" to="/">Home</b-navbar-item>
    </template>
    <template #end>
      <b-navbar-item tag="div">
        <div class="buttons">
          <b-button
            :type="selectedAccount ? 'is-secondary' : 'is-primary'"
            @click="$store.dispatch('connectToWallet')"
            >{{ selectedAccount ? selectedAccount : 'Connect' }}</b-button
          >
          <b-button
            v-if="selectedAccount"
            class="is-primary"
            tag="nuxt-link"
            to="/Camera"
          >
            <strong>Camera</strong>
          </b-button>
        </div>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['selectedAccount']),
  },
}
</script>

<style scoped>
.item {
  color: #aed2ff;
}
</style>
