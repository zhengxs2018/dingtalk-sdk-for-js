import os from 'node:os'
import path from 'node:path';
import { unlinkSync } from 'node:fs';

import { fileURLToPath } from 'node:url';

import { PuppetDingTalk } from '@zhengxs/wechaty-puppet-dingtalk';
import { FileBox } from 'file-box';
import { WechatyBuilder } from 'wechaty';

import { getAudioDurationInSeconds } from 'get-audio-duration'

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const puppet = new PuppetDingTalk({
  clientId: process.env.DINGTALK_CLIENT_ID,
  clientSecret: process.env.DINGTALK_CLIENT_SECRET,
  async getAudioDurationInSeconds(fileBox) {
    const saveTo = path.resolve(os.tmpdir(), fileBox.name)

    await fileBox.toFile(saveTo)

    try {
      return await getAudioDurationInSeconds(saveTo)
    } finally {
      unlinkSync(saveTo)
    }
  },
})

const bot = WechatyBuilder.build({
  puppet
});

bot.on('message', async msg => {
  const MessageTypes = bot.Message.Type;

  switch (msg.type()) {
    case MessageTypes.Attachment:
    case MessageTypes.Audio:
    case MessageTypes.Video:
    case MessageTypes.Image: {
      const fileBox = await msg.toFileBox();
      const saveTo = path.resolve(__dirname, 'data', fileBox.name)

      await fileBox.toFile(saveTo)

      await msg.say(`File saved to: ${saveTo}`);
      break;
    }

    case MessageTypes.Text: {
      if (msg.text() === 'ding') {
        await msg.say('dong')
      }

      await msg.say(FileBox.fromUrl('https://downsc.chinaz.net/Files/DownLoad/sound1/202311/y2300.mp3'));
      break;
    }

    default:
      await msg.say(`unhandled message: ${msg.toString()}`);
  }
});

bot.start();
