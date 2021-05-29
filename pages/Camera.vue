<template>
  <div class="column">
    <video id="webcam" autoplay playsinline width="640" height="480"></video>
    <canvas id="canvas" class="d-none"></canvas>
    <button @click="snap">Snap</button>
    <button @click="flip">Flip</button>
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
    }
  },

  computed: {
    ...mapState(['selectedAccount']),
  },

  mounted() {
    const webcamElement = document.getElementById('webcam')
    const canvasElement = document.getElementById('canvas')
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
