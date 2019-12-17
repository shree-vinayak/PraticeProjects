import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { TranslateModule, TranslateLoader, TranslateStaticLoader, TranslateService } from 'ng2-translate/ng2-translate';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { HttpModule, Http } from '@angular/http';
import {
  MaterialModule,
  MdInputModule,
  MdIconModule,
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
import { RncpTitlesRoutes } from './rncp-titles.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageRncpTitleComponent } from './manage-rncp-title/manage-rncp-title.component';
import { ManageClassesComponent } from './manage-classes/manage-classes.component';
import { FlexLayoutModule } from '@angular/flex-layout';
export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, '../../assets/i18n', '.json');
}

@NgModule({
  imports: [
    CommonModule,
    RncpTitlesRoutes,
    HttpModule,
    FlexLayoutModule,
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
    MdDialogModule,
    MdNativeDateModule,
    MdTooltipModule,
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    })
  ],
  declarations: [
    ManageRncpTitleComponent,
    ManageClassesComponent
  ],
  providers: [

  ]
})
export class RncpTitlesModule { }
