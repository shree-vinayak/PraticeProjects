import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService, MailService, UtilityService } from 'app/services';
import { MdDialogRef } from '@angular/material';
import { Mail } from 'app/models/mail';
import { TranslateService } from 'ng2-translate';
import { Observable } from 'rxjs';
import { DownloadAnyFileOrDocFromS3, Files } from 'app/shared/global-urls';
declare var swal: any;
@Component({
  selector: 'app-compose-internal-note-email-dialog',
  templateUrl: './compose-internal-note-email-dialog.component.html',
  styleUrls: ['./compose-internal-note-email-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ComposeInternalNoteEmailDialogComponent implements OnInit {
  public composeInternalNoteMail;
  public mailForm: FormGroup;
  public loggedInUser;
  selectedRecepientsList = [];
  ccselectedRecepientsList = [];
  bccselectedRecepientsList = [];
  attachmnetsPaths = [];
  composeProcess = false;
  composeMailMessage: string;
  subject = '';
  showCCInput = false;
  showBCCInput = false;
  loaded = false;
  documentsList = [];

  recepientsList: Observable<Array<string>>;
  ccrecepientsList: Observable<Array<string>>;
  bccrecepientsList: Observable<Array<string>>;

  constructor(
    private fb: FormBuilder,
    public loginService: LoginService,
    public dialogref: MdDialogRef<ComposeInternalNoteEmailDialogComponent>,
    private mailService: MailService,
    private translate: TranslateService,
    public utility: UtilityService
  ) {}

  ngOnInit() {
    this.mailForm = this.fb.group({
      search_receiver: [],
      subject: ['', Validators.required],
      message: ['', Validators.required],
      cc: ['', []],
      bcc: ['', []]
    });
    this.loggedInUser = this.loginService.getLoggedInUser();
    // this.internalExpectedDoc.push({ name: this.currentInternalDocString });
    this.attachmnetsPaths = this.composeInternalNoteMail.documents.map(f => {
      return {
        name: f.name,
        text: f.storedInS3
      };
    });
    console.log('attachmnetsPaths', this.attachmnetsPaths);

    this.getSignatureForShare();
    this.getRecipients();
    console.log(this.selectedRecepientsList);
    console.log('composeInternalNoteMail', this.composeInternalNoteMail);
  }
  closeDialog() {
    this.dialogref.close();
  }
  sendMail(): void {
    this.composeProcess = true;
    const formValues = this.mailForm.value;
    let receiversArray = [];

    this.selectedRecepientsList.forEach(function(recipient) {
      receiversArray.push({
        recipient: recipient.email,
        rank: 'a',
        mailType: 'inbox'
      });
    });

    this.ccselectedRecepientsList.forEach(function(recipient) {
      receiversArray.push({
        recipient: recipient.email,
        rank: 'cc',
        mailType: 'inbox'
      });
    });

    this.bccselectedRecepientsList.forEach(function(recipient) {
      receiversArray.push({
        recipient: recipient.email,
        rank: 'c',
        mailType: 'inbox'
      });
    });

    const new_mail = new Mail();
    // this.attachmnetsPaths.forEach(files => {
    //   MailAttachment.push(files.path);
    // });

    const MailAttachment = this.composeInternalNoteMail.documents.map(f => {
    return f.storedInS3
        // ? DownloadAnyFileOrDocFromS3.downloadWithoutBaseUrl + f.S3FileName
        // : Files.url + f.filePath;
    });

    const MailFileAttachments = this.composeInternalNoteMail.documents.map(doc => {
      const linkGenerated = doc.storedInS3
        ? DownloadAnyFileOrDocFromS3.download + doc.S3FileName
        : Files.url + doc.filePath;
      return {
        filename: doc.name,
        path: linkGenerated
      };
    });
    // this.attachmnetsPaths.forEach(files => {
    //   MailAttachment1.push(files.path);
    // });
    new_mail.emails = receiversArray;
    new_mail.subject = formValues.subject;
    new_mail.message = formValues.message;
    new_mail.isSent = true;
    new_mail.isUrgentMail = false;
    new_mail.attachments = MailAttachment;
    new_mail.fileAttachments = MailFileAttachments;
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
          confirmButtonText: this.translate.instant(
            'MailBox.composeMail.MESSAGES.CONFIRMBTN'
          )
        });
      },
      error => {
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
    // const docList = this.composeInternalNoteMail.documents.map(doc => {
    //   const linkGenerated = doc.storedInS3
    //     ? DownloadAnyFileOrDocFromS3.download + doc.S3FileName
    //     : Files.url + doc.filePath;
    //   return {
    //     docName: doc.name,
    //     link: linkGenerated
    //   };
    // });
    let body = '<br/><br/>';
    body += `<p><b>${this.translate.instant(
      'INTERNAL_NOTE.ADD_INTERNAL_NOTE.NoteTitle'
    )}:</b> ${this.composeInternalNoteMail.noteTitle}</p>`;

    body += `<p><b>${this.translate.instant(
      'INTERNALNOTEFORM.ADDITIONAL_NOTE.DESC'
    )}:</b> ${this.composeInternalNoteMail.noteBody}</p>`;

    body += `<p><b>${this.translate.instant(
      'TOOLS_INTERNAL_NOTES.School'
    )}:</b> ${this.composeInternalNoteMail.school.shortName}</p>`;

    body += `<p><b>${this.translate.instant(
      'TOOLS_INTERNAL_NOTES.Title'
    )}:</b> ${this.composeInternalNoteMail.rncpTitle.shortName}</p>`;

    body += `<p><b>${this.translate.instant('TOOLS_DOCTEST.Class')}:</b> ${
      this.composeInternalNoteMail.classId.name
    }</p>`;

    body += `<p><b>${this.translate.instant('TOOLS_HISTORY.Test')}:</b> ${
      this.composeInternalNoteMail.test.name
    }</p>`;
    body += `<p><b>${this.translate.instant(
      'TOOLS_INTERNAL_NOTES.User_type'
    )}:</b> ${this.composeInternalNoteMail.userType.name}</p>`;

    body += `<p><b>${this.translate.instant(
      'TOOLS_INTERNAL_NOTES.User'
    )}:</b> ${this.utility.computeCivility(
      this.composeInternalNoteMail.user.civility,
      this.translate.currentLang
    ) +
      ' ' +
      this.composeInternalNoteMail.user.firstName +
      ' ' +
      this.composeInternalNoteMail.user.lastName}</p>`;

    // docList.forEach(d => {
    //   body += `<p>${d.docName} - <a href="${
    //     d.link
    //   }" target="_blank">${this.translate.instant('DOWNLOAD')}</a></p>`;
    // });
    body += '<br/><br/>';
    body += this.utility.computeCivility(
      this.loggedInUser.sex,
      this.translate.currentLang
    );
    body +=
      ' ' + this.loggedInUser.firstName + ' ' + this.loggedInUser.lastName;
    body += ',</br>' + this.loggedInUser.position;
    body += '<br/><br/>';
    this.composeMailMessage = body;
    this.subject =
      this.subject +
      this.composeInternalNoteMail.rncpTitle.shortName +
      ' - ' +
      this.composeInternalNoteMail.school.shortName +
      ' - ' +
      this.composeInternalNoteMail.noteTitle;

    this.mailForm.controls['subject'].setValue(this.subject);
    return body;
  }

  recepientDisplayFunction(selectedRecepient) {
    return typeof selectedRecepient === 'object' && selectedRecepient
      ? selectedRecepient.display
      : null;
  }

  ccrecepientDisplayFunction(selectedRecepient) {
    return typeof selectedRecepient === 'object' && selectedRecepient
      ? selectedRecepient.display
      : null;
  }

  bccrecepientDisplayFunction(selectedRecepient) {
    return typeof selectedRecepient === 'object' && selectedRecepient
      ? selectedRecepient.display
      : null;
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
      this.mailService.uploadAttachment(formData).subscribe(value => {
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
          const isAlreadySelected = this.selectedRecepientsList.filter(
            recipient => recipient.id === keyword.id
          );
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
          const isAlreadySelected = this.ccselectedRecepientsList.filter(
            recipient => recipient.id === keyword.id
          );
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
          const isAlreadySelected = this.bccselectedRecepientsList.filter(
            recipient => recipient.id === keyword.id
          );
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
