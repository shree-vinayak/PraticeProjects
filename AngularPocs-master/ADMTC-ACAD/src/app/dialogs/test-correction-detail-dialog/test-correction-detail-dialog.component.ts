import { Component, OnInit } from '@angular/core';
import { DocumentDetailsDialogComponent } from '../document-details-dialog/document-details-dialog.component';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';
import { TestCorrectionService } from '../../services/test-correction.service';

@Component({
  selector: 'app-test-correction-detail-dialog',
  templateUrl: './test-correction-detail-dialog.component.html',
  styleUrls: ['./test-correction-detail-dialog.component.scss']
})
export class TestCorrectionDetailDialogComponent implements OnInit {

  testId;
  documentDetailsDialog: MdDialogRef<DocumentDetailsDialogComponent>;
  testDetails;

  configDoc: MdDialogConfig = {
    disableClose: true,
    width: '400px',
    height: '',
    position: {
      top: '',
      bottom: '',
      left: '',
      right: ''
    }
  };

  constructor(private dialog: MdDialog,
    public dialogRef: MdDialogRef<TestCorrectionDetailDialogComponent>,   

    private testCorrectionService: TestCorrectionService,
  ) { }

  ngOnInit() {
    let testId = this.testCorrectionService.getSelectedTest();
    this.testId = testId;
    if (typeof testId != 'function') {
      this.testCorrectionService.getTest(testId).subscribe((value) => {
        this.testDetails = value;
      });
    }
  }

  closeDialog():void{
    this.dialogRef.close();
  }

  openDocumentDetails(index: number) {
    let stack = this.getParent(undefined, [index, 0]);
    stack.reverse();
    this.documentDetailsDialog = this.dialog.open(DocumentDetailsDialogComponent, this.configDoc);
    this.documentDetailsDialog.componentInstance.document = this.testDetails.documents[index];
    this.documentDetailsDialog.componentInstance.positionStack = stack;
    this.documentDetailsDialog.componentInstance.testCorrect = true;
  }

  getParent(parent: any, stack: number[]) {
    if (parent) {
      if (parent.parent != null) {
        stack.push(parent.index);
        return this.getParent(parent.parent, stack);
      } else {
        stack.push(parent.index);
        return stack;
      }
    } else {
      return stack;
    }
  }

  
}
