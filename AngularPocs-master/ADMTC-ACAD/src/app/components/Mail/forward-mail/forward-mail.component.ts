import { Component, OnInit, ViewEncapsulation, Input, Inject } from '@angular/core';
import { MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA, MdSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { MailService } from '../../../services/mail.service';
import { Mail } from './../../../models/mail';
import swal from 'sweetalert2';

@Component({
  selector: 'app-forward-mail',
  templateUrl: './forward-mail.component.html',
  styleUrls: ['./forward-mail.component.scss'],
  providers: [MailService],
  encapsulation: ViewEncapsulation.None
})

export class ForwardMailComponent implements OnInit {

  senderId: string;
  forwardMessage: string;
  forwardSubjet: string;
  public forwardMailForm: FormGroup;
  mail = new Mail();
  recepientsList: Observable<Array<string>>;
  selectedRecepientsList = [];
  forwardMailMessage: string;
  subject;
  constructor(

    private fb: FormBuilder,
    public dialogref: MdDialogRef<ForwardMailComponent>,
    public snackBar: MdSnackBar,
    private MailService: MailService) {
    this.forwardMailForm = this.fb.group({
      search_receiver: [],
      // forwardTo:['',Validators.required],
      message: ['', Validators.required],
      subject: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getRecipients();

    this.forwardMailForm.controls.subject.setValue(this.forwardSubjet);
  }

  getRecipients() {
    this.recepientsList = this.forwardMailForm.controls.search_receiver.valueChanges
      .debounceTime(400)
      .distinctUntilChanged()
      .switchMap(keyword => {
        if (typeof keyword == 'object') {
          var isAlreadySelected = this.selectedRecepientsList.filter(recipient => recipient.id == keyword.id);
          if (isAlreadySelected.length == 0) {
            this.selectedRecepientsList.push(keyword);
          }
          this.forwardMailForm.controls.search_receiver.setValue(null);
          return [];
        }
        return this.MailService.searchRecipients(keyword);
      })
  }

  removeSelectedRecepient(index) {
    this.selectedRecepientsList.splice(index, 1);
  }
  validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  recepientDisplayFunction(selectedRecepient) {
    return typeof selectedRecepient == 'object' && selectedRecepient ? selectedRecepient.display : null;
  }

  sendMail(): void {

    var formValues = this.forwardMailForm.value;
    var receiversArray = [];
    this.selectedRecepientsList.forEach(function (recipient) {
      receiversArray.push({ "recipient": recipient.email, "rank": 'a', "mailType": "inbox" });
    });
    if (formValues.search_receiver !== null && formValues.search_receiver !== undefined ) {
      var str_array = formValues.search_receiver.split(',');
      for (var i = 0; i < str_array.length; i++) {
        str_array[i] = str_array[i].replace(/^\s*/, "").replace(/\s*$/, "");
        if (this.validateEmail(str_array[i])) {
          receiversArray.push({ "recipient": str_array[i], "rank": 'a', "mailType": "inbox" });
        }
      }
    }


    let new_mail = new Mail();
    // new_mail.sender = this.senderId;
    // new_mail.receivers = receiversArray;
    // new_mail.mailType = 'inbox';
    // new_mail.subject = this.forwardSubjet;
    // //new_mail.message = formValues.message;
    // new_mail.description = formValues.message;

    new_mail.emails = receiversArray;
    // new_mail.mailType = "sent";
    new_mail.subject = formValues.subject;
    new_mail.message = formValues.message;
    new_mail.isSent = true;
    new_mail.tags = ["foward-mail"];

    this.MailService.sendMail(new_mail).then(
      task => {
        //  this.dialogref.close('updateMailList');
        this.dialogref.close();
        this.snackBar.open("Mail Sent", 'Ok', { duration: 2000 });
      },
      (error) => {
        this.snackBar.open(error, 'Ok', { duration: 2000 });
      }
    );
  }

  closeDialog(): void {
    this.dialogref.close();
  }

  // File Uploading

  activeColor: string = 'green';
  baseColor: string = '#ccc';
  overlayColor: string = 'rgba(255,255,255,0.5)';

  iconColor: string;
  borderColor: string;

  dragging = false;
  loaded = false;
  imageLoaded = false;
  imageSrc = [];

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

  handleImageLoad() {
    this.imageLoaded = true;
    this.iconColor = this.overlayColor;
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

      const formats = ['.pdf', '.txt', '.doc', '.xls', '.png', '.jpeg', '.jpg', '.gif'];

      if (formats.indexOf(strsubstring) === -1) {
        swal({
          title: 'Oops...',
          text: 'Invalid format',
          allowEscapeKey: true,
          type: 'error'
        });
        return;
      }

      // if (strsubstring !== '.pdf' || strsubstring !== '.doc' || strsubstring !== '.xls'
      //   || strsubstring === '.txt' || strsubstring !== '.png' || strsubstring !== '.jpeg' ||
      //   strsubstring === '.jpg' || strsubstring !== '.gif') {
      //   console.log('valid format');
      // } else {
      //   swal({
      //     title: 'Oops...',
      //     text: 'Invalid format',
      //     allowEscapeKey: true,
      //     type: 'error'
      //   });
      //   return;
      // }

      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsDataURL(files[i]);
    }

  }

  _handleReaderLoaded(e) {

    const reader = e.target;
    const fileType = reader.result.split(';')[0].split(':')[1];
    this.imageSrc.push({
      'type': fileType,
      'data': reader.result
    });
    // this.imageSrc.push( reader.result);
    this.loaded = true;
  }

  _setActive() {
    this.borderColor = this.activeColor;
    if (this.imageSrc.length === 0) {
      this.iconColor = this.activeColor;
    }
  }

  _setInactive() {
    this.borderColor = this.baseColor;
    if (this.imageSrc.length === 0) {
      this.iconColor = this.baseColor;
    }
  }


}
