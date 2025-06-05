import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { DataTableComponent } from './data-table/data-table.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule // Import CommonModule for *ngFor, *ngIf, etc.
  ],
  providers: [provideHttpClient(withFetch())],
})
export class AppModule { }
