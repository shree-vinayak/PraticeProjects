import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Page } from '../../../../models/page.model';
import { Sort } from '../../../../models/sort.model';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { RNCPTitlesService } from '../../../../services/rncp-titles.service';
import { MdDialogRef } from '@angular/material';
import { ApplicationUrls } from '../../../../shared/settings';
import { Router } from '@angular/router';

import * as _ from 'lodash';

// Required for Logging on console
import { Log } from 'ng2-logger';
const log = Log.create('FinalCertificateDialogComponent');
log.color = 'grey';

@Component({
  selector: 'app-final-certificate-dialog',
  templateUrl: './final-certificate-dialog.component.html',
  styleUrls: ['./final-certificate-dialog.component.scss']
})
export class FinalCertificateDialogComponent implements OnInit {

  page = new Page();
  sort = new Sort();
  public form: FormGroup;

  certiDegreeImgUrl = ApplicationUrls.imageBasePath + 'assets/images/Logo-CertiDegree-Final.png';

  rncpTitles = [];
  title;
  filteredOptionsRNCPTitle: Observable<string[]>;
  selectedRNCP;

  scholarSeasones = [];
  scholarSeason = null;
  filteredOptionsScholarSeason: Observable<string[]>;
  selectedscholarSeason;

  classes = [];
  class;
  selectedClass;
  filteredOptionsClass: Observable<string[]>;

  constructor(
    private fb: FormBuilder,
    private titleService: RNCPTitlesService,
    public dialogref: MdDialogRef<FinalCertificateDialogComponent>,
    private router: Router
  ) {
    this.form = this.fb.group({
      rncpTitle: ['', Validators.required],
      class: ['', Validators.required],
      scholarSeason: ['', Validators.required]
    });

    this.title = this.form.controls['rncpTitle'];
    this.scholarSeason = this.form.controls['scholarSeason'];
    this.class = this.form.controls['class'];

    this.filteredOptionsRNCPTitle = this.title.valueChanges
      .startWith(null)
      .map(
        list => (list ? this.filterRNCPTitle(list) : this.rncpTitles.slice())
      );

    this.filteredOptionsScholarSeason = this.scholarSeason.valueChanges
      .startWith(null)
      .map(
        list =>
          list ? this.filterScholarSeason(list) : this.scholarSeasones.slice()
      );

    this.filteredOptionsClass = this.class.valueChanges
      .startWith(null)
      .map(list => (list ? this.filterClass(list) : this.classes.slice()));
  }

  ngOnInit(): void {
    this.page.pageNumber = 0;
    this.page.size = 100;
    this.page.totalElements = 0;
    this.page.totalPages = 0;
    this.sort.sortby = '';
    this.sort.sortmode = 'asc';
    this.getAllRNCPList();
  }

  filterRNCPTitle(name: string) {
    return this.rncpTitles.filter(
      list => list.shortName.toLowerCase().indexOf(name.toLowerCase()) === 0
    );
  }

  filterScholarSeason(name: string) {
    return this.scholarSeasones.filter(
      list => list.scholarseason.toLowerCase().indexOf(name.toLowerCase()) === 0
    );
  }

  filterClass(name: string) {
    return this.classes.filter(
      list => list.name.toLowerCase().indexOf(name.toLowerCase()) === 0
    );
  }

  getAllRNCPList() {
    this.titleService.getAllRNCPTitlesShortName().subscribe(response => {
      this.rncpTitles = _.sortBy(response.data, ['shortName']);
      this.form.controls['rncpTitle'].setValue('');
    });
  }


  OnSelectRNCPTitle(data) {
    this.scholarSeasones = [];
    if (data && data._id && this.selectedRNCP !== data) {
      this.selectedRNCP = data;

      this.titleService
        .getClasses(this.selectedRNCP._id, this.page, this.sort)
        .subscribe(response => {
          log.data('OnSelectScholarSeason getClasses', response);
          if (response.total > 0) {
            this.classes = _.sortBy(response.classes, ['name']);
          } else {
            this.classes = [];
          }
          this.form.controls['class'].setValue('');
          this.form.controls['scholarSeason'].setValue('');
        });
    }
  }

  OnSelectClass(data) {
    if (data && data._id && this.selectedClass !== data) {
      this.selectedClass = data;
      this.titleService
        .getSelectedScholarSeason(this.selectedRNCP._id)
        .subscribe(response => {
          log.data('getSelectedScholarSeason', response);
          if (response.length > 0) {
            this.scholarSeasones = _.sortBy(response, ['scholarseason']);
          } else {
            this.scholarSeasones = [];
          }
          this.form.controls['scholarSeason'].setValue('');
        });
    }
  }

  OnSelectScholarSeason(data) {
    this.classes = [];
    if (data && data._id && this.selectedscholarSeason !== data) {
      this.selectedscholarSeason = data;
    }
  }

  closeDialog() {
    this.dialogref.close();
  }

  submitCertificationSelections() {
    if (this.selectedRNCP._id && this.selectedClass._id && this.selectedscholarSeason._id) {
      const rncpClassScholarText = `${this.selectedRNCP.shortName}#${this.selectedClass.name
                      }#${this.selectedscholarSeason.scholarseason}`;
      this.router.navigate(
        ['final-certification-students', { rncpClassScholarText: rncpClassScholarText }],
        {
          queryParams: {
            rncpId: this.selectedRNCP._id,
            classId: this.selectedClass._id,
            scholarSeasonId: this.selectedscholarSeason._id
          }
        }
      );
      this.closeDialog();
    }
  }
}
