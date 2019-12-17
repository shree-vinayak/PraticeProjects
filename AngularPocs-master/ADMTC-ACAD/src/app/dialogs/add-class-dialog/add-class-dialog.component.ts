import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from 'ng2-translate';
import { UserService } from '../../services/users.service';
import { RNCPTitlesService } from '../../services/rncp-titles.service';
import { ClassModel } from '../../models/class.model';
import { Page } from '../../models/page.model';
import { Sort } from '../../models/sort.model';
import { FileUploader } from 'ng2-file-upload';
import { Document } from '../../models/document.model';
import { AcademicKitService } from '../../services/academic-kit.service';
import { FileUpload } from '../../shared/global-urls';
declare var swal: any;

@Component({
  selector: 'app-add-new-class-dialog',
  templateUrl: './add-class-dialog.component.html',
  styleUrls: ['./add-class-dialog.component.scss'],
  host: {
    '(document:keydown)': 'handleKeyboardEvents($event)'
  }
})
export class AddClassDialogComponent implements OnInit {
  form: FormGroup;
  public RNCPtitleId: string;
  ClassList = [];
  public RNCPSHORT = '';
  classAlreadyExist = false;
  public modify: boolean;
  public classObj: ClassModel;
  CLASSNAME = '';
  title = 'Add Class';
  rncpTitles = [];
  ShowRncpTitlesDP = false;
  page = new Page();
  sort = new Sort();

  @ViewChild('uploadCertificateBackground') uploadCertificateInput: any;
  @ViewChild('uploadSignatorySignature') uploadSignatoryInput: any;

  uploaderCertificateBackground: FileUploader = new FileUploader({
    url: FileUpload.uploadUrl,
    isHTML5: true,
    disableMultipart: false
  });

  uploaderSignatorySignature: FileUploader = new FileUploader({
    url: FileUpload.uploadUrl,
    isHTML5: true,
    disableMultipart: false
  });

  imageIdObj = {
    certificateId: undefined,
    signatureId: undefined,
  };

  constructor(private dialogRef: MdDialogRef<AddClassDialogComponent>,
    private translate: TranslateService, private service: UserService,
    private acadService: AcademicKitService,
    private appService: RNCPTitlesService) {
      this.page.pageNumber = 0;
      this.page.size = 100;
      this.page.totalElements = 0;
      this.page.totalPages = 0;
      this.sort.sortby = '';
      this.sort.sortmode = 'asc';

      this.signatureUploadSubs();
      this.certificateUploadSubs();

  }
  
  ngOnInit() {
    this.form = new FormGroup({
      rncpTitle: new FormControl(this.RNCPtitleId ? this.RNCPtitleId : '', [Validators.required, Validators.maxLength(50)]),
      name: new FormControl(this.modify ? this.classObj.name : '', [Validators.required, Validators.maxLength(50)]),
      description: new FormControl(this.modify ? this.classObj.description : '', [Validators.required, Validators.maxLength(500)]),
      dateOfCertificateIssuance: new FormControl(this.modify && this.classObj.dateOfCertificateIssuance ? this.classObj.dateOfCertificateIssuance : ''),
      certificateImageName: new FormControl(this.modify && this.classObj.certificateImageName ? this.classObj.certificateImageName : ''),
      certifiateSignatoryName: new FormControl(this.modify && this.classObj.certifiateSignatoryName ? this.classObj.certifiateSignatoryName : ''),
      signatoryImageName: new FormControl(this.modify && this.classObj.signatoryImageName ? this.classObj.signatoryImageName : '')
    });

    if (this.modify) {
      this.imageIdObj.certificateId = this.classObj.certificateBackgroundImage;
      this.imageIdObj.signatureId = this.classObj.signatorySignature;
    }

    this.certificateUploadSubs();
    if(!this.RNCPtitleId){
      this.ShowRncpTitlesDP = true;
      this.appService.getAllRNCPTitlesShortName().subscribe(response => {
        this.rncpTitles = response.data;
      });
    }

  }

  cancel() {
    this.dialogRef.close('');
  }

  handleKeyboardEvents(event: KeyboardEvent) {
    if (event.keyCode === 27) {
      this.cancel();
    }
  }

  checkExistClass(event) {
    if (this.modify) {
      if (event.target.value.trim().toLowerCase() === this.classObj.name.trim().toLowerCase()) {
        this.classAlreadyExist = false;
        return true;
      }
    }
    if (event.target.value) {
      for (const c of this.ClassList) {
        if (event.target.value.trim().toLowerCase() === c.name.trim().toLowerCase()) {
          this.classAlreadyExist = true;
          return true;
        }
      }
    }
    this.classAlreadyExist = false;
    return true;
  }
  uploadCertificate() {
    this.uploaderCertificateBackground.clearQueue();
    this.uploadCertificateInput.nativeElement.click();
  }

  uploadSignature() {
    this.uploaderSignatorySignature.clearQueue();
    this.uploadSignatoryInput.nativeElement.click();
  }
  certificateUploadSubs() {
    this.uploaderCertificateBackground.onAfterAddingFile = (file) => {
      file.withCredentials = false;
      const fileExtension = file.file.name.split('.').pop();
      const acceptedTypes: string[] = ['png', 'jpg', 'jpeg'];
      if (acceptedTypes.indexOf(fileExtension) === -1) {
        swal({
          title: this.translate.instant('TEST.UPLOAD_RESTRICT_TO_IMAGE.TITLE'),
          text: this.translate.instant('TEST.UPLOAD_RESTRICT_TO_IMAGE.TEXT'),
          allowEscapeKey: false,
          allowOutsideClick: false,
          confirmButtonText: this.translate.instant('TEST.UPLOAD_RESTRICT_TO_IMAGE.BUTTON'),
          type: 'error'
        }).then(() => {
          this.uploaderCertificateBackground.clearQueue();
        });
      } else {
        this.uploaderCertificateBackground.queue[0].upload();
      }
    };

    this.uploaderCertificateBackground.onErrorItem = (item, response, status, headers) => {
      console.log(item, response, status, headers);
      this.uploaderErrorSwal();
    };
    this.uploaderCertificateBackground.onSuccessItem = (item, response, status, headers) => {
      const res = JSON.parse(response);
      if (res.status === 'OK') {
        const certificate = new Document(this.RNCPtitleId, item.file.name, undefined, 'certiDegreeCertificate',
          res.data.filepath, item.file.name, 'certificateBackgroundImage', this.translate.currentLang, res.data.s3FileName);
          this.uploadFileAsDocument(certificate);
      } else {
        this.uploaderErrorSwal();
      }
    };
  }


  signatureUploadSubs() {
    this.uploaderSignatorySignature.onAfterAddingFile = (file) => {
      file.withCredentials = false;
      const fileExtension = file.file.name.split('.').pop();
      const acceptedTypes: string[] = ['png', 'jpg', 'jpeg'];
      if (acceptedTypes.indexOf(fileExtension) === -1) {
        swal({
          title: this.translate.instant('TEST.UPLOAD_RESTRICT_TO_IMAGE.TITLE'),
          text: this.translate.instant('TEST.UPLOAD_RESTRICT_TO_IMAGE.TEXT'),
          allowEscapeKey: false,
          allowOutsideClick: false,
          confirmButtonText: this.translate.instant('TEST.UPLOAD_RESTRICT_TO_IMAGE.BUTTON'),
          type: 'error'
        }).then(() => {
          this.uploaderSignatorySignature.clearQueue();
        });
      } else {
        this.uploaderSignatorySignature.queue[0].upload();
      }
    };

    this.uploaderSignatorySignature.onErrorItem = (item, response, status, headers) => {
      console.log(item, response, status, headers);
      this.uploaderErrorSwal();
    };
    this.uploaderSignatorySignature.onSuccessItem = (item, response, status, headers) => {
      const res = JSON.parse(response);
      if (res.status === 'OK') {
        const certificate = new Document(this.RNCPtitleId, item.file.name, undefined, 'certiDegreeCertificate',
          res.data.filepath, item.file.name, 'certificateBackgroundImage', this.translate.currentLang, res.data.s3FileName);
          this.uploadFileAsDocument(certificate, true);
      } else {
        this.uploaderErrorSwal();
      }
    };
  }

  uploadFileAsDocument(newDocument, isForSignature?: boolean) {
    this.acadService.addDocument(newDocument).subscribe(responseDoc => {
      if ( responseDoc._id ) {
        if ( isForSignature ) {
          this.imageIdObj.signatureId = responseDoc._id;
          this.form.get('signatoryImageName').setValue(responseDoc.fileName);
        } else {
          this.imageIdObj.certificateId = responseDoc._id;
          this.form.get('certificateImageName').setValue(responseDoc.fileName);
        }
      }
    });
  }

  uploaderErrorSwal() {
    swal({
      title: 'Attention',
      text: this.translate.instant('DASHBOARD.ERRORS.UPLOADERROR'),
      allowEscapeKey:true,
      type: 'warning'
    });
  }

  setCertificateValues() {
    this.classObj['dateOfCertificateIssuance'] = this.form.value.dateOfCertificateIssuance;
    this.classObj['certifiateSignatoryName'] = this.form.value.certifiateSignatoryName;
    this.classObj['certificateImageName'] = this.form.value.certificateImageName;
    this.classObj['signatoryImageName'] = this.form.value.signatoryImageName;

    this.classObj['certificateBackgroundImage'] = this.imageIdObj.certificateId;
    this.classObj['signatorySignature'] = this.imageIdObj.signatureId;
  }
  continue() {
    if (!this.classAlreadyExist) {
      if (this.form.valid) {
        this.CLASSNAME = this.form.value.name;
        if (!this.modify) {
          this.classObj = new ClassModel(
            this.form.value.name,
            this.form.value.description,
            this.RNCPtitleId);
            this.setCertificateValues();
          this.appService
            .addClass(this.classObj, this.RNCPtitleId)
            .subscribe(status => {
              if (status) {
                swal({
                  title: this.translate.instant('PARAMETERS-RNCP.CLASSES.MESSAGE.TITLE'),
                  text: this.translate.instant('PARAMETERS-RNCP.CLASSES.MESSAGE.UPDATESUCCESS', { CLASSNAME: this.CLASSNAME }),
                  type: 'success',
                  allowEscapeKey:true,
                  confirmButtonText: 'OK'
                }).then(function () {
                  this.dialogRef.close(this.form.value.rncpTitle);
                }.bind(this));
              } else {
                swal({
                  title: 'Attention',
                  text: this.translate.instant('CLASS.MESSAGE.CLASSADDFAILED'),
                  allowEscapeKey:true,
                  type: 'warning'
                });
              }
            }, (error) => {
              swal({
                title: 'Attention',
                text: this.translate.instant('CLASS.MESSAGE.CLASSADDFAILED'),
                allowEscapeKey:true,
                type: 'warning'
              });
            });
        } else {
          this.classObj.name = this.form.value['name'];
          this.classObj.description = this.form.value['description'];
          this.setCertificateValues();
          this.appService
            .updateClass(this.classObj)
            .subscribe(status => {
              if (status) {
                swal({
                  title: this.translate.instant('PARAMETERS-RNCP.CLASSES.MESSAGE.TITLE'),
                  text: this.translate.instant('PARAMETERS-RNCP.CLASSES.MESSAGE.UPDATESUCCESS', { CLASSNAME: this.CLASSNAME }),
                  allowEscapeKey:true,
                  type: 'success',
                  confirmButtonText: 'OK'
                }).then(function () {
                  this.dialogRef.close(status);
                }.bind(this));
              } else {
                swal({
                  title: 'Attention',
                  text: this.translate.instant('CLASS.MESSAGE.CLASSEDITFAILED'),
                  allowEscapeKey:true,
                  type: 'warning'
                });
              }
            }, (error) => {
              swal({
                title:'Attention',
                text: this.translate.instant('CLASS.MESSAGE.CLASSEDITFAILED'),
                allowEscapeKey:true,
                type: 'warning'
              });
            });
        }
      }
    }
  }
}
