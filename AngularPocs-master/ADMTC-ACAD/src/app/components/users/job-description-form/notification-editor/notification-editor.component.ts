import { Component, OnInit } from '@angular/core';
import * as Quill from 'quill';
// import * as renderer from 'quilljs-renderer';
import { MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA, MdSnackBar } from '@angular/material';
// import * as transformer from 'delta-transform-html';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
// renderer.loadFormat('html');
// let Document = renderer.Document;
import { MailService } from '../../../../services/mail.service';
import swal from 'sweetalert2'
import { Mail } from './../../../../models/mail';
import { LoginService } from '../../../../services/login.service';
import { TranslateService } from 'ng2-translate';
import { StudentsService } from '../../../../services/students.service';

@Component({
  selector: 'app-notification-editor',
  templateUrl: './notification-editor.component.html',
  styleUrls: ['./notification-editor.component.scss'],
  providers: [MailService,LoginService],
})
export class NotificationEditorComponent implements OnInit {

  public textValue: string;
  public subjectValue: string;
  public form: FormGroup;
  selectedStudent = [];
  currentUser;
  sendType;
  laterDate;
  sendNotification: boolean = true;
  selectedCompany;
  selectedMentor;
  constructor(
    public dialogRef: MdDialogRef <NotificationEditorComponent>,
    private MailService: MailService,
    private _login : LoginService,
    public snackBar: MdSnackBar,
    private translate: TranslateService,
    private studentService: StudentsService
    ){}

  ngOnInit() {
    console.log('SELECTED STUDENT');
    console.log(this.selectedStudent);
    console.log(this.textValue);
    this.form = new FormGroup({
      'editor': new FormControl(this.textValue)
    });

    this.currentUser = this._login.getLoggedInUser();
    if(!this.sendNotification) {
      this.register();
      this.studentService.jobDescriptionSendToStudents = true;
      this.closeDialog();
    }
  }

  register(){
    const value = this.form.value.editor;
    var receiversArray = [];

    this.selectedStudent.forEach( (student) => {
      receiversArray.push(student['email']);
    });
    

    let new_mail = new Mail();
    new_mail.senderProperty = {
      //"sender":this.currentUser.firstName + "<"+this.currentUser.email+">"
      "sender":"ADMTC <notification@admtc.pro>"
    };
    new_mail.subject = this.subjectValue;
    new_mail.message = value;
    new_mail.user = this.currentUser._id;
    if(this.sendType == 'Now'){
      new_mail.now = true;
      new_mail.laterDate = '';
    }else{
      new_mail.now = false;
      new_mail.laterDate = this.laterDate;
    }

    new_mail.lang = this.translate.currentLang.toUpperCase();
    new_mail.company = this.selectedCompany && this.selectedCompany._id ? this.selectedCompany._id : '';
    new_mail.mentor = this.selectedMentor;
    new_mail.sendNotification = this.sendNotification;
    new_mail.recipientProperty = {
      "recipient":receiversArray,
        "rank": "a"
    };

    console.log(new_mail);
    this.MailService.sendMailJobDescription(new_mail).then(
        task => {
          if( this.sendNotification ){
          swal({
            title: this.translate.instant('JOBDESCRIPTIONFORM.ConfirmSentToStudent.Title'),
            text: this.translate.instant('JOBDESCRIPTIONFORM.ConfirmSentToStudent.Text'),
            confirmButtonText: this.translate.instant('JOBDESCRIPTIONFORM.S6.OK'),
            allowEscapeKey:true,
            type:'success'
        });
      } else {
        swal({
          title: this.translate.instant('JOBDESCRIPTIONFORM.JOBDESC_S7.Title'),
          html: this.translate.instant('JOBDESCRIPTIONFORM.JOBDESC_S7.Text'),
          confirmButtonText: this.translate.instant('JOBDESCRIPTIONFORM.JOBDESC_S7.OK'),
          allowEscapeKey:true,
          type:'info'
      });
      }
          //this.snackBar.open("Notification Sent", 'Ok', { duration: 2000 });
          this.studentService.jobDescriptionSendToStudents = true;
          this.dialogRef.close(value);
        },
        (error) => {
          this.snackBar.open(error, 'Ok', { duration: 2000 });
        }
    );

  }



  closeDialog(){
    this.dialogRef.close(this.textValue);
  }

}
