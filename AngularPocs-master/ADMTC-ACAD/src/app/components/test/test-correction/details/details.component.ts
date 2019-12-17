import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { TranslateService } from 'ng2-translate';
import _ from 'lodash';
import { Category } from '../../../../models/category.model';
import { Page } from '../../../../models/page.model';
import { Sort } from '../../../../models/sort.model';
import { TestCorrection } from '../../../../models/correction.model';
import { TestCorrectionService } from '../../../../services/test-correction.service';
import { RNCPTitlesService } from '../../../../services/rncp-titles.service';

@Component({
  selector: 'test-correction-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit{
    correction;
    page = new Page();
    sort = new Sort();
    public testCorrection = new TestCorrection();
    reorderable = true;
    ngxDtCssClasses = {
      sortAscending: 'fa fa-caret-up',
      sortDescending: 'fa fa-caret-down',
      pagerLeftArrow: 'icon-left',
      pagerRightArrow: 'icon-right',
      pagerPrevious: 'icon-prev',
      pagerNext: 'icon-skip'
    };
    testDetails;
    public form: FormGroup;
    listServiceFeature= [];
    private totalMarks= [];
    testCorrect;
    private today;
    private currentSchoolYear;
    rncpTitle;

    constructor(private testCorrectionService:TestCorrectionService,
                private fb: FormBuilder,
                private router: ActivatedRoute,
                private routes: Router,
                private appService: RNCPTitlesService){
        //let id: number = this.router.params['id'];
        let student;
        let test;
        this.router.params.subscribe(params => {
          console.log(params)
          student = params['id'];
          test = params['testId'];
        });

        this.form = this.fb.group({
          });

        this.testCorrect = {
          test: test,
          corrector: '59a68e33f40ce5372bcfb747',
          student: student,
          date: new Date(),
          correctionGrid: {
            header: {
                fields: []
            },
            correction: {
                penalty: 0,
                bonus: 0,
                total: 0,
                additionalTotal: 0,
                finalComments: '',
                sections: []
            },
            footer: {
                fields: []
            }
          }
        }
    }
    ngOnInit() {
      let selectedTestId = this.testCorrectionService.getSelectedTest();
      if(!selectedTestId){
        this.routes.navigate(['rncp-titles']);
      }else if(typeof selectedTestId == 'function'){
          this.routes.navigate(['rncp-titles']);
        }else{
          let footerInfo = this.testCorrectionService.getFooter();
          let headerInfo = this.testCorrectionService.getHeader();
          console.log(footerInfo);
          if(footerInfo){
            this.testCorrect.correctionGrid.footer = footerInfo.footer;
          }
          if(headerInfo){
            this.testCorrect.correctionGrid.header = headerInfo.header;
          }
          console.log(headerInfo);
          this.today = new Date();
          let nextYear = Number(new Date().getFullYear())+1;
          this.currentSchoolYear = new Date().getFullYear()+'-'+ nextYear;
          this.correction = [
                {
                    "name":"test1",
                    "score":"",
                    "action":"add"
                },
                {
                    "name":"test1",
                    "score":"",
                    "action":"add"
                }
            ];


        this.testCorrectionService.getTest(selectedTestId).subscribe((value) => {
          this.testDetails = value;
          let rncpTitle;
          this.appService.selectRncpTitle(this.testDetails.parentRNCPTitle).subscribe((value) => {
            this.rncpTitle = value.longName;
            rncpTitle = value.longName;
          });
          let test = {};
          let header = [];
          let footer = [];
          let sections = [];
          let testCorrect = this.testCorrect;
          rncpTitle = this.rncpTitle;
          _.forEach(this.testDetails.correctionGrid.header.fields, function(val, key) {
              test['header'+key] = [null, Validators.required];
              let obj = {
                'type': val.type,
                'label': val.value,
                'value': null,
                'dataType': val.dataType,
                'align': val.align
              }
              switch(val.type) {
                  case 'dateRange':
                      obj.value = new Date();
                      testCorrect.correctionGrid.header.fields.push(obj);
                      break;
                  case 'dateFixed':
                      obj.value = new Date();
                      testCorrect.correctionGrid.header.fields.push(obj);
                      break;
                  case 'currentSchoolYear':
                      obj.value = new Date().getFullYear()+'-'+ nextYear;
                      testCorrect.correctionGrid.header.fields.push(obj);
                      break;
                  case 'titleName':
                      obj.value = rncpTitle;
                      testCorrect.correctionGrid.header.fields.push({
                        'type': val.type,
                        'label': val.value,
                        'value': rncpTitle,
                        'dataType': val.dataType,
                        'align': val.align
                      });
                      break;
                  case 'status':
                      testCorrect.correctionGrid.header.fields.push(obj);
                      break;
                  default:
                      testCorrect.correctionGrid.header.fields.push(obj);
              }

          })
          console.log(testCorrect.correctionGrid.header.fields);

            _.forEach(this.testDetails.correctionGrid.footer.fields, function(val, key) {
                test['footer'+key] = [null, Validators.required];
                testCorrect.correctionGrid.footer.fields.push({
                  'type': val.type,
                  'label': val.value,
                  'value': '',
                  'dataType': val.dataType,
                  'align': val.align
                });
            })

            _.forEach(this.testDetails.correctionGrid.correction.sections, function(val, key) {
                test['total'+key] = [0, Validators.required];
                test['comment'+key] = [null];
                testCorrect.correctionGrid.correction.sections.push({
                  title: val.title,
                  rating: 0,
                  comments: '',
                  subSections: []
                });
                _.forEach(val.subSections, function(v, k) {
                    test['subSection'+key+k] = [null, Validators.required];
                })
            })

            this.testCorrect.correctionGrid.correction.total = 0;
            if(this.testDetails.correctionGrid.correction.commentArea){
              _.forEach(this.testDetails.correctionGrid.correction.sections, function(val, key) {
                _.forEach(val.subSections, function(v, k) {
                    test['comment'+key+k] = [null];
                    testCorrect.correctionGrid.correction.sections[key].subSections.push({
                      title: val.title,
                      rating: '',
                      comments: '',
                    })
                })
              })
            }

            this.form = this.fb.group(test);

          });
        }

    }

  sortPage(sortInfo): void {
    this.sort.sortby = sortInfo.column.prop;
    this.sort.sortmode = sortInfo.newValue;
    this.page.pageNumber = 0;
  }

  blurEvent(event,value,i,formValue,rowIndex){
    var re = /^[0-9]+$/;
    let total = 0;
    this.testCorrect.correctionGrid.correction.total = 0;
    this.testCorrect.correctionGrid.correction.additionalTotal = 0;
    if(!re.test(event.target.value)){
        event.target.value = 0;
        this.listServiceFeature[i+'_'+rowIndex] = 0;
    } if(event.target.value > value){
        event.target.value = 0;
        this.listServiceFeature[i+'_'+rowIndex] = 0;
    }
    this.testCorrect.correctionGrid.correction.sections[i].subSections[rowIndex].rating = event.target.value;

    this.total(event,value,re,i,formValue,total,rowIndex);

  }

  total(event,value,re,i,formValue,total,rowIndex){
    for(let key in this.listServiceFeature){
      let res = key.split("_")
      if(res[0] == i){
        //console.log(this.listServiceFeature[key])
        if(this.listServiceFeature[key]){
          if(!re.test(event.target.value)){

          }else if(event.target.value > value){

          }else{
            //console.log(this.listServiceFeature[key]);
            total = Number(total)+Number(this.listServiceFeature[key]);
          }
        }
      }
    }
    let obj = {}
    for(let key in formValue){
      if(key == 'total'+i){
        formValue[key] = total;
        obj[key]=total;
        //console.log(obj);
        this.form.patchValue(obj)
      }
      if(key.substring(0,5) == 'total'){
        this.testCorrect.correctionGrid.correction.total = Number(this.testCorrect.correctionGrid.correction.total)+Number(formValue[key]);
      }
    }

    this.testCorrect.correctionGrid.correction.additionalTotal = (this.testDetails.correctionGrid.correction.totalZone.additionalMaxScore * this.testCorrect.correctionGrid.correction.total) / this.testDetails.maxScore;
    //console.log(this.testCorrect.correctionGrid.correction.additionalTotal);
    this.testCorrect.correctionGrid.correction.additionalTotal = this.testCorrect.correctionGrid.correction.additionalTotal.toFixed(this.testDetails.correctionGrid.correction.totalZone.decimalPlaces);
    //console.log(this.testCorrect.correctionGrid.correction.additionalTotal);
  }

  submit(form){
      //console.log(this.testCorrect);
      this.testCorrectionService.addCorrection('/'+this.testCorrect.test+'/correction',this.testCorrect).subscribe((value) => {
        //console.log(value)
        this.routes.navigate(['/test-correction']);
      },(error) => {
        //console.log(error);
      });

  }

}
