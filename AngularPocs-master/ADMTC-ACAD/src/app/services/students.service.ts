import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Student } from '../models/student.model';
import { JobDescription } from '../models/jobdescription.model';

import {
  Base, StudentRegistration, Users, StudentURL, Students, GlobalRncpTitle,
  JobDescriptionURL, UserTypeJobdescriptionURL, Entity, StudentSearch, thumbsUp
} from '../shared/global-urls';
import 'rxjs/add/operator/catch';
import { LoginService } from './login.service';
import { AppSettings } from '../app-settings';
import { TranslateService } from 'ng2-translate';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class StudentsService {

  /* Student Urls */
  urls: any = AppSettings.urls.student;
  problematicUrl = AppSettings.urls.academic.getProblemetic;
  jobDescUrls: any = AppSettings.urls.jobDescription;
  academicUrls: any = AppSettings.urls.academic;
  jobDescriptionSendToStudents = false;
  private _studentSubject: Subject<any> = new Subject<any>();
  private _previousCourses$: Subject<any> = new Subject<any>();
  public studentStream$ = this._studentSubject.asObservable();

  currentLoginUser: any = '';
  private isPreviousCourse = false;
  private subject = new BehaviorSubject<any>(null);
  private classSub = new BehaviorSubject<any>(null);

  constructor(private http: Http,
    private loginService: LoginService,
    private translate: TranslateService, ) {
    const CurrentUser = localStorage.getItem('currentUser');
    if (CurrentUser !== null && CurrentUser !== '' && CurrentUser.length > 0) {
      this.currentLoginUser = JSON.parse(CurrentUser);
    }
  }

  get isPreviousCourseState(): boolean {
    return this.isPreviousCourse;
  }

  set isPreviousCourseState(state: boolean) {
    this.isPreviousCourse = state;
  }

  registerStudent(student: Student, token) {
    return this.http.put(Students.url + '/register/' + token, student)
      .map(res => res.json())
      .catch(this.handlerError);
  };

  editJobDescriptionForm(jobdescriptionform: JobDescription, id) {
    return this.http.post(JobDescriptionURL.url + '' + id + '?token=' + this.loginService.getToken(), jobdescriptionform)
      .map(res => res.json())
      .catch(this.handlerError);
  };

  getJobDescriptionFormByID(id) {
    return this.http.get(JobDescriptionURL.url + '' + id + '?token=' + this.loginService.getToken())
      .map(res => res.json())
      .catch(this.handlerError);
  };

  getValidateJobDescriptionForm(id, queryToken) {
    let token = '';
    if (queryToken !== '' && queryToken !== undefined) {
      token = queryToken;
    } else {
      token = this.loginService.getToken();
    }
    return this.http.get(JobDescriptionURL.url + id + '?token=' + token).map(res => res.json()).catch(this.handlerError);
  };

  sendJobDescReminderToStudent(jobDescId, lang) {
    const token = this.loginService.getToken();
    console.log(' sendJobDescReminderToStudent lang', lang);
    return this.http.get(this.jobDescUrls.reminderMailStudent + jobDescId + '?lang=' + lang + '&token=' + token)
      .map(res => res.json())
      .catch(this.handlerError);
  }

  sendJobDescReminderToMentor(jobDescId, lang) {
    const token = this.loginService.getToken();
    console.log(' sendJobDescReminderToMentor lang', lang);
    return this.http.get(this.jobDescUrls.reminderMailMentor + jobDescId + '?lang=' + lang + '&token=' + token)
      .map(res => res.json())
      .catch(this.handlerError);
  }


  saveJobDescriptionForm(id, jobdescriptionform: JobDescription, queryToken) {
    let token = '';
    if (queryToken !== '' && queryToken !== undefined) {
      token = queryToken;
    } else {
      token = this.loginService.getToken();
    }
    return this.http.put(JobDescriptionURL.url + id + '?token=' + token, jobdescriptionform)
      .map(res => res.json())
      .catch(this.handlerError);
  };
  saveJobDescriptionFormStep4(id, jobdescriptionform: JobDescription, queryToken) {
    let token = '';
    if (queryToken !== '' && queryToken !== undefined) {
      token = queryToken;
    } else {
      token = this.loginService.getToken();
    }

    return this.http.post(JobDescriptionURL.urlStep4 + id + '?token=' + token, jobdescriptionform)
      .map(res => res.json())
      .catch(this.handlerError);
  };

  getUserType() {
    return this.http.get(UserTypeJobdescriptionURL.url + '?token=' + this.loginService.getToken())
      .map(res => res.json())
      .catch(this.handlerError);
  }

  getJobDescriptionForm() {
    return this.http.get(JobDescriptionURL.url + '?token=' + this.loginService.getToken())
      .map(res => res.json())
      .catch(this.handlerError);
  };


  handlerError(error: Response) {
    console.error(error);
    return Observable.throw(error);
  }

  /**
   * Get all Student
   **/
  getAllStudent(queryString: string, pageSize?: number, pageNumber?: number ) {

    if( !pageSize ) {
      pageSize = 0;
    }

    if( !pageNumber ) {
      pageNumber = 1;
    }

    return this.http.get(Students.url + '?token=' + this.loginService.getToken() +
                         queryString + '&limit=' + pageSize + '&page=' + pageNumber )
      .map((response) => {
        const res = response.json();
        console.log(res);
        return {
          studentList: res.data,
          total: res.total
        };
      });
  }

  getAllStudentOfMentor(id) {
    return this.http.get(Base.url + 'academic/mentor/' + id + '/students?token=' + this.loginService.getToken() + '&limit=0')
      .map((response) => {
        const res = response.json();
        console.log(res);
        return {
          studentList: res.data,
          total: res.total
        };
      });
  }

  /**
   * Test Purpose
   **/
  addStudent(student) {
    return this.http.post(Students.url + '?token=' + this.loginService.getToken(), student)
      .map(res => res.json())
      .catch(this.handlerError);
  }

  getUserTypes() {
    return this.http.get(Entity.getUserTypeUrl + '?entity=academic&isUserCollection=false' + '&token=' + this.loginService.getToken())
      .map(res => res.json())
      .catch(this.handlerError);
  }

  createUser(newStudent) {
    return this.http.post(Users.registerUser + '?token=' + this.loginService.getToken(), newStudent)
      .map(res => res.json())
      .catch(this.handlerError);
  }

  getStudentDetails(studentID) {
    return this.http.get(Students.url + '/' + studentID + '?token=' + this.loginService.getToken())
      .map(response => response.json());
  }


  getStudentInformation(token) {
    return this.http.get(StudentURL.url + '/token/' + token)
      .map(response => response.json());
  }

  getAllClassesRNCPTitle(rncp_title_id) {
    return this.http.get(GlobalRncpTitle.url + rncp_title_id + '/classes' + '?token=' + this.loginService.getToken())
      .map(response => response.json());
  }

  updateStudent(id, data: Student) {
    return this.http.put(Students.url + '/' + id + '?token=' + this.loginService.getToken()
      + '&lang=' + this.translate.currentLang.toUpperCase(), data).map(res => {
        const response = res.json();
        return response.data;
      });
  }

  getStudentIdByEmail(email) {
    return this.http.get(this.urls.getStudentIdByEmail + email + '?token=' + this.loginService.getToken())
      .map(response => response.json())
      .do(
        (response) => {
          if (response.data && response.data.previousCourses) {
            const previousCourseDetails = response.data.previousCourses.map(
              ( courseDetails ) => {
                return {
                  rncpId: courseDetails.rncpId,
                  schoolId: courseDetails.schoolId,
                };
              });
              this._previousCourses$.next(previousCourseDetails);
          }
        }
      );
  }

  returnPreviosCourse() {
    return this._previousCourses$.asObservable();
  }

  receiveStudentObject(student) {
    console.log('receiveStudentObject-----------------------------');
    this._studentSubject.next(student);
  }
  getListofStudents() {
    return this.http.get(Students.url + '?token=' + this.loginService.getToken())
      .map((response) => {
        const res = response.json();
        console.log(res);
        return {
          studentList: res.data,
          total: res.total
        };
      });
  }

  // For Student Table Only
  getListOfStudentsWithTests(customer) {
    console.log(customer);
    return this.http.post(Students.studentTable + '?token=' + this.loginService.getToken(), customer)
      .map((response) => {
        const res = response.json();
        console.log(res);
        return res;
      });
  }

  studentByFilter(dataValue) {
    const apirul = `${StudentSearch.url + '?token=' + this.loginService.getToken()}`;
    return this.http.post(apirul + '&limit=' + 1000, dataValue)
      .map(response =>
        response.json())
      .catch(this.handlerError);
  };

  sendProblematicToStudent(studentId) {

    const data = { 'students': studentId, 'lang': this.translate.currentLang };

    return this.http.post(Base.url + 'academic/problematic' + '?token=' + this.loginService.getToken(), data)
      .map((res) => {
        // console.log('Response for sendProblematicToStudent', res);
        const response = res.json();
        if (response.code === 200) {
          return response;
        } else {
          return [];
        }
      }).catch(this.handlerError);
  }

  deactivateStudent(id, reasonObject) {
    return this.http.post(this.urls.studentBase + id + '/deactivate?token=' + this.loginService.getToken(), reasonObject)
      .map(res => {
        const response = res.json();
        return response;
      });
  }

  reactivateStudent(id, Object) {
    return this.http.post(this.urls.studentBase + id + '/reactivate?token=' + this.loginService.getToken(), Object)
      .map(res => {
        const response = res.json();
        return response;
      });
  }

  studentTriggerMail(schoolIdObject) {
    return this.http.post(this.urls.studentsRegistrationEmail + '?token=' + this.loginService.getToken(), schoolIdObject)
      .map(res => {
        const response = res.json();
        return response;
      });
  }

  getProblemeticData(studentId) {
    return this.http.get(this.problematicUrl + studentId + '?token=' + this.loginService.getToken()).map(res => {
      const response = res.json();
      return response;
    });
  }

  updateProblemetic(data) {
    if (data.studentId && data.studentId._id) {
      data.studentId = data.studentId._id;
    }
    return this.http.put(this.problematicUrl + data._id + '?token=' + this.loginService.getToken() +
      '&lang=' + this.translate.currentLang.toLocaleUpperCase(), data).map(res => {
        const response = res.json();
        return response;
      });
  }

  // Import Student For A School Based on Scholar Season, RNCP Title and Class
  importStudentForSchool (importData) {
    return this.http.post(this.academicUrls.importStudentForSchool + '?token=' + this.loginService.getToken(), importData)
            .map( response => {
              const importStudentesponse = response.json();
                return importStudentesponse;
            });
  }

  // Issuance CertiDegree
  sendCertiDegree (data) {
    return this.http.post(this.academicUrls.sendCertiDegree + '?token=' + this.loginService.getToken(), data)
            .map( response => {
              const importStudentesponse = response.json();
                return importStudentesponse;
            });
  }

  getStudentsToExportWithTheirGroup (testId) {
    return this.http.get(Students.getStudentsToExport + testId + '/students' + '?token=' + this.loginService.getToken())
    .map( students => {
      return  students.json();
    });
  }

  requestStudentEmailChange (postData) {
    return this.http.post(this.academicUrls.requestStudentEmailChange + '?token=' + this.loginService.getToken(), postData)
            .map( response => {
              const importStudentesponse = response.json();
                return importStudentesponse;
            })
            .catch(
              error => {
                console.log('requestStudentEmailChange error', error);
                return 'requestStudentEmailChange api threw error';
              }
            );
  }


  getAllStudentForADMTC(params, pageSize?: number, pageNumber?: number ) {

    if( !pageSize ) {
      pageSize = 0;
    }

    if( !pageNumber ) {
      pageNumber = 1;
    }

    return this.http.post(this.urls.getStudentsForAdmtcTable + '?token=' + this.loginService.getToken() +
                           '&limit=' + pageSize + '&page=' + pageNumber, params)
      .map((response) => {
        const res = response.json();
        return {
          studentList: res.data,
          total: res.total
        };
      });
  }

  sendThumbsUpStatus(data){
    return this.http.put(thumbsUp.sendUrl + '?token=' + this.loginService.getToken(), data)
    .map((res)=> {
      const response = res.json();
      console.log(response)
    })
  }

  getFinalCertificationStudents(params) {
    return this.http.post(
      this.academicUrls.studentsForCertiDegree + '?token=' + this.loginService.getToken(), params
    ).map((res)=> {
      const response = res.json();
      return response;
    })
  }

  getSchoolForFinalCertificate(params) {
    return this.http.post(
      this.academicUrls.schoolForFinalCertificate + '?token=' + this.loginService.getToken(), params
    ).map((res)=> {
      const response = res.json();
      return response;
    })
  }

  sendStudentsForCertification(params) {
    return this.http.post(
      this.academicUrls.issueCertificate + '?token=' + this.loginService.getToken(), params
    ).map((res)=> {
      const response = res.json();
      return response;
    })
  }

  sendCERT_N7ToDownloadCertificate(params) {
    return this.http.post(
      this.academicUrls.downloadPDFCertificate + '?token=' + this.loginService.getToken(), params
    ).map((res)=> {
      const response = res.json();
      return response;
    })
  }

  sendRevisionRequest(params) {
    return this.http.post(
      this.academicUrls.studentFinalCertificateRevision + '?token=' + this.loginService.getToken(), params
    ).map((res) => {
      const response = res.json();
      return response;
    });
  }

  generateCertificatePdf(params) {
    return this.http.post(
      this.academicUrls.generateCertificatePdf + '?token=' + this.loginService.getToken(), params
    ).map((res) => {
      const response = res.json();
      return response;
    });
  }


  changementOfRncp(payload) {
    return this.http.post(
      this.academicUrls.changementOfRncp + '?token=' + this.loginService.getToken(), payload
    ).map((res) => {
      const response = res.json();
      return response;
    });
  }
  getPreviousCoursesDetails(payload) {
    return this.http.post(
      this.academicUrls.getPreviousCoursesDetails + '?token=' + this.loginService.getToken(), payload
      ).map((res) => {
        const response = res.json();
        return response;
      });
    }

  transferStudentToAnotherSchool(body) {
    return this.http.post(
      this.academicUrls.transferStudentToAnotherSchool + '?token=' + this.loginService.getToken(), body
    ).map((res) => {
      const response = res.json();
      return response;
    });
  }

  getStudentDetailsForCertiIssue(studentId) {
    return this.http.get(
      this.academicUrls.getStudentDetailsForCertiIssue + studentId + '?token=' + this.loginService.getToken(),
      ).map((res) => {
        const response = res.json();
        return response;
      });
    }

    getIssueCertiTaskOfAcadDir(studentId) {
      return this.http.get(
        `${this.academicUrls.getIssueCertiTaskOfAcadDir}${studentId}?token=${this.loginService.getToken()}`
        ).map((res) => {
        const response = res.json();
        return response;
      });
    }

    setRNCPforSTudentDetails(id) {
      this.subject.next(id);
    }
    getRNCPofStudent(): Observable<any> {
      return this.subject.asObservable();
    }
    setClassforStudentDetails(id) {
      this.classSub.next(id);
    }
    getClassofStudent(): Observable<any> {
      return this.classSub.asObservable();
  }
}
