<div align="center"><a name="readme-top"></a>
  
<h1>钉钉对话机器人</h1>

结合 Wechaty，打造对话式机器人，适用于所有钉钉应用的开发者。

[![][npm-types-shield]][npm-types-link]
[![][npm-release-shield]][npm-release-link]
[![][npm-downloads-shield]][npm-downloads-link]
[![][github-releasedate-shield]][github-releasedate-link]<br/>
[![][github-contributors-shield]][github-contributors-link]
[![][github-forks-shield]][github-forks-link]
[![][github-stars-shield]][github-stars-link]
[![][github-issues-shield]][github-issues-link]
[![][github-license-shield]][github-license-link]
[![][wechaty-poweredby-shield]][wechaty-website-link]

[Report Bug][github-issues-link] · [Request Feature][github-issues-link]

![](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)

</div>

> [!NOTE]
> 钉钉官方有自己的 [Stream SDk][dingtalk-node-link]，如需更多钉钉功能支持，请关注此项目。

> [!WARNING]
> 项目正在开发中，如需在生产中使用，请避免调用 **DingTalkPuppet** 方法。

<details>
<summary><kbd>目录树</kbd></summary>

#### TOC

- [✨ 功能特性](#-功能特性)
- [📦 安装](#-安装)
- [📖 使用文档](#-使用文档)
- [ ⌨️ 本地开发](#-本地开发)
- [🔗 更多工具](#-更多工具)
- [🤝 参与贡献](#-参与贡献)

<br/>

</details>

## ✨ 功能特性

- 🚀 **快速开始**: 只需创建一个钉钉应用，即可轻松启动智能对话机器人。
- 💡 **细节内敛**: 即使不看钉钉文档，也可快速开发一个钉钉机器人。
- 💬 **用户对话**: 可接收用户私聊和群内被提及的消息，并发送消息回复对方。
- ⏳ **持续维护**: 更多功能正在持续开发中，敬请期待。

## 📦 安装

要安装 SDK，请运行以下命令:

```sh
# With NPM
$ npm i -S @zhengxs/wechaty-puppet-dingtalk

# With YARN
$ yarn add @zhengxs/wechaty-puppet-dingtalk

# With PNPM
$ pnpm install @zhengxs/wechaty-puppet-dingtalk
```

<div align="right">

[![][back-to-top]](#readme-top)

</div>

### 👋 使用

创建一个 [钉钉应用](https://open-dev.dingtalk.com/fe/app#/corp/app)，并运行以下代码：

> 支持 `企业应用` 和 `第三方应用`，可根据自身情况选择。

```ts
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

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## ⌨️ 本地开发

可以使用 GitHub Codespaces 进行在线开发：

[![][github-codespace-shield]][github-codespace-link]

或者使用以下命令进行本地开发：

```bash
$ git clone https://github.com/zhengxs2018/wechaty-puppet-dingtalk.git
$ cd wechaty-puppet-dingtalk
$ pnpm install
$ pnpm dev
```

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## 🔗 更多工具

- **[AI SDK](https://github.com/zhengxs2018/ai)** - 集成 百度文心一言，阿里通义千问，腾讯混元助手 和 讯飞星火认知 等国内大模型的 API，并且适配 OpenAI 的输入与输出。
- **[微信智能对话机器人插件](https://github.com/zhengxs2018/wechaty-plugin-assistant)** - 只需三步即可轻松创建一个智能对话机器人

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## 🤝 参与贡献

我们非常欢迎各种形式的贡献。如果你对贡献代码感兴趣，可以查看我们的 GitHub [Issues][github-issues-link] 大展身手，向我们展示你的奇思妙想。

[![][pr-welcome-shield]][pr-welcome-link]

[![][github-contrib-shield]][github-contrib-link]

<div align="right">

[![][back-to-top]](#readme-top)

</div>

---

#### 📝 License

Copyright © 2023 [zhengxs2018][profile-link]. <br />
This project is [MIT](./LICENSE) licensed.

<div align="right">

[![][back-to-top]](#readme-top)

</div>

[dingtalk-node-link]: https://github.com/open-dingtalk/dingtalk-stream-sdk-nodejs
[back-to-top]: https://img.shields.io/badge/-BACK_TO_TOP-black?style=flat-square
[wechaty-website-link]: https://wechaty.js.org
[wechaty-poweredby-shield]: https://img.shields.io/badge/Powered%20By-Wechaty-brightgreen.svg?labelColor=black&style=flat-square
[npm-release-shield]: https://img.shields.io/npm/v/@zhengxs/wechaty-puppet-dingtalk?color=369eff&labelColor=black&logo=npm&logoColor=white&style=flat-square
[npm-release-link]: https://www.npmjs.com/package/@zhengxs/wechaty-puppet-dingtalk
[npm-downloads-shield]: https://img.shields.io/npm/dt/@zhengxs/wechaty-puppet-dingtalk?labelColor=black&style=flat-square
[npm-downloads-link]: https://www.npmjs.com/package/@zhengxs/wechaty-puppet-dingtalk
[npm-types-shield]: https://img.shields.io/npm/types/@zhengxs/wechaty-puppet-dingtalk?labelColor=black&style=flat-square
[npm-types-link]: https://www.npmjs.com/package/@zhengxs/wechaty-puppet-dingtalk
[npm-release-shield]: https://img.shields.io/npm/v/@zhengxs/dingtalk-sdk-for-js?color=369eff&labelColor=black&logo=npm&logoColor=white&style=flat-square
[npm-release-link]: https://www.npmjs.com/package/@zhengxs/dingtalk-sdk-for-js
[profile-link]: https://github.com/zhengxs2018
[github-issues-link]: https://github.com/zhengxs2018/dingtalk-sdk-for-js/issues
[pr-welcome-shield]: https://img.shields.io/badge/%F0%9F%A4%AF%20PR%20WELCOME-%E2%86%92-ffcb47?labelColor=black&style=for-the-badge
[pr-welcome-link]: https://github.com/zhengxs2018/dingtalk-sdk-for-js/pulls
[github-contrib-shield]: https://contrib.rocks/image?repo=zhengxs2018%2Fdingtalk-sdk-for-js
[github-contrib-link]: https://github.com/zhengxs2018/dingtalk-sdk-for-js/graphs/contributors
[github-codespace-shield]: https://github.com/codespaces/badge.svg
[github-codespace-link]: https://codespaces.new/zhengxs2018/dingtalk-sdk-for-js
[github-releasedate-shield]: https://img.shields.io/github/release-date/zhengxs2018/dingtalk-sdk-for-js?labelColor=black&style=flat-square
[github-releasedate-link]: https://github.com/zhengxs2018/dingtalk-sdk-for-js/releases
[github-contributors-shield]: https://img.shields.io/github/contributors/zhengxs2018/dingtalk-sdk-for-js?color=c4f042&labelColor=black&style=flat-square
[github-contributors-link]: https://github.com/zhengxs2018/dingtalk-sdk-for-js/graphs/contributors
[github-forks-shield]: https://img.shields.io/github/forks/zhengxs2018/dingtalk-sdk-for-js?color=8ae8ff&labelColor=black&style=flat-square
[github-forks-link]: https://github.com/zhengxs2018/dingtalk-sdk-for-js/network/members
[github-stars-shield]: https://img.shields.io/github/stars/zhengxs2018/dingtalk-sdk-for-js?color=ffcb47&labelColor=black&style=flat-square
[github-stars-link]: https://github.com/zhengxs2018/dingtalk-sdk-for-js/network/stargazers
[github-issues-shield]: https://img.shields.io/github/issues/zhengxs2018/dingtalk-sdk-for-js?color=ff80eb&labelColor=black&style=flat-square
[github-issues-link]: https://github.com/zhengxs2018/dingtalk-sdk-for-js/issues
[github-license-shield]: https://img.shields.io/github/license/zhengxs2018/dingtalk-sdk-for-js?color=white&labelColor=black&style=flat-square
[github-license-link]: https://github.com/zhengxs2018/dingtalk-sdk-for-js/blob/main/LICENSE
