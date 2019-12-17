
import { Component, OnInit, ViewEncapsulation, Input, Inject } from '@angular/core';
import { MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA, MdSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { LoginService } from '../../services/login.service';
import { TranslateService } from 'ng2-translate';
import { MailService } from '../../services/mail.service';
import { UtilityService } from '../../services/utility.service'
import swal from 'sweetalert2';
import { Mail } from './../../models/mail';
import { Student } from 'app/models/student.model';

@Component({
  selector: 'app-send-student-mail',
  templateUrl: './send-student-mail.component.html',
  styleUrls: ['./send-student-mail.component.scss'],
  providers: [MailService, LoginService],
  encapsulation: ViewEncapsulation.None,
  inputs: ['activeColor', 'baseColor', 'overlayColor']
})
export class SendStudentMailComponent implements OnInit {

  @Input() taskId;

  mail = new Mail();
  recepientsList: Observable<Array<string>>;
  selectedRecepientsList = [];
  composeProcess = false;
  composeMailMessage: string;
  public mailForm: FormGroup;
  attachmnetsPaths = [];
  currentUser;
  studentId;
  student;
  selectedStudent;
  showCCInput = false;
  showBCCInput = false;
  constructor(
    private fb: FormBuilder,
    public dialogref: MdDialogRef<SendStudentMailComponent>,
    public dialog: MdDialog,
    public translate: TranslateService,
    public snackBar: MdSnackBar,
    private MailService: MailService,
    private utility: UtilityService,
    private _login: LoginService,
    @Inject(MD_DIALOG_DATA) public data: any,
  ) {
    this.mailForm = this.fb.group({
      search_receiver: [],
      subject: ['', Validators.required],
      message: ['', Validators.required],
      cc: ['',],
      bcc: ['',]
    });

  }
  ngOnInit(): void {
    this.getRecipients();
    this.getCurrentUser();
    console.log(this.translate.currentLang);
    if (this.student) {
      this.composeMailMessage = this.utility.computeCivility(this.student.sex, this.translate.currentLang);
      this.composeMailMessage += ' ' + this.student.firstName + ' ' + this.student.lastName + ' , </br></br></br></br></br>';
      this.composeMailMessage += this.utility.computeCivility(this.currentUser.sex, this.translate.currentLang);
      this.composeMailMessage += ' ' + this.currentUser.firstName + ' ' + this.currentUser.lastName;
      this.composeMailMessage += ',</br>' + this.currentUser.position;
      if (this.student.rncpTitle && this.student.rncpTitle.shortName) {
        this.mailForm.controls['subject'].setValue(this.student.rncpTitle.shortName);
      }
    }

    if (this.selectedStudent.length) {
      this.selectedStudent.forEach(element => {
        this.selectedRecepientsList = [];
        this.selectedRecepientsList.push({
          email: element.email,
          display: element.firstName + ' ' + element.lastName + ' <' + element.email + '>',
          civility: element.civility
        });
      });
    } else {
      this.selectedRecepientsList = [];
      this.selectedRecepientsList.push({
        email: this.student.email,
        display: this.student.firstName + ' ' + this.student.lastName + ' <' + this.student.email + '>',
        civility: this.student.civility
      });
    }
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
        return this.MailService.searchRecipients(keyword);
      })
  }

  getCurrentUser(): void {
    this.currentUser = this._login.getLoggedInUser();
    console.log(this.currentUser);
  }

  addCCBox() {
    if (this.showCCInput === false) {
      this.showCCInput = true;
    } else {
      this.showCCInput = false;
    }

  }
  addBCCBox() {
    if (this.showBCCInput === false) {
      this.showBCCInput = true;
    } else {
      this.showBCCInput = false;
    }

  }

  closeDialog(): void {
    this.dialogref.close();
  }

  removeSelectedRecepient(index) {
    this.selectedRecepientsList.splice(index, 1);
  }

  recepientDisplayFunction(selectedRecepient) {
    return typeof selectedRecepient === 'object' && selectedRecepient ? selectedRecepient.display : null;
  }
  validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  sendMail(): void {

    console.log('Pending');

    this.composeProcess = true;
    const formValues = this.mailForm.value;
    const receiversArray = [];

    if (formValues.search_receiver) {
      const str_array = formValues.search_receiver.split(',');
      for (let i = 0; i < str_array.length; i++) {
        str_array[i] = str_array[i].replace(/^\s*/, '').replace(/\s*$/, '');
        if (this.validateEmail(str_array[i])) {
          receiversArray.push({ 'recipient': str_array[i], 'rank': 'a', 'mailType': 'inbox' });
        }
      }
    }

    this.selectedRecepientsList.forEach(function (recipient) {
      receiversArray.push({ 'recipient': recipient.email, 'rank': 'a', 'mailType': 'inbox' });
    });

    const new_mail = new Mail();
    new_mail.emails = receiversArray;
    new_mail.subject = formValues.subject;
    new_mail.message = formValues.message;
    new_mail.isSent = true;
    new_mail.tags = ['string'];

    this.MailService.sendMail(new_mail).then(
      task => {
        this.composeProcess = false;
        this.dialogref.close('updateMailList');
        // this.snackBar.open("Mail Sent", 'Ok', { duration: 2000 });
        const self = this;
        swal({
          title: self.translate.instant('STUDENT.MESSAGE.MAILSENDMSG'),
          text: '',
          allowEscapeKey: true,
          type: 'success',
          confirmButtonText: self.translate.instant('STUDENT.MESSAGE.OK'),
        });
      },
      (error) => {
        // this.snackBar.open(error, 'Ok', { duration: 2000 });
        swal({
          title: this.translate.instant('STUDENT.MESSAGE.ERRORTIT'),
          text: this.translate.instant('STUDENT.MESSAGE.ERRORMSG'),
          allowEscapeKey: true,
          type: 'error'
        });
        this.composeProcess = false;
      }
    );
  }



}
