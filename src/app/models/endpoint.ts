export class Endpoint {
  verb: string;
  path: string;
  statusCode: number;
  returnValue: string;
  headers: { [key: string]: string };
  minResponseMillis?: number;
  maxResponseMillis?: number;

  constructor(json) {
    this.verb = json['verb'];
    this.path = json['path'];
    this.statusCode = json['statusCode'];
    this.returnValue = json['returnValue'];
    this.headers = json['headers'];
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