import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { IatecLayoutModule } from './iatec-layout/iatec-layout.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot([{ path: '', component: AppComponent }]),
    IatecLayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
