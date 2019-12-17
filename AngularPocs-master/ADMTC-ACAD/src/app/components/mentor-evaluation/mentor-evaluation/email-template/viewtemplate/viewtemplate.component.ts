import { Component, OnInit, ViewEncapsulation, Input, Inject } from '@angular/core';
import { MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA, MdSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from 'ng2-translate';
import swal from 'sweetalert2';
import { EmailtemplateService } from 'app/services/emailtemplate.service';
// import { QuillModule } from 'ngx-quill';
import { QuillEditorComponent } from 'ngx-quill/src/quill-editor.component';
@Component({
  selector: 'app-viewmessage',
  templateUrl: './viewtemplate.component.html',
  styleUrls: ['./viewtemplate.component.scss'],
  providers: [ EmailtemplateService],
  encapsulation: ViewEncapsulation.None,
  inputs: ['activeColor', 'baseColor', 'overlayColor']
})
export class ViewtemplateComponent implements OnInit {

  @Input() taskId;


  recepientsList: Observable<Array<string>>;
  selectedRecepientsList = [];
  composeProcess = false;
  composeMailMessage: string;
  filename;
  text;
  subject;
  date;
  PopupTitle;
  TemplateId = "";
  TemplateData;
  formSubmit = false;
  dealType = '';
  availableVeriable = []
  public templateForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogref: MdDialogRef<ViewtemplateComponent>,
    public dialog: MdDialog,
    public snackBar: MdSnackBar,

    private EmailtemplateService: EmailtemplateService,
    @Inject(MD_DIALOG_DATA) public data: any,
    public translate: TranslateService
  ) {

    this.templateForm = this.fb.group({
      filename: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
      subject: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
      message: ['', Validators.required]
    });

  }

  ngOnInit(): void {
      this.templateForm.controls['filename'].setValue(this.TemplateData.name);
      this.templateForm.controls['subject'].setValue(this.TemplateData.subject);
      this.templateForm.controls['message'].setValue(this.TemplateData.message);
      this.composeMailMessage = this.TemplateData.message;

      this.getMailTags();
  }


  closeDialog(): void {
    this.dialogref.close();
  }

  getMailTags(): void {
    this.EmailtemplateService.getMailTags().then(data => {
      console.log(data.data);
      this.availableVeriable = data.data.fields;
    });
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

      this.EmailtemplateService.updateTemplate(this.TemplateId, dataPost)
        .subscribe(value => {
          console.log('HTTP Response data');
          console.log(typeof value['data']);
          if (value['data']) {
            console.log(value['data']['_id']);
            this.closeDialog();
            swal({
              title:this.translate.instant('MENTOREVALUATION.EMAILTEMPLATE.CONGRATULATION'),
              text:this.translate.instant('MENTOREVALUATION.EMAILTEMPLATE.TemplateupdatedSuccess')+ ':' + value['data']['name'], 
              allowEscapeKey:true,
              type:'success'
          })
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

  textChanged(event) {
    // console.log(event.range.index);
    if(event.range){
      //this.cursorPos = event.range.index;
    }
   }

   addVeriable(name){
     name = name.replace(/</g, '&lt;').replace(/>/g, '&gt;');
     this.templateForm.controls['message'].setValue(this.composeMailMessage + name);
   }



}
