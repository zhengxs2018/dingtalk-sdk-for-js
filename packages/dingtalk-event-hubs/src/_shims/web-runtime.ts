import EventEmitter from 'eventemitter3';

import { type Shims } from './registry';

export function getRuntime(): Shims {
  return {
    kind: 'web',
    WebSocket: globalThis.WebSocket,
    EventEmitter: EventEmitter,
  };
}
