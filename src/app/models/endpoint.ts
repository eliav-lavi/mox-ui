export class Endpoint {
  verb: string;
  path: string;
  returnValue: string;

  constructor(json) {
    this.verb = json['verb'];
    this.path = json['path'];
    this.returnValue = json['returnValue'];
  }
}

export class PersistedEndpoint extends Endpoint {
  id: string;

  constructor(json) {
    super(json)
    this.id = json['id'];
  }
}