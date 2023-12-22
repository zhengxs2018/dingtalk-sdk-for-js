# @zhengxs/wechaty-puppet-dingtalk

> WIP

基于 钉钉 Stream API 开发的 wechaty 傀儡。

## 使用

只支持 Node.js >= 18 的版本。

### 安装

```sh
# With NPM
$ pnpm add @zhengxs/wechaty-puppet-dingtalk @zhengxs/wechaty-dingtalk-message
```

### 示例

支持 `企业应用` 和 `第三方应用`，[传送门](https://open-dev.dingtalk.com/fe/app#/corp/app)

```js
import { PuppetDingTalk } from '@zhengxs/wechaty-puppet-dingtalk';
import { WechatyBuilder } from 'wechaty';

const bot = WechatyBuilder.build({
  puppet: new PuppetDingTalk({
    clientId: process.env.DINGTALK_CLIENT_ID,
    clientSecret: process.env.DINGTALK_CLIENT_SECRET,
  }),
});

bot.on('message', async msg => {
  // 发送文本消息
  await msg.say('dong');

  // 支持群聊
  const room = msg.room();

  if (room) {
    // 发送文本消息并且 @ 发送者
    await room.say('dong', msg.talker());

    return;
  }

  // 支持私聊
  msg.say('dong');
});

bot.start();
```

### Wechat 原生消息支持

目前仅支持 `UrlLink` 类消息。

```js
// msg.wechaty === bot
const { UrlLink } = msg.wechaty;

// 发送链接
await msg.say(
  new UrlLink({
    title: '测试',
    description: '这是一个Link消息',
    url: 'https://open.dingtalk.com/document/',
    thumbnailUrl: 'https://img.alicdn.com/tfs/TB1NwmBEL9TBuNjy1zbXXXpepXa-2400-1218.png',
  }),
);
```

### 钉钉其他消息格式

通过 `@zhengxs/wechaty-dingtalk-message` 模块支持的消息。

```js
import { ActionCard, FeedCard, Markdown } from '@zhengxs/wechaty-dingtalk-message';

// 发送 markdown
await msg.say(
  new Markdown({
    title: '测试',
    text: '## 这是 markdown 测试 \n [百度](https://www.baidu.com/)',
  }),
);

// 整体跳转 ActionCard 类型
await msg.say(
  new ActionCard({
    title: '打造一间咖啡厅',
    text: '![screenshot](https://img.alicdn.com/tfs/TB1NwmBEL9TBuNjy1zbXXXpepXa-2400-1218.png) \n #### 乔布斯 20 年前想打造的苹果咖啡厅 \n\n Apple Store 的设计正从原来满满的科技感走向生活化，而其生活化的走向其实可以追溯到 20 年前苹果一个建立咖啡馆的计划',
    singleTitle: '阅读全文',
    singleURL: 'https://www.dingtalk.com/',
  }),
);

// 独立跳转 ActionCard 类型
await msg.say(
  new ActionCard({
    title: '乔布斯 20 年前想打造一间苹果咖啡厅，而它正是 Apple Store 的前身',
    text: '![screenshot](https://img.alicdn.com/tfs/TB1NwmBEL9TBuNjy1zbXXXpepXa-2400-1218.png) \n\n #### 乔布斯 20 年前想打造的苹果咖啡厅 \n\n Apple Store 的设计正从原来满满的科技感走向生活化，而其生活化的走向其实可以追溯到 20 年前苹果一个建立咖啡馆的计划',
    btnOrientation: '0',
    btns: [
      {
        title: '内容不错',
        actionURL: 'https://www.dingtalk.com/',
      },
      {
        title: '不感兴趣',
        actionURL: 'https://www.dingtalk.com/',
      },
    ],
  }),
);

// 发送 FeedCard
await msg.say(
  new FeedCard({
    links: [
      {
        title: '时代的火车向前开1',
        messageURL: 'https://www.dingtalk.com/',
        picURL: 'https://img.alicdn.com/tfs/TB1NwmBEL9TBuNjy1zbXXXpepXa-2400-1218.png',
      },
      {
        title: '时代的火车向前开2',
        messageURL: 'https://www.dingtalk.com/',
        picURL: 'https://img.alicdn.com/tfs/TB1NwmBEL9TBuNjy1zbXXXpepXa-2400-1218.png',
      },
    ],
  }),
);
```

## 待办列表

- 聊天
  - [x] 群聊
    - [x] 提及对象
  - [x] 私聊
- 接收消息
  - [x] 文本
  - [ ] 富文本
  - [ ] 图片
  - [ ] 音频
  - [ ] 视频
  - [ ] 文件
- 发送消息
  - [x] 文本
  - [ ] 图片
  - [ ] 音频
  - [ ] 视频
  - [ ] 文件
  - [x] Link
  - [x] ActionCard - 由 `@zhengxs/wechaty-dingtalk-message` 提供支持
  - [x] Markdown - 由 `@zhengxs/wechaty-dingtalk-message` 提供支持
  - [x] FeedCard - 由 `@zhengxs/wechaty-dingtalk-message` 提供支持
- 互动卡片
  - [ ] 接收
  - [ ] 发送
  - [ ] 更新
- 其他
  - [ ] 消息引用内容

## License

MIT
