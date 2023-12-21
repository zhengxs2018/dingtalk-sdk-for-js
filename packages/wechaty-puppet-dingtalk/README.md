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
  const urlLink = new msg.wechaty.UrlLink({
    title: '测试',
    description: '测试',
    url: 'https://www.baidu.com/',
    thumbnailUrl:
      'https://www.baidu.com/img/PCfb_5bf082d29588c07f842ccde3f97243ea.png',
  });

  await msg.say(urlLink);
});

bot.start();
```

## License

MIT
