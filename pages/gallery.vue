<template>
  <section class="section scale-in-center">
    <div style="display: flex; justify-content: center; align-items: center">
      <lottie-player
        v-show="!images.length"
        src="https://assets5.lottiefiles.com/datafiles/vhvOcuUkH41HdrL/data.json"
        background="transparent"
        speed="1"
        class="lottie-player"
        style="width: 100%; height: 100%"
        loop
        autoplay
      ></lottie-player>

      <h1 v-show="!images.length" class="title">
        Go ahead and mint some moments!
      </h1>
      <stack
        v-if="images.length"
        ref="grid"
        :column-min-width="320"
        :gutter-width="15"
        :gutter-height="15"
      >
        <stack-item v-for="(image, i) in images" :key="i">
          <img
            :ref="`${image}${i}`"
            :src="image.image.replaceAll('ipfs://', 'https://ipfs.io/ipfs/')"
          />
        </stack-item>
      </stack>
      <!-- <b-button
        class="is-primary"
        @click="images.sort(() => 0.5 - Math.random())"
        >Shuffle</b-button
      > -->
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import { Stack, StackItem } from 'vue-stack-grid'
import LottiePlayer from '@lottiefiles/lottie-player'

export default {
  name: 'Gallery',
  components: { LottiePlayer, Stack, StackItem },
  data() {
    return {
      images: [],
    }
  },
  computed: { ...mapState(['nftCollection', 'selectedAccount']) },
  watch: {
    selectedAccount(newAcc) {
      this.$store.commit('recoverStateFromStorage', newAcc)
    },
    nftCollection(newCollection) {
      this.images = newCollection
    },
  },

  mounted() {
    if (this.selectedAccount) {
      this.$store.commit('recoverStateFromStorage', this.selectedAccount)
    }
    console.log('GRID: ', this.$refs.grid)

    setTimeout(() => this.$refs.grid.update(), 500)
  },
}
</script>
<style scoped>
.title {
  font-size: 2rem;
  position: absolute;
  bottom: 26%;
}

/* ----------------------------------------------
 * Generated by Animista on 2021-3-19 20:13:13
 * Licensed under FreeBSD License.
 * See http://animista.net/license for more info. 
 * w: http://animista.net, t: @cssanimista
 * ---------------------------------------------- */

/**
 * ----------------------------------------
 * animation scale-in-center
 * ----------------------------------------
 */
@-webkit-keyframes scale-in-center {
  0% {
    -webkit-transform: scale(0);
    transform: scale(0);
    opacity: 1;
  }
  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
    opacity: 1;
  }
}
@keyframes scale-in-center {
  0% {
    -webkit-transform: scale(0);
    transform: scale(0);
    opacity: 1;
  }
  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
    opacity: 1;
  }
}
.scale-in-center {
  -webkit-animation: scale-in-center 2s cubic-bezier(0.25, 0.46, 0.45, 0.94)
    both;
  animation: scale-in-center 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}
</style>
