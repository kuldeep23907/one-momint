<template>
  <div>
    <video v-show="!snapCaptured" id="webcam" ref="webcam" autoplay></video>
    <canvas v-show="snapCaptured" id="canvas" ref="canvas"></canvas>

    <b-button @click="snap">Snap</b-button>
    <b-button @click="flip">Flip</b-button>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import momintABI from '~/contracts/ABI/ERC721.json'
import { MOMINT_CONTRACT_ADDRESS } from '~/constants'

export default {
  data() {
    return {
      camera: null,
      picture: '',
      snapCaptured: false,
    }
  },
  layout: 'camera',
  computed: {
    ...mapState(['selectedAccount']),
  },

  mounted() {
    const webcamElement = this.$refs.webcam
    const canvasElement = this.$refs.canvas
    this.camera = new this.$webcam(webcamElement, 'user', canvasElement)

    this.camera
      .start()
      .then(() => {
        console.log('webcam started')
      })
      .catch((err) => {
        console.error(err)
      })

    this.momint = new this.$web3.eth.Contract(
      momintABI,
      MOMINT_CONTRACT_ADDRESS
    )
    console.log(this.momint)
  },

  destroyed() {
    if (this.camera) {
      this.camera.stop()
    }
  },

  methods: {
    snap() {
      this.picture = this.camera.snap()
      this.snapCaptured = true
      fetch(this.picture)
        .then((res) => res.blob())
        .then(async (blob) => {
          const file = new this.$nftStorageFile([blob], 'nftdata.png', {
            type: 'image/png',
          })
          await this.sendToNftStorage(file)
        })
    },

    flip() {
      this.camera.flip()
      this.camera.start()
    },

    async sendToNftStorage(image) {
      const metadata = await this.$nftStorageClient.store({
        name: 'MoMint NFT',
        description: 'Capture the moment',
        image,
      })
      console.log(metadata)
      await this.mint(metadata)
    },

    async mint(metadata) {
      if (!this.selectedAccount) {
        return alert('You must connect to MetaMask')
      }
      const mint = await this.momint.methods
        .mint(metadata.url)
        .send({ from: this.selectedAccount })
      console.log(mint)
    },
  },
}
</script>
<style scoped>
video {
  width: 100%;
  opacity: 0.65;
  min-height: 100vh;
  margin: 0 auto;
  position: fixed;
  background: transparent;
  border-radius: 5px;
  -webkit-transform: scaleX(-1);
  -moz-transform: scaleX(-1);
  -o-transform: scaleX(-1);
  transform: scaleX(-1);
  filter: fliph;
  -ms-filter: 'fliph';
}
</style>
