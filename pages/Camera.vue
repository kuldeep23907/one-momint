<template>
  <div class="column">
    <connect />
    <video id="webcam" autoplay playsinline width="640" height="480"></video>
    <canvas id="canvas" class="d-none"></canvas>
    <button @click="snap">Snap</button>
    <button @click="flip">Flip</button>
  </div>
</template>

<script>
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
  },
  methods: {
    async snap() {
      this.picture = this.camera.snap()
      console.log(this.picture)
      await fetch(this.picture)
        .then((res) => res.blob())
        .then((blob) => {
          this.file = new File([blob], 'nftdata', { type: 'image/png' })
        })
      console.log(this.file)
    },
    flip() {
      this.camera.flip()
    },
  },
}
</script>
