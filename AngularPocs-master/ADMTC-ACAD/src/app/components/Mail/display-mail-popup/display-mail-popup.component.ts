import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder
} from '@angular/forms';
import { QuestionnaireService } from 'app/components/mentor-evaluation/questionnaire.service';
import { AcademicKitService } from 'app/services/academic-kit.service';
import { MeQuestionnareComponent } from 'app/components/mentor-evaluation/mentor-evaluation/me-questionnare/me-questionnare.component';
import { MailService } from 'app/services/mail.service';
import { LoginService } from 'app/services/login.service';
import swal from 'sweetalert2';
import { RequiredValidator } from '@angular/forms/src/directives/validators';
import { Mail } from 'app/models/mail';
import { TranslateService } from 'ng2-translate';
import { DatePipe } from '@angular/common';
import { UtilityService } from 'app/services/utility.service';
import { AlertService } from '../../../services/alert.service';
// import { MentorEvaluationService } from '../../../../../services/mentor-evaluation.service';

@Component({
  selector: 'app-diplay-mail-popup',
  templateUrl: './display-mail-popup.component.html',
  styleUrls: ['./display-mail-popup.component.scss'],
  providers: [MailService]
})
export class DisplayMailPopupComponent implements OnInit {
  @ViewChild('myInput') currentFile: any;

  datePipe;
  totalUrgentMessage = [];
  UrgentMessage;
  currentMailBody;
  form: FormGroup;
  competence;
  operation;
  formSubmit = false;
  showHint = true;
  selectionType = '';
  loaded = false;
  attachmnetsPaths = [];
  imageSrc = [];
  isReplied: boolean;
  alertData: any;
  activeColor = 'green';
  baseColor = '#ccc';
  overlayColor = 'rgba(255,255,255,0.5)';
  selectedMailCategory = 'inbox';
  iconColor: string;
  borderColor: string;
  dragging = false;
  imageLoaded = false;
  newAlert = false;
  public mailForm: FormGroup;
  public alertReplyForm: FormGroup;
  displayResponse = false;
  constructor(
    private dialogRef: MdDialogRef<DisplayMailPopupComponent>,
    private questionnaireservice: QuestionnaireService,
    private loginService: LoginService,
    private mailService: MailService,
    private utility: UtilityService,
    private alertService: AlertService,
    private fb: FormBuilder,
    private translate: TranslateService
  ) {
    this.mailForm = this.fb.group({
      message: ['', Validators.required]
    });


    this.alertReplyForm = this.fb.group({
      message: ['', Validators.required]
    });
  }

  handleDragEnter() {
    this.dragging = true;
  }

  handleDragLeave() {
    this.dragging = false;
  }

  handleDrop(e) {
    e.preventDefault();
    this.dragging = false;
    this.handleInputChange(e);
  }

  ngOnInit() {
    this.selectionType = this.dialogRef.componentInstance.operation;
    this.getUrgentMails();
    this.isReplied = false;
    console.log('demo', this.alertData);

    if(this.newAlert === true){
      console.log('init alert',this.newAlert);
      if(this.alertData.requiredResponse === true){
        this.displayResponse = true;
      }else{
        this.displayResponse = false;
      }
    }
  }

  ReplyAlertMessage(val){
    const data = {
      response : '',
    };
    if(val === 'button1') {
      data.response = this.alertData.button1;
    } else if(val === 'button2') {
      data.response = this.alertData.button2;
    }else{
      data.response = this.alertReplyForm.value.message;
    }
  
    this.alertService.saveAlertResponse(this.alertData._id,data ).subscribe((res: any) =>{
      this.dialogRef.close();
    });

  }

  generateReplyBody() {
    if (this.UrgentMessage) {
      let body = '';
      body += '<br/><br/><br/>';
      body += '------------Message------------';
      body +=
        '<br/><b>' +
        this.translate.instant('dashboardMessage.FROM') +
        '</b> : ' +
        this.getSenderFullName();
      body +=
        '<br/><b>' +
        this.translate.instant('dashboardMessage.TO') +
        '</b> : ' +
        this.getRecipientFullName();
      body +=
        '<br/><b> Date </b> : ' +
        this.getTranslatedDate(this.UrgentMessage.createdAt);
      body +=
        '<br/><b> ' +
        this.translate.instant('MailBox.composeMail.subject') +
        ' </b> : ' +
        this.UrgentMessage.subject;
      body += '<br/><br/>';
      body += this.UrgentMessage.message;
      return body;
    }
    return '';
  }

  cancel() {
    this.dialogRef.close(false);
  }

  getUrgentMails() {
    const self = this;
    this.mailService.urgentMail().then(response => {
      self.totalUrgentMessage = [];
      this.currentMailBody = response.data[0];
      self.totalUrgentMessage.push(response.data[0]);
      self.getCivilityFromMail(response.data);
    });
  }

  handleInputChange(e) {
    const files = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files;
    const pattern = /image-*/;
    this.loaded = false;

    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      const filename = files[i].name;
      const index = filename.lastIndexOf('.');
      const strsubstring = filename.substring(index, filename.length);
      // const formats = ['.pdf', '.txt', '.doc', '.xls', '.png', '.jpeg', '.jpg', '.gif'];

      // if (formats.indexOf(strsubstring) > -1)
      {
        const files = e.target.files || e.srcElement.files;
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);

        console.log('valid format');
        this.mailService.uploadAttachment(formData).subscribe(value => {
          console.log('HTTP Response data');

          if (value['data']) {
            console.log(value['data']['_id']);
            console.log(value.data.filepath);
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
      }
      reader.onload = this._handleReaderLoaded.bind(this, {
        fileName: filename
      });
      reader.readAsDataURL(files[i]);
    }
    console.log(this.attachmnetsPaths);
    this.resetFileState();
  }

  resetFileState() {
    this.currentFile.nativeElement.value = '';
  }

  removeAttachment(file) {
    this.attachmnetsPaths.splice(this.attachmnetsPaths.indexOf(file), 1);
  }

  _handleReaderLoaded({ fileName }, e) {
    const reader = e.target;
    const fileType = reader.result.split(';')[0].split(':')[1];
    this.imageSrc.push({
      type: fileType,
      data: reader.result
    });
    console.log(this.imageSrc);
    this.loaded = true;
  }

  getRecipientFullName() {
    const recipients = this.UrgentMessage.recipientProperty[0];
    if (recipients) {
      if (recipients.recipient[0]) {
        if (recipients.recipient[0].hasOwnProperty('email')) {
          const senderObj = recipients.recipient[0];
          return (
            this.getCivility(senderObj.sex) +
            ' ' +
            senderObj.firstName +
            ' ' +
            senderObj.lastName
          );
        } else {
          return recipients.recipient[0];
        }
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  getSenderFullName() {
    const senders = this.UrgentMessage.senderProperty;
    if (senders) {
      if (senders.sender) {
        if (senders.sender.hasOwnProperty('email')) {
          const recObj = senders.sender;
          return (
            this.getCivility(recObj.sex) +
            ' ' +
            recObj.firstName +
            ' ' +
            recObj.lastName
          );
        } else {
          return senders.recipient;
        }
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  ReplyUrgentMessage() {
    const senderName = this.getSenderFullName();
    // console.log(this.mailForm.value);
    const messages = this.mailForm.value.message;
    this.isReplied = true;
    let emailofsender = '';
    if (this.UrgentMessage.senderProperty.sender.hasOwnProperty('email')) {
      emailofsender = this.UrgentMessage.senderProperty.sender.email;
    } else {
      emailofsender = this.UrgentMessage.senderProperty.sender;
    }

    const receiversArray = [];
    // const userValue;
    // let multimails = [];
    // const UserMail;
    if (this.validateEmail(emailofsender)) {
      receiversArray.push({
        recipient: emailofsender,
        rank: 'a',
        mailType: 'inbox'
      });
    }

    const attachments = [];

    this.attachmnetsPaths.forEach(file => {
      attachments.push(file.path);
    });
    const _mail = new Mail();
    _mail.attachments = attachments;
    _mail.emails = receiversArray;
    _mail.tags = ['reply-mail'];
    _mail.isUrgentMail = true;
    _mail.isSent = true;
    _mail.message = messages + this.generateReplyBody();
    _mail.subject = 'RE : ' + this.UrgentMessage.subject;
    this.mailService.sendMail(_mail).then(
      task => {
        swal({
          type: 'success',
          title: this.translate.instant('MailBox.URGENT_REPLY.TITLE'),
          html: this.translate.instant('MailBox.URGENT_REPLY.TEXT', {
            fullName: senderName
          }),
          confirmButtonText: this.translate.instant(
            'MailBox.URGENT_REPLY.CONFIRMBTN'
          )
        });
        // this.mailForm.reset();
        this.updateToReadFlag();
        this.dialogRef.close();
      },
      error => {
        swal({
          title: 'failed',
          type: 'error'
        });
      }
    );
  }

  validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  updateToReadFlag() {
    const self = this;
    const thisMailService = this.mailService;
    const mailData = this.currentMailBody;
    const currentUser = this.loginService.getLoggedInUser();
    if (mailData.recipientProperty && currentUser) {
      mailData.recipientProperty.forEach((recipient, index) => {
        const recData = recipient.recipient[0];
        if (recData.email) {
          if (recData.email === currentUser.email) {
            mailData.recipientProperty[index].isRead = true;
          }
          mailData.recipientProperty[index].recipient = [recData.email];
        } else {
          if (recData === currentUser.email) {
            mailData.recipientProperty[index].isRead = true;
          }
        }
      });
    }
    if (mailData.senderProperty) {
      if (mailData.senderProperty.sender) {
        if (mailData.senderProperty.sender.email) {
          mailData.senderProperty.sender = mailData.senderProperty.sender.email;
        }
      }
    }
    this.mailService.updateUrgentMessage(mailData).subscribe(data => {
      return data.json();
    });
    // const userIdList = [];
    // userIdList.push(_id);
    // let dataPost = {};
    // dataPost = {
    //   'ids': userIdList,
    //   'recipientProperty': {
    //     'isRead': true,
    //     'mailType': this.selectedMailCategory
    //   }
    // };

    // thisMailService.updateMail(dataPost).map((data) => {
    //   const response = data.json();
    //   return data;
    // }).subscribe(() => {
    // });
  }

  getCivility(value): string {
    if (value) {
      return this.utility.computeCivility(value, this.translate.currentLang);
    } else {
      return '';
    }
  }

  getTranslatedDate(date) {
    this.datePipe = new DatePipe(this.translate.currentLang);
    return this.datePipe.transform(date, 'fullDate');
  }

  getCivilityFromMail(data) {
    try {
      const mailIdsList = [];
      const self = this;
      if (data) {
        data.forEach(mail => {
          if (mail.senderProperty) {
            if (mail.senderProperty.sender) {
              if (mailIdsList.indexOf(mail.senderProperty.sender) === -1) {
                mailIdsList.push(mail.senderProperty.sender);
              }
            }
          }
          if (mail.recipientProperty) {
            mail.recipientProperty.forEach(receiver => {
              if (receiver.recipient) {
                receiver.recipient.forEach(ids => {
                  if (mailIdsList.indexOf(ids) === -1) {
                    mailIdsList.push(ids);
                  }
                });
              }
            });
          }
        });
        // console.log(mailIdsList);
        if (mailIdsList.length > 0) {
          this.mailService.findMailCivility(mailIdsList).subscribe(response => {
            const emailList = response.data;
            if (emailList) {
              emailList.forEach(mail => {
                self.updateCivility(mail.email, mail);
              });
            }
            self.UrgentMessage = self.totalUrgentMessage[0];
          });
        }
      } else {
        this.UrgentMessage = data;
      }
    } catch (e) {
      this.UrgentMessage = data;
    }
  }

  updateCivility(mailId, AccDetails) {
    if (mailId && AccDetails) {
      const self = this;
      this.totalUrgentMessage.forEach((data, index) => {
        if (data.senderProperty.sender) {
          if (!Array.isArray(data.senderProperty.sender)) {
            if (data.senderProperty.sender === mailId) {
              self.totalUrgentMessage[index].senderProperty.sender = AccDetails;
            }
          }
        }
        if (data.recipientProperty) {
          data.recipientProperty.forEach((receiver, rcIndex) => {
            if (receiver.recipient) {
              receiver.recipient.forEach((id, idIndex) => {
                if (!Array.isArray(id)) {
                  if (id === mailId) {
                    self.totalUrgentMessage[index].recipientProperty[
                      rcIndex
                    ].recipient[idIndex] = AccDetails;
                  }
                }
              });
            }
          });
        }
      });
      // console.log(self.totalMailList);
    }
  }
}
