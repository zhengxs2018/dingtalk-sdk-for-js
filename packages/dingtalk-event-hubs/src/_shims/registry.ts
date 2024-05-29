import type events from 'node:events'

export type WebSocket = globalThis.WebSocket;

export interface Shims {
  kind: string;
  WebSocket: any;
  EventEmitter: new () => any;
}

export let kind: Shims['kind'];
export let WebSocket: Shims['WebSocket'];
export let EventEmitter: Shims['EventEmitter'];

export type EventEmitter = events.EventEmitter<any>;

export function setShims(shims: Shims) {
  kind = shims.kind;
  WebSocket = shims.WebSocket;
  EventEmitter = shims.EventEmitter;
}
