import { EventEmitter, Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { UserList } from '../models/userlist.model';
import { User } from '../models/user.model';
import { AcademicStaffUser } from '../models/user_academicstaff.model';
import { AcademicAdministratorUser } from '../models/user_academic_administrator.model';
import { CorrectorUser } from '../models/user_corrector.model';
import { Student } from '../models/student.model';
import { HRTutor } from '../models/user_hr_tutor.model';
import { Country } from '../models/country.model'
import { Company } from '../models/company.model'
import { UserTypesModel } from '../models/userTypes.model'
import { Subject } from 'rxjs/Subject';
import { Users, Entity } from '../shared/global-urls';
import { Sales, Login } from '../shared/global-urls';
import { UserTypes } from '../shared/global-urls';
import { RncpTitle, RncpTitlesSchool } from '../shared/global-urls';
import { Classes, GlobalRncpTitle, Base } from '../shared/global-urls';
import { ClassModel } from '../models/class.model';
import { LoginService } from '../services/login.service';
import { AppSettings } from '../app-settings';

import 'rxjs/add/operator/catch';

// required for logging
import { Log } from "ng2-logger";
const log = Log.create("UserService");
log.color = "purple";

@Injectable()
export class UserService {
  usersUrls: any = AppSettings.urls.users;
  userUrls: any = AppSettings.urls.user;
  academicUrls: any = AppSettings.urls.academic;
  private login = new Subject<any>();
  currentLoginUser: any = '';
  token: any = '';
  loginUser = 0;
  mentorLoginURL: string = '';
  academicStaffUser: AcademicStaffUser[] = [];
  academicAdministratorUser: AcademicAdministratorUser[] = [];
  correctorUser: CorrectorUser[] = [];
  student: Student[] = [];
  hrTutor: HRTutor[] = [];
  users: User[] = [];
  user: User;
  selectedUserTypeId: string;
  userTypes: any[] = [];
  mentorTypeId: string = '';
  userTypesLocally = [];

  // New things
  userlistModel: User[] = [];
  userModel: User;

  private headers = new Headers({
    'Content-Type': 'application/json'
  });

  constructor(private http: Http,
    private loginService: LoginService) {
    log.info('Constructor Invoked!');
    const tokenValue = this.loginService.getToken();
    if (tokenValue !== null && tokenValue !== '') {
      this.token = tokenValue;
    }
  }

  getRole() {
    const CurrentUser = this.loginService.getLoggedInUser();
    if (CurrentUser !== null && CurrentUser !== '' && CurrentUser.length > 0) {
      return CurrentUser;
    }
  }

  // start
  setIsLoginFlag(isLogin: boolean) {
    this.login.next({ boolean: isLogin });
  }

  setIsLogoutFlag() {
    this.login.next();
  }

  getLoginStatus(): Observable<any> {
    return this.login.asObservable();
  }
  // end

  getAllCertifier() {
    const certifiers: any[] = [
      { id: '1', Name: 'Certifier 1' },
      { id: '2', Name: 'Certifier 2' },
      { id: '3', Name: 'Certifier 3' },
      { id: '4', Name: 'Certifier 4' },
      { id: '5', Name: 'Certifier 5' }
    ];
    return Observable.of(certifiers).map((res) => {
      const response = certifiers;
      return response;
    });
  }

  getAllClass() {
    return this.http.get(Classes.classUrl + '?token=' + this.loginService.getToken())
      .map((response) => {
        return response.json();
      });
  }

  addClass(classobj: ClassModel) {
    return this.http.post(Classes.classUrl + '?token=' + this.loginService.getToken(), classobj)
      .map(res => res.json())
      .catch(this.handlerError);
  }

  addNewClass(classobj: ClassModel, rncp_title_id) {
    return this.http.post(GlobalRncpTitle.url + rncp_title_id + '/classes' + '?token=' + this.loginService.getToken(), classobj)
      .map(res => res.json())
      .catch(this.handlerError);
  }

  getAllRNCPTitles() {
    return this.http.get(RncpTitle.getUrl + '?token=' + this.loginService.getToken() + '&limit=1000')
      .map((response) => {
        return response.json();
      });
  }

  getAllRNCPTitlesShortName() {
    return this.http.get(RncpTitle.getUrlShortName + '?token=' + this.loginService.getToken() + '&limit=1000')
      .map((response) => {
        return response.json();
      });
  }

  getAllRNCPTitlesSchool(school_id) {
    return this.http.get(RncpTitlesSchool.getUrl + school_id + '/rncp-titles' + '?token=' + this.loginService.getToken())
      .map((response) => {
        return response.json();
      });
  }

  getAllClassesRNCPTitlesSchool(school_id, rncp_title_id) {
    return this.http.get(RncpTitlesSchool.getUrl + school_id + '/rncp-titles' + rncp_title_id + '/classes' + '?token=' + this.loginService.getToken())
      .map((response) => {
        return response.json();
      });
  }

  // getUserTypeIdByName(name) {
  //   return this.http.get(UserTypes.userTypesUrl + '?token=' + this.loginService.getToken()).map((respone) => {
  //     const data = respone.json();
  //     const v = data.data;
  //     return v.filter(a => {
  //       return (a.name === name);
  //     });
  //   });
  // }

  getAllUserTypes(role): any {
    return this.http.get(UserTypes.userTypesUrl + '?token=' + this.loginService.getToken()).map((respone) => {
      const data = respone.json();
      if (role !== null && role !== undefined) {
        const v = data.data.filter(a => {
          return (a.name === role);
        });
        this.userTypes = v;
        return v;
      } else {
        this.userTypes = data.data;
        return data.data;
      }
    });
  }

  getUserRoles() {
    const userRoles: any[] = [
      { id: '1', Name: 'ADTMC_Management' },
      { id: '2', Name: 'ADTMC_Admin' },
      { id: '3', Name: 'ADTMC_Sales' },
    ];

    return Observable.of(userRoles).map((res) => {
      const response = userRoles;
      return response;
    });
  }

  getAllUser() {
    return this.http.get(Users.commonUser + '?token=' + this.loginService.getToken()).map((respone) => {
      return respone.json();
    });
  }
  getUserBasedOnUserTypeId(userTypeId) {
    return this.http.get(Users.commonUser + '?userTypeId=' + userTypeId + '&token=' + this.loginService.getToken()).map((respone) => {
      return respone.json();
    });
  }
  getUserBasedOnUserType(userType) {
    return this.http.get(Users.commonUser + '/userEntityType/' + userType + '?token=' + this.loginService.getToken()).map((respone) => {
      return respone.json();
    });
  }

  getUserByTitle(id) {
    return this.http.get(Base.url + 'academic/rncpTitle/' + id + '/users?token=' + this.loginService.getToken()).map((respone) => {
      return respone.json();
    });
  }

  getUserByTitleAndEntity(id, entity) {
    return this.http.get(Base.url + 'academic/rncpTitle/' + id 
      + '/users?entity=' + entity + '&token=' + this.loginService.getToken()).map((respone) => {
      return respone.json();
    });
  }

  getUserByTitleAndType(body){
    return this.http.post(Base.url + 'academic/rncpTitle/userType' + '?token=' + this.loginService.getToken(), body).map((respone) => {
      return respone.json();
    });
  }

  getUserForInternalTask(){
    return this.http.get(this.academicUrls.getUserForInternalTask + '?token=' + this.loginService.getToken()).map((respone) => {
      return respone.json();
    });
  }

  getAllPreparationCenter() {
    return this.http.get(Sales.schoolUrl + '?limit=1000' + '&token=' + this.loginService.getToken()).map((respone) => {
      return respone.json();
    })
  }

  getAllUserList(pageNumber: number, noOfRecords: number, certifier: string, rncptitle: string,
    preparationcenter1: string, userType: string, searchText: string, sortBy: string, sortMode: string) {
    return this.http.get(Users.url + '?page=' + (pageNumber + 1) + '&limit=' + noOfRecords +
      '&sortby=' + sortBy + '&sortmode=' + sortMode + '&token=' + this.loginService.getToken())
      .map((response) => {
        const res = response.json();
        return {
          data: res.data,
          total: res.total
        };
      });
  }


  addUser(user: User) {
    return this.http.post(Users.url + '?token=' + this.loginService.getToken(), user)
      .map(res => res.json())
      .catch(this.handlerError);
  };


  handlerError(error: Response) {
    console.error(error);
    return Observable.throw(error);
  }

  deleteUser(id: string) {
    return this.http.delete(Users.url + '/' + id + '?token=' + this.loginService.getToken()).map(res => {
      console.log('Res');
      const response = res.json();
      console.log(response);
      if (response.status === 'OK') {
        return true;
      } else {
        return false;
      }
    });
  }

  // getLastUserId(): any {
  //      return Observable.of(this.users).map((response) => {
  //         if (response.length > 0) {
  //             const lastuser = response[response.length - 1];
  //             if (lastuser != null) {
  //                 return (parseInt(lastuser._id) + 1).toString();
  //             }
  //         }
  //         else {
  //             return '1';
  //         }
  //     });
  // }

  addAcademicStaffUser(user: AcademicStaffUser) {
    this.academicStaffUser.push(user);
  }

  addAcademicAdministratorUser(user: AcademicAdministratorUser) {
    this.academicAdministratorUser.push(user);
  }

  addStudentUser(user: Student) {
    this.student.push(user);
  }

  addCorrectorUser(user: CorrectorUser) {
    this.correctorUser.push(user);
  }

  addHrTutorUser(user: HRTutor) {
    this.hrTutor.push(user);
  }

  getUserById(id): any {
    return this.http.get(Users.url + '/' + id + '?token=' + this.loginService.getToken()).map((response) => {
      return response.json().data;
    });
  }

  checkSetPassword(token) {
    return this.http.get(Base.url + 'password/' + 'set/' + 'check/' + token)
      .map(res => res.json())
      .catch(this.handlerError);
  }

  editUser(user: User) {
    const url = Users.url + '/' + user._id;
    return this.http.put(url + '?token=' + this.loginService.getToken(), user).map(res => {
      const response = res.json();
      if (response.status === 'OK') {
        return response.data;
      } else {
        return null;
      }
    });
  }

  getLastRegisteredUserId(): any {
    return Observable.of(this.userlistModel).map((response) => {
      if (response.length > 0) {
        const lastuser = response[response.length - 1];
        if (lastuser != null) {
          return (parseInt(lastuser._id) + 1).toString();
        }
      } else {
        return '1';
      }
    });
  }

  getUserTypesByEntities(userType) {
    return this.http.get(Entity.getUserTypeUrl + '?entity=' + userType + '&token=' + this.loginService.getToken()).map((response) => {
      const res = response.json();
      return res;
    });
  }

  getUserTypesByEntitiesAndStoreThemLocally(entity: string) {
    if (this.userTypesLocally.length < 1) {
      return this.http.get(Entity.getUserTypeUrl + '?entity=' + entity + '&token=' + this.loginService.getToken()).map((response) => {
        this.userTypesLocally = response.json().data;
        return response.json().data;
      });
    } else {
      return Observable.of(this.userTypesLocally);
    }

  }

  // For User Creation Module
  getUserTypesWithIsUserCollection(userType, isUserCollection) {
    const AdditionalUrl = '&isUserCollection=' + isUserCollection;
    return this.http.get(Entity.getUserTypeUrl + '?entity=' + userType +
      AdditionalUrl + '&token=' + this.loginService.getToken()).map((response) => {
        const res = response.json();
        return res;
      });
  }

  getUserAllTypes() {
    return this.http.get(Entity.getUserTypeUrl + '?token=' + this.loginService.getToken())
      .map((response) => {
        return response.json();
      });
  }


  addUserRegistration(user: any) {
    // Please user commented call  when api integration
    // const types = user.types.map(doc => {
    // return doc._id;
    // });
    // user.types = types;
    console.log(JSON.stringify(user));
    return this.http.post(Users.registerUser + '?token=' + this.loginService.getToken(), user)
      .map(res => res.json())
      .catch(this.handlerError);


    // this.getLastRegisteredUserId().subscribe(val =>
    //    user._id = val);
    // this.userlistModel.push(user);
    // console.log(this.userlistModel);

  }
 
  getAllUsersListView(){
    const token = this.loginService.getToken();
    return this.http.get(Users.getUserListView + '?token=' + token)
      .map((response) => {
        const res = response.json();
        return res;
      });
  }

  getFilteredUserListView(params, pageNumber, noOfRecords){
    return this.http.post(Users.getUserListView + '?token=' + this.loginService.getToken() +
    '&page=' + (pageNumber + 1) + '&limit=' + noOfRecords, params)
    .map(res => res.json())
    .catch(this.handlerError)
  }
  
  //TODO:Remove this function as it is depricated
  getAllRegisteredUsers(noOfRecords: number, certifier: string, rncptitle: string,
    preparationcenter1: string, userType: string, searchText: string, sortBy: string, sortMode: string) {
    const token = this.loginService.getToken();
    return this.http.get(Users.getUser + '?token=' + token + '&page=' + '1' +
      '&limit=' + noOfRecords + '&sortby=' + sortBy + '&sortmode=' + sortMode)
      .map((response) => {
        const res = response.json();
        return res;
      });
  }

  //TODO:Remove this function as it is depricated
  userByFilter(value, pageNumber, noOfRecords) {
    return this.http.post(this.usersUrls.userByFilter + '?token=' + this.loginService.getToken() +
      '&page=' + (pageNumber + 1) + '&limit=' + noOfRecords, value)
      .map(res => res.json())
      .catch(this.handlerError)
  };

  getRegisterUserById(id) {
    const token = this.loginService.getToken();
    return this.http.get(Users.getUser + '/' + id + '?token=' + token).map((response) => {
      return response.json().data;
    });
  }


  editRegisteredUser(user: User) {
    if (user.portablePhone === null || user.portablePhone === '') {
      delete user.portablePhone;
    }
    if (user.directLine === null || user.directLine === '') {
      delete user.directLine;
    }
    const url = Users.getUser + '/' + user._id + '?token=' + this.loginService.getToken();
    return this.http.put(url, user, {
      headers: this.headers
    }).map(res => {
      const response = res.json();
      if (response.status === 'OK') {
        return response;
      } else if (response.message === 'Email already used.' ) {
        log.data('editRegisteredUser response.message', response.message)
        return 'CLASH_EMAIL';
      } else {
        return null;
      }
    })
    .catch(
      (error) => {
        log.data('editRegisteredUser response.message error, error.json()', error, error.json());
        return error.json();
      }
    );
  }

  deleteRegisteredUser(id) {
    const token = this.loginService.getToken();
    return this.http.delete(Users.getUser + '/' + id + '?token=' + token).map(res => {
      console.log('Res');
      const response = res.json();
      console.log(response);
      if (response.status === 'OK') {
        return true;
      } else {
        return false;
      }
    });

    // return this.getRegisterUserById(id).subscribe(response => {
    //    const index = this.userlistModel.indexOf(response);
    //    if (index != -1) {
    //        this.userlistModel.splice(index, 1);
    //        return true;
    //    }
    //    else {
    //        return false;
    //    }
    // })
  }

  // getUserTypesById(id): any {
  //     return Observable.of(this.userTypeslist).map((res) => {
  //         let response = this.userTypeslist;
  //         if (id !== null) {
  //             response = response.filter(a => {
  //                 return (a._id === id)
  //             });
  //         }
  //         return response[0];
  //     });
  // }

  getCurrentUserInfo() {
    return this.loginService.getLoggedInUser();
  }


  // Mentor API Calls
  getAllMentors() {
    return this.http.get(Users.getmentor + '?token=' + this.loginService.getToken() + '&page=1&limit=40')
      .map((response) => {
        const res = response.json();
        console.log(res.data);
        return res.data;
      });
  }

  getMentorsForCompany(companyId: string) {
    return this.http.get(Users.getmentor + '?company_id=' + companyId + '&token=' + this.loginService.getToken())
      .map((response) => {
        const res = response.json();
        console.log(res.data);
        return res.data;
      });
  }

  setPassword(id, token, data) {
    return this.http.post(Base.url + 'setPassword/' + id + '?token=' + token, data)
      .map(res => res.json())
      .catch(this.handlerError);
  }
  forgotPassword(data) {
    return this.http.post(Base.url + 'password/forgot/', data)
      .map(res => res.json())
      .catch(this.handlerError);
  }
  recoverPassword(token, data) {
    return this.http.post(Base.url + 'password/recovery/' + token, data)
      .map(res => res.json())
      .catch(this.handlerError);
  }




  getUserTypesByIsUserCollection(isUserCollection?: boolean) {
    return this.http.get(this.userUrls.userTypeCollection + isUserCollection + '&token=' + this.loginService.getToken())
      .map((response) => {
        const res = response.json();
        console.log(res.data);
        return res.data;
      });
  }

  //Users that have User Type Corrector and linked to this School + Title + All Acad Staff linked to School + this Title
  getAcadStaffAndCorrectorUsers(rncpTitleId, schoolId: string, taskId?: string) {
    const taskIdQString = taskId ? '&taskId=' + taskId : '';
    return this.http.get(Users.getAcadStaffAndCorrectorUsers + '?rncpTitleId=' + rncpTitleId + '&schoolId=' + schoolId + taskIdQString +
                        '&token=' + this.loginService.getToken())
      .map((response) => {
        const res = response.json();
        console.log(res);
        return res;
      });
  }
  userNewEmailCheck(email) {
    return this.http.post(this.userUrls.emailCheck + '?token=' + this.loginService.getToken(), email)
      .map((response) => {
        const res = response.json();
        return res;
      });
  }

  getMentorTypeId() {
    if (this.mentorTypeId === '') {
      this.getUserTypesWithIsUserCollection('company', true).subscribe((response) => {
        const types = response.data;
        types.forEach((type) => {
          if (type.name === 'mentor') {
            this.mentorTypeId = type._id;
            return this.mentorTypeId;
          }
        });
      });
    } else {
      return this.mentorTypeId;
    }
  }

  changeUserResponsibility(body) {
    return this.http.post(Users.transferUserResponsibility + '?token=' + this.loginService.getToken(), body)
    .map(
      res => {
      console.log(res.json());
      return res.json();
    },
    err => {
      console.log(err.json());
      return err.json();
    }
    );
  }

  getUserToAssignTasks(rncpId, userTypeId) {
    const body = {
      'rncpTitleId': rncpId,
      'userTypeId': userTypeId
    };
    return this.http.post(Users.getUsersToAssignTask + '?token=' + this.loginService.getToken(), body).map( res => {
      return res.json();
    });
  }

  requestCorrectionInEmailByAcad(userId, lang) {
    return this.http.get( `${this.academicUrls.requestEmailChange}${userId}?token=${this.loginService.getToken()}&lang=${lang}` )
  }
  getMinimalUserList(body) {
    return this.http.post(`${Users.getUserListView}?token=${this.loginService.getToken()}`,body)
    .map(res=> {return res.json()});
  }

  getCreatedByEmailDetails(userId) {
    return this.http.get(`${this.usersUrls.createdByDetails}${userId}?token=${this.loginService.getToken()}`)
    .map(res => { return res.json() });
  }

}
