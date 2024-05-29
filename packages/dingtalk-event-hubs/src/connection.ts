import Backoff from 'backo2';

import { EventEmitter, WebSocket as NativeWebSocket } from './_shims';
import type { HttpLink } from './HttpLink';
import type { EffectCleanup, GraphAPIResponse, ParsedEvent, SendMessage } from './types';

const WS_TIMEOUT = 30000;

const MIN_WS_TIMEOUT = 1000;

export interface HubConnectionOptions {
  url?: string;
  httpLink?: HttpLink;
  lazy?: boolean;
  timeout?: number;
  minTimeout?: number;
  reconnect?: boolean;
  reconnectionAttempts?: number;
}

export class HubConnection {
  protected url?: string;
  protected httpLink?: HttpLink;

  private backoff: Backoff;
  private emitter: EventEmitter;

  private closedByUser: boolean;
  private wasKeepAliveReceived: boolean;

  private unsentMessagesQueue: Array<any>; // queued messages while websocket is opening.

  private reconnect: boolean;
  private reconnecting: boolean;
  private reconnectionAttempts: number;
  private tryReconnectTimeoutId: any;
  private checkConnectionIntervalId: any;
  private maxConnectTimeoutId: any;
  private maxConnectTimeGenerator: any;

  private ws?: globalThis.WebSocket | null;
  private wsTimeout: number;
  private minWsTimeout: number;
  private wsImpl: typeof globalThis.WebSocket;

  private effects: EffectCleanup[];

  constructor(options: HubConnectionOptions, webSocketImpl?: typeof globalThis.WebSocket) {
    const {
      url,
      httpLink,
      lazy = true,
      minTimeout = MIN_WS_TIMEOUT,
      timeout = WS_TIMEOUT,
      reconnect = false,
      reconnectionAttempts = Infinity,
    } = options;

    this.wsImpl = webSocketImpl || NativeWebSocket!;
    if (!this.wsImpl) {
      throw new Error('Unable to find native implementation, or alternative implementation for WebSocket!');
    }

    this.url = url;
    this.httpLink = httpLink;
    this.unsentMessagesQueue = [];

    this.backoff = new Backoff({ jitter: 0.5 });
    this.emitter = new EventEmitter();

    this.effects = [];
    this.closedByUser = false;
    this.wasKeepAliveReceived = false;

    this.wsTimeout = timeout;
    this.minWsTimeout = minTimeout;
    this.reconnect = reconnect;
    this.reconnecting = false;
    this.reconnectionAttempts = reconnectionAttempts;
    this.maxConnectTimeGenerator = this.createMaxConnectTimeGenerator();

    if (!lazy) this.start();
  }

  get status() {
    if (this.ws == null) {
      return this.wsImpl.CLOSED;
    }

    return this.ws.readyState;
  }

  on(eventName: string | symbol, listener: (...args: any[]) => void) {
    this.emitter.on(eventName, listener);

    return () => {
      this.emitter.removeListener(eventName, listener);
    };
  }

  async start() {
    if (this.status === this.wsImpl.CLOSED) {
      this.url ??= await this.httpLink?.create();

      this.connect();
    }
  }

  protected connect() {
    const effects = this.effects;
    const ws = new this.wsImpl(this.url!);

    function on<K extends keyof WebSocketEventMap>(
      type: K,
      listener: (ev: WebSocketEventMap[K]) => any,
      options?: boolean | AddEventListenerOptions,
    ): EffectCleanup;
    function on(type: string, listener: EventListener, options?: boolean | AddEventListenerOptions): EffectCleanup;
    function on(type: string, listener: EventListener, options?: boolean | AddEventListenerOptions): EffectCleanup {
      ws.addEventListener(type, listener, options);

      const off = () => ws.removeEventListener(type, listener, options);

      effects.push(off);

      return () => {
        off();

        const index = effects.indexOf(off);
        if (index > -1) effects.splice(index, 1);
      };
    }

    on('open', () => {
      if (this.status === this.wsImpl.OPEN) {
        this.closedByUser = false;
        this.emitter.emit(this.reconnecting ? 'reconnecting' : 'connecting');

        this.clearMaxConnectTimeout();

        try {
          this.flushUnsentMessagesQueue();
        } catch (error) {
          this.flushUnsentMessagesQueue();
        }
      }
    });

    on('message', ev => this.processReceivedData(ev.data));
    on('ping', () => this.heartbeat());

    on('close', () => {
      if (this.closedByUser) return;

      this.close(false, false);
    });

    on('error', ev => {
      // Capture and ignore errors to prevent unhandled exceptions, wait for
      // onclose to fire before attempting a reconnect.
      this.emitter.emit('error', ev);
    });

    this.ws = ws;
    this.checkMaxConnectTimeout();
  }

  protected processReceivedData(receivedData: string) {
    let event: ParsedEvent;

    try {
      event = JSON.parse(receivedData);
    } catch (e) {
      throw new Error(`Message must be JSON-parsable. Got: ${receivedData}`);
    }

    switch (event.type) {
      case 'SYSTEM':
        this.processSystemEvent(event);
        break;

      case 'CALLBACK':
        this.processCallbacks(event);
        break;

      case 'EVENT':
        // TODO: support event?
        break;

      default:
        throw new Error('Invalid message type!');
    }
  }

  protected processSystemEvent(event: ParsedEvent) {
    switch (event.headers.topic) {
      case 'CONNECTED':
        // pass
        break;

      case 'REGISTERED': {
        this.emitter.emit(this.reconnecting ? 'reconnected' : 'connected', event);
        this.reconnecting = false;
        this.backoff.reset();
        this.maxConnectTimeGenerator.reset();
        break;
      }

      case 'KEEPALIVE': {
        this.heartbeat();
        break;
      }

      case 'disconnect': {
        this.close(false, true);
        break;
      }

      case 'ping':
        this.ws!.send(
          JSON.stringify({
            code: 200,
            headers: event.headers,
            message: 'OK',
            data: event.data,
          }),
        );
        break;
    }
  }

  protected processCallbacks(event: ParsedEvent) {
    this.emitter.emit('message', event);
    this.emitter.emit('message.headers.topic', event);
  }

  close(isForced = true, closedByUser = true) {
    if (this.ws == null) return;

    this.closedByUser = closedByUser;

    if (isForced) {
      this.clearCheckConnectionInterval();
      this.clearMaxConnectTimeout();
      this.clearTryReconnectTimeout();
    }

    this.effects.map(cleanup => cleanup());
    this.effects = [];

    this.ws.close();
    this.ws = null;

    this.emitter.emit('disconnected');

    if (!isForced) this.tryReconnect();
  }

  /**
   * AI 应用
   *
   * @param id -
   * @param data -
   */
  invoke(id: string, data: unknown) {
    const response: GraphAPIResponse = {
      response: {
        statusLine: {},
        headers: {},
        body: JSON.stringify(data),
      },
    };

    this.send(id, response);
  }

  /**
   * 发送普通消息
   *
   * @param id -
   * @param data - 数据
   */
  send(id: string, payload: NonNullable<unknown>) {
    if (!id) {
      throw new Error('send: messageId must be defined');
    }

    this.emit(this.buildMessage(id, payload));
  }

  /**
   * 使用 websocket 发出最原始的消息
   *
   * @param message -
   * @returns
   */
  emit(message: SendMessage) {
    switch (this.status) {
      case this.wsImpl.OPEN: {
        const serializedMessage: string = JSON.stringify(message);
        this.ws!.send(serializedMessage);
        break;
      }

      case this.wsImpl.CONNECTING:
        this.unsentMessagesQueue.push(message);
        break;

      default: {
        if (this.reconnecting) return;

        this.emitter.emit(
          'error',
          new Error(
            'A message was not sent because socket is not connected, is closing or ' +
              'is already closed. Message was: ' +
              JSON.stringify(message),
          ),
        );
      }
    }
  }

  protected buildMessage(id: string, payload: NonNullable<unknown>): SendMessage {
    return {
      code: 200,
      message: 'OK',
      headers: {
        IncomingType: 'application/json',
        messageId: id,
      },
      data: JSON.stringify(payload),
    };
  }

  private flushUnsentMessagesQueue() {
    this.unsentMessagesQueue.forEach(message => {
      this.emit(message);
    });

    this.unsentMessagesQueue = [];
  }

  private heartbeat() {
    const firstKA = typeof this.wasKeepAliveReceived === 'undefined';
    this.wasKeepAliveReceived = true;

    if (firstKA) {
      this.checkConnection();
    }

    if (this.checkConnectionIntervalId) {
      clearInterval(this.checkConnectionIntervalId);
      this.checkConnection();
    }

    this.checkConnectionIntervalId = setInterval(this.checkConnection.bind(this), this.wsTimeout);
  }

  private tryReconnect() {
    if (!this.reconnect || this.backoff.attempts >= this.reconnectionAttempts) {
      return;
    }

    if (!this.reconnecting) {
      this.reconnecting = true;
    }

    this.clearTryReconnectTimeout();

    this.tryReconnectTimeoutId = setTimeout(() => this.connect(), this.backoff.duration());
  }

  private checkConnection() {
    if (this.reconnecting) return;

    if (this.wasKeepAliveReceived) {
      this.wasKeepAliveReceived = false;
      return;
    }

    this.close(false, true);
  }

  private checkMaxConnectTimeout() {
    this.clearMaxConnectTimeout();

    // Max timeout trying to connect
    this.maxConnectTimeoutId = setTimeout(() => {
      if (this.status !== this.wsImpl.OPEN) {
        this.reconnecting = true;
        this.close(false, true);
      }
    }, this.maxConnectTimeGenerator.duration());
  }

  private createMaxConnectTimeGenerator() {
    const minValue = this.minWsTimeout;
    const maxValue = this.wsTimeout;

    return new Backoff({
      min: minValue,
      max: maxValue,
      factor: 1.2,
    });
  }

  private clearCheckConnectionInterval() {
    if (this.checkConnectionIntervalId) {
      clearInterval(this.checkConnectionIntervalId);
      this.checkConnectionIntervalId = null;
    }
  }

  private clearMaxConnectTimeout() {
    if (this.maxConnectTimeoutId) {
      clearTimeout(this.maxConnectTimeoutId);
      this.maxConnectTimeoutId = null;
    }
  }

  private clearTryReconnectTimeout() {
    if (this.tryReconnectTimeoutId) {
      clearTimeout(this.tryReconnectTimeoutId);
      this.tryReconnectTimeoutId = null;
    }
  }
}
