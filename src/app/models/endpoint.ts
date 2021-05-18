export class Endpoint {
  verb: string;
  path: string;
  returnValue: string;
  minResponseMillis?: number;
  maxResponseMillis?: number;

  constructor(json) {
    this.verb = json['verb'];
    this.path = json['path'];
    this.returnValue = json['returnValue'];
    this.minResponseMillis = json['minResponseMillis'];
    this.maxResponseMillis = json['maxResponseMillis'];
  }
}

export class PersistedEndpoint extends Endpoint {
  id: string;

  constructor(json) {
    super(json)
    this.id = json['id'];
  }
}