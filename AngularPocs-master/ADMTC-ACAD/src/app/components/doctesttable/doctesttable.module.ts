import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctesttableComponent } from './doctesttable.component';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate/ng2-translate';
import { Http } from '@angular/http';
import { MaterialModule, MdToolbarModule, MdInputModule, MdRadioModule, MdIconModule, MdCardModule, MdButtonModule, MdListModule, MdProgressBarModule, MdMenuModule, MdDialogModule, MdNativeDateModule, MdSelectModule, MdDatepickerModule, MdAutocompleteModule } from '@angular/material';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SelectModule } from 'ng2-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComposeDocumenttestEmailComponent } from './compose-documenttest-email/compose-documenttest-email.component';
import { SharedModule } from 'app/shared/shared.module';
import { QuillModule } from 'ngx-quill';

const AppRoutes: Routes = [
  {
    path: 'doctesttable',
    component: DoctesttableComponent
  }
];
export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, './assets/i18n', '.json');
}
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    QuillModule,
    SharedModule,
    RouterModule.forChild(AppRoutes),
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    }),
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
    MdAutocompleteModule,
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    }),
    NgxDatatableModule,
    FlexLayoutModule,
    SelectModule
  ],
  entryComponents: [
    ComposeDocumenttestEmailComponent
  ],
  exports: [RouterModule],
  declarations: [DoctesttableComponent, ComposeDocumenttestEmailComponent]
})
export class DoctesttableModule { }
