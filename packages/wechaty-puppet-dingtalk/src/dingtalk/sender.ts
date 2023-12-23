import { log } from 'wechaty-puppet';

import { type MessagePayload } from './payloads';

export class Sender {
  constructor(
    protected url: string,
    protected expiredTime: number = 0,
  ) {}

  isExpired(): boolean {
    return this.expiredTime < Date.now();
  }

  async send(message: MessagePayload): Promise<void> {
    // 忽略过期的 Webhook
    if (this.isExpired()) {
      log.warn('PuppetDingTalk', 'Sender.send() Webhook 过期，已忽略需要发送的消息');
      return;
    }

    const result = await fetch(this.url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    }).then(res => res.json());

    if (result?.errcode) {
      throw new Error(result.errmsg);
    }
  }
}
