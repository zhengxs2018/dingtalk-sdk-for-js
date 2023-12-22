import * as PUPPET from 'wechaty-puppet';

import { PuppetDingTalk } from '../../puppet-dingtalk';
import { type DTMessageRawPayload, DTMessageType } from '../schemas';

export async function dtMessageToWechaty(
  _: PuppetDingTalk,
  payload: DTMessageRawPayload,
): Promise<PUPPET.payloads.Message> {
  const ret: PUPPET.payloads.Message = {
    id: payload.msgId,
    talkerId: payload.senderId,
    text: undefined,
    timestamp: payload.createAt,
    listenerId: payload.senderId,
    type: PUPPET.types.Message.Unknown,
  } as PUPPET.payloads.Message;

  if (payload.conversationType === '2') {
    ret.roomId = payload.conversationId;
    // @ts-expect-error
    ret.mentionIdList = payload.atUsers?.map(u => u.dingtalkId) || [];
  }

  // TODO: support more msgtype
  switch (payload.msgtype) {
    case DTMessageType.Text:
      ret.text = payload.text.content;
      ret.type = PUPPET.types.Message.Text;
      break;
    case DTMessageType.Audio:
      ret.type = PUPPET.types.Message.Audio;
      ret.text = payload.content.recognition;
      break;
    case DTMessageType.Video:
      ret.type = PUPPET.types.Message.Video;
      break;
    case DTMessageType.Image:
      ret.type = PUPPET.types.Message.Image;
      break;
    case DTMessageType.File:
      ret.type = PUPPET.types.Message.Attachment;
      ret.text = payload.content.fileName;
      break;
    case DTMessageType.Unknown:
      ret.text = payload.content.unknownMsgType;
      break;
  }

  return ret;
}

// {
//   conversationId: 'cid8tfOR+7uip234mJoPjImGsuJt4fHDZ7qaZmlW1GdaOk=',
//   chatbotCorpId: 'ding7112a6c325a0edecee0f45d8e4f7c288',
//   chatbotUserId: '$:LWCP_v1:$5w23e+uJKMOAfM1Q7F2qA5s2a95g5UsN',
//   msgId: 'msgXei2goecpfoitYbNjCo5NA==',
//   senderNick: '阿ຼ森໌້ᮨ',
//   isAdmin: true,
//   senderStaffId: '030008551219215',
//   sessionWebhookExpiredTime: 1703273334222,
//   createAt: 1703267933949,
//   senderCorpId: 'ding7112a6c325a0edecee0f45d8e4f7c288',
//   conversationType: '1',
//   senderId: '$:LWCP_v1:$pTZor09tFmT3sHMgZEYEow==',
//   sessionWebhook: 'https://oapi.dingtalk.com/robot/sendBySession?session=c6033f6d49026c447863c479166654b8',
//   text: { content: '1' },
//   robotCode: 'dinguqpp3plqvllptchj',
//   msgtype: 'text'
// }

// {
//   conversationId: 'cid8tfOR+7uip234mJoPjImGsuJt4fHDZ7qaZmlW1GdaOk=',
//   chatbotCorpId: 'ding7112a6c325a0edecee0f45d8e4f7c288',
//   chatbotUserId: '$:LWCP_v1:$5w23e+uJKMOAfM1Q7F2qA5s2a95g5UsN',
//   msgId: 'msggw+ujvfAJAmpGLqAXE5lrg==',
//   senderNick: '阿ຼ森໌້ᮨ',
//   isAdmin: true,
//   senderStaffId: '030008551219215',
//   sessionWebhookExpiredTime: 1703273378129,
//   createAt: 1703267977946,
//   content: {
//     pictureDownloadCode: 'lmrX1ebuPUuxGEAZuLupIadhCG3ULHirt65MyrTkbxPnmNG5KUey7704xUybmzgZKL6Vccix36e/9pZPoLDkLj5VwLUg283rhIclWnTTVv6GjR8WXpE1gRyEquHUKpPDxH0ZFjIZmBiDTDRlIjdhtOMLwpvYfXnEC/dFmKv1qkc=',
//     downloadCode: 'mIofN681YE3f/+m+NntqpYLLSf9G/KEKkjEFFgizQvkdYt1ykJv6frSk4dn7eWjN4zxtzdGcejSslMnMughnc2ID2/4i8GgarYE2K8UcFIb6Y8E9lxrxFF219gaSA4rkG2chzjCynaqz9RieoWZ2x43gSHtvi4hZDD8ZzDMsl4RXc4ra3J2O5NeEf2nWP0OL'
//   },
//   senderCorpId: 'ding7112a6c325a0edecee0f45d8e4f7c288',
//   conversationType: '1',
//   senderId: '$:LWCP_v1:$pTZor09tFmT3sHMgZEYEow==',
//   sessionWebhook: 'https://oapi.dingtalk.com/robot/sendBySession?session=c6033f6d49026c447863c479166654b8',
//   robotCode: 'dinguqpp3plqvllptchj',
//   msgtype: 'picture'
// }
