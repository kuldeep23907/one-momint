import { File } from 'nft.storage'

/* eslint-disable @typescript-eslint/no-unused-vars */
export default function (context, inject) {
  inject('nftStorageFile', File)
}
