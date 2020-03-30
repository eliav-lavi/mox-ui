import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { PersistedEndpoint, Endpoint } from '../models/endpoint';
import { EndpointDialogComponent, EndpointDialogType } from '../endpoint-dialog/endpoint-dialog.component';
import { EndpointService } from '../endpoint.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import * as fileSaver from 'file-saver';
import { Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss']
})
export class ManagerComponent implements OnInit {

  endpoints: PersistedEndpoint[] = [];

  constructor(
    public dialog: MatDialog,
    private endpointService: EndpointService) { }

  ngOnInit() {
    this.endpointService.getAllEndpoints().subscribe(endpoints => this.endpoints = endpoints)
  }


  addEndpoint(): void {
    const dialogRef = this.dialog.open(EndpointDialogComponent, { data: { type: EndpointDialogType.Add } });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let endpoint = new Endpoint(result);
        this.endpointService.addEndpoint(endpoint).subscribe(endpoint => this.endpoints.push(endpoint));
      };
    });
  }

  updateEndpoint(persistedEndpoint: PersistedEndpoint): void {
    const dialogRef = this.dialog.open(EndpointDialogComponent,
      { data: { type: EndpointDialogType.Edit, persistedEndpoint: persistedEndpoint } });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        result['id'] = persistedEndpoint.id;
        let updatedEndpointRequest = new PersistedEndpoint(result);
        this.endpointService
          .updateEndpoint(updatedEndpointRequest)
          .subscribe(persistedEndpoint => {
            const i = this.endpoints.findIndex(ep => ep.id == persistedEndpoint.id);
            this.endpoints[i] = persistedEndpoint;
          }
          );
      };
    });
  }

  removeEndpoint(endpoint: PersistedEndpoint): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.endpointService
          .removeEndpoint(endpoint)
          .subscribe(_ => this.endpoints = this.endpoints
            .filter(ep => !(ep.verb == endpoint.verb && ep.path == endpoint.path))
          )
      };
    });
  }

  removeAllEndpoints(): void {
    this.endpointService.getAllEndpoints()
      .pipe(flatMap(endpoints => endpoints.map(endpoint => this.endpointService.removeEndpoint(endpoint).subscribe())))
      .subscribe(_ => this.endpoints = [])
  }

  saveEndpointsSchema(): void {
    this.endpointService.downloadEndpointsSchema().subscribe(response => {
      const blob: any = new Blob([JSON.stringify(response)], { type: 'text/json; charset=utf-8' });
      fileSaver.saveAs(blob, "endpoints-schema.json");
    }), error => console.log('Error downloading the file'),
      () => console.info('File downloaded successfully');
  }

  readFile = (blob) => Observable.create(obs => {
    if (!(blob instanceof Blob)) {
      obs.error(new Error('`blob` must be an instance of File or Blob.'));
      return;
    }

    const reader = new FileReader();

    reader.onerror = err => obs.error(err);
    reader.onabort = err => obs.error(err);
    reader.onload = () => obs.next(reader.result);
    reader.onloadend = () => obs.complete();

    return reader.readAsText(blob);
  });

  loadEndpointsSchema(event): void {
    this.readFile(event.target.files[0]).subscribe(rawEndpoints => {
      const parsedEndpoints = JSON.parse(rawEndpoints)
      this.endpointService.uploadEndpointsSchema(parsedEndpoints)
        .subscribe(endpoints => this.endpoints = this.endpoints.concat(endpoints))
    }
    )
  }
}