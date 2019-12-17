import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, Form } from '@angular/forms';
import { Mail } from 'app/models/mail';
import { MailService } from '../../../services/mail.service';
import { TranslateService } from 'ng2-translate';
import { MdDialogRef } from '@angular/material';
import { emailValidator } from '../../../custome-validation/custom-validator';
import { UtilityService } from '../../../services/utility.service';
import { LoginService } from '../../../services/login.service';
import { Observable } from 'rxjs/Rx';
declare var swal: any;

@Component({
  selector: 'app-compose-documenttest-email',
  templateUrl: './compose-documenttest-email.component.html',
  styleUrls: ['./compose-documenttest-email.component.scss'],
  encapsulation: ViewEncapsulation.None,
  inputs: ['activeColor', 'baseColor', 'overlayColor']

})
export class ComposeDocumenttestEmailComponent implements OnInit {

  public mailForm: FormGroup;
  public mailDataForDocTestTable;
  public loggedInUser;
  selectedRecepientsList = [];
  ccselectedRecepientsList = [];
  bccselectedRecepientsList = [];
  attachmnetsPaths = [];
  loaded = false;
  composeProcess = false;
  showCCInput = false;
  showBCCInput = false;
  composeMailMessage: string;
  subject = '';

  recepientsList: Observable<Array<string>>;
  ccrecepientsList: Observable<Array<string>>;
  bccrecepientsList: Observable<Array<string>>;

  constructor(
    private fb: FormBuilder,
    private mailService: MailService,
    private translate: TranslateService,
    public dialogref: MdDialogRef<ComposeDocumenttestEmailComponent>,
    public utility: UtilityService,
    public loginService: LoginService
  ) {

  }

  ngOnInit() {
    this.mailForm = this.fb.group({
      search_receiver: [],
      subject: ['', Validators.required],
      message: ['', Validators.required],
      cc: ['', []],
      bcc: ['', []]
    });
    this.loggedInUser = this.loginService.getLoggedInUser();
    // this.selectedRecepientsList = this.mailDataForDocTestTable.map(a => {
    //   return {
    //     'recipient': a.uploadedForStudent.email,
    //     'rank': 'a',
    //     'mailType': 'inbox',
    //     'sex': a.uploadedForStudent.civility,
    //     'display': a.uploadedForStudent.firstName + ' ' + a.uploadedForStudent.lastName + ' <' + a.uploadedForStudent.email + '>'
    //   };
    // });

    this.attachmnetsPaths = this.mailDataForDocTestTable.map(f => {
      return {
        'name': f.fileName,
        'path': f.filePath
      };
    });

    this.getSignatureForShare();
    this.getRecipients();
    console.log(this.selectedRecepientsList);
  }

  sendMail(): void {
    this.composeProcess = true;
    const formValues = this.mailForm.value;
    let receiversArray = [];

    this.selectedRecepientsList.forEach(function (recipient) {
      receiversArray.push({ 'recipient': recipient.email, 'rank': 'a', 'mailType': 'inbox' });
    });

    this.ccselectedRecepientsList.forEach(function (recipient) {
      receiversArray.push({ 'recipient': recipient.email, 'rank': 'cc', 'mailType': 'inbox' });
    });

    this.bccselectedRecepientsList.forEach(function (recipient) {
      receiversArray.push({ 'recipient': recipient.email, 'rank': 'c', 'mailType': 'inbox' });
    });

    // if (receiversArray.length < 1) {

    //   return;
    // }

    const new_mail = new Mail();
    const MailAttachment = [];
    this.attachmnetsPaths.forEach((files) => {
      MailAttachment.push(files.path);
    });
    new_mail.emails = receiversArray;
    new_mail.subject = formValues.subject;
    new_mail.message = formValues.message;
    new_mail.isSent = true;
    new_mail.isUrgentMail = false;
    new_mail.attachments = MailAttachment;
    new_mail.tags = [];
    const self = this;
    this.mailService.sendMail(new_mail).then(
      task => {
        this.composeProcess = false;
        this.dialogref.close('updateMailList');
        swal({
          title: this.translate.instant('MailBox.composeMail.MESSAGES.TITLE'),
          text: this.translate.instant('MailBox.composeMail.MESSAGES.TEXT'),
          allowEscapeKey: true,
          type: 'success',
          confirmButtonText: this.translate.instant('MailBox.composeMail.MESSAGES.CONFIRMBTN'),
        });
      },
      (error) => {
        // swal({ type: 'error', title: 'Mail Saved to Draft', text: error });
        swal({
          title: this.translate.instant('STUDENT.MESSAGE.ERRORTIT'),
          text: this.translate.instant('STUDENT.MESSAGE.ERRORMSG'),
          allowEscapeKey: true,
          type: 'error'
        });
        // this.snackBar.open(error, 'Ok', { duration: 2000 });
        this.composeProcess = false;
      }
    );
  }
  getSignatureForShare() {


    let body = '<br/><br/>';
    // body += '<br/><br/><br/><br/><br/>';
    body += this.utility.computeCivility(this.loggedInUser.sex, this.translate.currentLang);
    body += ' ' + this.loggedInUser.firstName + ' ' + this.loggedInUser.lastName;
    body += ',</br>' + this.loggedInUser.position;
    body += '<br/><br/>';

    this.composeMailMessage = body;
    this.mailDataForDocTestTable.forEach((s, index) => {
      console.log(s.name);
      this.subject = this.subject + s.name + ((index + 1) === this.mailDataForDocTestTable.length ? '' : ', ');
    });

    this.mailForm.controls['subject'].setValue(this.subject);
    return body;

  }

  closeDialog() {
    this.dialogref.close();
  }

  recepientDisplayFunction(selectedRecepient) {
    return typeof selectedRecepient === 'object' && selectedRecepient ? selectedRecepient.display : null;
  }

  ccrecepientDisplayFunction(selectedRecepient) {
    return typeof selectedRecepient === 'object' && selectedRecepient ? selectedRecepient.display : null;
  }

  bccrecepientDisplayFunction(selectedRecepient) {
    return typeof selectedRecepient === 'object' && selectedRecepient ? selectedRecepient.display : null;
  }

  removeSelectedRecepient(index, type) {
    if (type) {
      switch (type) {
        case 'to':
          this.selectedRecepientsList.splice(index, 1);
          break;
        case 'cc':
          this.ccselectedRecepientsList.splice(index, 1);
          break;
        case 'bcc':
          this.bccselectedRecepientsList.splice(index, 1);
          break;

      }
    }
  }
  handleInputChange(e) {

    const files = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files;
    this.loaded = false;

    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      const filename = files[i].name;
      const index = filename.lastIndexOf('.');
      const strsubstring = filename.substring(index, filename.length);
      const filesUploaded = e.target.files || e.srcElement.files;
      const file = filesUploaded[i];
      const formData = new FormData();
      formData.append('file', file);
      this.mailService.uploadAttachment(formData)
        .subscribe(value => {
          if (value['data']) {
            this.attachmnetsPaths.push({
              path: value.data.filepath,
              name: filename
            });
          } else {
            swal({
              title: 'Oops...',
              text: 'Upload Fail. Please try again.',
              allowEscapeKey: true,
              type: 'error'
            });
          }
        });
      this.loaded = true;
      reader.readAsDataURL(files[i]);
    }
  }

  removeAttachment(file) {
    this.attachmnetsPaths.splice(this.attachmnetsPaths.indexOf(file), 1);
  }
  getRecipients() {
    this.recepientsList = this.mailForm.controls.search_receiver.valueChanges
      .debounceTime(400)
      .distinctUntilChanged()
      .switchMap(keyword => {
        if (typeof keyword === 'object') {
          const isAlreadySelected = this.selectedRecepientsList.filter(recipient => recipient.id === keyword.id);
          if (isAlreadySelected.length === 0) {
            this.selectedRecepientsList.push(keyword);
          }
          this.mailForm.controls.search_receiver.setValue(null);
          return [];
        }
        return this.mailService.searchRecipients(keyword);
      });

    this.ccrecepientsList = this.mailForm.controls.cc.valueChanges
      .debounceTime(400)
      .distinctUntilChanged()
      .switchMap(keyword => {
        if (typeof keyword === 'object') {
          const isAlreadySelected = this.ccselectedRecepientsList.filter(recipient => recipient.id === keyword.id);
          if (isAlreadySelected.length === 0) {
            this.ccselectedRecepientsList.push(keyword);
          }
          this.mailForm.controls.cc.setValue(null);
          return [];
        }
        return this.mailService.searchRecipients(keyword);
      });

    this.bccrecepientsList = this.mailForm.controls.bcc.valueChanges
      .debounceTime(400)
      .distinctUntilChanged()
      .switchMap(keyword => {
        if (typeof keyword === 'object') {
          const isAlreadySelected = this.bccselectedRecepientsList.filter(recipient => recipient.id === keyword.id);
          if (isAlreadySelected.length === 0) {
            this.bccselectedRecepientsList.push(keyword);
          }
          this.mailForm.controls.bcc.setValue(null);
          return [];
        }
        return this.mailService.searchRecipients(keyword);
      });
  }
}
