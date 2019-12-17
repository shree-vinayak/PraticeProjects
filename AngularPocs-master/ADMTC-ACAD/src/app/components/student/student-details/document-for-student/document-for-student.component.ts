import { Component, OnInit, Input } from '@angular/core';
import { RNCPTitlesService } from '../../../../services/rncp-titles.service';
import { MdDialog } from '@angular/material';
import { DocumentDetailsDialogComponent } from '../../../../dialogs/document-details-dialog/document-details-dialog.component';
import * as _ from 'lodash';

@Component({
  selector: 'app-document-for-student',
  templateUrl: './document-for-student.component.html',
  styleUrls: ['./document-for-student.component.scss']
})
export class DocumentForStudentComponent implements OnInit {
  @Input() student;
  rncpTitle;
  categories;
  constructor(private appService: RNCPTitlesService,
              private dialog: MdDialog,) { }

  ngOnInit() {
    this.getAcadKitforDocuments();
  }

  getAcadKitforDocuments() {
    this.appService.getPublishedForStudentsDocument(this.student.rncpTitle._id).subscribe((response) => {
      console.log(' getPublishedForStudentsDocument data', response);
      this.categories = response.data;
    });
  }

  openDocumentDetailsDialog(document: any) {
    const documentDetailsDialog = this.dialog.open(DocumentDetailsDialogComponent, {
      disableClose: false,
      width: '600px'
  });
    documentDetailsDialog.componentInstance.document = document;
  }

  getSortedDocumentArray(documentArray) {
    return [..._.orderBy(documentArray, ['name'], ['asc'])];
  }
}
