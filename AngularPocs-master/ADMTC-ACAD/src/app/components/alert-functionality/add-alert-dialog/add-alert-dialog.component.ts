import { Component, OnInit, ViewChild } from '@angular/core';
import { MdDialogRef, MdDialog, MdAutocompleteTrigger } from '@angular/material';
import { TranslateService } from 'ng2-translate';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AlertService } from '../../../services/alert.service';
import { AppSettings } from '../../../app-settings';
import { UtilityService } from '../../../services/utility.service';
declare var swal: any;
@Component({
  selector: 'app-add-alert-dialog',
  templateUrl: './add-alert-dialog.component.html',
  styleUrls: ['./add-alert-dialog.component.scss']
})
export class AddAlertDialogComponent implements OnInit {
  @ViewChild(MdAutocompleteTrigger) autoCompTo;
  addAlertForm: FormGroup;
  recepientsList = [];
  selectedRecepientsList = [];
  filteredUserTypes: Observable<string[]>;
  cursorPos = 0;
  recipient: any;
  dispButtonText = true;
  selectedAlert: any;
  message: string;
  isChecked: string;
  message1 = '';
  loggedID: any;
  loggeduserId: any;
  constructor(public dialogref: MdDialogRef<AddAlertDialogComponent>,
    public dialog: MdDialog,
    public translate: TranslateService,
    private fb: FormBuilder,
    public utilityService: UtilityService,
    //public translate: TranslateService,
    private alertService: AlertService) {

      this.loggedID = this.alertService.getLoggedUser();
    }


  ngOnInit() {


  //  let quill = new Quill('.editor');
  //   quill.setText('Hello\n');

    this.initializeForm();
    this.getRecipents();
    this.toggleAnswer(false);

    if (this.selectedAlert) {
      this.addAlertForm.controls['message'].setValue(this.selectedAlert.message);
      this.message1 = this.selectedAlert.message;
      this.toggleAnswer(this.selectedAlert.requiredResponse);
      this.toggleStatus(this.selectedAlert.requiredResponse);
      this.selectedAlert.recipient.forEach(element => {
        this.selectedRecepientsList.push(element);
      });
    }else {
      this.message1 = '<p><br></p><p><br></p><p> ' +  this.utilityService.computeCivility(this.loggedID.sex, this.translate.currentLang) + ' ' + this.loggedID.firstName + ' ' + this.loggedID.lastName + '<br> ' + this.loggedID.position  + '</p>';

    }


    console.log("saa", this.selectedRecepientsList);
  }

  toggleStatus(val) {
    if (val === true) {
      this.isChecked = 'checked';
    } else {
      this.isChecked = '';
    }
  }

  toggleAnswer(val) {
    console.log(val);
    const ans = this.addAlertForm.value.requiredResponse;

    if (ans === true) {
      this.dispButtonText = false;
      this.addAlertForm.controls['button1'].clearValidators();
      this.addAlertForm.controls['button2'].clearValidators();
      this.addAlertForm.controls['button2'].updateValueAndValidity();
      this.addAlertForm.controls['button1'].updateValueAndValidity();
    } else {
      this.dispButtonText = true;
      this.addAlertForm.controls['button1'].setValidators([Validators.required]);
      this.addAlertForm.controls['button2'].setValidators([Validators.required]);
      this.addAlertForm.controls['button2'].updateValueAndValidity();
      this.addAlertForm.controls['button1'].updateValueAndValidity();
    }
  }
  initializeForm() {
    this.addAlertForm = this.fb.group({
      name: new FormControl(this.selectedAlert && this.selectedAlert.name ? this.selectedAlert.name : '', Validators.required),
      recipient: new FormControl(''),
      message: new FormControl(this.selectedAlert && this.selectedAlert.message ? this.selectedAlert.message : '', Validators.required),
      // dateOfPublish: new FormControl(''),
      button1: new FormControl(this.selectedAlert && this.selectedAlert.button1 ? this.selectedAlert.button1 : ''),
      button2: new FormControl(this.selectedAlert && this.selectedAlert.button2 ? this.selectedAlert.button2 : ''),
      userType: new FormControl(''),
      requiredResponse: new FormControl(this.selectedAlert && this.selectedAlert.requiredResponse ? this.selectedAlert.requiredResponse : false),
      published: false
    });
  }

  saveAlert(action) {
    const userTypeArray = [];

    console.log(this.selectedRecepientsList);
    this.selectedRecepientsList.forEach( (recipient) => {
      userTypeArray.push(recipient._id);
    });



    this.addAlertForm.value.recipient = userTypeArray;


    if (action === 'publish') {
      this.addAlertForm.value.published = true;


      let timeDisabled = AppSettings.global.timeDisabledinSecForSwalMini;
      swal({
        title: this.translate.instant('ALERT_FUNCTIONALITY.PUBLISH.TITLE'),
        html: this.translate.instant('ALERT_FUNCTIONALITY.PUBLISH.TEXT', {
          alertTitle: this.addAlertForm.value.name
        }),
        type: 'question',
        allowEscapeKey: true,
        showCancelButton: true,
        confirmButtonText: this.translate.instant('ALERT_FUNCTIONALITY.PUBLISH.BUTTON'),
        cancelButtonText: this.translate.instant('ALERT_FUNCTIONALITY.PUBLISH.CANCEL'),
        onOpen: () => {
          swal.disableConfirmButton();
         // const cancelBtnRef = swal.cancelButtonText;
          const confirmBtnRef = swal.getConfirmButton();
          const time = setInterval(() => {
            timeDisabled -= 1;
            confirmBtnRef.innerText = this.translate.instant('ALERT_FUNCTIONALITY.PUBLISH.BUTTON') + ' in ' + timeDisabled + ' sec';
           // cancelBtnRef.innerText = this.translate.instant('ALERT_FUNCTIONALITY.PUBLISH.CANCEL');
          }, 1000);

          setTimeout(() => {

            confirmBtnRef.innerText = this.translate.instant('ALERT_FUNCTIONALITY.PUBLISH.BUTTON');
            swal.showCancelButton = this.translate.instant('ALERT_FUNCTIONALITY.PUBLISH.CANCEL');
            swal.enableConfirmButton();
            clearTimeout(time);
          }, (timeDisabled * 1000));
        }
      }).then(
        () => {

          if (this.selectedAlert && this.selectedAlert._id) {
            this.alertService.updateAlert(this.selectedAlert._id, this.addAlertForm.value).subscribe((res: any) =>{
              if (res.code === 200) {
                let rec = '';
                res.data.recipient.forEach(element => {
                    rec += this.utilityService.getTranslateADMTCSTAFFKEY(element.name) + ',';
                });
                // console.log('recipent',rec);
                swal({
                  title: this.translate.instant('ALERT_FUNCTIONALITY.ALERT_S3.TITLE'),
                  html: this.translate.instant('ALERT_FUNCTIONALITY.ALERT_S3.TEXT', {usertype: rec}),
                  type: 'success',
                  allowEscapeKey: true,
                  showCancelButton: false,
                  confirmButtonText: this.translate.instant('ALERT_FUNCTIONALITY.ALERT_S3.BUTTON')
                });
                this.dialogref.close('refresh');
              }
              //  if(res.code === 400){
              //   this.validateName();
              // }

            });
          } else {

          this.alertService.saveAlert(this.addAlertForm.value).subscribe((res: any) => {
            if (res.code === 200) {
              let rec = '';
              res.data.recipient.forEach(element => {
                  rec += this.utilityService.getTranslateADMTCSTAFFKEY(element.name) + ',';
              });
              swal({
                title: this.translate.instant('ALERT_FUNCTIONALITY.ALERT_S3.TITLE'),
                html: this.translate.instant('ALERT_FUNCTIONALITY.ALERT_S3.TEXT', {usertype: rec}),
                type: 'success',
                allowEscapeKey: true,
                showCancelButton: false,
                confirmButtonText: this.translate.instant('ALERT_FUNCTIONALITY.ALERT_S3.BUTTON')
              });
              this.dialogref.close('refresh');
            } if(res.code === 400){
              this.validateName();
            }

          });
        }

        },
        function (dismiss) {
        }
      );

    } else {



      this.addAlertForm.controls['button1'].clearValidators();
      this.addAlertForm.controls['button2'].clearValidators();
      this.addAlertForm.controls['button2'].updateValueAndValidity();
      this.addAlertForm.controls['button1'].updateValueAndValidity();
      this.addAlertForm.value.recipient = userTypeArray;
      if (this.selectedAlert && this.selectedAlert._id) {

        this.alertService.updateAlert(this.selectedAlert._id, this.addAlertForm.value).subscribe((res: any) =>{
          if (res.code === 200) {
            swal({
              title: this.translate.instant('ALERT_FUNCTIONALITY.NOT_PUBLISH.TITLE'),
              html: this.translate.instant('ALERT_FUNCTIONALITY.NOT_PUBLISH.TEXT'),
              type: 'info',
              allowEscapeKey: true,
              showCancelButton: false,
              confirmButtonText: this.translate.instant('ALERT_FUNCTIONALITY.NOT_PUBLISH.BUTTON')
            });
            this.dialogref.close('refresh');
          }
          //  else  if(res.code === 400){
          //   this.validateName();
          // }
        });
      } else{

        this.addAlertForm.value.recipient = userTypeArray;
        this.alertService.saveAlert(this.addAlertForm.value).subscribe(res => {
          if (res) {

            if(res.code === 400){
              this.validateName();
            }else{
              swal({
                title: this.translate.instant('ALERT_FUNCTIONALITY.NOT_PUBLISH.TITLE'),
                html: this.translate.instant('ALERT_FUNCTIONALITY.NOT_PUBLISH.TEXT'),
                type: 'info',
                allowEscapeKey: true,
                showCancelButton: false,
                confirmButtonText: this.translate.instant('ALERT_FUNCTIONALITY.NOT_PUBLISH.BUTTON')
              });
              this.dialogref.close('refresh');
            }
          }
        });
      }

    }
  }

  validateName(){
    swal({
      title: this.translate.instant('ALERT_FUNCTIONALITY.ALERT_S9.TITLE'),
      html: this.translate.instant('ALERT_FUNCTIONALITY.ALERT_S9.TEXT'),
      type: 'warning',
      allowEscapeKey: true,
      showCancelButton: false,
      confirmButtonText: this.translate.instant('ALERT_FUNCTIONALITY.ALERT_S9.BUTTON')
    });
  }

  getTranslateUserType(name) {
    let value = this.translate.instant('ADMTCSTAFFKEY.' + name.toUpperCase());
    return value !== 'ADMTCSTAFFKEY.' + name.toUpperCase() ? value : name;
  }


  getRecipents() {
    this.alertService.searchTranslatedRecipients('').subscribe( (data) => {
      this.recepientsList = data;
      this.filteredUserTypes = this.addAlertForm.get('userType').valueChanges
      .startWith(null)
      .map(list => list && list.length ? this.filterUserType(list) : this.recepientsList.slice());
    });

  }

  filterUserType(name: string) {
    return this.recepientsList.filter((list: any) => list.name.toLowerCase().includes(name.toLowerCase())).slice();
  }

  openUserTypesSuggestionList() {
    this.autoCompTo.openPanel();
  }

  selectRecipient(res, i) {
    this.selectedRecepientsList.push(res);
    this.recepientsList.splice(i, 1);
    this.recepientsList = [...this.recepientsList];
    this.selectedRecepientsList = [...this.selectedRecepientsList];
    this.addAlertForm.controls.userType.setValue('');
  }

  recepientDisplayFunction(selectedRecepient) {
    return typeof selectedRecepient === 'object' && selectedRecepient ? selectedRecepient.name : null;
  }

  removeSelectedRecepient(index, type) {
    this.recepientsList.push(this.selectedRecepientsList[index]);
    this.recepientsList = [...this.recepientsList];
    this.selectedRecepientsList.splice(index, 1);
  }

  textChanged(event) {
    if (event.range) {
      this.cursorPos = event.range.index;
    }
  }

  closeDialog() {
    this.dialogref.close();
  }
}
