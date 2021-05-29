import Webcam from 'webcam-easy'

/* eslint-disable @typescript-eslint/no-unused-vars */
export default async function (context, inject) {
  const webcam = Webcam

  inject('webcam', webcam)
}
