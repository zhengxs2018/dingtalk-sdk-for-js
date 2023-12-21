import { EventEmitter } from 'node:events';

import { WebSocket } from 'ws';

import { type Shims } from './registry';

export function getRuntime(): Shims {
  return {
    kind: 'node',
    WebSocket,
    EventEmitter,
  };
}
