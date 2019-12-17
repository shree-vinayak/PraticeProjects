import { Component, OnInit } from '@angular/core';
import { RNCPTitlesService } from '../../../services/rncp-titles.service';
import { Page } from '../../../models/page.model';
import { Sort } from '../../../models/sort.model';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';
import { AddClassDialogComponent } from '../../../dialogs/add-class-dialog/add-class-dialog.component';
import { ClassModel } from '../../../models/class.model';

@Component({
  selector: 'app-manage-classes',
  templateUrl: './manage-classes.component.html',
  styleUrls: ['./manage-classes.component.scss']
})
export class ManageClassesComponent implements OnInit {

  rncpTitle: any;
  classes: [ClassModel];

  addClassDialog: MdDialogRef<AddClassDialogComponent>;
  configClass: any = {
    disableClose: true,
    width: '400px'
  };

  page = new Page();
  sort = new Sort();
  reorderable = true;
  ngxDtCssClasses = {
    sortAscending: 'fa fa-caret-up',
    sortDescending: 'fa fa-caret-down',
    pagerLeftArrow: 'icon-left',
    pagerRightArrow: 'icon-right',
    pagerPrevious: 'icon-prev',
    pagerNext: 'icon-skip'
  };

  constructor(private titleService: RNCPTitlesService,
              private dialog: MdDialog) {
    this.page.pageNumber = 0;
    this.page.size = 10;
    this.page.totalElements = 0;
    this.page.totalPages = 0;
    this.sort.sortby = '';
    this.sort.sortmode = 'asc';
  }

  ngOnInit() {
    this.titleService
      .getSelectedRncpTitle()
      .subscribe(title => {
        this.rncpTitle = title;
      });
    this.getClassList();
  }

  getClassList() {
    this.titleService
      .getClasses(this.rncpTitle ? this.rncpTitle._id : null, this.page, this.sort)
      .subscribe(data => {
        console.log(data);
        this.classes = data.classes;
        this.page.totalElements = data.total;
      });
  }

  onSelectClass(selected) {
    console.log('Selected: ', selected);

  }

  addNewClass() {
    this.addClassDialog = this.dialog.open(AddClassDialogComponent, this.configClass);
    this.addClassDialog.componentInstance.RNCPtitleId = this.rncpTitle._id;
    this.addClassDialog.afterClosed().subscribe((status) => {
      this.getClassList();
    });
  }

  editClass(classObj: ClassModel) {
    console.log('Edit: ', classObj);
    this.addClassDialog = this.dialog.open(AddClassDialogComponent, this.configClass);
    this.addClassDialog.componentInstance.modify = true;
    this.addClassDialog.componentInstance.classObj = classObj;
    this.addClassDialog.afterClosed().subscribe((status) => {
      this.getClassList();
    });
  }

  changePage(pageInfo): void {
    this.page.pageNumber = pageInfo.offset;
    this.getClassList();
  }

  sortPage(sortInfo): void {
    this.sort.sortby = sortInfo.column.prop;
    this.sort.sortmode = sortInfo.newValue;
    console.log('Sort :', this.sort);
    this.page.pageNumber = 0;
    this.getClassList();
  }

}
