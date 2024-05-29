import { EventEmitter } from 'node:events';
import { createRequire } from 'node:module'

let WebSocket = globalThis.WebSocket
try {
  if (!WebSocket) {
    const require = createRequire(import.meta.url);
    try {
      const ws = require('ws');
      WebSocket = ws.WebSocket || ws.default.WebSocket;
    } catch { }
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
