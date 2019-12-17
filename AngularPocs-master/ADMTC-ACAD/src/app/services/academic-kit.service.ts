import { Injectable } from '@angular/core';
import { RNCPTitlesService } from './rncp-titles.service';
import { Http, RequestOptions, Headers, ResponseContentType } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Category } from '../models/category.model';
import { Categories, Documents, Tests, BasicKit, CloneKit, Base, ACADEMICTASKS, StudentSearch } from '../shared/global-urls';
import { DemoData } from '../shared/demo-data';
import { Document } from '../models/document.model';
import { Test } from '../models/test.model';
import { LoginService } from './login.service';
import { ExpectedDocuments } from '../models/expecteddocuments.model';
import { TranslateService } from 'ng2-translate';
import { UtilityService } from './utility.service';
import { CustomerService } from '../components/customer/customer.service';
import _ from 'lodash';

@Injectable()
export class AcademicKitService {

  academicKit = new BehaviorSubject<any>(null);
  rncpTitle = new BehaviorSubject<any>(null);
  modifyView = new BehaviorSubject<boolean>(false);

  toCategory = new BehaviorSubject<Category>(null);
  testStack: number[] = [];

  constructor(
    private appService: RNCPTitlesService, private http: Http,
    private loginService: LoginService,
    private translate: TranslateService,
    private utilityService: UtilityService,
    private customerService: CustomerService
  ) {
    this.initializeService();
  }

  demoUpdate() {
    setTimeout(() => {
      this.updateKit();
    }, 1000);
  }

  initializeService(): void {

    this.appService.getSelectedRncpTitle().subscribe(title => {
      this.rncpTitle.next(title);
    });

    this.rncpTitle.subscribe(title => {
      this.academicKit.next(title ? title.academicKit : null);
    });
  }

  resetState() {
    this.testStack = [];
  }

  getAcademicKit(): BehaviorSubject<any> {
    //    this.initializeService();
    return this.academicKit;
  }

  createAcademicKit(): Subject<boolean> {
    const newKit = {
      isCreated: true,
      categories: []
    };
    const rncpTitle = this.rncpTitle.getValue();
    rncpTitle.academicKit = newKit;
    return Observable.create(observer => {
      this.appService.updateSelectedRncpTitle().subscribe(status => {
        if (status) {
          this.academicKit.next(rncpTitle.academicKit);
        }
        observer.next(status);
      });
    });
  }



  updateKit(kit?: any) {
    return this.appService.updateSelectedRncpTitle();
  }

  getModifyView() {
    return this.modifyView;
  }

  setModifyView(modify: boolean) {
    this.modifyView.next(modify);
  }

  setTestStack(positionStack: number[]) {
    this.testStack = positionStack;
  }

  getTestStack() {
    return this.testStack || [];
  }

  addCategory(cat: Category) {
    // demo code
    // return Observable.create(observer => {
    //   cat._id = DemoData.getNewID();
    //   console.log(cat._id);
    //   observer.next(cat);
    // });

    // real code
    console.log('Sent : ', cat);
    // this.demoUpdate();
    return this.http.post(Categories.url, cat).map(res => {
      const response = res.json();
      console.log('Response: ', response);
      if (response.status === 'OK') {
        return response.data;
      } else {
        return null;
      }
    });
  }

  updateCategory(cat: Category) {
    // demo code
    // return Observable.create(observer => {
    //   console.log(cat);
    //   this.academicKit.next(this.academicKit.getValue());
    //   observer.next(cat);
    // });

    // real code
    // this.demoUpdate();
    console.log('Sent : ', cat);
    return this.http.put(Categories.url + '/' + cat._id, cat).map(res => {
      const response = res.json();
      // console.log('Response: ', response);

      if (response.status === 'OK') {
        return response.data;
      } else {
        return null;
      }
    });
  }

  removeCategory(cat: Category) {
    // demo code
    // return Observable.create(observer => observer.next(true));

    // real code
    // this.demoUpdate();
    return this.http.delete(Categories.url + '/' + cat._id).map(res => {
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

  addExpectedDocument(test: Test) {
    return this.http.put(Base.url + 'academic/tests/' + test._id, test).map(res => {
      const response = res.json();
      if (response.status === 'OK') {
        return response.data;
      } else {
        return null;
      }
    });
  }

  addDocument(doc: Document) {
    return this.http.post(Documents.url + '?token=' + this.loginService.getToken(), doc).map(res => {
      const response = res.json();
      if (response.status === 'OK') {
        return response.data;
      } else {
        return null;
      }
    });
  }

  addStudentDocument(doc) {
    return this.http.post(Documents.url + '?token=' + this.loginService.getToken(), doc).map(res => {
      const response = res.json();
      if (response.status === 'OK') {
        return response.data;
      } else {
        return null;
      }
    });
  }

  getDocumentById(id) {
    return this.http.get(Documents.url + '/' + id + '?token=' + this.loginService.getToken()).map(res => {
      const response = res.json();
      if (response.status === 'OK') {
        return response.data;
      } else {
        return null;
      }
    });
  }

  removeDocument(doc: Document) {
    return this.http.delete(Documents.url + '/' + doc._id + '?token=' + this.loginService.getToken()).map(res => {
      const response = res.json();
      console.log(response);
      return response;
    });

  }

  updateDocument(doc: Document) {
    return this.http.put(Documents.url + '/' + doc._id + '?token=' + this.loginService.getToken(), doc).map(res => {
      const response = res.json();
      return response.data;
    });

  }

  addDocumentToTest(testId, docId) {
    const doc = {
      documents: [docId]
    };
    return this.http.post(Documents.addDocToTest + testId + '/addDocument?token=' + this.loginService.getToken(), doc).map(res => {
      const response = res.json();
      return response.data;
    });
  }

  getTest(id: string) {
    return this.http.get(Tests.url + '/' + id + '?token=' + this.loginService.getToken()).map(res => {
      const response = res.json();
      return response.data;
    });
  }

  addTest(test: any) {
    // console.log('add test');
    const categories = this.academicKit.getValue().categories;
    let cat = categories[this.testStack[0]];
    for (let i = 1; i <= this.testStack.length - 1; i++) {
      cat = cat.subCategories[this.testStack[i]];
    }
    // return Observable.create(observer => {
    //   test.parentCategory = cat._id;
    //   test._id = DemoData.getNewID();
    //   cat.tests.push(test);
    //   observer.next(test);
    // });

    // real code
    test.parentCategory = cat._id;
    const docs = Object.assign([], test.documents);

    const documents = test.documents.map(doc => {
      return doc._id;
    });
    test.documents = documents;
    // this.demoUpdate();
    return this.http.post(Tests.url + '?token=' + this.loginService.getToken() + '&lang=' + this.translate.currentLang, test).map(res => {
      const response = res.json();
      if (response.status === 'OK') {
        cat.tests.push(response.data);
        cat.tests[cat.tests.length - 1].documents = docs;
        return response.data;
      } else {
        return null;
      }
    });
  }

  editTest(test: any, stack?: number[]) {
    console.log(this.academicKit.getValue());
    const categories = this.academicKit.getValue().categories;
    let cat;
    let index;
    if (stack) {
      cat = categories[stack[0]];
      for (let i = 1; i <= stack.length - 1; i++) {
        cat = cat.subCategories[stack[i]];
      }
    } else {

      cat = categories[this.testStack[0]];
      index = this.testStack.pop();
      index = index < 0 ? 0 : index;
      for (let i = 1; i <= this.testStack.length - 1; i++) {
        cat = cat.subCategories[this.testStack[i]];
      }
    }
    // demo code
    // return Observable.create(observer => {
    //   cat.tests[index] = test;
    //   observer.next(test);
    // });

    // real code
    // this.demoUpdate();

    const docs = Object.assign([], test.documents);
    const documents = test.documents.map(doc => {
      return doc._id;
    });
    test.documents = documents;
    console.log('PUT', test);
    return this.http.put(Tests.url + '/' + test._id + '?token=' + this.loginService.getToken() + '&lang=' + this.translate.currentLang, test).map(res => {
      const response = res.json();
      if (response.status === 'OK') {
        console.log('Done', response.data);
        if (stack) {
        } else {
          if (cat) {
            cat.tests[index] = response.data;
            cat.tests[index].documents = docs;
          }
        }
        return response.data;
      } else {
        console.log('error', response);
        return null;
      }
    });
  }

  updateTest(test: Test) {
    // demo code
    return Observable.create(observer => {
      observer.next(test);
    });


    // real code
    // return this.http.put(Tests.url + '/' + test._id, test).map(res => {
    //   const response = res.json();
    //   return response.data;
    // });
  }

  removeTest(test: Test) {
    // demo code
    // return Observable.create(observer => {
    //   observer.next(true);
    // });

    // real code
    // this.demoUpdate();
    return this.http.delete(Tests.url + '/' + test._id + '?token=' + this.loginService.getToken()).map(res => {
      const response = res.json();
      if (response.status === 'OK') {
        return true;
      } else {
        return false;
      }
    });
  }

  moveAcademicContent(type: string, fromPositionStack: number[], toPositionStack: number[], fromCategory?, document?) {
    // console.log(type, fromPositionStack, toPositionStack);
    return Observable.create(observer => {
      switch (type) {
        case 'document':

          // let dindex = fromPositionStack.pop();
          // if (dindex === -1) {
          //   dindex = 0;
          // }
          // const dcats = this.academicKit.getValue().categories;
          // let dcat = dcats[fromPositionStack[0]];
          // for (let i = 1; i <= fromPositionStack.length - 1; i++) {
          //   dcat = dcat.subCategories[fromPositionStack[i]];
          // }
          let d = document;
          // let dcat1 = dcats[toPositionStack[0]];
          // console.log(dcat1);
          // for (let i = 1; i <= toPositionStack.length - 1; i++) {
          //   dcat1 = dcat1.subCategories[toPositionStack[i]];
          // }
          d['parentCategory'] = this.toCategory.getValue()._id;
          this.updateDocument(d).subscribe(doc => {
            const toC = this.toCategory.getValue();
            if (d.parentCategory === doc.parentCategory) {
              toC.documents.push(d);
              this.toCategory.next(toC);
              const doc = fromCategory.documents.filter( doc => doc._id !== document._id);
              console.log(fromCategory, this.toCategory, doc);
              observer.next(true);
            } else {
              observer.next(false);
            }
          });
          break;
        case 'category':
          const cats = this.academicKit.getValue().categories;
          let cat = cats[fromPositionStack[0]];

          for (let i = 1; i < fromPositionStack.length - 1; i++) {
            cat = cat.subCategories[fromPositionStack[i]];
          }
          let c;
          if (fromPositionStack.length === 1) {
            c = cats[fromPositionStack[0]];
          } else {
            c = cat.subCategories[fromPositionStack[fromPositionStack.length - 1]];
          }
          if (toPositionStack.length === 0) {
            console.log('BBB')
            c.parentCategory = null;
            this.updateCategory(c).subscribe(category => {
              if (category.parentCategory === null) {
                cats.push(c);
                observer.next(true);
              } else {
                observer.next(false);
              }
            });
          } else {
            console.log('aaaaaa')
            let cat1 = cats[toPositionStack[0]];
            const self = this;
            for (let i = 1; i <= toPositionStack.length - 1; i++) {
              cat1 = cat1.subCategories[toPositionStack[i]];
            }
            console.log(cat1)
            c.parentCategory = cat1._id;
            this.updateCategory(c).subscribe(category => {
              if (category.parentCategory === c.parentCategory) {
                cat1.subCategories.push(c);
                self.updateCategory(cat1).subscribe(category => {
                  observer.next(true);
                });

              } else {
                observer.next(false);
              }
            });
          }
          if (fromPositionStack.length === 1) {
            const moved = cats.splice(fromPositionStack[0], 1)[0];
          } else {
            const moved = cat.subCategories.splice(fromPositionStack[fromPositionStack.length - 1], 1)[0];
          }
          if (fromPositionStack.length === toPositionStack.length) {
            if (fromPositionStack[fromPositionStack.length - 1] < toPositionStack[toPositionStack.length - 1]) {
              toPositionStack[toPositionStack.length - 1] = toPositionStack[toPositionStack.length - 1] - 1;
            }
          }
          break;
        case 'test':
          const self = this;
          let tindex = fromPositionStack.pop();
          if (tindex === -1) {
            tindex = 0;
          }
          const tcats = this.academicKit.getValue().categories;
          let tcat = tcats[fromPositionStack[0]];
          for (let i = 1; i <= fromPositionStack.length - 1; i++) {
            tcat = tcat.subCategories[fromPositionStack[i]];
          }
          const t = tcat.tests[tindex];
          console.log(t);

          let tcat1 = tcats[toPositionStack[0]];
          for (let i = 1; i <= toPositionStack.length - 1; i++) {
            tcat1 = tcat1.subCategories[toPositionStack[i]];
          }
          t.parentCategory = tcat1._id;
          this.editTest(t, [...toPositionStack]).subscribe(test => {
            if (t.parentCategory === test.parentCategory['_id']) {
              tcat1.tests.push(t);
              const test = tcat.tests.splice(tindex, 1)[0];

              this.updateCategory(tcat).subscribe(category => {
                self.updateCategory(tcat1).subscribe(category => {
                  observer.next(true);
                });
              });
            } else {
              observer.next(false);
            }
          });
          break;
        default:
        // break;
      }
    });
  }

  clonekit(data) {

    console.log('data : ', data);

    return this.http.post(CloneKit.url + '?token=' + this.loginService.getToken(), data).map(res => {
      const response = res.json();
      console.log('Response: ', response);
      if (response.status === 'OK') {
        return response.data;
      } else {
        return null;
      }
    });
  }
  addBasicKit(data) {
    return this.http.post(BasicKit.url + '?token=' + this.loginService.getToken(), data).map(res => {
      const response = res.json();
      console.log('Response: ', response);
      if (response.status === 'OK') {
        return response.data;
      } else {
        return null;
      }
    });
  }

  downloadAllDocs(catId) {
    const headers = new Headers();
    headers.append('Accept', 'application/zip');
    const requestOptions = new RequestOptions({
      headers: headers,
      responseType: ResponseContentType.Blob
    });

    const options = new RequestOptions({ headers: headers });
    return this.http.post(Documents.downloadAllDocs + '/' + catId + '?token=' + this.loginService.getToken(), {}, requestOptions)
      .map(zip => {
        console.log(zip.headers.toJSON());
        return zip;
      })
      .subscribe(response => {
        var fileName = '';
        const responseHeaders = response.headers.toJSON();
        console.log(responseHeaders['content-disposition'][0]);
        const disposition = responseHeaders['content-disposition'][0];

        if (disposition && disposition.indexOf('attachment') !== -1) {
          const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          const matches = filenameRegex.exec(disposition);
          if (matches != null && matches[1]) {
            fileName = matches[1].replace(/['"]/g, '');
          }
        }

        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(response.blob());
        link.download = fileName;
        link.click();
      });
  }

  getTaskIdForCreateGroups(schoolId, testId) {
    const body = {
      testId: testId,
      schoolId: schoolId
    };
    return this.http.post(ACADEMICTASKS.getTaskIdForCreateGroups + '?token=' + this.loginService.getToken(), body).map(res => {
      return res.json();
    });
  }

  getNumberOfStudents(schoolId, classId, testId) {
    const body = {
      classId: classId,
      schoolId: schoolId,
      testId: testId
    };
    return this.http.post(StudentSearch.getNumberOfStudents + '?token=' + this.loginService.getToken(), body).map(res => {
      return res.json();
    });
  }

  checkToDisplayDocForSchoolUser(document): boolean {
    const hideDocument = false;
    const user = this.loginService.getLoggedInUser();
    if (this.utilityService.checkUserIsDirectorSalesAdmin()) {
      return false;
    } else {
      if ( document.publicationDate && document.publicationDate.type === 'relative' &&
        (( user.entity && user.entity.type === 'academic') ||
        this.utilityService.checkUserIsFromGroupOfSchools())) {
      const schooolId = this.utilityService.checkUserIsFromGroupOfSchools() ?
                        this.customerService.schoolId :
                        user.entity.school ? user.entity.school._id : '';
      if ( schooolId && document.publicationDateForSchools && document.publicationDateForSchools.length) {
        const publicationDateForSchool = _.find(document.publicationDateForSchools, (dateForSchool) => {
          return dateForSchool.school === schooolId;
        });
        if ( publicationDateForSchool ) {
          const todayDate = new Date();
          const dateForSchool = publicationDateForSchool.date;
          const publishForSchoolDate = new Date(
            dateForSchool.year, (dateForSchool.month - 1), dateForSchool.date, dateForSchool.hour, dateForSchool.minute,
          );
          return publishForSchoolDate >= todayDate;
        }
      }
    } else if ( document.publicationDate && document.publicationDate.type === 'fixed') {
      const todayDate = new Date();
      const dateForFixedDoc = document.publicationDate.publicationDate;
      const publishFixedDoc = new Date(
        dateForFixedDoc.year, (dateForFixedDoc.month - 1), dateForFixedDoc.date, dateForFixedDoc.hour, dateForFixedDoc.minute,
      );
      return publishFixedDoc >= todayDate;
    }
    return hideDocument;
  }
    }


}
