import { Component, OnInit } from '@angular/core';
import { RNCPTitlesService } from '../../services/rncp-titles.service';
import { MoveItemService } from '../../services/move-item.service';
import { TranslateService } from 'ng2-translate';
import { MdDialogRef } from '@angular/material';
import { AcademicKitService } from '../../services/academic-kit.service';
import { DashboardService } from '../../services/dashboard.service';
import { Category } from '../../models/category.model';

declare var swal: any;

@Component({
  selector: 'app-move-item-dialog',
  templateUrl: './move-item-dialog.component.html',
  styleUrls: ['./move-item-dialog.component.scss'],
  providers: [DashboardService]
})
export class MoveItemDialogComponent implements OnInit {

  public itemtype: string;
  stack: number[] = null;
  pathArray: string[];
  public folderPosition: number[];
  academicKit: any;
  document;

  // Below initialized 2 variables for moving documents
  fromCategory: Category;
  toCategory: Category;

  constructor(private acadService: AcademicKitService,
    private mvService: MoveItemService,
    private translate: TranslateService,
    private dialogRef: MdDialogRef<MoveItemDialogComponent>) {
  }

  ngOnInit() {
    // console.log("Move: ", this.folderPosition);
    this.acadService.getAcademicKit().subscribe(function (kit) {
      this.academicKit = kit;
    }.bind(this));
    this.mvService.updateMovingCategory(this.folderPosition, this.itemtype);
    this.mvService.getPositionStack().subscribe( (stack) => {
      this.stack = stack;
      this.setPath();
    });


  }

  selectRoot() {
    if (this.itemtype === 'category') {
      this.stack = [];
      this.mvService.updateSelectedCategory(this.stack);
    }

  }

  setPath() {
    const pathArray = [];

    if (this.stack) {
      pathArray.push('Root');
      if (this.stack.length > 0) {
        let cats = this.academicKit.categories[this.stack[0]];
        pathArray.push(cats.title);
        for (let i = 1; i <= this.stack.length - 1; i++) {
          cats = cats.subCategories[this.stack[i]];
          pathArray.push(cats.title);
        }
      }
    }
    this.pathArray = pathArray;
  }

  onSelectToCategory(c) {
    console.log(c);
    this.toCategory = c;
  }

  move() {

    // let cats = this.academicKit.categories[this.stack[0]];
    // let catsOrg = this.academicKit.categories[this.folderPosition[0]];
    let folderName = '';
    let DocName = '';
    // if(cats){
    //   folderName = cats.title;
    // }
    // if(catsOrg){
    //   DocName = catsOrg.title;
    // }
    let messageType = this.itemtype;
    const cats = this.academicKit.categories;

    if (this.itemtype === 'document') {
      console.log(this.folderPosition);
      console.log(this.fromCategory);

      this.fromCategory.documents = this.fromCategory.documents.filter(d => d._id !== this.document._id);
      // const dindex = this.folderPosition.pop();
      // let dcat = cats[this.folderPosition[0]];
      // for (let i = 1; i <= this.folderPosition.length - 1; i++) {
      //   dcat = dcat.subCategories[this.folderPosition[i]];
      // }
      // const d = dcat.documents[dindex === -1 ? 0 : dindex];
      // this.folderPosition.push(dindex);
      // DocName = d && d.name ? d.name : '';
      // let dcat1 = cats[this.stack[0]];
      // for (let i = 1; i <= this.stack.length - 1; i++) {
      //   dcat1 = dcat1.subCategories[this.stack[i]];
      // }
      folderName = this.acadService.toCategory.getValue() ? this.acadService.toCategory.getValue().title : '';
      DocName = this.document.name && this.document.name ? this.document.name : '';
      messageType = 'Document';
    }
    if (this.itemtype === 'category'){
      let cat = cats[this.folderPosition[0]];
      for (let i = 1; i <= this.folderPosition.length - 1; i++) {
        cat = cat.subCategories[this.folderPosition[i]];
      }
      DocName = cat.title;
      let cat1 = cats[this.stack[0]];
      const self = this;
      for (let i = 1; i <= this.stack.length - 1; i++) {
        cat1 = cat1.subCategories[this.stack[i]];
      }
      folderName = cat1 && cat1.title ? cat1.title : '';
      messageType = this.translate.instant('DASHBOARD.MESSAGES.MOVEDOCUMENTSUCCESS.Folder');
    }
    if (this.itemtype === 'test') {
      const tindex = this.folderPosition.pop();
      let tcat = cats[this.folderPosition[0]];
      for (let i = 1; i <= this.folderPosition.length - 1; i++) {
        tcat = tcat.subCategories[this.folderPosition[i]];
      }
      const t = tcat.tests[tindex === -1 ? 0 : tindex];
      this.folderPosition.push(tindex);
       console.log(t);
       DocName = t && t.name ? t.name : '';

      let tcat1 = cats[this.stack[0]];
      for (let i = 1; i <= this.stack.length - 1; i++) {
        tcat1 = tcat1.subCategories[this.stack[i]];
      }
      folderName = tcat1 && tcat1.title ? tcat1.title : '';
      messageType = this.translate.instant('TEST.TEST');
    }

    console.log('Source : ' + DocName);
    console.log('Destination : ' + folderName);
    console.log('Type : ' + messageType);
    console.log(this.folderPosition);
    console.log('Move : from ', this.folderPosition, ' to ', this.stack);
    this.mvService.moveItem(this.itemtype, this.folderPosition, this.stack, this.fromCategory, this.document)
      .subscribe( (status) => {
        if (status) {
            swal({
              title: this.translate.instant('DASHBOARD.MESSAGES.MOVEDOCUMENTSUCCESS.Title'),
              html: this.translate.instant('DASHBOARD.MESSAGES.MOVEDOCUMENTSUCCESS.Text', {messageType: messageType, DocName: DocName, FolderName: folderName}),
              type: 'success',
              allowEscapeKey: true,
              showCancelButton: false,
              confirmButtonText: this.translate.instant('DASHBOARD.MESSAGES.MOVEDOCUMENTSUCCESS.Ok')
            }).then(() => {
              this.dialogRef.close({ stack: this.stack, category: this.fromCategory});
            }, function (dismiss) {
              if (dismiss === 'cancel') {
              }
            });

        } else {
          swal({
            title: 'Attention',
            text: this.translate.instant('DASHBOARD.ERRORS.MOVEDOCUMENTERROR', {messageType: messageType}),
            allowEscapeKey: true,
            type: 'warning'
          });
        }
      });
  }

  cancel() {
    this.dialogRef.close();
  }
}
