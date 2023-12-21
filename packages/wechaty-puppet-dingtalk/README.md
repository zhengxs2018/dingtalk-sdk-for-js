# @zhengxs/wechaty-puppet-dingtalk

> WIP

基于 钉钉 Stream API 开发的 wechaty 傀儡。

## 使用

只支持 Node.js >= 18 的版本。

### 安装

```sh
# With NPM
$ pnpm add @zhengxs/wechaty-puppet-dingtalk
```

### 示例

支持 `企业应用` 和 `第三方应用`，[传送门](https://open-dev.dingtalk.com/fe/app#/corp/app)

```js
import { PuppetDingTalk } from '@zhengxs/wechaty-puppet-dingtalk';
import { log, WechatyBuilder } from 'wechaty';

const puppet = new PuppetDingTalk({
  clientId: process.env['DINGTALK_CLIENT_ID'], // This is the default and can be omitted
  clientSecret: process.env['DINGTALK_CLIENT_SECRET'], // This is the default and can be omitted
});

const bot = WechatyBuilder.build({
  puppet,
});

bot.on('message', async msg => {
  log.info('StarterBot', msg.toString());

  // 发送文本消息
  await msg.say('dong');

  // 发送 URL 卡片
  await msg.say(
    new msg.wechaty.UrlLink({
      title: '测试',
      description: '测试',
      url: 'https://www.baidu.com/',
      thumbnailUrl:
        'https://www.baidu.com/img/PCfb_5bf082d29588c07f842ccde3f97243ea.png',
    }),
  );

  // hack 解决 wechaty 无法发送 markdown 的问题
  await puppet.unstable__send(msg.id, {
    msgtype: 'markdown',
    markdown: {
      title: '测试',
      text: '## 这是 markdown 测试 \n [百度](https://www.baidu.com/)',
    },
  });
});

bot.start();
```

## 待办列表

- [x] 聊天
  - [x] 群聊
    - [x] 提及对象
  - [x] 私聊
- [ ] 接收消息
  - [x] 文本
  - [ ] 富文本
  - [ ] 图片
  - [ ] 音频
  - [ ] 视频
  - [ ] 文件
- [ ] 发送消息
  - [x] 文本
  - [ ] 图片 `puppet.unstable__send()` 支持
  - [ ] 音频 `puppet.unstable__send()` 支持
  - [ ] 视频 `puppet.unstable__send()` 支持
  - [ ] 文件 `puppet.unstable__send()` 支持
  - [ ] ActionCard `puppet.unstable__send()` 支持
  - [ ] Markdown `puppet.unstable__send()` 支持
  - [x] Link
  - [ ] ActionCard `puppet.unstable__send()` 支持
  - [ ] FeedCard `puppet.unstable__send()` 支持
- [ ] 互动卡片
  - [ ] 接收
  - [ ] 发送
  - [ ] 更新

## License

MIT
