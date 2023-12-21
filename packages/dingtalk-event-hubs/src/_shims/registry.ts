export type WebSocket = globalThis.WebSocket;

export interface Shims {
  kind: string;
  WebSocket: any;
  EventEmitter: any;
}

export let kind: Shims['kind'] | undefined = undefined;
export let WebSocket: Shims['WebSocket'] | undefined = undefined;
export let EventEmitter: Shims['EventEmitter'] | undefined = undefined;

export function setShims(shims: Shims) {
  kind = shims.kind;
  WebSocket = shims.WebSocket;
  EventEmitter = shims.EventEmitter;
}
