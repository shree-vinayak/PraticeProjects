import { Component, OnInit, OnDestroy } from '@angular/core';
import { CustomerService } from 'app/components/customer/customer.service';
import { MdDialogRef } from '@angular/material';
import { UserService } from 'app/services/users.service';
import { UtilityService } from '../../../../services';
import { TranslateService } from 'ng2-translate';
import { Subscription } from 'rxjs';
import { UserFilter } from 'app/models/userfilter.model';
import _ from 'lodash';
declare var swal: any;

@Component({
  selector: 'app-transfer-responsibility-dialog',
  templateUrl: './transfer-responsibility-dialog.component.html',
  styleUrls: ['./transfer-responsibility-dialog.component.scss']
})
export class TransferResponsibilityDialogComponent implements OnInit, OnDestroy {

  schoolLists = [];
  selectedSchool = [];

  titleLists = [];
  selectedRNCP = [];

  initialUserTypes = [];
  userTypesLists = [];
  selectedUserType = [];

  userList = [];
  leftUserList = [];
  rigthUserList = [];
  selectedLeftUser = [];
  selectedRightUser = [];

  userFilterObject: UserFilter = new UserFilter();

  private _subscription: Subscription = new Subscription();

  constructor(
    private custService: CustomerService,
    private dialogRef: MdDialogRef<TransferResponsibilityDialogComponent>,
    private userService: UserService,
    private utilityService: UtilityService,
    public translate: TranslateService
  ) { }

  ngOnInit() {
    this.getAllSchools();
    this.getAcademicDirectorAndCRAdmin();
    this._subscription = this.translate.onLangChange.subscribe((params) => {
      if (this.initialUserTypes.length > 0) {
        this.userTypesLists = [];
        this.initialUserTypes.forEach((item) => {
          const type = this.utilityService.getTranslateADMTCSTAFFKEY(item.text);
          this.userTypesLists.push({ id: item.id, text: type });
        });
        this.userTypesLists = [...this.userTypesLists.sort(this.keysrt('text'))];
      }
    });
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  selectSchool(event) {
    this.titleLists = [];
    if (event.id) {
      this.selectedRNCP = [];
      this.selectedLeftUser = [];
      event.id.rncpTitles.forEach(item => {
        this.titleLists.push({ id: item._id, text: item.shortName });
      });

      this.titleLists = [...this.titleLists.sort(this.keysrt('text'))];

      this.getUserBasedOnSelectedSchool(event);
    }
  }

  schoolRemoved(event) {
    this.selectedRNCP = [];
  }

  selectUserType(event) {
    if (event.id) {
      this.leftUserList = [];
      this.selectedLeftUser = [];
      this.selectedUserType = [];
      this.selectedUserType.push(event);
      if (this.selectedRNCP.length > 0) {
        this.filterUserBasedOnRNCPAndUserType();
      }
    }
  }

  leftUserSelected(event) {
    if (event.id) {
      this.selectedLeftUser = [];
      this.selectedLeftUser.push(event);
      this.selectedRightUser = [];
      this.rigthUserList = [];
      this.userList.forEach(user => {
        if (event.id !== user.id._id && user.id.entity.type !== 'company'
          && this.checkIfIsCertifierType(user.id)) {
          this.rigthUserList.push({ 'id': user.id._id, 'text': user.text });
        }
      });

      this.rigthUserList = [...this.rigthUserList];
      console.log(this.rigthUserList);
    }
  }

  checkIfIsCertifierType(currentUser) {
    if (currentUser.types.length && currentUser.operationRoleType &&
      currentUser.operationRoleType.toLowerCase() === 'certifier') {
      const userIndex = _.findIndex(currentUser.types, function (type) {
        return type.name.toLowerCase() === 'admin';
      });
      if (userIndex > -1) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }


  rightUserSelected(event) {
    if (event.id) {
      this.selectedRightUser = [];
      this.selectedRightUser.push(event);
    }
  }

  getAllSchools() {
    this.custService.getSchoolsBasedOnLoggedInUserType().subscribe(schools => {
      const data = schools.data;
      this.schoolLists = [];
      if (data) {
        data.forEach(rep => {
          this.schoolLists.push({
            id: rep,
            text: rep.shortName
          });
        });
      }
      this.schoolLists = this.schoolLists.sort(this.keysrt('text'));
    });
  }

  selectRNCP(event) {
    if (event.id) {
      this.selectedRNCP = [];
      this.leftUserList = [];
      this.selectedLeftUser = [];
      this.selectedRNCP.push(event);
      console.log(this.selectedRNCP);
      if (this.selectedUserType.length > 0) {
        this.filterUserBasedOnRNCPAndUserType();
      }
    }
  }

  getAcademicDirectorAndCRAdmin() {
    let acad = [];
    this.userService.getUserTypesByEntities('academic').subscribe(academic => {
      acad = academic.data.filter(element =>
        element.name.toLowerCase() === 'academic-director' && element.isSystemType === true
      );

      this.userService.getUserTypesByEntities('certifier').subscribe(certifier => {
        const certifierAdmin = certifier.data.filter(element =>
          element.name.toLowerCase() === 'admin' && element.isSystemType === true
        );

        if (certifierAdmin.length > 0) {
          acad.push(certifierAdmin[0]);
        }

        this.userTypesLists = [];
        if (acad.length > 0) {
          this.initialUserTypes = [];
          acad.forEach(rep => {
            this.initialUserTypes.push({
              id: rep._id,
              text: rep.name
            });
          });
          this.initialUserTypes.forEach((item) => {
            const type = this.utilityService.getTranslateADMTCSTAFFKEY(item.text);
            this.userTypesLists.push({ id: item.id, text: type });
          });
          this.userTypesLists = [...this.userTypesLists.sort(this.keysrt('text'))];
        }
      });
    });
  }

  getUserBasedOnSelectedSchool(schoolId) {
    this.userList = [];
    this.leftUserList = [];
    this.userFilterObject.schoolId = schoolId.id._id;
    // this.userFilterObject.rncpTitle = this.selectedRNCP[0].id;
    // this.userFilterObject.userType = userType;
    this.userService
      .userByFilter(this.userFilterObject, 0, 0)
      .subscribe(response => {
        console.log(response);
        for (const user of response.data) {
          this.userList.push({
            id: user,
            text: this.utilityService.computeCivility(user.sex, this.translate.currentLang) + ' ' + user.lastName + ' ' + user.firstName
          });
        }

        this.userList = [...this.userList.sort(this.keysrt('text'))];
      });
  }

  filterUserBasedOnRNCPAndUserType() {
    this.leftUserList = [];
    console.log(this.userList);
    for (const user of this.userList) {
      if (user && this.checkUserBasedOnSelectedUserType(user.id.types)) {
        const rncpTitles = user.id.assignedRncpTitles;
        rncpTitles.forEach(rncp => {
          if (rncp._id === this.selectedRNCP[0].id) {
            this.leftUserList.push({ 'id': user.id._id, 'text': user.text });
          }
        });
      }
    }

    this.leftUserList = [...this.leftUserList];
    console.log(this.leftUserList);
  }

  keysrt(key) {
    return function (a, b) {
      if (a[key] > b[key]) {
        return 1;
      } else if (a[key] < b[key]) {
        return -1;
      }
      return 0;
    };
  }

  closeDialog() {
    this.dialogRef.close();
  }

  transferResponsibility() {
    const self = this;
    swal({
      title: this.translate.instant('TRANSFER_RESPONSIBILITY.TRANS_S1.Title'),
      html: this.translate.instant('TRANSFER_RESPONSIBILITY.TRANS_S1.Text', {
        userType: this.selectedUserType[0].text,
        leftUser: this.selectedLeftUser[0].text,
        rightUser: this.selectedRightUser[0].text
      }),
      type: 'warning',
      allowEscapeKey: true,
      showCancelButton: true,
      cancelButtonText: this.translate.instant('CrossCorrection.CROSS_S1.Cancle'),
      confirmButtonText: this.translate.instant('TRANSFER_RESPONSIBILITY.TRANS_S1.YES_TRANSFER')
    }).then(function () {
      const body = {
        'from': this.selectedLeftUser[0].id,
        'to': this.selectedRightUser[0].id,
        'userType': this.selectedUserType[0].id,
        'rncp': this.selectedRNCP[0].id,
        'lang': this.translate.currentLang
      };
      this.userService.changeUserResponsibility(body).subscribe(res => {
        console.log(res.data);
        if (res.code === 200) {
          self.closeDialog();
          swal({
            title: this.translate.instant('Bravo !'),
            html: this.translate.instant('TRANSFER_RESPONSIBILITY.TRANS_S1B.Text', {
              rightUser: this.selectedRightUser[0].text,
              userType: this.selectedUserType[0].text,
              schoolShortName: this.selectedSchool[0].text,
              rncpShortName: this.selectedRNCP[0].text
            }),
            type: 'success',
            allowEscapeKey: true,
            confirmButtonText: this.translate.instant('TRANSFER_RESPONSIBILITY.TRANS_S1B.OK'),
          });
        } else if (res.code === 451) {
          const existedUser = res.user ? this.utilityService.computeCivility(res.user.sex, this.translate.currentLang) + ' ' + res.user.lastName + ' ' + res.user.firstName : '';
          swal({
            title: this.translate.instant('TRANSFER_RESPONSIBILITY.TRANS_S2.Title'),
            html: this.translate.instant('TRANSFER_RESPONSIBILITY.TRANS_S2.Text', {
              existedUser: existedUser,
              userType: this.selectedUserType[0].text,
              rncpShortName: this.selectedRNCP[0].text
            }),
            type: 'warning',
            allowEscapeKey: true,
            confirmButtonText: this.translate.instant('TRANSFER_RESPONSIBILITY.TRANS_S1B.OK'),
          }).then(function () {
            self.closeDialog();
          }.bind(this));
        } else if (res.code === 400 && res.message === 'BACKEND.TRANSFER_RESPONSIBILITY.TRANSFER.CANNOT_TRANSFER') {
          swal({
            title: this.translate.instant('TRANSFER_RESPONSIBILITY.TRANS_S3.Title'),
            html: this.translate.instant('TRANSFER_RESPONSIBILITY.TRANS_S3.Text'),
            type: 'warning',
            allowEscapeKey: true,
            confirmButtonText: this.translate.instant('FINAL_TRANSCRIPT.UNDERSTOOD')
          });
        }

      });
    }.bind(this));
  }

  checkUserBasedOnSelectedUserType(userTypes) {
    let self = this;
    const currentUser = userTypes;
    const userIndex = _.findIndex(userTypes, function (u) {
      return (u._id === self.selectedUserType[0].id);
    });
    if (userIndex > -1) {
      return true;
    } else {
      return false;
    }
  }
}
