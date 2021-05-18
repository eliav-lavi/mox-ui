import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';

import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { EndpointComponent } from './endpoint/endpoint.component';
import { ManagerComponent } from './manager/manager.component';
import { EndpointDialogComponent } from './endpoint-dialog/endpoint-dialog.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { PrettyPrintPipe } from './pretty-print.pipe';

@NgModule({
  declarations: [
    AppComponent,
    EndpointComponent,
    ManagerComponent,
    EndpointDialogComponent,
    ConfirmationDialogComponent,
    NotificationsComponent,
    PrettyPrintPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    HttpClientModule,

    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatDialogModule,
    MatButtonToggleModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
