import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PersistedEndpoint } from '../models/endpoint';

@Component({
  selector: 'app-endpoint',
  templateUrl: './endpoint.component.html',
  styleUrls: ['./endpoint.component.scss']
})
export class EndpointComponent {
  constructor() { }

  @Input() endpoint: PersistedEndpoint;
  @Output() removeRequest = new EventEmitter<PersistedEndpoint>();
  @Output() editRequest = new EventEmitter<PersistedEndpoint>();

  remove() {
    this.removeRequest.emit(this.endpoint);
  }

  edit() {
    this.editRequest.emit(this.endpoint)
  }
}
