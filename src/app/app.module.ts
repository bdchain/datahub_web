
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MDBBootstrapModulesPro, MDBSpinningPreloader, ToastModule } from 'ng-uikit-pro-standard';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { AppRoutingModule } from './app-routing.module';
// import { AgmCoreModule } from '@agm/core';
import { AppComponent } from './app.component';
import { FileSizePipe } from './filters/file-size.pip';
import { FSFNComponent } from './layouts/f-s-f-n/f-s-f-n.component';
import { RFNComponent } from './layouts/r-f-n/r-f-n.component';
import { DatasetComponent } from './views/dataset/dataset.component';
import { DatasetsComponent } from './views/datasets/datasets.component';
import { HomeComponent } from './views/home/home.component';
import { NotfoundComponent } from './views/notfound/notfound.component';
import { TableComponent } from './views/table/table.component';

import { FooterComponent } from './layouts/footer/footer.component';

@NgModule({
  declarations: [
    FileSizePipe,
    AppComponent,
    FooterComponent,
    DatasetsComponent,
    RFNComponent,
    FSFNComponent,
    HomeComponent,
    NotfoundComponent,
    TableComponent,
    DatasetComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    ToastModule.forRoot(),
    MDBBootstrapModulesPro.forRoot(),
    TypeaheadModule.forRoot(),
    AppRoutingModule,
  ],
  providers: [MDBSpinningPreloader],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule { }
