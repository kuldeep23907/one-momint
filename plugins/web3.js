import Web3 from 'web3'

/* eslint-disable @typescript-eslint/no-unused-vars */
export default function (context, inject) {
  inject('web3', new Web3(Web3.givenProvider || 'ws://localhost:8545'))
}
