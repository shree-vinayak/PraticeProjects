import { NgModule } from '@angular/core';
//import { AppModule } from '../../app.module';
import { QuillModule } from 'ngx-quill';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MentorEvaluationComponent } from '../mentor-evaluation/mentor-evaluation/mentor-evaluation.component';
import { MaterialModule, MdCard } from '@angular/material';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate/ng2-translate';
import { Http } from '@angular/http';
import { EmailTemplateComponent } from './mentor-evaluation/email-template/email-template.component';
import { QuestionnaireAnswerComponent } from 'app/components/mentor-evaluation/mentor-evaluation/questionnaire-answer/questionnaire-answer.component';
import { EmailtemplateService } from '../../services/emailtemplate.service';
import { ViewtemplateComponent } from './mentor-evaluation/email-template/viewtemplate/viewtemplate.component';
import { ViewQuestionnaireComponent } from './mentor-evaluation/questionnaire/viewquestionnaire/viewquestionnaire.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { QuestionnaireComponent } from './mentor-evaluation/questionnaire/questionnaire.component';
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
import { MeQuestionnareComponent } from './mentor-evaluation/me-questionnare/me-questionnare.component';
import { QuestionnaireDetailsComponent } from './mentor-evaluation/me-questionnare/questionnaire-details/questionnaire-details.component';
import { QuestionnaireDocumentComponent } from './mentor-evaluation/me-questionnare/questionnaire-document/questionnaire-document.component';
import { SharedModule } from 'app/shared/shared.module';
import { QuestionnaireService } from './questionnaire.service';
import { AddCompetenceComponent } from './mentor-evaluation/me-questionnare/add-competence/add-competence.component';
import { ListQuestionnaireComponent } from './mentor-evaluation/me-questionnare/list-questionnaire/list-questionnaire.component';
import { QuestionnaireToolsComponent } from './questionnaire-tools.component';
import { QuestionnaireTemplateComponent } from './questionnaire-template/questionnaire-template.component';
import { QuestionnaireBoardComponent } from './questionnaire-board/questionnaire-board.component';
import { SendQuestionnaireDialogComponent } from './questionnaire-board/send-questionnaire-dialog/send-questionnaire-dialog.component';
import { QuestionnaireRecipientComponent } from './questionnaire-recipient/questionnaire-recipient.component';

export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, './assets/i18n', '.json');
}
const routes: Routes = [
  {
    path: 'tools/questionnaire-tools',
    component: QuestionnaireToolsComponent,
  },
  {
    path: 'tools/questionnaire-data',
    component: MentorEvaluationComponent,
  },
  {
    path: 'tools/questionnaire-data/:id',
    component: MentorEvaluationComponent,
  }
];

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
    FlexLayoutModule
  ],
  exports: [RouterModule],
  declarations: [
  //  SafeHtmlPipe,
    MentorEvaluationComponent,
    EmailTemplateComponent,
    QuestionnaireAnswerComponent,
    QuestionnaireComponent,
    ViewtemplateComponent,
    ViewQuestionnaireComponent,
    MeQuestionnareComponent,
    QuestionnaireDetailsComponent,
    QuestionnaireDocumentComponent,
    AddCompetenceComponent,
    ListQuestionnaireComponent,
    QuestionnaireToolsComponent,
    QuestionnaireTemplateComponent,
    QuestionnaireBoardComponent,
    SendQuestionnaireDialogComponent,
    QuestionnaireRecipientComponent
  ],
  providers: [
    EmailtemplateService,
    QuestionnaireService
  ],
  entryComponents: [
    AddCompetenceComponent,
    ListQuestionnaireComponent,
    SendQuestionnaireDialogComponent
  ]
})
export class MentorEvaluationModule { }
