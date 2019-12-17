import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { SubjectService } from '../../../../services/subject.service';
import { ExpertiseService } from '../../../../services/expertise.service';
import swal from 'sweetalert2';
import { RNCPTitlesService } from "../../../../services/rncp-titles.service";
import { Print } from '../../../../shared/global-urls';
import { PDFService } from '../../../../services/pdf.service';
import { TranslateService } from 'ng2-translate';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { ScholarSeasonService } from '../../../../services/scholar-season.service';
import { MdSelect, MdSlideToggleChange, MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA, MdSnackBar } from '@angular/material';
import { FormsModule, ReactiveFormsModule, FormArray, FormBuilder, FormGroup, Validators, FormControl, ValidationErrors } from '@angular/forms';
@Component({
  selector: 'app-student-marks',
  templateUrl: './student-marks.component.html',
  styleUrls: ['./student-marks.component.css']
})
export class StudentMarksComponent implements OnInit {

  selectedRNCP;
  @Input() student;
  selectedRNCPDetails
  TestSections;
  seasons;
  form: FormGroup;
  filteredOptions: Observable<string[]>;
  expertiseList = [];
  text: any;
  docFooterText;
  constructor(private titleService: RNCPTitlesService,
    private subjectService: SubjectService,
    private expertiseService: ExpertiseService,
    private pdfService: PDFService,
    public translate: TranslateService,
    public dialog: MdDialog,
    public datepipe: DatePipe,
    public scholarservice: ScholarSeasonService, ) {
    this.form = new FormGroup({
      text: new FormControl('', Validators.required)
    });
    this.text = this.form.controls['text'];
    this.filteredOptions = this.text.valueChanges.startWith(null).map(list => list ? this.filterScolar(list) : this.seasons);
  }

  ngOnInit() {
    if (this.student && this.student.rncpTitle) {
      console.log(this.student);
      this.selectedRNCPDetails = this.student.rncpTitle;
      this.selectedRNCP = this.student.rncpTitle._id;
      if(this.student.correctedTests && this.student.correctedTests[0]){
        this.TestSections = this.student.correctedTests[0].correction.correctionGrid.correction.sections;
      }

      this.getAllScholerSeason();
      this.getExpertise();
    }

    // this.form.controls['text'].setValue('');
  }
  filterScolar(scholarseason: string) {
    return this.seasons.filter(list =>
      list.scholarseason.toLowerCase().indexOf(scholarseason.toLowerCase()) === 0);
  }
  OnSelectScolar(data) {
    console.log(data);
  }

  getExpertise() {

    this.titleService.selectRncpTitle(this.selectedRNCP).subscribe(() => {
      this.expertiseService.getTitleExpertise(this.selectedRNCP).subscribe((res) => {
        this.expertiseList = [];
        for (let i = 0; i < res.expertiseList.length; i++) {
          if (res.expertiseList[i].status !== 'deleted') {
            this.expertiseList.push(res.expertiseList[i]);
          }
        }
      });
    });

    this.docFooterText = 'ADMTC ' + this.selectedRNCPDetails.shortName + ' - CONDITIONS - '+ this.datepipe.transform(this.selectedRNCPDetails.updatedAt, 'ddMMyyyy');


  }


  getAllScholerSeason() {
    this.scholarservice.getscholerSeason().subscribe((res) => {
      this.seasons = res;
      console.log('this.seasons');
      console.log(this.seasons);
      this.form.controls['text'].setValue(this.student.scholarSeason?this.student.scholarSeason.scholarseason:'');
    });
  }

}
