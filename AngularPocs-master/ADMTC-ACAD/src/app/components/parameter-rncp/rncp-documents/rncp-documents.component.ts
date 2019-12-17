import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Page } from '../../../models/page.model';
import { Sort } from '../../../models/sort.model';
import { RNCPTitlesService } from '../../../services/rncp-titles.service';
import { MdDialog } from '@angular/material';
import { TranslateService } from 'ng2-translate';
import _ from 'lodash';
import { AcademicKitService } from '../../../services/academic-kit.service';
import { AddDocumentDialogComponent } from '../../../dialogs/add-document-dialog/add-document-dialog.component';
declare var swal: any;

@Component({
  selector: 'app-rncp-documents',
  templateUrl: './rncp-documents.component.html',
  styleUrls: ['./rncp-documents.component.scss']
})
export class RncpDocumentsComponent implements OnInit {

  selectedRNCP;
  rncpTitles = [];
  RNCPform: FormGroup;

  acadDocumentsList: any = [];

  page = new Page();
  sort = new Sort();
  ngxDtCssClasses = {
    sortAscending: 'fa fa-caret-up',
    sortDescending: 'fa fa-caret-down',
    pagerLeftArrow: 'icon-left',
    pagerRightArrow: 'icon-right',
    pagerPrevious: 'icon-prev',
    pagerNext: 'icon-skip'
  };
  filteredOptions: Observable<string[]>;

  constructor(private titleService: RNCPTitlesService,
    private dialog: MdDialog,
    private acadService: AcademicKitService,
    private translate: TranslateService) {
    this.RNCPform = new FormGroup({
    text: new FormControl('', Validators.required)
  });}

  ngOnInit() {
    this.getRncpTitles();
    this.setPageSortInitState();

    this.filteredOptions = this.RNCPform.get('text').valueChanges.startWith(null)
    .map(list => list ? this.filterRNCPTitle(list) :
      this.rncpTitles.slice());
  }
  setPageSortInitState() {
    this.page.pageNumber = 0;
    this.page.size = 100;
    this.page.totalElements = 0;
    this.page.totalPages = 0;
    this.sort.sortby = '';
    this.sort.sortmode = 'asc';
  }

  getRncpTitles() {
    this.titleService
      .getRNCPTitleListView(this.page, this.sort)
      .subscribe(
      data => {
        this.rncpTitles = _.orderBy(data.titles, ['shortName'], ['asc']);
        this.RNCPform.controls['text'].setValue('');
      });
  }

  filterRNCPTitle(name: string) {
    return this.rncpTitles.filter(list =>
      list.shortName.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  OnSelectRNCPTitle(data) {
    if (data) {
      this.selectedRNCP =  data;
      this.titleService.setSelectedRncpTitleSubject({...this.selectedRNCP});
      this.getAcadDocumentList();
    }
  }

  getAcadDocumentList() {
    this.titleService.getAcadKitDocs(this.selectedRNCP._id).subscribe(
      (docList) => {
        console.log('getAcadDocumentList docList', docList);
        if (docList.data && docList.data.length) {
          this.acadDocumentsList = _.orderBy(docList.data, ['name'], ['asc']);
          this.page.totalElements = docList.total;
        } else {
          this.acadDocumentsList = [];
        }
    });
  }

  onSelectDocument(event) {
    const document = event.selected[0];
    const editDocumentDialog = this.dialog.open(AddDocumentDialogComponent, { disableClose: true, width: '600px' });
    editDocumentDialog.componentInstance.document = document;
    editDocumentDialog.afterClosed().subscribe((value) => {
      if (value) {
        const newDocument = value;
        newDocument._id = document._id;
        newDocument.parentCategory = document.parentCategory._id ||  document.parentCategory ;
        newDocument.parentTest = document.parentTest;
        this.acadService.updateDocument(newDocument).subscribe(newDoc => {
          if (newDoc) {
            this.getAcadDocumentList();
            if ( newDoc && newDoc.documentType === 'uploadedFromAcadKit' &&  document.publishedForStudent !==  newDoc.publishedForStudent) {
              if (newDoc.publishedForStudent) {
                this.studentDocPublished();
              } else {
                this.studentDocUnpublished();
              }
            }
          }
        });
      }
    });
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

}
