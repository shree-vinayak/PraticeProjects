import { Component, OnInit, ViewEncapsulation, Input, Inject } from '@angular/core';
import { MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA, MdSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from 'ng2-translate';
import swal from 'sweetalert2';
import { RNCPTitlesService } from 'app/services/rncp-titles.service';
import { Page } from 'app/models/page.model';
import { Sort } from 'app/models/sort.model';
import { CrossCorrectionService } from 'app/components/cross-correction/cross-correction.service';
@Component({
  selector: 'app-cross-correction-dialog',
  templateUrl: './cross-correction-dialog.component.html',
  styleUrls: ['./cross-correction-dialog.component.scss'],
  providers: [],
  encapsulation: ViewEncapsulation.None,
  inputs: ['activeColor', 'baseColor', 'overlayColor']
})
export class CrossCorrectionDialogComponent implements OnInit {

  page = new Page();
  sort = new Sort();
  public form: FormGroup;
  rncpTitles = [];
  title;
  filteredOptionsRNCPTitle: Observable<string[]>;
  selectedRNCP;

  classes = [];
  class;
  filteredOptionsClass: Observable<string[]>;
  selectedClass;

  tests = [];
  test;
  filteredOptionsTest: Observable<string[]>;
  selectedTest;
  formSubmit=false;

  constructor(
    private fb: FormBuilder,
    public dialogref: MdDialogRef<CrossCorrectionDialogComponent>,
    public dialog: MdDialog,
    public snackBar: MdSnackBar,
    @Inject(MD_DIALOG_DATA) public data: any,
    public translate: TranslateService,
    private titleService: RNCPTitlesService,
    private crosscorrectionService: CrossCorrectionService,
  ) {

    this.page.pageNumber = 0;
    this.page.size = 100;
    this.page.totalElements = 0;
    this.page.totalPages = 0;
    this.sort.sortby = '';
    this.sort.sortmode = 'asc';

    this.form = this.fb.group({
      title: ['', Validators.required],
      class: ['', Validators.required],
      test: ['', Validators.required]
    });

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
      this.selectedRNCP = data._id;

      self.titleService.getClasses(this.selectedRNCP, self.page, self.sort).subscribe(data => {
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
      this.selectedClass = data._id;
      self.crosscorrectionService.getTests(this.selectedRNCP,this.selectedClass, self.page, self.sort).subscribe(data => {
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
      this.selectedTest = data._id;
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
    this.dialogref.close({status:false,TitleId:'', ClassId:'', TestId:''});
  }
  enterToCrossCorrection(){
    if(this.form.valid && this.selectedTest && this.selectedClass && this.selectedRNCP){
      this.dialogref.close({status:true,TitleId:this.selectedRNCP, ClassId:this.selectedClass, TestId:this.selectedTest});
    }
  }




}
