import { Component, OnInit } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import { MdDialog, MdDialogConfig, MdDialogRef, MD_DIALOG_DATA,MdSnackBar } from '@angular/material';
import { NotificationEditorComponent } from '../../../../users/job-description-form/notification-editor/notification-editor.component';
import { DatePipe } from '@angular/common';
import { MailService } from '../../../../../services/mail.service';
import { LoginService } from '../../../../../services/login.service';
import { Mail } from './../../../../../models/mail';
import { UtilityService } from '../../../../../services/utility.service';
declare  let swal: any;

@Component({
  selector: 'app-job-description-notification-dialog',
  templateUrl: './job-description-notification-dialog.component.html',
  styleUrls: ['./job-description-notification-dialog.component.scss'],
  providers: [DatePipe,MailService]
})
export class JobDescriptionNotificationDialogComponent implements OnInit {

  public notificationEditorComponentDialog: MdDialogRef<NotificationEditorComponent>;
  selectedStudent : any[] = [];
  customer;
  currentUser;
  selectedCompany;
  selectedMentor;
  sendNotification : boolean = true;
  constructor(
    private translate: TranslateService,
    private dialog: MdDialog,
    public datepipe: DatePipe,
    public dialogRef: MdDialogRef<JobDescriptionNotificationDialogComponent>,
    private MailService: MailService,
    public snackBar: MdSnackBar,
    private _login : LoginService,
    public utilityService: UtilityService) { }

  config: MdDialogConfig = {
    disableClose: true
  };

  ngOnInit() {
    this.currentUser = this._login.getLoggedInUser();
  }

  updateCalcs(event) {
    let self = this;
    const PlaceHoders = this.populatePlaceHolder();

    console.log(PlaceHoders);
    self.notificationEditorComponentDialog = self.dialog.open(NotificationEditorComponent, self.config);
    self.notificationEditorComponentDialog.componentInstance.selectedStudent = self.selectedStudent;
    this.notificationEditorComponentDialog.componentInstance.selectedCompany = this.selectedCompany;
    this.notificationEditorComponentDialog.componentInstance.selectedMentor = this.selectedMentor;
    this.notificationEditorComponentDialog.componentInstance.sendNotification = this.sendNotification;
    self.notificationEditorComponentDialog.componentInstance.sendType = 'Later';
    self.notificationEditorComponentDialog.componentInstance.laterDate = self.datepipe.transform(event, 'M-dd-yyyy');
    let textValue = self.translate.instant('JOBDESCRIPTIONFORM.N1', PlaceHoders);
    let subjectValue = self.translate.instant('JOBDESCRIPTIONFORM.N1Subject', {date: PlaceHoders.date});
    self.notificationEditorComponentDialog.componentInstance.textValue = textValue;
    self.notificationEditorComponentDialog.componentInstance.subjectValue = subjectValue;
    self.notificationEditorComponentDialog.afterClosed().subscribe((result) => {
          console.log(result);
          self.dialogRef.close();
    });


  }

  notifyNowWithoutNotification(){
    this.sendNotification = false;
    this.notifyNow();
  }

  notifyNow() {
    //let date = this.datepipe.transform(new Date(), 'dd/M/yyyy');
    console.log(this.customer);
    let self = this;
    const PlaceHoders = this.populatePlaceHolder();
   
    console.log(PlaceHoders);

    this.notificationEditorComponentDialog = this.dialog.open(NotificationEditorComponent, this.config);
    this.notificationEditorComponentDialog.componentInstance.selectedStudent = this.selectedStudent;
    this.notificationEditorComponentDialog.componentInstance.selectedCompany = this.selectedCompany;
    this.notificationEditorComponentDialog.componentInstance.selectedMentor = this.selectedMentor;
    this.notificationEditorComponentDialog.componentInstance.sendNotification = this.sendNotification
    this.notificationEditorComponentDialog.componentInstance.sendType = 'Now';
    let textValue = this.translate.instant('JOBDESCRIPTIONFORM.N1', PlaceHoders);
    let subjectValue = this.translate.instant('JOBDESCRIPTIONFORM.N1Subject', {date: PlaceHoders.date});
    this.notificationEditorComponentDialog.componentInstance.textValue = textValue;
    this.notificationEditorComponentDialog.componentInstance.subjectValue = subjectValue;
    this.notificationEditorComponentDialog.afterClosed().subscribe((result) => {
          console.log(result);
          self.dialogRef.close();
        //swal({html:this.translate.instant('JOBDESCRIPTIONFORM.M3')});
    });

  }

  populatePlaceHolder() {
    let self = this;
    const date = this.datepipe.transform(new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)), 'dd/M/yyyy');
    let PlaceHoders;
    if ( self.selectedStudent.length === 1 ) {
      PlaceHoders = {
        date: date,
        schoolName:self.customer.shortName,
        TitreAbrege:self.selectedStudent[0]['rncpTitle'].shortName,
        TitreDéveloppé:self.selectedStudent[0]['rncpTitle'].longName,
        ApprenantSalutation:this.utilityService.computeSalutation(self.selectedStudent[0]['sex'],self.translate.currentLang),
        ApprenantCivilité:this.utilityService.computeCivility(self.selectedStudent[0]['sex'],self.translate.currentLang),
        ApprenantPrenom:self.selectedStudent[0]['firstName'],
        ApprenantNom:self.selectedStudent[0]['lastName'],
        Entreprise:'',
        TuteurCivilité:'',
        TuteurPrenom:'',
        TuteurNom:'',
        URL:self.customer.shortName,
        senderEmail: this.utilityService.checkUserIsAcademicDirector() ? this.currentUser.email : null,
        senderCivility: this.utilityService.checkUserIsAcademicDirector() ?
                        this.utilityService.computeCivility(this.currentUser.sex, this.translate.currentLang.toLowerCase()) : null,
        senderFirstName: this.utilityService.checkUserIsAcademicDirector() ? this.currentUser.firstName : null,
        senderLastName: this.utilityService.checkUserIsAcademicDirector() ? this.currentUser.lastName : null,
        senderPostion: this.utilityService.checkUserIsAcademicDirector() ?
                      this.currentUser.position ? this.currentUser.position : '' : null
      };
      for ( let index = 0; index < self.selectedStudent[0]['companies'].length; index++) {
        let element = self.selectedStudent[0]['companies'][index];
       if(element.isActive){
         PlaceHoders.Entreprise =  element.company.companyName;
         PlaceHoders.TuteurPrenom =  element.mentors.firstName;
         PlaceHoders.TuteurNom =  element.mentors.lastName;
         PlaceHoders.TuteurCivilité = this.utilityService.computeCivility(element.mentors.sex,self.translate.currentLang)
       }
     }
    } else {
      PlaceHoders = {
        date: date,
        schoolName:self.customer.shortName,
        URL:self.customer.shortName,
        senderEmail: this.utilityService.checkUserIsAcademicDirector() ? this.currentUser.email : null,
        senderCivility: this.utilityService.checkUserIsAcademicDirector() ?
                        this.utilityService.computeCivility(this.currentUser.sex, this.translate.currentLang.toLowerCase()) : null,
        senderFirstName: this.utilityService.checkUserIsAcademicDirector() ? this.currentUser.firstName : null,
        senderLastName: this.utilityService.checkUserIsAcademicDirector() ? this.currentUser.lastName : null,
        senderPostion: this.utilityService.checkUserIsAcademicDirector() ?
                      this.currentUser.position ? this.currentUser.position : '' : null
      }
    }
    return PlaceHoders
  }

  minDate() {
          let now = new Date();
          return new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
          );
  }

  close() {
    this.dialogRef.close();
  }
}
