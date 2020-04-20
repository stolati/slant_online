import { postphoneAsync } from '../utils'

const io = require('socket.io-client')

export const socket = io({
  transports: ['websocket'],
})

// on reconnection, reset the transports option, as the Websocket
// connection may have failed (caused by proxy, firewall, browser, ...)
socket.on('reconnect_attempt', () => {
  socket.io.opts.transports = ['polling', 'websocket']
})

socket.whenConnected = (fct) => {
  if (socket.connected) {
    postphoneAsync(fct)
  }

  socket.on('connect', fct)

  return () => {
    socket.off('connect', fct)
  }
}
