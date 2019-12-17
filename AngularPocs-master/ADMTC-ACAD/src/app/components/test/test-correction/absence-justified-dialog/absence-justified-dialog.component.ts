import { Component, OnInit, ViewChild } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { FileUpload } from '../../../../shared/global-urls';
import { TranslateService } from 'ng2-translate';
import { Document } from '../../../../models/document.model';
import { RNCPTitlesService } from '../../../../services/rncp-titles.service';
import { AcademicKitService } from '../../../../services/academic-kit.service';
import { AddDocumentDialogComponent } from '../../../../dialogs/add-document-dialog/add-document-dialog.component';
import { UtilityService } from '../../../../services/utility.service';
import { TestCorrectionService } from '../../../../services/test-correction.service';
declare var swal: any;


@Component({
  selector: 'app-absence-justified-dialog-dialog.component',
  templateUrl: './absence-justified-dialog.component.html',
  styleUrls: ['./absence-justified-dialog.component.scss']
})
export class AbsenceJustifiedDialogComponent implements OnInit {

  expectedDocuments;
  student;
  reson;
  documentId = [];

  reorderable = true;
  ngxDtCssClasses = {
    sortAscending: 'fa fa-caret-up',
    sortDescending: 'fa fa-caret-down',
    pagerLeftArrow: 'icon-left',
    pagerRightArrow: 'icon-right',
    pagerPrevious: 'icon-prev',
    pagerNext: 'icon-skip'
  };
  uploader: FileUploader = new FileUploader({
    url: FileUpload.uploadUrl,
    isHTML5: true,
    disableMultipart: false
  });
  document;
  @ViewChild("userphoto") uploadInput: any;
  selectedRncpTitle;
  testDetails;
  constructor(private dialog: MdDialog,
              private dialogRef: MdDialogRef<AbsenceJustifiedDialogComponent>,
              private translate: TranslateService,
              private acadService: AcademicKitService,
              public utilityService: UtilityService,
              private testCorrectionService: TestCorrectionService,
             ) {

  }

  ngOnInit() {
     /*Upload Student Photo*/
     this.uploader.onAfterAddingFile = file => {
      file.withCredentials = false;
      this.uploader.queue[0].upload();
    };
    this.uploader.onErrorItem = (item, response, status, headers) => {
      swal({
        title:"Attention",
        text:this.translate.instant("DASHBOARD.ERRORS.UPLOADERROR"),
        allowEscapeKey:true,
        type:"warning"
      });
    };
    this.uploader.onSuccessItem = (item, response, status, headers) => {
      const res = JSON.parse(response);
      const today = new Date();
      const publicationDateObj = {
        year: today.getFullYear(),
        month: (today.getMonth() + 1),
        date: today.getDate(),
        hour: today.getHours(),
        minute: today.getMinutes(),
        timeZone: today.getTimezoneOffset().toString(),
      };
      const documentData = {
        'parentRNCPTitle': this.student.rncpTitle,
        'name': this.selectedRncpTitle.shortName + "-" +this.testDetails.name +"-" +this.student.firstName + this.student.lastName,
        'type': item.file.type,
        'document': item.file.type,
        'documentType': 'missingCopy',
        'filePath': res.data.filepath,
        'fileName': item.file.name,
        'publicationDate': {
          'type': 'fixed',
          'publicationDate': publicationDateObj
        },
        'testCorrection': this.student.correctedTests[0].correction._id,
        'storedInS3': true,
        'S3FileName': res.data.s3FileName
      };

      if (res.status === 'OK') {
        this.acadService.addStudentDocument(documentData).subscribe(d => {
          if (d) {
             this.documentId.push(d._id);
            //  swal({
            //   title: this.translate.instant("STUDENT.expectedDocUploadSuccess.Title"),
            //   text: this.translate.instant("STUDENT.expectedDocUploadSuccess.Text",{TestDocName:this.document.documentName,StudentCivility:this.utilityService.computeCivility(this.student.civility,this.translate.currentLang),StudentFirstName:this.student.firstName,StudentLastName:this.student.lastName}),
            //   allowEscapeKey:true,
            //   type: "success"
            //  });
          }else{
            swal({
              title: 'Attention',
              text: this.translate.instant('DASHBOARD.ERRORS.UPLOADERROR'),
              allowEscapeKey: true,
              type: 'warning'
            });
          }
        });

      } else {
        swal({
          title: 'Attention',
          text: this.translate.instant('DASHBOARD.ERRORS.UPLOADERROR'),
          allowEscapeKey: true,
          type: 'warning'
        });
      }
    };

  }



  cancel() {
    this.dialogRef.close({status: false, testCorrect: this.student});
  }

  submit() {
    const self = this;
    if (this.reson && this.documentId){
      if (this.student.testCorrectionId) {
        this.student.testCorrectionId.reasonForMissingCopy = this.reson;
        this.student.testCorrectionId.documentForMissingCopy = this.documentId;
        this.student.testCorrectionId.isJustified = 'yes';
        this.dialogRef.close({status: true, testCorrect: this.student.testCorrectionId});
      }
       else if (this.student.correctedTests[0]) {
        this.student.correctedTests[0].correction.reasonForMissingCopy = this.reson;
        this.student.correctedTests[0].correction.documentForMissingCopy = this.documentId;
        this.student.correctedTests[0].correction.isJustified = 'yes';
        this.dialogRef.close({status: true, testCorrect: this.student.correctedTests[0].correction});
      } 
    }
  }

  checkIsExpectedDocument(){
    return false;
  }
  docUploaded(doc){
    return false;
  }


}
