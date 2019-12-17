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
@Component({
  selector: 'group-test-notification-editor',
  templateUrl: './group-test-notification-editor.component.html',
  styleUrls: ['./group-test-notification-editor.component.scss'],
  providers: [MailService,LoginService],
})
export class GroupTestNotificationEditorComponent implements OnInit {

  public textValue: string;
  public subjectValue: string;
  public form: FormGroup;
  selectedRncpTitle;
  testDetails;
  currentUser;
  sendType;
  laterDate;
  selectedCompany;
  selectedMentor;
  schoolID: string = '';
  constructor(
    public dialogRef: MdDialogRef <GroupTestNotificationEditorComponent>,
    private MailService: MailService,
    private _login : LoginService,
    public snackBar: MdSnackBar,
    private translate: TranslateService,
    ){}

  ngOnInit() {
    this.form = new FormGroup({
      'editor': new FormControl(this.textValue)
    });

    this.currentUser = this._login.getLoggedInUser();
  }

  register(){



    const value = this.form.value.editor;
    var receiversArray = [];

    receiversArray.push([]);

    let new_mail = new Mail();
    new_mail.subject = this.subjectValue;
    new_mail.message = value;
    if(this.sendType == 'Now'){
      new_mail.now = true;
      new_mail.laterDate = '';
    }else{
      new_mail.now = false;
      new_mail.laterDate = this.laterDate;
    }
    new_mail.lang = this.translate.currentLang.toUpperCase();
    this.MailService.sendMailGroupTest(new_mail,this.testDetails._id, this.schoolID).then(
        task => {
          swal({
              title: this.translate.instant('TESTCORRECTIONS.GROUP.SAVENOWSuccessTitle'),
              text: this.translate.instant('TESTCORRECTIONS.GROUP.SAVENOWSuccessText'),
              allowEscapeKey:true,
              type:'success',
              confirmButtonText: this.translate.instant('TESTCORRECTIONS.GROUP.SAVENOWSuccessOk')
          });
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
