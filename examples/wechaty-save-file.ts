import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { PuppetDingTalk } from '@zhengxs/wechaty-puppet-dingtalk';
import { WechatyBuilder } from 'wechaty';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const bot = WechatyBuilder.build({
  puppet: new PuppetDingTalk({
    clientId: process.env.DINGTALK_CLIENT_ID,
    clientSecret: process.env.DINGTALK_CLIENT_SECRET,
  }),
});

bot.on('message', async msg => {
  const fileBox = await msg.toFileBox();

  await fileBox.toFile(path.resolve(__dirname, fileBox.name));

  msg.say('done');
});

bot.start();
