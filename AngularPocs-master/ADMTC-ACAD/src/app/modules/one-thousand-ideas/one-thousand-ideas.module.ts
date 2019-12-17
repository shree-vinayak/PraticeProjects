import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule, Http } from '@angular/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { OneThousandIdeasComponent } from './one-thousand-ideas.component';
import { AddAcademicSuggestionDialogComponent } from '../../dialogs/add-academic-suggestion-dialog/add-academic-suggestion-dialog.component';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate/ng2-translate';
import { TranslateService } from 'ng2-translate';
import {
  MaterialModule,
  MdIconModule,
  MdInputModule,
  MdGridListModule,
  MdButtonModule,
  MdListModule,
  MdCheckboxModule,
  MdMenuModule,
  MdSelectModule,
  MdDialogModule,
  MdNativeDateModule,
  MdTooltipModule
} from '@angular/material';
import {
  FormsModule,
  ReactiveFormsModule,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  ValidationErrors
} from "@angular/forms";
import { IdeasSuggestionService } from '../../services/ideas-suggestion.service';
import { OneThousandIdeasRoutingModule } from './one-thousand-ideas-routing.module';
import { PDFService } from '../../services/pdf.service';
import { SelectModule } from 'ng2-select';
export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, '../../assets/i18n', '.json');
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    NgxDatatableModule,
    MaterialModule,
    MdInputModule,
    MdIconModule,
    MdGridListModule,
    MdButtonModule,
    MdListModule,
    MdCheckboxModule,
    MdMenuModule,
    MdSelectModule,
    SelectModule,
    MdDialogModule,
    MdNativeDateModule,
    MdTooltipModule,
    OneThousandIdeasRoutingModule,
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    })
  ],
  declarations: [OneThousandIdeasComponent],
  entryComponents: [AddAcademicSuggestionDialogComponent],
  providers: [IdeasSuggestionService, TranslateService, PDFService]
})
export class OneThousandIdeasModule {}
