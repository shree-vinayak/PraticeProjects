import { Component, OnInit, ViewEncapsulation, Input, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA, MdSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from 'ng2-translate';
import { ViewtemplateComponent } from './viewtemplate/viewtemplate.component';
import swal from 'sweetalert2';
import { EmailtemplateService } from '../../../../services/emailtemplate.service';

@Component({
  selector: 'app-mentor-email-template',
  templateUrl: './email-template.component.html',
  styleUrls: ['./email-template.component.scss'],
  providers: [EmailtemplateService]

})
export class EmailTemplateComponent implements OnInit {

  @Input() taskId;


  recepientsList: Observable<Array<string>>;
  selectedRecepientsList = [];
  composeProcess = false;
  composeMailMessage = '';
  composeMailSubject = '';
  cursorPos = 0;
  filename;
  text;
  subject;
  date;
  PopupTitle;
  TemplateId = "";
  TemplateData;
  formSubmit = false;
  isReadOnly = false;
  dealType = '';
  public editor;

  availableVeriable = [];
  public templateForm: FormGroup;
  public dialogRef: MdDialogRef<ViewtemplateComponent>;
  templateList = [];
  viewtemplateConfig: MdDialogConfig = {
    disableClose: true,
    width: '80%',
    height: '80%'
  };

  constructor(
    private fb: FormBuilder,
    private EmailtemplateService: EmailtemplateService,
    public translate: TranslateService,
    public dialog: MdDialog,
  ) {

    this.templateForm = this.fb.group({
      filename: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
      subject: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
      message: ['', Validators.required]
    });

  }

  ngOnInit(): void {
    this.getTemplates();
    this.getMailTags();
  }

  getTemplates(): void {
    this.EmailtemplateService.getTemplates().then(data => {
      console.log(data.data);
      this.templateList = data.data;
    });
  }
  getMailTags(): void {
    this.EmailtemplateService.getMailTags().then(data => {
      console.log(data.data);
      this.availableVeriable = data.data.fields;
    });
  }

  viewTemplate(data) {
    console.log('data');
    console.log(data);
    this.templateForm.enable();
    this.isReadOnly = false;
    this.templateForm.controls['filename'].setValue(data.name);
    this.templateForm.controls['subject'].setValue(data.subject);
    this.templateForm.controls['message'].setValue(data.message);
    this.composeMailMessage = data.message;
    this.TemplateId = data._id;

    // this.dialogRef = this.dialog.open(ViewtemplateComponent, this.viewtemplateConfig);
    // this.dialogRef.componentInstance.TemplateData = data;
    // this.dialogRef.componentInstance.TemplateId = data._id;
    // this.dialogRef.afterClosed().subscribe(result => {
    //   this.dialogRef = null;
    //   this.getTemplates();
    // });
    // return false;

  }
  viewEyeTemplate(data) {
    this.templateForm.enable();
    this.templateForm.controls['filename'].setValue(data.name);
    this.templateForm.controls['subject'].setValue(data.subject);
    this.templateForm.controls['message'].setValue(data.message);
    this.composeMailMessage = data.message;
    this.TemplateId = data._id;
    this.templateForm.disable();
    this.isReadOnly = true;
  }

  deleteTemplate(data) {
      let EmailtemplateService = this.EmailtemplateService;
      let thistranslate = this.translate;
      let self = this;
      swal({
        title: thistranslate.instant('MENTOREVALUATION.EMAILTEMPLATE.TemplatedeletedWarningTitle'),
        text: thistranslate.instant('MENTOREVALUATION.EMAILTEMPLATE.TemplatedeletedWarningMessage'),
        type: 'warning',
        allowEscapeKey:true,
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then(function () {

        self.EmailtemplateService.removeTemplate(data._id).map((data) => {
          swal({
            title:'Deleted!', 
            text: thistranslate.instant('MENTOREVALUATION.EMAILTEMPLATE.TemplatedeletedSuccess'), 
            allowEscapeKey:true,
            type:'success'
          });
          self.getTemplates();
          return data;
        }).subscribe();

      }, function (dismiss) {
        if (dismiss === 'cancel') {

        }
      })
  }

  sendTemplate() {
    this.formSubmit = true;
    if (!this.templateForm.valid) {
      return;
    }
    var formValues = this.templateForm.value;

    let dataPost = {
      'name': formValues.filename,
      'purpose': 'testing',
      'subject': formValues.subject,
      'message': formValues.message,
      'fields': this.availableVeriable,
      'fieldsMap': [],
      'version': '1',
      'status': 'active'
    }
    console.log(dataPost);

    if(this.TemplateId){
      this.EmailtemplateService.updateTemplate(this.TemplateId, dataPost)
      .subscribe(value => {
        console.log('HTTP Response data');
        console.log(typeof value['data']);
        if (value['data']) {
          this.getTemplates();
          this.templateForm.reset();
          this.formSubmit = false;
          this.TemplateId = "";
          swal({
            title: this.translate.instant('MENTOREVALUATION.EMAILTEMPLATE.CONGRATULATION'), 
            text:this.translate.instant('MENTOREVALUATION.EMAILTEMPLATE.TemplateupdatedSuccess')+ ':' + value['data']['name'],
            allowEscapeKey:true,
            type: 'success'
          })
        } else {
          swal({
            title: 'Oops...', 
            text: value['message'],
            allowEscapeKey:true,
            type:'error'
          })
        }
      });
    }else{

        this.EmailtemplateService.createTempalte(dataPost)
        .subscribe(value => {
          console.log('HTTP Response data');
          console.log(typeof value['data']);
          if (value['data']) {
            console.log(value['data']['_id']);
            this.getTemplates();
            this.templateForm.reset();
            this.formSubmit = false;
            swal({
              title: this.translate.instant('MENTOREVALUATION.EMAILTEMPLATE.CONGRATULATION'),
              text: this.translate.instant('MENTOREVALUATION.EMAILTEMPLATE.TemplateCreatedSuccess',{name:value['data']['name']}),
              type: 'success',
              allowEscapeKey:true,
              showCancelButton: false,
              confirmButtonText: this.translate.instant('SETTINGS.USERTYPES.S1.Ok')
            });
          } else {
            swal({
              title:'Oops...', 
              text: value['message'],
              allowEscapeKey:true,
              type: 'error'
            })
          }
        });

    }

  }

  revert(){
    this.templateForm.reset();
    this.formSubmit = false;
  }


  textChanged(event) {
   // console.log(event.range.index);
   if(event.range){
     this.cursorPos = event.range.index;
   }
  }

  addVeriable(name){
    name = name.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    this.templateForm.controls['message'].setValue(this.composeMailMessage + name);
    this.templateForm.controls['subject'].setValue(this.composeMailSubject + name);
  }




}
