export interface GraphAPIResponse {
  response: {
    statusLine?: {
      code?: number;
      reasonPhrase?: string;
    };
    headers?: Record<string, string>;
    body?: string;
  };
}

export type SendMessage = {
  code?: number;
  message?: string;
  headers: Record<string, string>;
  data: string;
};

export type ParsedEvent = {
  specVersion: string;
  type: OperationType;
  headers: {
    appId: string;
    connectionId: string;
    IncomingType: string;
    messageId: string;
    time: string;
    topic: string;
    eventType?: string;
    eventBornTime?: string;
    eventId?: string;
    eventCorpId?: string;
    eventUnifiedAppId?: string;
  };
  data: string;
};

export type EffectCleanup = () => void;

export type OperationType = 'EVENT' | 'SYSTEM' | 'CALLBACK';

export type OperationOption = Operation.Option;

export interface Operation {
  options: Operation.Option[];
  handler: Operation.Handler;
}

export namespace Operation {
  export type Handler = (event: ParsedEvent) => void;

  export type Option = {
    type: OperationType;
    topic: (NonNullable<unknown> & string) | '*';
  };
}

export type ConnectionParamsOptions = {
  ua?: string;
  subscriptions?: OperationOption[];
};
