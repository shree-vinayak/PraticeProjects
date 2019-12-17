import { Document } from './../../../../../models/document.model';
import { Documents } from './../../../../../shared/global-urls';
import { rcnpTitle } from './../../../../../models/rncpTitle.model';
import { School } from './../../../../Mail/list-mail/list-mail.component';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { InternalNotesService } from '../internal-notes.service';
import { TranslateService } from 'ng2-translate';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import {
  RNCPTitlesService,
  StudentsService,
  TestService,
  AcademicKitService,
  UtilityService,
  LoginService,
  UserService
} from 'app/services';
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl
} from '@angular/forms';
import { Page } from 'app/models/page.model';
import { Sort } from 'app/models/sort.model';
import { Observable } from 'rxjs';
import { CustomerService } from 'app/components/customer/customer.service';
import { CrossCorrectionService } from 'app/components/cross-correction/cross-correction.service';
import { FileUploader } from 'ng2-file-upload';
import { FileUpload } from 'app/shared/global-urls';
import swal from 'sweetalert2';
import _ from 'lodash';
import { UserFilter } from 'app/models/userfilter.model';
// Required for Logging on console
import { Log } from 'ng2-logger';
const log = Log.create('AddInternalNoteDialogComponent');
log.color = 'violet';

@Component({
  selector: 'app-add-internal-note-dialog',
  templateUrl: './add-internal-note-dialog.component.html',
  styleUrls: ['./add-internal-note-dialog.component.css']
})
export class AddInternalNoteDialogComponent implements OnInit {
  page = new Page();
  sort = new Sort();
  form: FormGroup;
  submitted = false;
  // selected filters
  selectedSchool = [];
  selectedRNCP = [];
  selectedClass = [];
  selectedTest = [];
  selectedUser = [];
  selectedUserType = [];
  searchDocument = '';
  // searchText: string = '';
  noteTitle: string = '';
  noteBody: string = '';
  schoolLists = [];
  titleLists = [];
  classLists = [];
  testLists = [];
  allUserTypes = [];
  userTypeLists = [];
  usersList = [];
  documentsList = [];
  userFilterObject: UserFilter = new UserFilter();

  currentInternalDocString = '';
  selectedName: string;
  internalExpectedDoc: { name: string }[] = [];
  isRequired = false;
  selectedInternalNoteEdit;
  isNoteEdit = false;

  // document: Document;

  documentType = {
    pfe: 'PFE',
    oral: 'Oral',
    ecrit: 'Ecrit',
    interro: 'Interro'
  };
  documentTypes = [
    {
      value: 'guideline',
      view: 'Guidelines'
    },
    {
      value: 'test',
      view: 'Test'
    },
    {
      value: 'scoring-rules',
      view: 'Scoring Rules'
    },
    {
      value: 'studentnotification',
      view: 'Notification to Student'
    },
    {
      value: 'other',
      view: 'Other'
    }
  ];
  uploader: FileUploader = new FileUploader({
    url: FileUpload.uploadUrl,
    isHTML5: true,
    disableMultipart: false
  });
  @ViewChild('uploadFileControl') uploadInput: any;
  school;
  title;
  class;
  test;
  user;
  userType;
  searchBy: string = '';
  statusFilterSelection: string = 'all';

  constructor(
    private fb: FormBuilder,
    public dialogref: MdDialogRef<AddInternalNoteDialogComponent>,
    private internalNotesService: InternalNotesService,
    public custService: CustomerService,
    private testService: TestService,
    // public snackBar: MdSnackBar,
    @Inject(MD_DIALOG_DATA) public data: any,
    public translate: TranslateService,
    private acadService: AcademicKitService,
    public utility: UtilityService,
    private loginService: LoginService,
    private studentService: StudentsService,
    private service: UserService,
    public Computeutilityservice: UtilityService
  ) {
    // this.school = this.form.controls['school'];
    // this.title = this.form.controls['title'];
    // this.class = this.form.controls['class'];
    // this.test = this.form.controls['test'];
    // this.userType = this.form.controls['userType'];
    // this.user = this.form.controls['user'];
    this.handelFileUploads();
  }

  ngOnInit() {
    this.getAllSchools();
    this.getAllUserTypesByIsUserCollection();
    this.initializeFormGroup();
    this.addDocuments();

    console.log(this.selectedInternalNoteEdit);
  }

  initializeFormGroup() {
    this.form = new FormGroup({
      noteTitle: new FormControl(
        this.isNoteEdit ? this.selectedInternalNoteEdit.noteTitle : '',
        [Validators.required]
      ),
      noteBody: new FormControl(
        this.isNoteEdit ? this.selectedInternalNoteEdit.noteBody : '',
        [Validators.required]
      ),
      documents: new FormControl(
        this.isNoteEdit ? this.selectedInternalNoteEdit.documents : '',
        [Validators.required]
      )
    });
    if (this.isNoteEdit) {
      this.selectedSchool.push({
        id: this.selectedInternalNoteEdit.school,
        text: this.selectedInternalNoteEdit.school.shortName
      });
      this.selectedSchool = [...this.selectedSchool];
      this.changeSchoolFilterTyped({
        id: this.selectedInternalNoteEdit.school,
        text: this.selectedInternalNoteEdit.school.shortName
      });

      this.internalExpectedDoc = this.selectedInternalNoteEdit.documents.map(
        doc => {
          return {
            id: doc.id,
            name: doc.name
          };
        }
      );

      this.documentsList = this.selectedInternalNoteEdit.documents.map(d => {
        return d._id;
      });
    }
  }
  changeSchoolFilterTyped(event) {
    if (event.id) {
      this.testLists = [];
      this.titleLists = [];
      this.titleLists = [...this.titleLists];

      // If the school selection is changed, all the other selected filters should be empty
      if (this.selectedSchool.length) {
        this.selectedClass = [];
        this.selectedRNCP = [];
        this.selectedTest = [];
      }
      // If the school selection is changed, all the other selected filters should be empty ENDS HERE

      event.id.rncpTitles.forEach(item => {
        this.titleLists.push({ id: item._id, text: item.shortName });
      });

      // If the logged in user is acad-dir he should be able to see rncp that are assigned to him
      // if (this.utility.checkUserIsAcademicDirector()) {
      //   const acadDirRNCP = this.loginService.getLoggedInUser().assignedRncpTitles.map(r => { return { 'id': r }; });
      //   this.titleLists = _.intersectionBy(this.titleLists, acadDirRNCP, 'id');
      // }
      this.titleLists = [...this.titleLists.sort(this.keysrt('text'))];
      if (this.isNoteEdit) {
        this.selectedRNCP.push({
          id: this.selectedInternalNoteEdit.rncpTitle._id,
          text: this.selectedInternalNoteEdit.rncpTitle.shortName
        });
        this.selectedRNCP = [...this.selectedRNCP];
        this.changeTitleFilter({
          id: this.selectedInternalNoteEdit.rncpTitle._id,
          text: this.selectedInternalNoteEdit.rncpTitle.shortName
        });
      }
    }
  }

  changeTitleFilter(event) {
    if (event.id) {
      // If the RNCP selection is changed, all the other selected filters should be empty
      if (this.selectedRNCP.length > 0) {
        this.selectedClass = [];
        this.selectedTest = [];
      }
      // If the school RNCP is changed, all the other selected filters should be empty ENDS HERE

      // When RNCP is selected Classes will be fetched
      this.testService.getclass(event.id).subscribe(res => {
        const data = res;
        this.classLists = [];
        if (data) {
          data.forEach(rep => {
            this.classLists.push({
              id: rep._id,
              text: rep.name
            });
          });
        }
        this.classLists = this.classLists.sort(this.keysrt('text'));
        if (this.isNoteEdit) {
          this.selectedClass.push({
            id: this.selectedInternalNoteEdit.classId._id,
            text: this.selectedInternalNoteEdit.classId.name
          });
          this.selectedClass = [...this.selectedClass];
          this.changeClassFilter({
            id: this.selectedInternalNoteEdit.classId._id,
            text: this.selectedInternalNoteEdit.classId.name
          });
        }
        // this.form.controls['classId'].setValue('');
      });
    }
  }
  changeClassFilter(event) {
    this.testLists = [];
    if (event.id) {
      // If the Class selection is changed, all the other dependent selected filters on it should be empty
      if (this.selectedClass.length > 0) {
        this.selectedTest = [];
      }
      // If the Class selection is changed, all the other dependent selected filters on it should be empty ENDS HERE

      this.getAll(event.id);
      this.getTests(event.id);
    }
  }
  getTests(rncpId) {
    this.testLists = [];
    this.testService.getTestsBasedOnClassId(rncpId).subscribe(tests => {
      tests.forEach(test => {
        this.testLists.push({
          id: test._id,
          text: test.name
        });
      });
      this.testLists = [...this.testLists.sort(this.keysrt('text'))];
      if (this.isNoteEdit) {
        this.selectedTest.push({
          id: this.selectedInternalNoteEdit.test._id,
          text: this.selectedInternalNoteEdit.test.name
        });
        this.selectedTest = [...this.selectedTest];
        // this.changeTestFilter({ 'id': this.selectedInternalNoteEdit.test._id, 'text': this.selectedInternalNoteEdit.test.name });
      }
    });
  }

  changeTestFilter(event) {}

  ChangeUserTypeFilter(event) {
    if (event.id) {
      // this.userFilterObject.userName =
      //   this.searchText !== '' ? this.searchText : '';
      this.userFilterObject.rncpTitle = this.selectedRNCP.length
        ? this.selectedRNCP[0].id
        : '';
      this.userFilterObject.schoolId = this.selectedSchool.length
        ? this.selectedSchool[0].id._id
        : '';
      this.userFilterObject.userType = this.selectedUserType.length
        ? this.selectedUserType[0].id
        : '';
      // this.userFilterObject.searchBy = this.searchBy;
      // this.userFilterObject.userStatus = this.statusFilterSelection === 'all' ? '' : this.statusFilterSelection;
      this.page.size = 1000;
      this.page.totalElements = 0;

      // this.page.totalPages = 5;
      // All Records Fetched in One call hence Page no. should be 1 by default
      const pageNumber = 0;
      const numberofRecords = 0;
      this.service
        .getFilteredUserListView(
          this.userFilterObject,
          pageNumber,
          numberofRecords
        )
        .subscribe(response => {
          this.usersList = [];
          this.usersList = response.data;
          const users: any[] = response.data;

          if (users.length > 0) {
            // this.searchText = '';
            users.forEach(item => {
              this.usersList.push({
                id: item._id,
                text:
                  this.utility.computeCivility(
                    item.civility,
                    this.translate.currentLang.toUpperCase()
                  ) +
                  ' ' +
                  item.firstName +
                  ' ' +
                  item.lastName
              });
            });
            this.usersList = [...this.usersList.sort(this.keysrt('text'))];
            if (this.isNoteEdit) {
              this.selectedUser.push({
                id: this.selectedInternalNoteEdit.user._id,
                text:
                  this.utility.computeCivility(
                    this.selectedInternalNoteEdit.user.civility,
                    this.translate.currentLang.toUpperCase()
                  ) +
                  ' ' +
                  this.selectedInternalNoteEdit.user.firstName +
                  ' ' +
                  this.selectedInternalNoteEdit.user.lastName
              });
              this.selectedUser = [...this.selectedUser];
            }
            this.getAll(event.id);
          }
        });
    }
  }
  ChangeUserFilter(event) {}
  checkForUserTypesArray(types, typeId) {
    const type = _.findIndex(types, function(t) {
      return t._id === typeId;
    });
    if (type > -1) {
      return true;
    } else {
      return false;
    }
  }

  getAllUserTypesByIsUserCollection() {
    this.service.getUserTypesByIsUserCollection().subscribe(response => {
      this.allUserTypes = response;
      this.userTypeLists = [];

      this.allUserTypes.forEach(item => {
        const typeEntity =
          this.utility.getTranslateADMTCSTAFFKEY(item.name) +
          ' / ' +
          this.utility.getTranslateENTITY(item.entity);
        this.userTypeLists.push({ id: item._id, text: typeEntity });
      });
      this.userTypeLists = this.userTypeLists.sort(this.keysrt('text'));
      if (this.isNoteEdit) {
        this.selectedUserType.push({
          id: this.selectedInternalNoteEdit.userType._id,
          text: this.selectedInternalNoteEdit.userType.name
        });
        this.selectedUserType = [...this.selectedUserType];
        this.ChangeUserTypeFilter({
          id: this.selectedInternalNoteEdit.userType._id,
          text: this.selectedInternalNoteEdit.userType.name
        });
      }
    });
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
      // this.form.controls['school'].setValue('');
    });
  }
  onClickRNCP() {
    this.titleLists = [];
    this.titleLists = [...this.titleLists];
  }

  getAll(classId) {
    let queryString = '';

    if (this.selectedSchool.length > 0) {
      queryString += '&prepcenter=' + this.selectedSchool[0].id._id;
    }
    if (this.selectedRNCP.length > 0) {
      queryString += '&rncpTitleId=' + this.selectedRNCP[0].id;
    }
    if (classId) {
      queryString += '&classId=' + classId;
    }
  }

  keysrt(key) {
    return function(a, b) {
      if (a[key] > b[key]) {
        return 1;
      }
      if (a[key] < b[key]) {
        return -1;
      }
      return 0;
    };
  }

  // CODE FOR ADD DOCUMENT

  addDocuments() {
    if (this.currentInternalDocString.trim()) {
      this.internalExpectedDoc.push({ name: this.currentInternalDocString });
      this.internalExpectedDoc = [
        ..._.uniqBy(this.internalExpectedDoc, doc =>
          doc.name.trim().toLowerCase()
        )
      ];
      this.currentInternalDocString = '';
    }
  }
  removeDocument(index) {
    this.internalExpectedDoc.splice(index, 1);
    this.documentsList.splice(index, 1);
  }

  openUploadWindow() {
    if (this.currentInternalDocString !== '') {
      this.uploadInput.nativeElement.click();
    }
  }
  handelFileUploads() {
    this.uploader.onAfterAddingFile = file => {
      file.withCredentials = false;
      const fileExtension = file.file.name.split('.').pop();
      this.upload();
    };
    this.uploader.onErrorItem = (item, response, status, headers) => {
      swal({
        title: 'Attention',
        text: this.translate.instant('DASHBOARD.ERRORS.UPLOADERROR'),
        allowEscapeKey: true,
        type: 'warning'
      });
    };
    this.uploader.onSuccessItem = (item, response, status, headers) => {
      const res = JSON.parse(response);
      if (res.status === 'OK') {
        const document = {
          name: this.currentInternalDocString,
          type: 'other',
          documentType: 'internalNote',
          storedInS3: res.data.s3FileName ? true : false,
          S3FileName: res.data.s3FileName ? res.data.s3FileName : '',
          lang: this.translate.currentLang,
          createdAt: new Date(),
          filePath: res.data.filepath,
          fileName: item.file.name
        };
        this.addDocuments();
        // this.documentsList = [];
        // this.acadService.addDocument(document).subscribe(docs => {
        //   this.documentsList.push(docs._id);
        //   // this.documentsList = docs.map((addDoc) => addDoc._id);
        //   // this.form.controls['documents'].setValue('');
        // });
      } else {
        swal({
          title: 'Attention',
          text: this.translate.instant('DASHBOARD.ERRORS.UPLOADERROR'),
          allowEscapeKey: true,
          type: 'warning'
        });
      }
    };
  }
  upload() {
    this.uploader.queue[0].upload();
  }
  saveInternalNote(value) {
    this.submitted = true;
    const formValues = this.form.value;

    if (this.isNoteEdit) {
      const data = {
        _id: this.selectedInternalNoteEdit._id,
        rncpTitle: this.selectedRNCP[0].id,
        classId: this.selectedClass[0].id,
        school: this.selectedSchool[0].id._id,
        test: this.selectedTest[0].id,
        userType: this.selectedUserType[0].id,
        user: this.selectedUser[0].id,
        noteTitle: value.noteTitle,
        noteBody: value.noteBody,
        documents: this.documentsList,
        additionalNote: this.selectedInternalNoteEdit.additionalNote
          ? this.selectedInternalNoteEdit.additionalNote
          : []
      };
      this.internalNotesService
        .updateInternalNotes(data._id, data)
        .subscribe(response => {
          if (response) {
            if (response.code === 400) {
              swal({
                title: this.translate.instant('INTERNAL_NOTE.NOTE_S5.Title'),
                text: this.translate.instant('INTERNAL_NOTE.NOTE_S5.Text'),
                type: 'warning',
                allowEscapeKey: true,
                confirmButtonText: this.translate.instant(
                  'INTERNAL_NOTE.NOTE_S5.Ok'
                )
              });
            } else {
              swal({
                title: this.translate.instant('INTERNAL_NOTE.NOTE_S1.Title'),
                text: this.translate.instant('INTERNAL_NOTE.NOTE_S1.Text'),
                allowEscapeKey: true,
                type: 'success',
                confirmButtonText: this.translate.instant(
                  'INTERNAL_NOTE.NOTE_S1.OK'
                )
              });
              this.dialogref.close(true);
            }
          }
        });
    } else {
      const data = {
        rncpTitle: this.selectedRNCP[0].id,
        classId: this.selectedClass[0].id,
        school: this.selectedSchool[0].id._id,
        test: this.selectedTest[0].id,
        userType: this.selectedUserType[0].id,
        user: this.selectedUser[0].id,
        noteTitle: value.noteTitle,
        noteBody: value.noteBody,
        documents: this.documentsList
      };
      this.internalNotesService.createInternalNote(data).subscribe(response => {
        if (response) {
          if (response.code === 400) {
            swal({
              title: this.translate.instant('INTERNAL_NOTE.NOTE_S5.Title'),
              text: this.translate.instant('INTERNAL_NOTE.NOTE_S5.Text'),
              type: 'warning',
              allowEscapeKey: true,
              confirmButtonText: this.translate.instant(
                'INTERNAL_NOTE.NOTE_S5.Ok'
              )
            });
          } else {
            swal({
              title: this.translate.instant('INTERNAL_NOTE.NOTE_S1.Title'),
              text: this.translate.instant('INTERNAL_NOTE.NOTE_S1.Text'),
              allowEscapeKey: true,
              type: 'success',
              confirmButtonText: this.translate.instant(
                'INTERNAL_NOTE.NOTE_S1.OK'
              )
            });
            this.dialogref.close(true);
          }
        }
      });
    }
  }

  closeDialog() {
    this.dialogref.close(false);
  }
}
