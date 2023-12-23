import { APIResource } from '../../../resource';
import * as InstancesAPI from './instances';

export class InteractiveCards extends APIResource {
  instances = new InstancesAPI.Instances(this._client);
}

export namespace InteractiveCards {
  export type Instances = InstancesAPI.Instances;
  export type InstanceCreateParams = InstancesAPI.InstanceCreateParams;
  export type InstanceCreateParamsRoom = InstancesAPI.InstanceCreateParamsRoom;
  export type InstanceCreateParamsNonRoom = InstancesAPI.InstanceCreateParamsNonRoom;
  export type InstanceCreation = InstancesAPI.InstanceCreation;
}
