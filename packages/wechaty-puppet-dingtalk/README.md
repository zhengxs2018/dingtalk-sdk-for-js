<h1>钉钉对话机器人</h1>

结合 Wechaty，打造对话式机器人，适用于所有钉钉应用的开发者。

> 只支持 Node.js >= 18 的版本。

## 📦 安装

要安装 SDK，请运行以下命令:

```sh
# With NPM
$ npm i -S @zhengxs/wechaty-puppet-dingtalk @zhengxs/wechaty-dingtalk-message

# With YARN
$ yarn add @zhengxs/wechaty-puppet-dingtalk @zhengxs/wechaty-dingtalk-message

# With PNPM
$ pnpm install @zhengxs/wechaty-puppet-dingtalk @zhengxs/wechaty-dingtalk-message
```

## 👋 使用

创建一个 [钉钉应用](https://open-dev.dingtalk.com/fe/app#/corp/app)，并运行以下代码：

> 支持 `企业应用` 和 `第三方应用`，可根据自身情况选择。

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
  log.info('StarterBot', msg.toString());

  if (msg.text() === 'ding') {
    await msg.say('dong');
  }
});

bot.start();
```

## 📖 使用文档

在 [Wiki](https://github.com/zhengxs2018/dingtalk-sdk-for-js/wiki) 上阅读完整文档。

## 📝 License

MIT
