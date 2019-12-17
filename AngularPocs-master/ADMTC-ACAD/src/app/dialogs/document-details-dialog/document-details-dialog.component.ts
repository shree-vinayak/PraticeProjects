import { LoginService } from 'app/services/login.service';
import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';
import { RNCPTitlesService } from '../../services/rncp-titles.service';
import { Document } from '../../models/document.model';
import { TranslateService } from 'ng2-translate';
import { Files, DownloadAnyFileOrDocFromS3 } from '../../shared/global-urls';
import { MoveItemDialogComponent } from '../move-item-dialog/move-item-dialog.component';
import { AddDocumentDialogComponent } from '../add-document-dialog/add-document-dialog.component';
import { AcademicKitService } from '../../services/academic-kit.service';
import { UtilityService } from '../../services';
import _ from 'lodash';

// Required for Logging on console
import { Log } from 'ng2-logger';
const log = Log.create('DocumentDetailsDialogComponent');
log.color = 'green';

declare var swal: any;

@Component({
  selector: 'app-document-details-dialog',
  templateUrl: './document-details-dialog.component.html',
  styleUrls: ['./document-details-dialog.component.scss']
})
export class DocumentDetailsDialogComponent implements OnInit {

  public document: Document;
  public positionStack: number[];
  testCorrect: boolean;
  academicKit: any;
  category: any;
  isPublishedForStud = false;
  documentTypes = [
    {
      value: 'guideline',
      view: 'Guidelines'
    },
    {
      value: 'test',
      view: 'Test'
    },
    {
      value: 'scoring-rules',
      view: 'Scoring Rules'
    },
    {
      value: 'studentnotification',
      view: 'Notification to Student'
    },
    {
      value: 'other',
      view: 'Other'
    }
  ];
  configMove: MdDialogConfig = {
    // disableClose: true,
    width: '50%',
    height: '80%'
  };
  configDoc: MdDialogConfig = {
    disableClose: true,
    width: '600px'
  };

  moveItemsDialog: MdDialogRef<MoveItemDialogComponent>;
  addDocumentDialog: MdDialogRef<AddDocumentDialogComponent>;
  user;
  folderName = '';
  constructor(private dialogRef: MdDialogRef<DocumentDetailsDialogComponent>,
    private acadService: AcademicKitService,
    private translate: TranslateService,
    private dialog: MdDialog,
    private loginService: LoginService,
    public utilityService: UtilityService) {
      log.info('Constructor Invoked!');
  }

  ngOnInit() {
    this.acadService.getAcademicKit().subscribe(kit => {
      this.academicKit = kit;
    });
    this.user = this.loginService.getLoggedInUser();
    this.isPublishedForStud = this.checkIsUploadedForStudent();
  }

  removeDocument() {
    const self = this;
    swal({
      title: this.translate.instant('DELETEDOC_S1.TITLE'),
      html: this.translate.instant('DELETEDOC_S1.TEXT', { DOCNAME: this.document.name }),
      type: 'warning',
      showCancelButton: true,
      allowEscapeKey: true,
      cancelButtonText: this.translate.instant('NO'),
      confirmButtonText: this.translate.instant('YES')
    }).then(() => {
      this.acadService.removeDocument(this.document).subscribe(
        (res) => { console.log(this.document);
          if (res.status === 'OK') {
            let findCat = this.category && this.category._id ? this.academicKit.categories.find( c => c._id === this.category._id) : '';
            let cat = findCat ? findCat : this.academicKit.categories[this.positionStack[0]];;
            for (let i = 1; i < this.positionStack.length - 1; i++) {
              if (cat && cat.subCategories && cat.subCategories.length) {
                cat = cat.subCategories[this.positionStack[i]];
              }
            }

            this.category.documents = _.filter(this.category.documents, function(d) {
              return d._id !== res.data._id;
            });
            this.dialogRef.close({document: this.category.documents, eventType: 'delete'});
            swal({
              title:'Success',
              text:this.translate.instant('DASHBOARD.MESSAGES.REMOVEDOCUMENTSUCCESS'),
              allowEscapeKey:true,
              type:'success'
            })
          } else {
            swal({
              title: 'Attention',
              text: this.translate.instant('DASHBOARD.MESSAGES.REMOVEDOCUMENTERROR'),
              allowEscapeKey:true,
              type: 'warning'
            });
          }
        });
    }, function (dismiss) {
      if (dismiss === 'cancel') {
      }
    });


  }

  editDocument() {
    // this.moveItemsDialog = this.dialog.open(MoveItemDialogComponent, this.configMove);
    let document = this.document;
    this.addDocumentDialog = this.dialog.open(AddDocumentDialogComponent, this.configDoc);
    this.addDocumentDialog.componentInstance.document = this.document;
    this.addDocumentDialog.afterClosed().subscribe((value) => {
      if (value) {
        const newDocument = value;
        newDocument._id = document._id;
        newDocument.parentCategory = document.parentCategory;
        this.acadService.updateDocument(newDocument).subscribe(d => {
          if (d) {
            const newDoc = {...d};
            if ( newDoc.documentType === 'uploadedFromAcadKit' &&  this.document.publishedForStudent !==  newDoc.publishedForStudent) {
              if (newDoc.publishedForStudent) {
                this.studentDocPublished();
              } else if (this.document.publishedForStudent && !newDoc.publishedForStudent) {
                this.studentDocUnpublished();
              }
            }
            // const newCategoryList = this.category.documents.filter((doc) => doc._id !== newDoc._id );
            // this.dialogRef.close([...newCategoryList, newDoc]);
            d['parentTest'] = this.document.parentTest;
            this.document = {...d};
            this.dialogRef.close({document: d, eventType: 'update'});
          }
        });
        // return cats.tests;
        // this.appService.updateSelectedRncpTitle();
      }
    });
    // this.document = document;
  }

  studentDocPublished() {
    swal({
      title: 'Bravo !',
      text: this.translate.instant('PUBLISHABLE_FOR_STUDENTS.PUBLISHDOC_S2.TEXT'),
      allowEscapeKey: true,
      type: 'success',
      confirmButtonText: this.translate.instant('PUBLISHABLE_FOR_STUDENTS.PUBLISHDOC_S2.BTN')
    });
  }

  studentDocUnpublished() {
    swal({
      title: this.translate.instant('PUBLISHABLE_FOR_STUDENTS.PUBLISHDOC_S3.TITLE'),
      allowEscapeKey: true,
      type: 'success',
      confirmButtonText: this.translate.instant('PUBLISHABLE_FOR_STUDENTS.PUBLISHDOC_S2.BTN')
    });
  }

  moveDocument() {
    this.moveItemsDialog = this.dialog.open(MoveItemDialogComponent, this.configMove);
    this.moveItemsDialog.componentInstance.itemtype = 'document';
    this.moveItemsDialog.componentInstance.document = this.document;
    this.moveItemsDialog.componentInstance.fromCategory = this.category;
    this.moveItemsDialog.componentInstance.folderPosition = [...this.positionStack];
    // let pos = this.positionStack.pop();
    this.moveItemsDialog.afterClosed().subscribe( (status) => {
      if (status) {
        // this.positionStack = [...status.stack, this.positionStack[this.positionStack.length - 1]];
        // this.category = {...status.category};
        this.closeDialog();
      } else {
        // this.positionStack.push(pos);
      }
    });
  }

  downloadDocument() {
    const a = document.createElement('a');
    a.target = 'blank';
    if (this.document.storedInS3) {
      a.href = DownloadAnyFileOrDocFromS3.download + this.document.S3FileName + '?token=' + this.loginService.getToken();
    } else {
      a.href = Files.url + this.document.filePath;
    }
    a.download = this.document.fileName;
    a.click();
  }

  getTypeView() {
    if (this.document.type) {
      const documentType = this.documentTypes.find((type) => {
        return type.view.toUpperCase() === this.document.type.toUpperCase();
      });
      const view = documentType ? documentType.value : '';
      return this.translate.instant('DOCUMENTTYPES.' + view.toUpperCase());
    }
    return '';
  }

  closeDialog() {
    this.dialogRef.close();
  }

  viewDocument() {
    const a = document.createElement('a');
    a.target = 'blank';
    if (this.document.storedInS3) {
      a.href = DownloadAnyFileOrDocFromS3.download + this.document.S3FileName + '?token=' + this.loginService.getToken() + '&views=true';
    } else {
      a.href = Files.url + this.document.filePath;
    }
    a.click();
  }

  checkFolderPermission(folderName, permission) {
    /* Check the folder permission - start */
    let key = '';
    if (folderName.trim() === '01. ADMISSIONS') { key = 'admissions'; };
    if (folderName.trim() === '02. ANNALES EPREUVES') { key = 'annalesEpreuves'; };
    if (folderName.trim() === '03. BOITE A OUTILS') { key = 'boiteaOutils'; };
    if (folderName.trim() === '04. ORGANISATION') { key = 'organisation'; };
    if (folderName.trim() === '05. PROGRAMME') { key = 'programme'; };
    if (folderName.trim() === '06. EPREUVES DE LA CERTIFICATION') { key = 'epreuvesCertification'; };
    if (folderName.trim() === '07. ARCHIVES') { key = 'archives'; };
    if (folderName.trim() === 'COMMUNICATION') { key = 'communication'; };


    if (key === '') {
      return true;
    }
    if (this.user && this.user.userFolderPermissions && this.user.userFolderPermissions[key][permission]) {
      return true;
    }
    return false;

    /* Check the folder permission - end */
  }

  checkUserEligibility() {
    return  this.utilityService.checkUserIsDirectorSalesAdmin();
  }

  checkIsUploadedForStudent() {
    return ( this.document && this.document.documentType === 'uploadedFromAcadKit' &&  this.document.publishedForStudent);
  }
}
