import {
  type ActionCardMessagePayload,
  type FeedCardMessagePayload,
  type InteractiveCardMessagePayload,
} from '@zhengxs/wechaty-puppet-dingtalk';
import { UrlLinkImpl } from 'wechaty/impls';

// hack 解决 钉钉的消息类型，wechaty 不支持的问题
export class WechatifiedActionCard extends UrlLinkImpl {
  constructor(payload: ActionCardMessagePayload['actionCard']) {
    // @ts-expect-error
    super({ msgtype: 'actionCard', actionCard: payload });
  }
}

// hack 解决 钉钉的消息类型，wechaty 不支持的问题
export class WechatifiedFeedCard extends UrlLinkImpl {
  constructor(payload: FeedCardMessagePayload['feedCard']) {
    // @ts-expect-error
    super({ msgtype: 'feedCard', feedCard: payload });
  }
}

export class WechatifiedInteractiveCard extends UrlLinkImpl {
  constructor(payload: InteractiveCardMessagePayload['interactiveCard']) {
    // @ts-expect-error
    super({ msgtype: 'interactive-card', interactiveCard: payload });
  }
}
