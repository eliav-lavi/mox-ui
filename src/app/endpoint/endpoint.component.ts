import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { PersistedEndpoint } from '../models/endpoint';

@Component({
  selector: 'app-endpoint',
  templateUrl: './endpoint.component.html',
  styleUrls: ['./endpoint.component.scss']
})
export class EndpointComponent implements OnInit {
  constructor() { }

  @Input() endpoint: PersistedEndpoint;
  @Output() removeRequest = new EventEmitter<PersistedEndpoint>();
  @Output() editRequest = new EventEmitter<PersistedEndpoint>();


  responseTimeData: { enabled: boolean, icon?: string, responseTimeStr?: string }

  ngOnInit(): void {
    if (this.endpoint.minResponseMillis && this.endpoint.maxResponseMillis) {
      this.responseTimeData = { enabled: true, icon: "linear_scale", responseTimeStr: `${this.endpoint.minResponseMillis}ms - ${this.endpoint.maxResponseMillis}ms` }
    } else if (this.endpoint.minResponseMillis) {
      this.responseTimeData = { enabled: true, icon: "timer", responseTimeStr: `${this.endpoint.minResponseMillis}ms` }
    } else {
      this.responseTimeData = { enabled: false }
    }

  }
  remove() {
    this.removeRequest.emit(this.endpoint);
  }

  edit() {
    this.editRequest.emit(this.endpoint)
  }
}
