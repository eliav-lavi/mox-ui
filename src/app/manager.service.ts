import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { map, tap, catchError } from 'rxjs/operators';

import { PersistedEndpoint } from './models/endpoint';
import { Observable } from 'rxjs';
import * as humps from 'humps';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  private httpOptions = { headers: this.httpHeaders };
  private serverUrl = 'http://0.0.0.0:9898'
  
  constructor(private http: HttpClient) { }

  getAll(): Observable<PersistedEndpoint[]> {
    return this.http.get<PersistedEndpoint[]>(`${this.serverUrl}/endpoint`, this.httpOptions).pipe(
      tap(res => console.log(res)),
      map(res => humps.camelizeKeys(res)),
      map(res => res['response'].map(json => new PersistedEndpoint(json)))
      );
  }
}
