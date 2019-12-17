import { Component, OnInit } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import { MdDialog, MdDialogConfig, MdDialogRef, MD_DIALOG_DATA,MdSnackBar } from '@angular/material';
import { GroupTestNotificationEditorComponent } from '../group-test-notification-editor/group-test-notification-editor.component';
import { DatePipe } from '@angular/common';
import { MailService } from '../../../../services/mail.service';
import { LoginService } from '../../../../services/login.service';
import { Mail } from './../../../../models/mail';
import { UtilityService } from '../../../../services/utility.service';
import swal from 'sweetalert2';
@Component({
  selector: 'group-test-notification-dialog.component',
  templateUrl: './group-test-notification-dialog.component.html',
  styleUrls: ['./group-test-notification-dialog.component.scss'],
  providers: [DatePipe,MailService]
})
export class GroupTestNotificationDialogComponent implements OnInit {

  public notificationEditorComponentDialog: MdDialogRef<GroupTestNotificationEditorComponent>;
  selectedRncpTitle;
  testDetails
  currentUser;

  constructor(
    private translate: TranslateService,
    private dialog: MdDialog,
    public datepipe: DatePipe,
    public dialogRef: MdDialogRef<GroupTestNotificationDialogComponent>,
    private MailService: MailService,
    public snackBar: MdSnackBar,
    private _login : LoginService,
    public utilityService: UtilityService) { }

  config: MdDialogConfig = {
    disableClose: true
  };

  ngOnInit() {
    console.log(this.testDetails);
    console.log(this.selectedRncpTitle);
    this.currentUser = this._login.getLoggedInUser();
  }

  updateCalcs(event){
    let self = this;
    let date = self.datepipe.transform(new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)), 'dd/M/yyyy');

    let PlaceHoders = {
      TitleShortName : this.selectedRncpTitle.shortName,
      TestName: this.testDetails.name,
      TestDate: self.datepipe.transform(new Date(this.testDetails.date), 'dd/M/yyyy')
    }

    console.log(PlaceHoders);

    self.notificationEditorComponentDialog = self.dialog.open(GroupTestNotificationEditorComponent, self.config);
    self.notificationEditorComponentDialog.componentInstance.selectedRncpTitle = self.selectedRncpTitle;
    self.notificationEditorComponentDialog.componentInstance.testDetails = self.testDetails;
    self.notificationEditorComponentDialog.componentInstance.sendType = 'Later';
    self.notificationEditorComponentDialog.componentInstance.laterDate = self.datepipe.transform(event, 'M-dd-yyyy');
    let textValue = self.translate.instant('TESTCORRECTIONS.GROUP.N1', PlaceHoders);
    let subjectValue = self.translate.instant('TESTCORRECTIONS.GROUP.N1Subject', PlaceHoders);
    self.notificationEditorComponentDialog.componentInstance.textValue = textValue;
    self.notificationEditorComponentDialog.componentInstance.subjectValue = subjectValue;
    self.notificationEditorComponentDialog.afterClosed().subscribe((result) => {
          console.log(result);
          self.dialogRef.close();
    });


  }


  notifyNow(){

    console.log(this.testDetails);

    let date = this.datepipe.transform(new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)), 'dd/M/yyyy');
    let self = this;
    let PlaceHoders = {
      TitleShortName : this.selectedRncpTitle.shortName,
      TestName: this.testDetails.name,
      TestDate: self.datepipe.transform(new Date(this.testDetails.date), 'dd/M/yyyy')
    }
    this.notificationEditorComponentDialog = this.dialog.open(GroupTestNotificationEditorComponent, this.config);
    self.notificationEditorComponentDialog.componentInstance.selectedRncpTitle = self.selectedRncpTitle;
    self.notificationEditorComponentDialog.componentInstance.testDetails = self.testDetails;
    this.notificationEditorComponentDialog.componentInstance.sendType = 'Now';
    let textValue = '';
    let subjectValue = '';

    if(this.translate.currentLang == 'fr'){
      textValue = '<div><p>${studentCivility} ${studentFirstName} ${studentLastName},</p><br><br><p>Vous etes convoque pour l’évaluation '+this.testDetails.name+' comptant pour l’épreuve '+this.testDetails['subjectId']['subjectName']+'.</p><br><p>'
      if(self.testDetails.dateType !== 'Marks'){
        textValue = textValue + "Cette évaluation se déroule le "+self.datepipe.transform(new Date(this.testDetails.date), 'dd/M/yyyy')+" en groupe.";
      }else{
        textValue = textValue + "Cette évaluation se déroule en groupe.";
      }
      textValue = textValue + "</p><br><p>Vous avez été affecté au groupe ${groupName} dont voici la liste des participants.<br>${studentList}</p><br><br><p>N’hésitez pas à nous contacter si vous avez besoin de notre aide.</p><br><br><p>Cordialement,<br>L’équipe ADMTC</p></div>";
      subjectValue = this.selectedRncpTitle.shortName + ': votre convocation pour '+this.testDetails.name;
    }else{
      textValue = '<p>${salutation} ${studentCivility} ${studentFirstName} ${studentLastName},</p><br><br><p>You are invited for '+this.testDetails.name+' for '+this.testDetails['subjectId']['subjectName']+'.</p><br><p>';
      if(self.testDetails.dateType !== 'Marks'){
        textValue = textValue + "This test will be conducted on "+self.datepipe.transform(new Date(this.testDetails.date), 'dd/M/yyyy')+" by group.";
      }else{
        textValue = textValue + "This test is conducted by group.";
      }
      textValue = textValue + "</p><br><p>You have been assigned to ${groupName} for which you will find the list of students below:<br>${studentList}</p><br><br><p>Feel free to contact us should you have any question.</p><br><br><p>Sincerely,<br>ADTMC Team</p></div>";
      subjectValue = this.selectedRncpTitle.shortName + ': you are invited to '+this.testDetails.name;
    }

    this.notificationEditorComponentDialog.componentInstance.textValue = textValue;
    this.notificationEditorComponentDialog.componentInstance.subjectValue = subjectValue;
    this.notificationEditorComponentDialog.afterClosed().subscribe((result) => {
          console.log(result);
          self.dialogRef.close();

    });



  }

  minDate(){
          let now = new Date();
          return new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
          );
  }

  close(){
    this.dialogRef.close();
  }





}
