import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { TranslateService } from 'ng2-translate';
import { MdDialogRef } from '@angular/material';
import { RNCPTitlesService } from '../../../services/rncp-titles.service';
declare var swal: any;
import _ from 'lodash';
import { CustomerService } from '../../customer/customer.service';
import { TutorialsService } from '../tutorials.service';
import { UtilityService } from '../../../services/utility.service';
import { LoginService } from '../../../services/login.service';


// required for logging
import { Log } from 'ng2-logger';
const log = Log.create('SendTutorialDialogComponent');
log.color = 'green';


@Component({
  selector: 'app-send-tutorial-dialog',
  templateUrl: './send-tutorial-dialog.component.html',
  styleUrls: ['./send-tutorial-dialog.component.scss']
})
export class SendTutorialDialogComponent implements OnInit {

  form: FormGroup;
  selectedUsertype: any = [];
  allUserTypes: any = [];
  userTypes: any = [];
  userList: any = [];
  selectedTutorial:any = null;
  rncpList: any = [];
  schoolList: any = [];
  debounceUserSearch = _.debounce(this.getUserCondition, 1500);
  debounceSchoolSearch = _.debounce(this.getAllSchools, 500);
  isAcadDir = false;
  disableRncp = false;

  constructor(
    private custService: CustomerService,
    private _formBuilder: FormBuilder,
    private rncpService: RNCPTitlesService,
    public dialogRef: MdDialogRef<SendTutorialDialogComponent>,
    private translate: TranslateService,
    private tutorialsService: TutorialsService,
    public loginService: LoginService,
    private utilityService: UtilityService) { }

  ngOnInit() {
    this.isAcadDir = this.utilityService.checkUserIsAcademicDirector();
    this.initializeForm();
    this.getRNCPlist();

    if (this.selectedTutorial) {
      this.getUserTypesNTranslate();
    }

    this.form.get('rncpId').valueChanges.subscribe((value) => {
        this.schoolList = [];
        this.getAllSchools();
    });
  }

  initializeForm() {
    this.form = this._formBuilder.group({
      rncpId: [[]],
      schoolId: [[]],
      recipientType: [true],
      userTypeId: [[], Validators.required],
      userId: [[]],
      subject: [this.selectedTutorial ? this.removeHTMLTags(this.getTutotialTitleTranslated(this.selectedTutorial.title))
            : null, Validators.required],
      message: [this.selectedTutorial && this.selectedTutorial.message ? this.selectedTutorial.message :
        this.translate.instant('TUTORIAL_MENU.MESSAGE_TEMPLATE')]
    });
  }

  removeHTMLTags(text: string): string {
    return text.replace(/<\/?[^>]+(>|$)/g, '');
  }

  getTutotialTitleTranslated(title) {
    if (title) {
      const value = this.translate.instant('TUTORIALS_List.' + title.toUpperCase());
      return value !== 'TUTORIALS_List.' + title.toUpperCase() ? value : title;
    }
  }

  toggleRecipientSelection() {
    if (this.form.value.recipientType) {
      this.form.get('userTypeId').enable();
      this.form.get('userTypeId').setValidators([Validators.required]);
      this.form.get('userId').clearValidators();
      this.form.get('userId').setValue([]);
      this.form.get('userId').disable();
    } else {
      this.form.get('userId').enable();
      this.form.get('userId').setValidators([Validators.required]);
      this.form.get('userId').setValue([]);
      this.form.get('userTypeId').clearValidators();
      this.form.get('userTypeId').setValue([]);
      this.form.get('userTypeId').disable();
      this.getListOfUsers();
    }
  }

  getUserCondition() {
    if (!this.form.value.recipientType) {
      this.getListOfUsers();
    }
  }

  getListOfUsers() {
    const payload = {
      userTypeId: this.mapToIds(this.userTypes) ,
      rncpId: this.mapToIds(this.form.get('rncpId').value),
      schoolId: this.mapToIds(this.form.get('schoolId').value),
    };
    this.tutorialsService.usersForSendTutorial(payload).subscribe(
      (response) => {
        if (response.data) {
        this.userList = [..._.orderBy(response.data, ['lastName'], ['asc'])];
        this.userList = [...this.userList.map((user) => { return {
          id: user,
          text: `${this.utilityService.computeCivility(user.sex, this.translate.currentLang)
                    } ${user.firstName} ${user.lastName}`
        }; })];
      }  else {
        this.userList = [];
      }

      }
    )
  }

  mapToIds(array) {
    if (array && array.length) {
      return array.map( item => {
        if (item.id && item.id._id) {
          return item.id._id;
        } else {
          return item.id;
        }
      });
    }
    return [];
  }

  getUserTypesNTranslate() {
    let userTypes = this.selectedTutorial.userType;
    if ( this.utilityService.checkUserIsAcademicDirector() ) {
      userTypes = [...userTypes.filter(type => type.entity && type.entity.toLowerCase() === 'academic')];
    }
    this.userTypes = userTypes.map(item => {
        const typeEntity =
          this.getTranslateADMTCSTAFFKEY(item.name) +
          ' / ' +
          this.getTranslateENTITY(item.entity);
        return { id: item, text: typeEntity };
      });
    this.userTypes = [..._.orderBy(this.userTypes, ['text'], ['asc'])];
  }

  getTranslateADMTCSTAFFKEY(name) {
    const value = this.translate.instant('ADMTCSTAFFKEY.' + name.toUpperCase());
    return value !== 'ADMTCSTAFFKEY.' + name.toUpperCase() ? value : name;
  }

  getTranslateENTITY(name) {
    const value = this.translate.instant('SETTINGS.USERTYPES.ENTITYNAME.' + name.toUpperCase());
    return value !== 'SETTINGS.USERTYPES.ENTITYNAME.' + name.toUpperCase() ? value : name;
  }

  closeDialog(state: any = false) {
    this.dialogRef.close(state);
  }

  getUserTypes() {

  }

  getRNCPlist() {
    this.rncpService.getAllRNCPTitlesShortName().subscribe( res => {
      this.rncpList = res.data.map((rncp) => { return { id: rncp, text: rncp.shortName}; });
      this.rncpList = [..._.orderBy(this.rncpList, ['text'], ['asc'])];
      if (this.isAcadDir) {
        this.setAcadDirConditions();
      } else {
        this.getAllSchools();
      }
    });
  }

  getAllSchools() {
    const payload = {
      rncpIds: this.mapToIds(this.form.get('rncpId').value)
    };

    this.custService.getSchoolBasedOnRNCP(payload).subscribe(schools => {
      const snitSchool = schools.data.filter( school => school && school._id);
      this.schoolList = snitSchool.map((school) => { return { id: school, text: school.shortName }});
      this.schoolList = [..._.orderBy(this.schoolList, ['text'], ['asc'])];
      this.schoolList = [..._.uniqBy(this.schoolList, 'id._id')];
    });
  }

  setAcadDirConditions() {
    const acadUser = this.loginService.getLoggedInUser();
    log.data('setAcadDirConditions acadUser', acadUser);

    if (acadUser.entity && acadUser.entity.school._id) {
      const schoolArray = [{
        id: acadUser.entity.school,
        text: acadUser.entity.school.shortName
      }];
      this.schoolList = schoolArray;
      this.form.get('schoolId').setValue(schoolArray);
    }

    if (acadUser.assignedRncpTitles && acadUser.assignedRncpTitles.length) {
      const rncpArray = [..._.intersectionWith(this.rncpList, acadUser.assignedRncpTitles, (rncp, asngRncp) => {
        return (rncp.id && rncp.id._id === asngRncp);
      })];
      this.rncpList = rncpArray;
      if (rncpArray.length === 1) {
        this.form.get('rncpId').setValue(rncpArray);
        this.disableRncp = true;
      } else {
        this.disableRncp = false;
      }
    }
  }

  confirmSend () {
    const formvalue = this.form.value;
    let userType = '';

    if (formvalue.recipientType && formvalue.userTypeId) {
      formvalue.userTypeId.forEach(type => {
        userType += `${this.getTranslateADMTCSTAFFKEY(type.id.name)} `;
      });
    } else if (formvalue.userId) {
      formvalue.userId.forEach(user => {
        userType += `${user.text} `;
      });
    }

    let titleLongName = '';
    if ( formvalue.rncpId && formvalue.rncpId.length ) {
      formvalue.rncpId.forEach(rncp => {
        titleLongName += `${rncp.id.longName} `;
      });
    }

    swal({
      title: this.translate.instant('TUTORIAL_MENU.TUTO_S3.TITLE', {
        tutorialName: this.getTutotialTitleTranslated(this.selectedTutorial.title)
      }),
      html: this.translate.instant('TUTORIAL_MENU.TUTO_S3.TEXT', {
        tutorialName: this.getTutotialTitleTranslated(this.selectedTutorial.title),
        userType: userType,
        titleLongName: titleLongName
      }),
      type: 'question',
      allowEscapeKey: true,
      showCancelButton: true,
      cancelButtonText: this.translate.instant('CANCEL'),
      confirmButtonText: this.translate.instant('TUTORIAL_MENU.TUTO_S5.CONFIRM')
      }).then(
        () => {
          this.sendTutorial();
        }
      );
  }

  sendTutorial() {
    const formvalue = this.form.value;
    formvalue.userTypeId = this.mapToIds(formvalue.userTypeId);
    formvalue.rncpId = this.mapToIds(formvalue.rncpId);
    formvalue.schoolId = this.mapToIds(formvalue.schoolId);
    formvalue.userId = this.mapToIds(formvalue.userId);
    formvalue.tutorialId = this.selectedTutorial._id;
    formvalue.lang = this.translate.currentLang.toLowerCase();

    this.tutorialsService.sendTutorial(formvalue).subscribe(
      (response) => {
        if ( response.data) {
          this.sendSuccess();
          this.closeDialog(true);
        }
    })
  }

  sendSuccess() {
    swal({
      title: 'Bravo!',
      html: this.translate.instant('TUTORIAL_MENU.TUTO_S4.TEXT',),
      type: 'success',
      allowEscapeKey: true,
      confirmButtonText: 'OK'
    });
  }
}
