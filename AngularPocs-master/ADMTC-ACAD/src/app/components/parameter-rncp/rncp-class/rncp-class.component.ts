import { Component, OnInit } from '@angular/core';
import { MdSelect } from '@angular/material';
import { RNCPTitlesService } from '../../../services/rncp-titles.service';
import { Page } from '../../../models/page.model';
import { Sort } from '../../../models/sort.model';
import { FormsModule, ReactiveFormsModule,FormArray, FormBuilder, FormGroup, Validators, FormControl,ValidationErrors } from '@angular/forms';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';
import { AddClassDialogComponent } from '../../../dialogs/add-class-dialog/add-class-dialog.component';
import { ClassModel } from '../../../models/class.model';
import { TranslateService } from 'ng2-translate';
import { Observable } from 'rxjs/Observable';
declare var swal: any;
@Component({
  selector: 'app-rncp-class',
  templateUrl: './rncp-class.component.html',
  styleUrls: ['./rncp-class.component.scss']
})
export class RncpClassComponent implements OnInit {

  rncpTitle: any;
  RncpShort = '';
  selectedRNCP;
  classes = [];
  rncpTitles = [];
  RNCPform: FormGroup;
  addClassDialog: MdDialogRef<AddClassDialogComponent>;
  configClass: any = {
    disableClose: true,
    width: '600px',
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
  filteredOptions: Observable<string[]>;
  text: any;

  constructor(private titleService: RNCPTitlesService,
    private dialog: MdDialog,
    private translate: TranslateService, ) {
    this.page.pageNumber = 0;
    this.page.size = 100;
    this.page.totalElements = 0;
    this.page.totalPages = 0;
    this.sort.sortby = '';
    this.sort.sortmode = 'asc';

    this.RNCPform = new FormGroup({
      text: new FormControl('', Validators.required)
    });
    this.text = this.RNCPform.controls['text'];
    this.filteredOptions = this.text.valueChanges.startWith(null)
    .map(list => list ? this.filterRNCPTitle(list) :
      this.rncpTitles.slice());
  }
  filterRNCPTitle(name: string) {
    return this.rncpTitles.filter(list =>
      list.shortName.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  ngOnInit() {
    let self = this;
    this.titleService
      .getRNCPTitleListView(this.page, this.sort)
      .subscribe(
      data => {
        this.rncpTitles = data.titles.sort(self.keysrt('shortName'));
        this.RNCPform.controls['text'].setValue('');
      });
  }
  OnSelectRNCPTitle(data) {
    console.log(data);
    if (data) {
      this.selectedRNCP =  data._id;
      this.getClassList();

    }
  }
  keysrt(key) {
    return function(a,b){
     if (a[key] > b[key]) return 1;
     if (a[key] < b[key]) return -1;
     return 0;
    }
  }

  getClassList() {
    this.titleService.selectRncpTitle(this.selectedRNCP).subscribe(() => {
      if (this.selectedRNCP) {
        this.titleService
          .getClasses(this.selectedRNCP, this.page, this.sort)
          .subscribe(data => {
            console.log(data);
            if (data.total === 0) {
              this.classes = [];
              this.page.totalElements = 0;
            } else {
              this.classes = data.classes;
              this.page.totalElements = data.total;
            }

          });
      }
    })
  }

  onSelectClass(selected) {
    console.log('Selected: ', selected);

  }

  getRNCPName(): string {
    for (const s of this.rncpTitles) {
      if (s._id === this.selectedRNCP) {
        return s.shortName;
      }
    }
    return '';
  }

  addNewClass() {
    this.addClassDialog = this.dialog.open(AddClassDialogComponent, this.configClass);
    this.addClassDialog.componentInstance.RNCPSHORT = this.getRNCPName();
    this.addClassDialog.componentInstance.RNCPtitleId = this.selectedRNCP;
    this.addClassDialog.componentInstance.ClassList = this.classes;
    this.addClassDialog.afterClosed().subscribe((id) => {
      // this.selectedRNCP = status.
      console.log(id);
      if(id !== ""){
        this.selectedRNCP = id;
        this.getClassList();
      }
    });
  }

  editClass(classObj: ClassModel) {
    console.log('Edit: ', classObj);
    this.addClassDialog = this.dialog.open(AddClassDialogComponent, this.configClass);
    this.addClassDialog.componentInstance.modify = true;
    this.addClassDialog.componentInstance.RNCPSHORT = this.getRNCPName();
    this.addClassDialog.componentInstance.RNCPtitleId = this.selectedRNCP;
    this.addClassDialog.componentInstance.ClassList = this.classes;
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

  deleteClass(data) {
    console.log(data);


    let self = this;
    let className = data.name;
    let classId = data._id;

    if (this.selectedRNCP) {
      this.titleService
        .getStudentByClass(classId)
        .subscribe(data => {
          console.log(data);



          if (data.total) {

            swal({
              title: this.translate.instant('PARAMETERS-RNCP.CLASSES.MESSAGE.STUDENTTITLE'),
              html: this.translate.instant('PARAMETERS-RNCP.CLASSES.MESSAGE.STUDENTEXIEST', { CLASSNAME: className, STUDENTTOTLE: data.total }),
              type: 'question',
              allowEscapeKey:true,
              showCancelButton: true,
              cancelButtonText: this.translate.instant('NO'),
              confirmButtonText: this.translate.instant('YES')
            }).then(() => {
              console.log('redirect to student list');
            }, function (dismiss) {
              if (dismiss === 'cancel') {
              }
            });

          } else {
            swal({
              title: this.translate.instant('PARAMETERS-RNCP.CLASSES.MESSAGE.ATTENTION'),
              html: this.translate.instant('PARAMETERS-RNCP.CLASSES.MESSAGE.DELETECONFIRMMESSAGE', { CLASSNAME: className }),
              type: 'question',
              showCancelButton: true,
              allowEscapeKey:true,
              cancelButtonText: this.translate.instant('NO'),
              confirmButtonText: this.translate.instant('YES')
            }).then(() => {
              this.titleService.deleteClass(this.selectedRNCP, classId).subscribe(status => {
                if (status) {
                  swal({
                    title: 'Success',
                    text: this.translate.instant('PARAMETERS-RNCP.CLASSES.MESSAGE.DELETESUCCESS', { CLASSNAME: className }),
                    allowEscapeKey:true,
                    type: 'success'
                  }).then(function () {
                    self.getClassList();
                  }.bind(this));
                }
                else {
                  swal({
                    title: 'Attention',
                    text: this.translate.instant('PARAMETERS-RNCP.CLASSES.MESSAGE.DELETEFAILED'),
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

        });
    }



  }
}
