<template>
  <div class="column">
    <video id="webcam" autoplay playsinline width="640" height="480"></video>
    <canvas id="canvas" class="d-none"></canvas>
    <button @click="snap">Snap</button>
    <button @click="flip">Flip</button>
  </div>
</template>

<script>
import momintABI from '~/contracts/ABI/ERC721.json'

export default {
  data() {
    return {
      picture: '',
    }
  },
  computed: {
    // ownership() {
    //   console.log('running', this.connectedAccountBalance, this.totalSupply)
    //   return Number(this.connectedAccountBalance) / Number(this.totalSupply)
    // },
  },
  async mounted() {
    console.log(this.$webcam)
    const webcamElement = document.getElementById('webcam')
    const canvasElement = document.getElementById('canvas')
    this.camera = new this.$webcam(webcamElement, 'user', canvasElement)
    this.camera
      .start()
      .then((result) => {
        console.log('webcam started')
      })
      .catch((err) => {
        console.log(err)
      })

    this.momint = new this.$web3.eth.Contract(
      momintABI,
      '0xD9546d7b514a33EFF8785f97bF0B047326AA7d3d'
    )
    console.log(this.momint)
  },
  methods: {
    async snap() {
      this.picture = this.camera.snap()
      console.log(this.picture)
      await fetch(this.picture)
        .then((res) => res.blob())
        .then(async (blob) => {
          const file = new this.$nftStorageFile([blob], 'nftdata.png', {
            type: 'image/png',
          })
          const ipfsResult = await this.sendToNftStorage(file).then(
            (result) => {
              console.log(result)
              return result
            }
          )
        })
    },
    flip() {
      this.camera.flip()
      this.camera.start()
    },
    async sendToNftStorage(img) {
      console.log(this.$nftStorageClient)
      const metadata = await this.$nftStorageClient.store({
        name: 'moMint NFT',
        description: 'Capture the moment',
        image: img,
      })
      console.log(metadata)
      this.mint(metadata)
    },

    async mint(metadata) {
      const mint = await this.momint.methods
        .mint({ value: metadata.url })
        .send({ from: ethereum.selectedAddress })
      console.log(mint)
    },
  },
}
</script>
