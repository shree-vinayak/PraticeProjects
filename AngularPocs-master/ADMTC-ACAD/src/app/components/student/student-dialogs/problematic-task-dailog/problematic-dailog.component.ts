import { UtilityService } from './../../../../services/utility.service';
import { Component, OnInit, Inject } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import { Observable } from 'rxjs/Rx';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { StudentsService } from '../../../../services/students.service';
import { Router } from '@angular/router';

// required for logging
import { Log } from "ng2-logger";
const log = Log.create("ProblematicTaskDialogComponent");
log.color = "blue";

declare var swal: any;

@Component({
  selector: 'app-problematic-task-dialog',
  templateUrl: './problematic-dailog.component.html',
  styleUrls: ['./problematic-dailog.component.scss']
})

export class ProblematicTaskDialogComponent implements OnInit {
  /*************************************************************************
   *   VARIABLES
   *************************************************************************/
    problematicTask;

  /*************************************************************************
   *   CONSTRUCTOR
  *************************************************************************/
  constructor(
    private dialogRef: MdDialogRef < ProblematicTaskDialogComponent > ,
    @Inject(MD_DIALOG_DATA) public data: any,
    private translate: TranslateService,
    private studentService: StudentsService,
    private router: Router,
    private utilityService: UtilityService) {
        log.info('Constructor Invoked')
     }

  /*************************************************************************
   *   EVENTS
  *************************************************************************/
  ngOnInit() {
    log.data('ngOnInit problematicTask', this.problematicTask);
  }

  /*************************************************************************
   *   METHODS
   *************************************************************************/

  cancel() {
    this.dialogRef.close(false);
  }

  goToProblematic() {
    let navigateTo: string = '';

    if ( ( this.utilityService.checkUserIsAdminOfCertifier() || this.utilityService.checkUserIsDirectorSalesAdmin() || this.utilityService.isJustProbCorrector())
          && this.problematicTask.type === 'validateProblematicTask' ) {
      navigateTo = 'school/' + this.problematicTask.uniqueID + '/edit/0;goto=problematic;status=sent_to_certifier';
    } else if ( ( this.utilityService.checkUserIsStudent() || this.utilityService.checkUserIsDirectorSalesAdmin() ) 
                  && this.problematicTask.type === 'problematicTask' ) {
      navigateTo = '/academic/problematic/' + this.problematicTask.uniqueID;
    } else {
      navigateTo = null;
    }

    this.router.navigateByUrl(navigateTo);
    this.dialogRef.close(true);
  }

  translateTaskDescription(description) {
    if (this.translate.currentLang.toLowerCase() === 'en') {
      let taskDetails = description.split(' : ');
      taskDetails[ taskDetails.length - 1 ] = 'Validate Problematics';
      taskDetails = taskDetails.join( ' : ' );
      return taskDetails;
    } else {
      let taskDetails = description.split(' : ');
      taskDetails[ taskDetails.length - 1 ] = 'Notes de problématique à valider';
      taskDetails = taskDetails.join( ' : ' );
      return taskDetails;
    }
  }
}
