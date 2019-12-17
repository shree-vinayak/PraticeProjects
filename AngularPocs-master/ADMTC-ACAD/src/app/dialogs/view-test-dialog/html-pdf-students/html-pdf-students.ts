import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TestCorrectionService, LoginService, RNCPTitlesService } from 'app/services';
import { CustomerService } from 'app/components/customer/customer.service';
declare var _: any;

@Component({
  selector: 'app-html-pdf-students',
  templateUrl: './html-pdf-students.html'
})
export class HtmlPdfStudentsComponent implements OnInit {

  studentList = [];
  @Input() test?: any;
  @Input() pageSectionsArray?: any;
  @Input() visiblePage?: any;
  rncpTitle;
  user;
  scholarSeason = '';
  constructor(
    private loginService: LoginService,
    private testCorrectionService: TestCorrectionService,
    public customerService: CustomerService,
    private appService: RNCPTitlesService,
  ) {

  }

  ngOnInit() {
    this.user = this.loginService.getLoggedInUser();
    let self = this;
    this.appService.getSelectedRncpTitle().subscribe((title) => {
      if(title){
        self.rncpTitle = title;

        self.appService.getSelectedScholarSeason(self.rncpTitle._id).subscribe((season) => {
          if (season.length !== 0) {
            self.scholarSeason = season[0].scholarseason;
          }
        });

      }
    });

    if(self.user.entity.type === 'group-of-schools'){
      self.testCorrectionService.getStudentForTestCorrection(self.test._id, this.customerService.getSelectedSchoolId().schoolId).subscribe((data) => {
        if (data) {
          self.studentList = _.orderBy(data, ['lastName'], ['asc']);
        }
      });
    }else if(self.user && self.user.entity && self.user.entity.school && self.user.entity.school._id){

      self.testCorrectionService.getStudentForTestCorrection(self.test._id, self.user.entity.school._id).subscribe((data) => {
        if (data) {
          self.studentList = _.orderBy(data, ['lastName'], ['asc']);
        }
      });

    }

  }

  getArrayExceptFirst() {
    return this.pageSectionsArray.slice(1);
  }

  getTitleWidth() {
    let correction = this.test.correctionGrid.correction;
    if (correction.commentArea) {
      if (correction.showDirectionsColumn) {
        if (correction.showLetterMarksColumn && correction.showNumberMarksColumn) {
          return '30%';
        } else {
          return '35%';
        }
      } else {
        return '35%';
      }
    } else {
      if (correction.showDirectionsColumn) {
        if (correction.showLetterMarksColumn && correction.showNumberMarksColumn) {
          return '35%';
        } else {
          return '40%';
        }
      } else {
        return '70%';
      }
    }
  }

  getDirectionWidth() {
    let correction = this.test.correctionGrid.correction;
    if (correction.commentArea) {
      return '30%';
    } else {
      return '40%';
    }
  }

  getMaxScore() {
    let a = 0;
    let penalty = 0;
    let bonus = 0;
    if (this.test.type === 'free-continuous-control') {
      a = 20;
    } else {
        this.test.correctionGrid.correction.sections.forEach((section, index) => {
          a += section.maximumRating;
        });

    }
    // if (a > 100) {
    //   a = 100;
    // }
    return a;
  }

  getMaxCustomScore() {
    return this.test.correctionGrid.correction.totalZone.additionalMaxScore;
  }

}
