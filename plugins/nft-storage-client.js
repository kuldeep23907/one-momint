import { NFTStorage } from 'nft.storage'

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
export default function (context, inject) {
  inject(
    'nftStorageClient',
    new NFTStorage({ token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGUwMzc4NzRlZDQ4NkU3MWY0MzA3NzVmOEREZEUxMzU0NDA2YTFBZkQiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYyMjIzMjM0MzA5NCwibmFtZSI6Imluc3RhLW5mdC1pZyJ9.900zF4VpNAkR7ldEr8Po6COQuhRtQ3eog9JAJVjQWco" })
  )
}
