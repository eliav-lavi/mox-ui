import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { PersistedEndpoint } from '../models/endpoint';
import { Verb } from '../models/verb'
import * as _ from 'lodash'

export enum EndpointDialogType {
  Add,
  Edit
}

export interface DialogData {
  type: EndpointDialogType
  persistedEndpoint?: PersistedEndpoint;
}

const ResponseTimeValidator: ValidatorFn = (fg: FormGroup) => {
  const start = fg.get('minResponseMillis')?.value;
  const end = fg.get('maxResponseMillis')?.value;

  switch (fg.controls.responseTimeToggle.value) {
    case ResponseTimeType.Off:
      return null
    case ResponseTimeType.Fixed:
      return start > 0 ? null : { range: true }
    case ResponseTimeType.Range:
      return start > 0 && end > start ? null : { range: true }
  }
};

function jsonValidator(control: AbstractControl): ValidationErrors | null {
  try {
    JSON.parse(control.value);
  } catch (e) {
    return { jsonInvalid: true };
  }

  return null;
};

export enum ResponseTimeType {
  Off = 'off',
  Fixed = 'fixed',
  Range = 'range'
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
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }


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

    if (this.data.persistedEndpoint?.minResponseMillis && this.data.persistedEndpoint?.maxResponseMillis) {
      this.endpointForm.controls.responseTimeToggle.setValue(ResponseTimeType.Range)
    } else if (this.data.persistedEndpoint?.minResponseMillis) {
      this.endpointForm.controls.responseTimeToggle.setValue(ResponseTimeType.Fixed)
    } else {
      this.endpointForm.controls.responseTimeToggle.setValue(ResponseTimeType.Off)
    }
    this.handleResponseTimeToggle()
  }

  cancel(): void {
    this.dialogRef.close();
  }

  create(): void {
    switch (this.endpointForm.controls.responseTimeToggle.value) {
      case (ResponseTimeType.Off):
        this.clearResponseTime('min')
        this.clearResponseTime('max')
      case (ResponseTimeType.Fixed):
        this.clearResponseTime('max')
    }
    this.setHeadersAsObject()
    this.dialogRef.close(this.endpointForm.value);
  }

  setHeadersAsObject() {
    this.endpointForm.controls.headers.setValue(this.headersAsObject())
  }
  headersAsObject() {
    return JSON.parse(this.endpointForm.controls.headers.value)
  }

  clearResponseTime(type: 'min' | 'max') {
    this.endpointForm.controls[`${type}ResponseMillis`].setValue(null);
  }

  getMinResponseTimeAttributes(): { show: boolean, enabled: boolean, title: string } {
    switch (this.endpointForm.controls.responseTimeToggle.value) {
      case ResponseTimeType.Off:
        return { show: true, enabled: false, title: 'Response Time' }
      case ResponseTimeType.Fixed:
        return { show: true, enabled: true, title: 'Response Time' }
      case ResponseTimeType.Range:
        return { show: true, enabled: true, title: 'Min Response Time' }
    }
  }

  getMaxResponseTimeAttributes(): { show: boolean, enabled: boolean, title: string } {
    switch (this.endpointForm.controls.responseTimeToggle.value) {
      case ResponseTimeType.Off:
        return { show: false, enabled: false, title: null }
      case ResponseTimeType.Fixed:
        return { show: false, enabled: false, title: null }
      case ResponseTimeType.Range:
        return { show: true, enabled: true, title: 'Max Response Time' }
    }
  }

  handleResponseTimeToggle() {
    this.getMinResponseTimeAttributes().enabled ? this.endpointForm.controls.minResponseMillis.enable() : this.endpointForm.controls.minResponseMillis.disable();
    this.getMaxResponseTimeAttributes().enabled ? this.endpointForm.controls.maxResponseMillis.enable() : this.endpointForm.controls.maxResponseMillis.disable();
  }

  endpointForm = new FormGroup({
    verb: new FormControl(this.data.persistedEndpoint?.verb || '', [Validators.required]),
    path: new FormControl(this.data.persistedEndpoint?.path || '', [Validators.required, Validators.pattern(/\/.+/)]),
    statusCode: new FormControl(this.data.persistedEndpoint?.statusCode || 200, [Validators.required, Validators.pattern(/\d{3,3}/)]),
    returnValue: new FormControl(this.data.persistedEndpoint?.returnValue || '', [Validators.required]),
    headers: new FormControl(JSON.stringify(this.data.persistedEndpoint?.headers, undefined, 4) || '{}', [jsonValidator]),
    responseTimeToggle: new FormControl(ResponseTimeType.Off),
    minResponseMillis: new FormControl({ value: this.data.persistedEndpoint?.minResponseMillis || null, disabled: true }),
    maxResponseMillis: new FormControl({ value: this.data.persistedEndpoint?.maxResponseMillis || null, disabled: true })
  }, [ResponseTimeValidator]);
}
