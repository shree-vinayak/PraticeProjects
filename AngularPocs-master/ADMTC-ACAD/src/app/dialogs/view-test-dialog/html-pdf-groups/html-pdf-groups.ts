import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoginService, TestService } from 'app/services';
import { CustomerService } from 'app/components/customer/customer.service';
declare var _: any;

@Component({
  selector: 'app-html-pdf-groups',
  templateUrl: './html-pdf-groups.html'
})
export class HtmlPdfGroupsComponent implements OnInit {

  groups = [];
  @Input() test?: any;
  @Input() pageSectionsArray?: any;
  @Input() visiblePage?: any;
  user;
  constructor(
    private loginService: LoginService,
    private testService: TestService,
    public customerService: CustomerService,
  ) {

  }

  ngOnInit() {

    this.user = this.loginService.getLoggedInUser();
    let self = this;

    if(self.user.entity.type === 'group-of-schools'){
      this.testService.getTestGroupFromTest(this.test._id, this.customerService.getSelectedSchoolId().schoolId).subscribe((data) => {
        if (data) {
          this.groups = data;
        }
      });
    }else if(self.user && self.user.entity && self.user.entity.school && self.user.entity.school._id){
      this.testService.getTestGroupFromTest(this.test._id, self.user.entity.school._id).subscribe((data) => {
        if (data) {
          this.groups = data;
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

