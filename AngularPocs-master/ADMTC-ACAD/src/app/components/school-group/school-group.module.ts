import { NgModule } from '@angular/core';
//import { AppModule } from '../../app.module';
import { QuillModule } from 'ngx-quill';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SchoolGroupListComponent } from './school-group-list/school-group-list.component';
import { SchoolTitleListComponent } from './school-title-list/school-title-list.component';
import { MaterialModule, MdCard } from '@angular/material';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate/ng2-translate';
import { Http } from '@angular/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import {
  MdToolbarModule,
  MdInputModule,
  MdRadioModule,
  MdIconModule,
  MdCardModule,
  MdButtonModule,
  MdListModule,
  MdProgressBarModule,
  MdMenuModule,
  MdDialogModule,
  MdNativeDateModule,
  MdSelectModule,
  MdDatepickerModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';


export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, './assets/i18n', '.json');
}
const routes: Routes = [
  {
    path: 'school-group',
    component: SchoolGroupListComponent,
  },
  {
    path: 'school-group/:id',
    component: SchoolTitleListComponent
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    QuillModule,
    RouterModule.forChild(routes),
    MaterialModule,
    MdToolbarModule,
    MdInputModule,
    MdRadioModule,
    MdIconModule,
    MdCardModule,
    MdButtonModule,
    MdListModule,
    MdProgressBarModule,
    MdMenuModule,
    MdDialogModule,
    MdNativeDateModule,
    MdSelectModule,
    MdDatepickerModule,
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    }),
    NgxDatatableModule,
    FlexLayoutModule
  ],
  exports: [RouterModule],
  declarations: [
  //  SafeHtmlPipe,
  SchoolGroupListComponent,
  SchoolTitleListComponent
  ],
  providers: [

  ],
  entryComponents: [

  ]
})
export class SchoolGroupModule { }
