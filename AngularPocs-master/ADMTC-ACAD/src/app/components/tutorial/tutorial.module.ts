import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TutorialComponent } from './tutorial.component';
import { Routes, RouterModule } from '@angular/router';
import { TutorialsListComponent } from './tutorials-list/tutorials-list.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TranslateModule } from 'ng2-translate';
import { FlexLayoutModule } from '@angular/flex-layout';
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
  MaterialModule
} from '@angular/material';
import { QuillModule } from 'ngx-quill';
import { SharedModule } from '../../shared/shared.module';
import { HttpModule } from '@angular/http';
import { TutorialsService } from './tutorials.service';
import { SelectModule } from 'ng2-select';
import { AddTutorialDialogComponent } from './add-tutorial-dialog/add-tutorial-dialog.component';
import { SendTutorialDialogComponent } from './send-tutorial-dialog/send-tutorial-dialog.component';

const routes: Routes = [
  {
    path: '',
    component: TutorialComponent,
    children: [
      {
        path: 'list',
        component: TutorialsListComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    NgxDatatableModule,
    TranslateModule,
    FlexLayoutModule,
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
    MaterialModule,
    QuillModule,
    SharedModule,
    HttpModule,
    SelectModule
  ],
  declarations: [
    TutorialComponent,
    TutorialsListComponent,
    AddTutorialDialogComponent,
    SendTutorialDialogComponent
  ],
  providers: [TutorialsService],
  entryComponents: [
    AddTutorialDialogComponent,
    SendTutorialDialogComponent
  ]
})
export class TutorialModule { }
