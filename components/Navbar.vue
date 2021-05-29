<template>
  <b-navbar>
    <template #brand>
      <b-navbar-item tag="router-link" :to="{ path: '/' }">
        <img :src="require('~/assets/brand-logo.png')" />
      </b-navbar-item>
    </template>
    <template #start>
      <b-navbar-item class="is-size-4" tag="router-link" to="/"
        >Home</b-navbar-item
      >
      <b-navbar-item class="is-size-4" tag="router-link" to="/Camera"
        >Camera</b-navbar-item
      >
      <!-- <b-navbar-dropdown label="Info">
        <b-navbar-item href="#"> About </b-navbar-item>
        <b-navbar-item href="#"> Contact </b-navbar-item>
      </b-navbar-dropdown> -->
    </template>
    <template #end>
      <b-navbar-item tag="div">
        <div class="buttons">
          <b-button
            :type="selectedAccount ? 'is-secondary' : 'is-primary'"
            @click="$store.dispatch('connectToWallet')"
            >{{ selectedAccount ? 'Connected' : 'Connect' }}</b-button
          >
          <b-button v-if="selectedAccount" class="button is-primary">
            <strong>Profile</strong>
          </b-button>
          <!-- <a class="button is-light"> Disconnect </a> -->
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
