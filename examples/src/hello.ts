import path from 'node:path';
import { fileURLToPath } from 'node:url'

import { PuppetDingTalk } from '@zhengxs/wechaty-puppet-dingtalk';
import { FileBox } from 'file-box';
import { WechatyBuilder } from 'wechaty';

const __dirname =  path.dirname(fileURLToPath(import.meta.url));

const puppet = new PuppetDingTalk({
  clientId: process.env.DINGTALK_CLIENT_ID,
  clientSecret: process.env.DINGTALK_CLIENT_SECRET,
});

const bot = WechatyBuilder.build({
  puppet,
});

bot.on('message', async msg => {
  const MessageTypes = bot.Message.Type;

  switch (msg.type()) {
    case MessageTypes.Attachment:
    case MessageTypes.Audio:
    case MessageTypes.Video:
    case MessageTypes.Image: {
      const fileBox = await msg.toFileBox();
      const saveTo = path.resolve(__dirname, 'data', fileBox.name);

      await fileBox.toFile(saveTo);
      await msg.say(`File saved to: ${saveTo}`);
      break;
    }

    case MessageTypes.Text: {
      if (msg.text() === 'ding') {
        await msg.say('dong');
        break;
      }

      await msg.say(FileBox.fromUrl('https://www.baidu.com/img/PCfb_5bf082d29588c07f842ccde3f97243ea.png'));
      break;
    }

    default:
      await msg.say(`unhandled message: ${msg.toString()}`);
  }
});

await bot.start();
console.log('Bot Started.');
