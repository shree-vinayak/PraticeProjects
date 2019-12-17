import { Injectable } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import { LoginService } from './login.service';
import _ from 'lodash';
import { FormControl, ValidatorFn } from '@angular/forms';

@Injectable()
export class UtilityService {
  constructor(private translate: TranslateService, private _login: LoginService, ) {

  }

  computeCivility(gender: string, language: string) {
    let civility = "";

    if (!language) {
      language = "fr";
    }

    if (language.toLowerCase() == "en") {
      if (gender) {
        if (gender.toLowerCase().startsWith('m')) {
          civility = "Mr";
        } else if (gender.toLowerCase().startsWith('f')) {
          civility = "Mrs";
        }
      } else {
        civility = "Mr";
      }
    } else if (language.toLowerCase() == "fr") {
      if (gender) {
        if (gender.toLowerCase().startsWith('m')) {
          civility = "M.";
        } else if (gender.toLowerCase().startsWith('f')) {
          civility = "Mme";
        }
      } else {
        civility = "M.";
      }
    }
    return civility;
  };

  computeSalutation(gender: string, language: string) {
    if (!language) {
      language = "fr";
    }
    let salutation = "";
    if (language.toLowerCase() == "en") {
      salutation = "Dear";
    } else if (language.toLowerCase() == "fr") {
      if (gender) {
        if (gender.toLowerCase().startsWith('m')) {
          salutation = "Cher";
        } else if (gender.toLowerCase().startsWith('f')) {
          salutation = "Chère";
        }
      } else {
        salutation = "Cher";
      }
    }
    return salutation;
  };

  //developed by sulay
  calculateGroups(total, min, max) {
    //total = total no of students.
    //min = minimum no of students in one group.
    //max = maximum no of students in one group.
    //returns integer: no of groups.
    var groups = [];
    var singlegroup = {
      students: []
    };
    var groupNo = 0;
    var remainingStudents = total;
    for (var i = 0; i < total; i++) {
      if (singlegroup.students.length < max && remainingStudents > min) {
        singlegroup.students.push(i);
        remainingStudents--;
      } else {
        if (remainingStudents >= max || (remainingStudents >= min && (min != 1 && remainingStudents == min)) || (min == 1 && remainingStudents > min)) {
          groups.push(singlegroup);
          groupNo++;
          singlegroup = {
            students: []
          };
        }
        singlegroup.students.push(i);
        remainingStudents--;
      }
    }
    groups.push(singlegroup);
    return groups;
  }

  convertIntegerToCharacter(i) {
    return ((i >= 26 ? this.convertIntegerToCharacter((i / 26 >> 0) - 1) : '') + 'abcdefghijklmnopqrstuvwxyz'[i % 26 >> 0]).toUpperCase();
  }

  getTranslateADMTCSTAFFKEY(name) {
    let value = this.translate.instant('ADMTCSTAFFKEY.' + name.toUpperCase());
    return value != 'ADMTCSTAFFKEY.' + name.toUpperCase() ? value : name;
  }

  getTranslateENTITY(name) {
    if (name) {
      let value = this.translate.instant('SETTINGS.USERTYPES.ENTITYNAME.' + name.toUpperCase());
      return value != 'SETTINGS.USERTYPES.ENTITYNAME.' + name.toUpperCase() ? value : name;
    }
  }

  checkUserIsDirectorSalesAdmin() {
    const currentUser = this._login.getLoggedInUser();
    if (currentUser.types.length && currentUser.entity.type.toUpperCase() === 'ADMTC') {
      for (let i = 0; i < currentUser.types.length; i++) {
        const typeOfUser = currentUser.types[i].name.toLowerCase();
        if (typeOfUser === 'sales' ||
          typeOfUser === 'admin' ||
          typeOfUser === 'director') {
          return true;
        }
      }
    }
    return false;
  }

  checkUserIsStudent() {
    const currentUser = this._login.getLoggedInUser();
    if (currentUser.types.length && currentUser.entity.type.toUpperCase() === 'ACADEMIC') {
      for (let i = 0; i < currentUser.types.length; i++) {
        const typeOfUser = currentUser.types[i].name.toLowerCase();
        if (typeOfUser === 'student') {
          return true;
        }
      }
    }
    return false;
  }

  checkUserIsAcademicDirector() {
    const currentUser = this._login.getLoggedInUser();
    if (currentUser.types.length && currentUser.entity &&
        currentUser.entity.type.toUpperCase() === 'ACADEMIC') {
      const userIndex = _.findIndex(currentUser.types, function (u) {
        return u.name.toLowerCase() === 'academic-director';
      });
      if (userIndex > -1) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  checkUserIsAcademicAdminDirector() {
    const currentUser = this._login.getLoggedInUser();
    if (currentUser.types.length && currentUser.entity.type.toUpperCase() === 'ACADEMIC') {
      const userIndex = _.findIndex(currentUser.types, function (u) {
        return u.name.toLowerCase() === 'academic-director' || u.name.toLowerCase() === 'academic-admin';
      });
      if (userIndex > -1) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }


  checkUserIsFromGroupOfSchools() {
    const currentUser = this._login.getLoggedInUser();
    if (currentUser.entity.type === 'group-of-schools') {
      return true;
    } else {
      return false;
    }
  }

  checkUserIsAdminOfCertifier() {
    const currentUser = this._login.getLoggedInUser();
    if (currentUser.entity.type === 'academic' && currentUser.operationRoleType === 'certifier') {
      const userIndex = _.findIndex(currentUser.types, function (u) {
        return u.name.toLowerCase() === 'admin';
      });
      if (userIndex > -1) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  checkUserIsDirectorOfCertifier() {
    const currentUser = this._login.getLoggedInUser();
    if (currentUser.entity.type === 'academic' && currentUser.operationRoleType === 'certifier') {
      const userIndex = _.findIndex(currentUser.types, function (u) {
        return u.name.toLowerCase() === 'director';
      });
      if (userIndex > -1) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  checkUserIsAdminOrDirectorOfCertifier() {
    const currentUser = this._login.getLoggedInUser();
    if (currentUser.entity && currentUser.entity.type === 'academic' && currentUser.operationRoleType === 'certifier') {
      const userIndex = _.findIndex(currentUser.types, function (u) {
        return u.name.toLowerCase() === 'admin' || u.name.toLowerCase() === 'director';
      });
      if (userIndex > -1) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  checkUserIsCorrector() {
    const currentUser = this._login.getLoggedInUser();
    if (currentUser.entity.type === 'academic') {
      const userIndex = _.findIndex(currentUser.types, function (u) {
        return u.name.toLowerCase() === 'corrector';
      });
      if (userIndex > -1) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  checkUserIsQualityControlCorrector() {
    const currentUser = this._login.getLoggedInUser();
      const userIndex = _.findIndex(currentUser.types, function (u) {
        return (u.name.toLowerCase() === 'corrector-quality') ;
      });
      if (userIndex > -1) {
        return true;
      } else {
        return false;
      }
  }

  checkIsQualityControlCorrector() {
    const currentUser = this._login.getLoggedInUser();
    if (currentUser.entity.type === 'academic') {
      const userIndex = _.findIndex(currentUser.types, function (u) {
        return ( u.name.toLowerCase() === 'corrector-quality');
      });
      if (userIndex > -1) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  checkUserIsCrossCorrector() {
    const currentUser = this._login.getLoggedInUser();
    if (currentUser.entity.type === 'academic') {
      const userIndex = _.findIndex(currentUser.types, function (u) {
        return u.name.toLowerCase() === 'cross-corrector';
      });
      if (userIndex > -1) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  checkUserIsCertifierCorrector() {
    const currentUser = this._login.getLoggedInUser();
    if (currentUser.entity.type === 'academic' && currentUser.operationRoleType === 'certifier') {
      const userIndex = _.findIndex(currentUser.types, function (u) {
        return u.name.toLowerCase() === 'corrector-certifier';
      });
      if (userIndex > -1) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  checkUserIsMentor() {
    const currentUser = this._login.getLoggedInUser();
    if ( currentUser && currentUser.entity.type === 'company') {
      const userIndex = _.findIndex(currentUser.types, function (u) {
        return u.name.toLowerCase() === 'mentor';
      });
      if (userIndex > -1) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }



  noWhitespaceValidator(control: FormControl) {
    let isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true }
  }

  minMaxValidation(min: number, max: number): ValidatorFn {
    return (control: FormControl): { [key: string]: boolean } | null => {

      let val: number = control.value;

      if (control.pristine || control.pristine) {
        return null;
      }
      if (val >= min && val <= max) {
        return null;
      }
      return { 'max': true };
    }
  }

  convertToCapitalCase(text) {
    if (text) {
      return _.capitalize(text);
    }
    return '';
  }

  convertToFrenchTitleCase(text: string) {
    let textList = text.trim().split('-');
    textList = [...textList.map((txt) => {
        txt.trim();
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    })];
    return textList.join('-');
  }

  convertNameCasing(text, isFirstName = true) {
    if (isFirstName) {
      return this.convertToFrenchTitleCase(text);
    } else {
      return text.toUpperCase();
    }
  }

 // Will return if this user is corrector of problematic without admin of certifier
  isJustProbCorrector(): boolean {
    const currentUser = this._login.getLoggedInUser();
    let isProblematicCorrector =  false;
    if (currentUser.operationRoleType === 'certifier') {
      for (const type of currentUser.types) {
        if (type.name === 'Admin') {
          isProblematicCorrector = false;
          break;
        } else if (type.name === 'Corrector-of-Problematic') {
          isProblematicCorrector = true;
        }
      }
    }
    return isProblematicCorrector;
  }
}
