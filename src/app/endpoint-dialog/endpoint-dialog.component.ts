import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PersistedEndpoint } from '../models/endpoint';
import { Verb } from '../models/verb'

export enum EndpointDialogType {
  Add,
  Edit
}

export interface DialogData {
  type: EndpointDialogType
  persistedEndpoint?: PersistedEndpoint;
}

@Component({
  selector: 'app-endpoint-dialog',
  templateUrl: './endpoint-dialog.component.html',
  styleUrls: ['./endpoint-dialog.component.scss']
})
export class EndpointDialogComponent implements OnInit {

  verbs = Object.values(Verb)

  confirmCaption: string;
  title: string;

  constructor(
    public dialogRef: MatDialogRef<EndpointDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}


  ngOnInit(): void {
    switch (this.data.type) {
      case EndpointDialogType.Edit:
        this.confirmCaption = "Update";
        this.title = "Update Existing Endpoint";
        break;
      case EndpointDialogType.Add:
        this.confirmCaption = "Create";
        this.title = "Add New Endpoint";
        break;
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
  
  create(): void {
    this.dialogRef.close(this.endpointForm.value);
  }

  endpointForm = new FormGroup({
    verb: new FormControl(this.data.persistedEndpoint?.verb || '', [Validators.required]),
    path: new FormControl(this.data.persistedEndpoint?.path || '', [Validators.required, Validators.pattern(/\/.+/)]),
    returnValue: new FormControl(this.data.persistedEndpoint?.returnValue || '', [Validators.required])
  });
}
