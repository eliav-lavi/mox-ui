import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpResponse } from '@angular/common/http';
import { Endpoint, PersistedEndpoint } from './models/endpoint';
import { catchError, map, tap } from 'rxjs/operators';
import * as humps from 'humps';
import { global } from '@angular/compiler/src/util';
import { Observable } from 'rxjs';
import { NotificationService } from './notification.service';
import { Notification, NotificationLevel } from './models/notification';


@Injectable({
  providedIn: 'root'
})
export class EndpointService {
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  private httpOptions = { headers: this.httpHeaders };
  private serverUrl = 'http://0.0.0.0:9898'

  constructor(private http: HttpClient, private notificationService: NotificationService) { }

  getAllEndpoints(): Observable<PersistedEndpoint[]> {
    return this.http.get<PersistedEndpoint[]>(`${this.serverUrl}/endpoint`, this.httpOptions).pipe(
      map(res => humps.camelizeKeys(res)),
      map(res => res['response'].map(json => new PersistedEndpoint(json))),
      tap(res => this.notificationService.notify(new Notification(new Date(), NotificationLevel.Info, `fetched ${res.length} existing endpoints`)))
    )
      ;
  }

  addEndpoint(endpoint: Endpoint): Observable<PersistedEndpoint> {
    return this.http.post<Endpoint>(`${this.serverUrl}/endpoint`, humps.decamelizeKeys(endpoint as Object), this.httpOptions).pipe(
      map(res => humps.camelizeKeys(res)),
      map(res => new PersistedEndpoint(res['response'])),
      tap((newEndpoint: PersistedEndpoint) => this.notificationService.notify(new Notification(new Date(), NotificationLevel.Info, `added new endpoint ${newEndpoint.verb} ${newEndpoint.path}`)))
    );
  }


  updateEndpoint(endpoint: PersistedEndpoint): Observable<PersistedEndpoint> {
    return this.http.put<PersistedEndpoint>(`${this.serverUrl}/endpoint`, humps.decamelizeKeys(endpoint as Object), this.httpOptions).pipe(
      map(res => humps.camelizeKeys(res)),
      map(res => new PersistedEndpoint(res['response'])),
      tap((newEndpoint: PersistedEndpoint) => this.notificationService.notify(new Notification(new Date(), NotificationLevel.Info, `updated endpoint ${newEndpoint.verb} ${newEndpoint.path}`)))
    );
  }

  removeEndpoint(endpoint: PersistedEndpoint) {
    return this.http.delete(`${this.serverUrl}/endpoint?id=${endpoint.id}`, this.httpOptions).pipe(
      map(res => humps.camelizeKeys(res)),
      map(res => new PersistedEndpoint(res['response'])),
      tap((newEndpoint: PersistedEndpoint) => this.notificationService.notify(new Notification(new Date(), NotificationLevel.Info, `removed endpoint ${newEndpoint.verb} ${newEndpoint.path}`)))
    )
  }

  downloadEndpointsSchema(): Observable<any> {
    return this.http.get(`${this.serverUrl}/endpoint`).pipe(
      map(res => res['response'].map(endpoint => {delete endpoint.id; return endpoint})),
      tap(res => this.notificationService.notify(new Notification(new Date(), NotificationLevel.Info, `downloaded schema from server. fetched ${res.length} endpoints`)))
    )
  }

  uploadEndpointsSchema(endpoints): Observable<PersistedEndpoint[]> {
    console.log("from service: " + endpoints.map)
    return this.http.post<Endpoint>(`${this.serverUrl}/endpoints`, humps.decamelizeKeys(endpoints as Object), this.httpOptions).pipe(
      map(res => humps.camelizeKeys(res)),
      map(res => res['response'].map(singleRes =>new PersistedEndpoint(singleRes))),
      tap((res: PersistedEndpoint[]) => this.notificationService.notify(new Notification(new Date(), NotificationLevel.Info, `uploaded schema. added ${res.length} endpoints`)))
    );
  }
}
