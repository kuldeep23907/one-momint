import Webcam from 'webcam-easy'

/* eslint-disable @typescript-eslint/no-unused-vars */
export default function (context, inject) {
  const webcam = Webcam

  inject('webcam', webcam)
}
