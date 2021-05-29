<template>
  <div>
    <video
      v-show="!snapCaptured"
      id="webcam"
      ref="webcam"
      autoplay
      playsinline
    ></video>
    <canvas v-show="snapCaptured" id="canvas" ref="canvas"></canvas>
    <div class="buttons">
      <b-icon
        @click.native="snap"
        icon="camera"
        type="is-white"
        size="is-large"
      >
      </b-icon>
      <b-icon
        @click.native="flip"
        icon="camera-flip"
        type="is-white"
        size="is-large"
      >
      </b-icon>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {
  Client,
  ThreadID,
  KeyInfo,
  PrivateKey,
  WithKeyInfoOptions,
} from '@textile/hub'
import momintABI from '~/contracts/ABI/ERC721.json'
import { MOMINT_CONTRACT_ADDRESS } from '~/constants'

export default {
  data() {
    return {
      camera: null,
      picture: '',
      identity: '',
      client: '',
      isLoading: true,
      threadId: '',
      ipfsGateway: 'https://hub.textile.io',
      keyInfo: {
        key: 'bfm62iuga3aokfkwat3pyjw7umu',
      },
      keyInfoOptions: {
        debug: false,
      },
      allMintedPics: [],
      // Define a simple person schema
      schema: {
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: 'UserMoments',
        type: 'object',
        properties: {
          _id: { type: 'string' },
          address: { type: 'string' },
          URI: { type: 'string' },
          description: { type: 'string' },
          name: { type: 'string' },
          href: { type: 'string' },
          origin: { type: 'string' },
          pathname: { type: 'string' },
          protocol: { type: 'string' },
        },
      },
      snapCaptured: false,
    }
  },
  layout: 'camera',
  computed: {
    ...mapState(['selectedAccount']),
  },

  async mounted() {
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
    console.log('here')
    this.identity = await this.getIdentity()
    this.client = await this.getClient()
    await this.listThreads()

    // await this.createThread()

    // await this.createCollectionFromSchema()

    await this.getAllData()
    // await this.addNewData()

    this.isLoading = false
  },

  destroyed() {
    if (this.camera) {
      this.camera.stop()
    }
  },
  /**
   * getIdentity uses a basic private key identity.
   * The user's identity will be cached client side. This is long
   * but ephemeral storage not sufficient for production apps.
   *
   * Read more here:
   * https://docs.textile.io/tutorials/hub/libp2p-identities/
   */
  methods: {
    getIdentity() {
      try {
        let storedIdent = localStorage.getItem('identity')
        if (storedIdent === null) {
          throw new Error('No identity')
        }
        const restored = PrivateKey.fromString(storedIdent)
        return restored
      } catch (e) {
        /**
         * If any error, create a new identity.
         */
        try {
          const identity = PrivateKey.fromRandom()
          const identityString = identity.toString()
          localStorage.setItem('identity', identityString)
          return identity
        } catch (err) {
          return err.message
        }
      }
    },

    async getClient() {
      if (!this.identity) {
        throw new Error('Identity not set')
      }
      const client = await Client.withKeyInfo(this.keyInfo)
      console.log('Key Info', client)
      await client.getToken(this.identity)
      return client
    },

    async listThreads() {
      if (!this.identity) {
        throw new Error('Identity not set')
      }
      const threads = (await this.client.listThreads()) || []
      console.log(threads)
      const lastThread = threads[threads.length - 1 ? threads.length - 1 : 0]
      console.log(lastThread)
      this.threadId = lastThread.id
      console.log(this.threadId)
      // this.threadId = threads.id
    },

    async createThread() {
      if (!this.client) {
        throw new Error('Client not set')
      }
      const thread = await this.client.newDB()
      this.threadId = thread.toString()
      console.log(this.threadId)
    },

    async createCollectionFromSchema() {
      if (!this.client) {
        throw new Error('Client not set')
      }
      if (!this.threadId) {
        throw new Error('No DB yet')
      }
      console.log(this.threadId)
      await this.client.newCollection(ThreadID.fromString(this.threadId), {
        name: 'UserMoments1',
        schema: this.schema,
      })
    },

    async getAllData() {
      if (!this.client) {
        throw new Error('Client not set')
      }
      if (!this.threadId) {
        throw new Error('No DB yet')
      }
      console.log(this.threadId)
      const found = await this.client.find(
        ThreadID.fromString(this.threadId),
        'UserMoments1',
        {}
      )
      console.log('found:', found)
      this.allMintedPics = found
    },

    async addNewData(metadata) {
      if (!this.client) {
        throw new Error('Client not set')
      }
      if (!this.threadId) {
        throw new Error('No DB yet')
      }
      console.log(this.threadId)
      const fruits = ['Apple', 'Orange', 'Banana']
      const created = await this.client.create(
        ThreadID.fromString(this.threadId),
        'UserMoments1',
        [
          {
            _id: '' + Date.now(),
            address: this.selectedAccount,
            URI: metadata.url,
            description: metadata.data.description,
            name: metadata.data.name,
            href: metadata.data.image.href,
            origin: metadata.data.image.origin,
            pathname: metadata.data.image.pathname,
            protocol: metadata.data.image.protocol,
          },
        ]
      )
      console.log(created)
    },
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
      console.log(metadata.data)
      await this.addNewData(metadata)
      await this.getAllData()
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
  min-height: 100vh;
  margin: 0 auto;
  position: fixed;
  background: black;
  border-radius: 5px;
  -webkit-transform: scaleX(-1);
  -moz-transform: scaleX(-1);
  -o-transform: scaleX(-1);
  transform: scaleX(-1);
  filter: fliph;
  -ms-filter: 'fliph';
}

.buttons {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  position: fixed;
  bottom: 0;
  background: rgb(0, 0, 0);
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.8029586834733894) 0%,
    rgba(0, 0, 0, 0.8645833333333334) 35%,
    rgba(26, 49, 113, 1) 100%
  );
  width: 100vw;
  height: 10vh;
}
</style>
