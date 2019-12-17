import { NgModule } from '@angular/core';
import { QuillModule } from 'ngx-quill';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule, MdCard } from '@angular/material';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate/ng2-translate';
import { Http } from '@angular/http';
import { EmailtemplateService } from '../../services/emailtemplate.service';
import { SelectModule } from 'ng2-select';
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
  MdDatepickerModule,
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { SharedModule } from 'app/shared/shared.module';
import { CrossCorrectionService } from './cross-correction.service';
import { CrossCorrectionListComponent } from 'app/components/cross-correction/cross-correction-list/cross-correction-list.component';
import { CrossCorrectionDialogComponent } from 'app/components/cross-correction/cross-correction-dialog/cross-correction-dialog.component';
import { SendCopiesTaskDialogComponent } from './send-copies-task-dialog/send-copies-task-dialog.component';


export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, './assets/i18n', '.json');
}
const routes: Routes = [{
  path: 'tools/cross-correction/:titleId/:classId/:TestId',
  component: CrossCorrectionListComponent,
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
    SelectModule,
  ],
  exports: [RouterModule],
  declarations: [
  //  SafeHtmlPipe,
  CrossCorrectionListComponent,
  CrossCorrectionDialogComponent,
  SendCopiesTaskDialogComponent
  ],
  providers: [
    EmailtemplateService,
    CrossCorrectionService
  ],
  entryComponents: [
    CrossCorrectionDialogComponent,
    CrossCorrectionListComponent,
    SendCopiesTaskDialogComponent
  ]
})
export class CrossCorrectionModule { }
