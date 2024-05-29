const { EventEmitter } = require('node:events')

let WebSocket = globalThis.WebSocket
try {
  if (!WebSocket) {
    try {
      const ws = require('ws');
      WebSocket = ws.WebSocket || ws.default.WebSocket;
    } catch {
      // pass
    }
  }
} catch {
  // pass
}

export function getRuntime() {
  return {
    kind: 'node',
    WebSocket,
    EventEmitter,
  };
}
