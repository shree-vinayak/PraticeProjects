//import { Subject } from 'rxjs/Rx';
import { EventEmitter, Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { CorrectorUser } from '../models/user_corrector.model';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/catch';
import { Tasks } from '../models/tasks.model';
import { ACADEMICTASKS, Base, NotificationHistory } from '../shared/global-urls';
import { TranslateService } from 'ng2-translate';
import { LoginService } from './login.service';
import { AppSettings } from '../app-settings';
import { Page } from '../models/page.model';
import { Sort } from '../models/sort.model';

@Injectable()
export class TasksService {
  currentLoginUser: any = "";
  tasks: Tasks[] = [];
  task: Tasks;
  header = new Headers({ 'Content-Type': 'application/json' });

  testCorrectionUrl = AppSettings.urls.academic.testCorrection;
  taskListFilterState: any = null;

  constructor(
    private http: Http,
    private translate: TranslateService,
    private loginService: LoginService
  ) {
      this.currentLoginUser = this.loginService.getLoggedInUser();
  }
  // sortBy: string, sortMode: string,  '&sortby=' + sortBy + '&sortmode=' + sortMode +
  getTasks(pageNumber: number, noOfRecords: number, sortBy: string, sortMode: string,
          searchText?: string, taskStatus?: string, userTypeId?: string, type?: string) {
    
    const searchTextQString = searchText ? '&searchText=' + searchText : '';
    const taskStatusQString = taskStatus ? '&taskStatus=' + taskStatus : '';
    const userTypeIdQString = userTypeId ? '&userTypeId=' + userTypeId : '';
    const typeSting = type ? '&type=' + type : '';

    let url = ACADEMICTASKS.url + '?token=' + this.loginService.getToken() + '&page=' + (pageNumber + 1) + '&limit=' + noOfRecords +
            '&sortby=' + sortBy + '&sortmode=' + sortMode +
            '&lang=' + this.translate.currentLang.toLowerCase() + searchTextQString + taskStatusQString + userTypeIdQString + typeSting;

    if (this.isStudent()) {
      url = url + '&type=student';
    }
    if (this.isMentor()) {
      url = url + '&type=mentor';
    }

    return this.http.get(url)
      .map((response) => {
        const res = response.json();
        return {
          tasks: res.data,
          total: res.total
        };
      });
  }

  getInternalTasks() {
    return this.http.get(ACADEMICTASKS.url + '?token=' + this.loginService.getToken() + '&type=internalTask')
    .map((response) => {
      const res = response.json();
      return {
        tasks: res.data,
        total: res.total
      };
    });
  }

  getTaskDetail(taskId) {
    return this.http.get(ACADEMICTASKS.url + "/" + taskId + "/details?" + 'token=' + this.loginService.getToken())
      .map((response) => {
        return response.json().data;
    });
  }

  // For Fetching Task Details in My Task List
  getMyTaskDetail(taskId) {
    return this.http.get(ACADEMICTASKS.url + '/' + taskId + '?token=' + this.loginService.getToken())
      .map((response) => {
        return response.json().data;
    });
  }

  getHistories(pageNumber: number, noOfRecords: number, sortBy: string, sortMode: string) {
    let url = NotificationHistory.getAllHistories + '?token=' + this.loginService.getToken() +
              '&page=' + (pageNumber + 1) + '&limit=' + noOfRecords + '&sortby=' + sortBy + '&sortmode=' +
      sortMode ;
    if (this.isStudent()) {
      url = url + '&type=student';
    }
    if (this.isMentor()) {
      url = url + '&type=mentor';
    }

    return this.http.get(url)
      .map((response) => {
        const res = response.json();
        return {
          history: res.data,
          total: res.total
        };
      });
  }

  historyFilter(data, page: Page, sort: Sort) {
    return this.http.post(NotificationHistory.getAllHistories + '?token=' + this.loginService.getToken() +
                          '&limit=' + page.size + '&page=' + (page.pageNumber + 1) +
                          '&sortby=' + sort.sortby + '&sortmode=' + sort.sortmode,
                          data)
      .map(res => res.json());
  };

  isStudent() {
    const loginuser = localStorage.getItem('loginuser');
    let user;
    if (loginuser !== undefined && loginuser) {
      user = JSON.parse(loginuser);
    }
    if (user !== undefined && user) {
      if (user.types && user.types[0] && user.types[0].name === 'student') {
        return true;
      }
    }
    return false;
  }
  isMentor() {
    const loginuser = localStorage.getItem('loginuser');
    let user;
    if (loginuser !== undefined && loginuser) {
      user = JSON.parse(loginuser);
    }
    if (user !== undefined && user) {
      if (user.types && user.types[0] && user.types[0].name === 'mentor') {
        return true;
      }
    }
    return false;
  }
  
  removeTask(id) {
    return this.http.delete(ACADEMICTASKS.url + '/' + id + '?token=' + this.loginService.getToken())
    .map(response => { return response.json(); });
  }

  createTask(data) {
    console.log(JSON.stringify(data));
    return this.http.post(ACADEMICTASKS.url + '?token=' + this.loginService.getToken(), JSON.stringify(data), { headers: this.header })
      .map(response => { return response.json(); });
  }

  updateTask(id, data) {
    // Shreyas P : Temporary fix as data structures differ.
    let taskToSave: any = {};
    taskToSave._id = taskToSave._id;
    taskToSave.actionTaken = data.actionTaken;
    taskToSave.taskStatus = data.taskStatus;
    taskToSave.comments = data.comments;
    taskToSave.createdBy = data.createdBy;
    taskToSave.createdDate = data.createdDate;
    taskToSave.dueDate = data.dueDate;
    taskToSave.description = data.description;
    taskToSave.priority = data.priority;
    if (data.rncp) {
      taskToSave.rncp = data.rncp;
    }
    taskToSave.lang = this.translate.currentLang;
    if ("user" == data.userSelection.selectionType) {
      if (data.userSelection.userId) {
        taskToSave.userSelection = {
          selectionType: data.userSelection.selectionType,
          userId: data.userSelection.userId
        }
      }
    } else {
      if (data.userSelection.userTypeId) {
        taskToSave.userSelection = {
          selectionType: data.userSelection.selectionType,
          userTypeId: data.userSelection.userTypeId
        }
      }
    }
    if (data.documentExpected) {
      taskToSave.documentExpected = data.documentExpected;
    }
    return this.http.put(ACADEMICTASKS.url + '/' + id + '?token=' + this.loginService.getToken() + '&lang=' + this.translate.currentLang.toLowerCase(),
      taskToSave).map(response => {
        const data = response.json();
        return data;
      }).catch(error => {
        if (error.status === 0) {

        }
        return error;
      });
  }

  // GetAllTasks(pageNumber: number, noOfRecords: number, searchText: string, sortBy: string, sortMode: string): any {

  //     let taskFilterArray: Tasks[] = [];
  //     taskFilterArray = this.tasks.filter(a => {
  //         return ((searchText != undefined && searchText != "" ?
  //             a.rncptitle === searchText || a.assignTo === searchText || a.dueDate === searchText || a.priority === searchText || a.status === searchText
  //             : true))
  //     })

  //     if (sortBy != undefined && sortBy != "") {
  //         taskFilterArray.sort(function (a, b) {
  //             let a1 = a[sortBy];
  //             let b1 = b[sortBy];
  //             if (sortMode == "asc") {
  //                 if (a1 == b1) return 0;
  //                 return a1 < b1 ? 1 : -1;
  //             }
  //             else {
  //                 if (a1 == b1) return 0;
  //                 return a1 > b1 ? 1 : -1;
  //             }
  //         });
  //     }
  //     return Observable.of(taskFilterArray.slice((noOfRecords * pageNumber), (noOfRecords * pageNumber) + noOfRecords)).map((response) => {
  //         let res = response;
  //         return {
  //             data: res,
  //             total: taskFilterArray.length
  //         };
  //     });




  //     //let userFilterArray: UserList[] = [];
  //     //userFilterArray = this.userList.filter(a => {
  //     //    return ((userType != undefined && userType != "" ? a.userTypeID === userType : true)
  //     //        && (rncptitle != undefined && rncptitle != "" ? a.RNCPTitleID === rncptitle : true)
  //     //        && (certifier != undefined && certifier != "" ? a.certifierID === certifier : true)
  //     //        && (searchText != undefined && searchText != "" ? (a.name === searchText || a.affiliation === searchText) : true)
  //     //        && (preparationcenter1 != undefined && preparationcenter1 != "" ? a.preparationCenterID === preparationcenter1 : true)

  //     //    )
  //     //})

  //     //if (sortBy != undefined && sortBy != "") {
  //     //    userFilterArray.sort(function (a, b) {
  //     //        let a1 = a[sortBy];
  //     //        let b1 = b[sortBy];
  //     //        if (sortMode == "asc") {
  //     //            if (a1 == b1) return 0;
  //     //            return a1 < b1 ? 1 : -1;
  //     //        }
  //     //        else {
  //     //            if (a1 == b1) return 0;
  //     //            return a1 > b1 ? 1 : -1;
  //     //        }
  //     //    });
  //     //}

  //     //return Observable.of(userFilterArray.slice((noOfRecords * pageNumber), (noOfRecords * pageNumber) + noOfRecords)).map((response) => {
  //     //    let res = response;
  //     //    return {
  //     //        data: res,
  //     //        total: userFilterArray.length
  //     //    };
  //     //});
  // }

  // getLastUserId(): any {
  //     //return Observable.of(this.userList).map((response) => {
  //     return Observable.of(this.tasks).map((response) => {
  //         if (response.length > 0) {
  //             var lastuser = response[response.length - 1];
  //             if (lastuser != null) {
  //                 return (parseInt(lastuser._id) + 1).toString();
  //             }
  //         }
  //         else {
  //             return "1";
  //         }
  //     });
  // }

  // getTaskById(id): any {
  //     return Observable.of(this.tasks).map((res) => {
  //         let response = this.tasks;
  //         if (id !== null) {
  //             response = response.filter(a => {
  //                 return (a._id === id)
  //             });
  //         }
  //         return response[0];
  //     });
  // }


  // editTask(task: Tasks) {
  //     return this.getTaskById(task._id).subscribe(response => {
  //         const index = this.tasks.indexOf(response)
  //         this.tasks[index] = task;
  //         return task;
  //     });
  // }

  // AddTask(task: Tasks) {
  //     this.getLastUserId().subscribe(val =>
  //         task._id = val);
  //     this.tasks.push(task);
  //     console.log(this.tasks);
  // }

  // deleteTask(id) {
  //     return this.getTaskById(id).subscribe(response => {
  //         const index = this.tasks.indexOf(response)
  //         if (index !== -1) {
  //             this.tasks.splice(index, 1);
  //             return true;
  //         }
  //         else {
  //             return false;
  //         }
  //     });
  // }

  completeTask(taskId) {
    const lang = this.translate.currentLang.toUpperCase();
    return this.http.get(ACADEMICTASKS.completeTask + taskId + '?lang=' + lang + '&token=' + this.loginService.getToken())
      .map(response => {
        if ( response.ok ) {
          return response.json();
        } else {
          return null;
        }
    });
  }
  markAllMarksEntryAsDone(testId,schoolId) {
    const lang = this.translate.currentLang.toUpperCase();
    const data = {
      "schoolId": schoolId,
      "testId": testId,
      "lang": lang
    }
    return this.http.post(ACADEMICTASKS.markAllMarksEntryAsDone + '?lang=' + lang + '&token=' + this.loginService.getToken(),data).map(response => {
      return response;
    });
  }
  taskValidatedByAcadStaff(taskId,schoolId,data) {

    return this.http.post(Base.url + "academic/testCorrection/" + taskId + '/'+schoolId+'/validatedByAcadStaff?token=' + this.loginService.getToken(), data).map(response => {
      return response;
    });
  }
  markAllValidateTestAsDone(data) {
    return this.http.post(Base.url + 'academic/test-correction/markAllValidateTestAsDone?token=' + this.loginService.getToken(), data)
    .map(response => {
      return response;
    });
  }
  submitRetakeTask(testId, correction, taskId?: any){
    const lang = this.translate.currentLang.toUpperCase();
    let data = {
      "lang": lang,
      "corrections": correction,
      "taskId": taskId
    }
    return this.http.post(Base.url + 'academic/test/'+testId+'/submitStudentForRetakeTest?lang=' + lang + '&token=' + this.loginService.getToken(),data).map(response => {
      return response;
    });
  }

  getTaskbyTestId(testId) {
    return this.http.get(ACADEMICTASKS.taskIdFromTestId + testId + '?token=' + this.loginService.getToken()).map(response => {
      return response;
    });
  }

  getTaskByTaskId(taskId) {
    return this.http.get(ACADEMICTASKS.url + '/' + taskId + '?token=' + this.loginService.getToken()).map(response => {
      return response.json();
    });
  }

  getExpectedDocTask(testId, docId) {
    return this.http.get(ACADEMICTASKS.expectedDocTaskUrl + testId + '/getExpectedDocument/' + docId + '?token=' + this.loginService.getToken()).map(response => {
      return response.json();
    });
  }
  getNotificationReference() {
    return this.http.get(NotificationHistory.getAllHistories + '/getNotificationReference/?token=' + this.loginService.getToken()).map(response => {
      return response.json();
    });
  }

  getTasksBasedOnTest(testId) {
    return this.http.get(ACADEMICTASKS.getTasksBasedOnTest + testId + '?token=' + this.loginService.getToken()).map(response => {
      return response.json();
    });
  }

  createManualTestTask(taskId, userIds: string[]) {
    const body = {
      'parentTaskId': taskId,
      'assignedTo': userIds,
      'lang': this.translate.currentLang
    };
    return this.http.post(ACADEMICTASKS.generateManualTestTaskForUser + '?token=' + this.loginService.getToken(), body).map(response => {
      return response.json();
    });
  }

  checkIfMarksEntryIsStarted(testId, taskId) {
    return this.http.get(this.testCorrectionUrl + testId + '/' + taskId + '/check-if-started' + '?token=' + this.loginService.getToken())
                    .map(res => {
                          const response = res.json();
                          return response;
                        });
  }

  setTaskListFilterState(state) {
    console.log('TasksService setTaskListFilterState state', state);
    this.taskListFilterState = state;
  }

  getTaskListFilterState() {
    return this.taskListFilterState;
  }
}
