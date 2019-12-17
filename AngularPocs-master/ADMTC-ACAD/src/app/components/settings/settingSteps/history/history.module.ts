import { NgModule } from '@angular/core';
//import { AppModule } from '../../app.module';
import { QuillModule } from 'ngx-quill';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HistoryComponent } from './history-component';
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
import { SharedModule } from 'app/shared/shared.module';
import { SelectModule } from 'ng2-select';

export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, './assets/i18n', '.json');
}
const routes: Routes = [{
  path: 'tools/history',
  component: HistoryComponent,
}];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
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
    FlexLayoutModule,
    SelectModule
  ],
  exports: [RouterModule],
  declarations: [
  //  SafeHtmlPipe,
  HistoryComponent

  ],
  providers: [

  ],
  entryComponents: [

  ]
})
export class HistoryModule { }
