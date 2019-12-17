import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { CrossCorrectionService } from 'app/components/cross-correction/cross-correction.service';
import { RNCPTitlesService } from 'app/services';
import { TranslateService } from 'ng2-translate';
import { MD_DIALOG_DATA, MdDialogRef, MdDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { Page } from 'app/models/page.model';
import { Sort } from 'app/models/sort.model';
import { Router } from '@angular/router';
import { QualityControlService } from 'app/services/quality-control.service';
declare var swal: any;

@Component({
  selector: 'app-quality-control-dialog',
  templateUrl: './quality-control-dialog.component.html',
  styleUrls: ['./quality-control-dialog.component.css']
})
export class QualityControlDialogComponent implements OnInit {

  page = new Page();
  sort = new Sort();
  public form: FormGroup;
  rncpTitles = [];
  title;
  filteredOptionsRNCPTitle: Observable<string[]>;
  selectedRNCP = {
    'name': '',
    '_id': ''
  };;

  classes = [];
  class;
  filteredOptionsClass: Observable<string[]>;
  selectedClass = {
    'name': '',
    '_id': ''
  };;

  tests = [];
  test;
  filteredOptionsTest: Observable<string[]>;
  selectedTest = {
    'name': '',
    '_id': ''
  };
  formSubmit=false;

  constructor(
    private fb: FormBuilder,
    public dialogref: MdDialogRef<QualityControlDialogComponent>,
    public dialog: MdDialog,
    @Inject(MD_DIALOG_DATA) public data: any,
    public translate: TranslateService,
    private titleService: RNCPTitlesService,
    private crosscorrectionService: CrossCorrectionService,
    private router: Router,
    private qualityControlService: QualityControlService
  ) {

    this.form = this.fb.group({
      title: ['', Validators.required],
      class: ['', Validators.required],
      test: ['', Validators.required]
    });

    this.page.pageNumber = 0;
    this.page.size = 100;
    this.page.totalElements = 0;
    this.page.totalPages = 0;
    this.sort.sortby = '';
    this.sort.sortmode = 'asc';

    this.title = this.form.controls['title'];
    this.class = this.form.controls['class'];
    this.test = this.form.controls['test'];
    this.filteredOptionsRNCPTitle = this.title.valueChanges.startWith(null).map(list => list ? this.filterRNCPTitle(list) : this.rncpTitles.slice());
    this.filteredOptionsClass = this.class.valueChanges.startWith(null).map(list => list ? this.filterClass(list) : this.classes.slice());
    this.filteredOptionsTest = this.test.valueChanges.startWith(null).map(list => list ? this.filterTests(list) : this.tests.slice());

  }

  ngOnInit(): void {

    const self = this;
    this.titleService
      .getAllRNCPTitlesShortName()
      .subscribe(data => {
        this.rncpTitles = data.data.sort(self.keysrt('shortName'));
        this.form.controls['title'].setValue('');
      });

  }

  filterRNCPTitle(name: string) {
    return this.rncpTitles.filter(list =>list.shortName.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }
  filterClass(name: string) {
    return this.classes.filter(list =>list.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }
  filterTests(name: string) {
    return this.tests.filter(list =>list.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }
  OnSelectRNCPTitle(data) {
    let self = this;
    this.classes = [];
    if (data && data._id) {
      this.selectedRNCP._id = data._id;
      this.selectedRNCP.name = data.shortName;

      self.titleService.getClasses(this.selectedRNCP._id, self.page, self.sort).subscribe(data => {
          if (data.total === 0) {
            self.classes = [];
          } else {
            self.classes = data.classes;
          }
          self.form.controls['class'].setValue('');
      });

    }
  }
  OnSelectClass(data) {
    let self = this;
    this.tests = [];

    if (data && data._id) {
      this.selectedClass._id = data._id;
      this.selectedClass.name = data.name;
      // self.crosscorrectionService.getTests(this.selectedRNCP._id, this.selectedClass._id, self.page, self.sort).subscribe(data => {
      //   if (data.total === 0) {
      //     self.tests = [];
      //   } else {
      //     self.tests = data.tests;
      //   }
      //   this.form.controls['test'].setValue('');
      //  });
      self.crosscorrectionService.getTestForQc(this.selectedRNCP._id, this.selectedClass._id).subscribe
      ( data => {
          if (data.total === 0) {
          self.tests = [];
        } else {
          self.tests = data.tests;
        }
        this.form.controls['test'].setValue('');
      });

    }
  }
  OnSelectTest(data) {
    if (data && data._id) {
      this.selectedTest._id = data._id;
      this.selectedTest.name = data.name;
    }
  }
  keysrt(key) {
    return function (a, b) {
      if (a[key] > b[key]) { return 1; }
      if (a[key] < b[key]) { return -1; }
      return 0;
    }
  }



  closeDialog(): void {
    this.dialogref.close({status: false, TitleId: '', ClassId: '', TestId: ''});
  }

  displaySwalQUALITY_S7() {
    swal({
      type: 'warning',
      title: this.translate.instant('QUALITY_CONTROL.QUALITY_S7.TITLE'),
      html: this.translate.instant('QUALITY_CONTROL.QUALITY_S7.TEXT', {testName: this.selectedTest.name}),
      allowEscapeKey: true,
      confirmButtonText: this.translate.instant('QUALITY_CONTROL.QUALITY_S7.OK'),
    });
  }

  checkIfTestIsDoneOrNot() {
    this.qualityControlService.checkIfTestIsDoneOrNot(this.selectedTest._id).subscribe( data => {
      console.log(data);
      if (data.data) {
        const body = {
          rncp: this.selectedRNCP,
          class: this.selectedClass,
          test: this.selectedTest
        }
        if (this.form.valid && this.selectedTest._id && this.selectedClass._id && this.selectedRNCP._id) {
          this.router.navigate(['quality-control', this.selectedRNCP._id, this.selectedClass._id, this.selectedTest._id, { routeData: JSON.stringify(body) }]);
          this.dialogref.close({status: true, TitleId: this.selectedRNCP, ClassId: this.selectedClass, TestId: this.selectedTest});
        }
      } else {
        this.displaySwalQUALITY_S7();
      }
    });
  }
}
