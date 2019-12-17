import { Component, OnInit, ViewChild } from '@angular/core';
import { MdDialogRef, MdSlideToggleChange, MdSnackBar } from '@angular/material';
import { FormControl, FormGroup, FormArray, Validators, FormBuilder } from '@angular/forms';
import { TranslateService } from 'ng2-translate';
import { Country } from '../../models/country.model';
import { Company } from '../../models/company.model';
import { UserService } from '../../services/users.service';
import { LoginService } from '../../services/login.service';
import { Tasks } from '../../models/tasks.model';
import { TasksService } from '../../services/tasks.service';
declare var swal: any;
import { DatePipe } from '@angular/common';
import { Mail } from './../../models/mail';
import { MailService } from '../../services/mail.service';
import { Subject } from 'app/shared/global-urls';
import { UserFilter } from 'app/models/userfilter.model';

//import swal from 'sweetalert2';
@Component({
  selector: 'app-add-urgent-message-dialog',
  templateUrl: './add-urgent-message-dialog.component.html',
  styleUrls: ['./add-urgent-message-dialog.component.scss'],
  providers: [DatePipe, MailService]
})
export class AddUrgentMessageComponent implements OnInit {
  form: FormGroup;
  company: Company;
  companyID: any;
  AssignTo: any = [];
  modify = false;
  userCatStatus = false;
  submitted = false;
  statusList = [{
    value: 'Todo',
    view: this.translate.instant('TASK.TODO')
  }, {
    value: 'InProgress',
    view: this.translate.instant('TASK.INPROGRESS')
  }, {
    value: 'Done',
    view: this.translate.instant('TASK.DONE')
  }];
  RNCPTitles: any = [];
  userIdList: any = [];
  userList: any = [];
  userTypeList: any = [];
  taskid: string;
  task: Tasks;
  title: string;
  today = new Date();
  selectedRNCP;
  selectedUser;
  selectedRNCPDetails;
  currentUser;
  mail = new Mail();
  attachmnetsPaths = [];
  subject;
  composeProcess = false;
  ListAllUsers: any;
  user: any = {};
  email: string = '';
  loginData;
  minDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
  constructor(
    private dialogRef: MdDialogRef<AddUrgentMessageComponent>,
    private translate: TranslateService,
    private service: UserService,
    private _fb: FormBuilder,
    private taskService: TasksService,
    private _login: LoginService,
    private fb: FormBuilder,
    public datepipe: DatePipe,
    public mailService: MailService,
    public snackBar: MdSnackBar) {
    this.form = this.fb.group({
      rncp: [],
      subject: ['', Validators.required],
      message: ['', Validators.required],
      userId: [''],
    });

  }

  ngOnInit() {
    this.service.getAllRNCPTitlesShortName().subscribe((response) => {
      const data = response.data;
      this.RNCPTitles = [];
      if (data) {
        data.forEach((rep) => {
          this.RNCPTitles.push({
            id: rep._id,
            text: rep.shortName
          });
        });
      }
      this.RNCPTitles = this.RNCPTitles.sort(this.keysrt('text'));
    });

    this.service.getAllUser().subscribe((res) => {
      this.ListAllUsers = res.data;
      // console.log(this.ListAllUsers);
      // for(var i = 0; i< this.ListAllUsers.length; i++){
      //   if(this.ListAllUsers[i].types.length > 0)
      //     console.log(i,this.ListAllUsers[i].types[0].entityTitleEN);
      // }
    });

    this.currentUser = this._login.getLoggedInUser();
    // console.log('this.currentUser', this.currentUser);
    console.log('this.task', this.task);
    console.log('this.task', this.taskid);

    if (this.taskid !== undefined) {
      this.title = 'Edit Task';
      this.modify = true;
      this.AddinitializeFormGroup();
      this.userCatStatus = this.task.userSelection.selectionType === 'user' ? false : true;
      // this.taskService.getTaskById(this.taskid).subscribe(response => {
      //     this.modify = true;
      //     this.task = response
      //     console.log("Edit")
      // console.log(this.task);
      //     console.log(response);
      //     this.initializeFormGroup();
      // });
      this.selectedRNCP = this.task.rncp['_id'];
      if (this.task.userSelection.userId) {
        this.selectedUser = this.task.userSelection.userId._id;
      }

      this.GetAllUser();
    } else {
      this.title = 'Add Task';
      this.modify = false;
      // this.initializeFormGroup();
      this.AddinitializeFormGroup();
    }


    this.service.getUserTypesByEntities('academic').subscribe((response) => {
      let items = response.data;
      items = items.sort(this.keysrt('name'));


      // console.log("Inside");
      items.forEach((item) => {
        this.userTypeList.push({ '_id': item._id, 'name': this.getTranslateADMTCSTAFFKEY(item.name) });
      });
    });
  }

  keysrt(key) {
    return function (a, b) {
      if (a[key].toLocaleUpperCase() > b[key].toLocaleUpperCase()) {
        return 1;
      } else if (a[key].toLocaleUpperCase() < b[key].toLocaleUpperCase()) {
        return -1;
      }
      return 0;
    };
  }

  ChangeRNCPTitle(data) {
    if (data.hasOwnProperty('id')) {
      this.selectedRNCP = data.id;
      this.form.controls.userSelection['controls'].userTypeId.setValue('');
      this.GetAllUser();
    }
  }

  ChangeAssignTo() {
    if (this.selectedUser && this.selectedUser[0]) {
      this.AssignTo.forEach(element => {
        if (element._id === this.selectedUser[0].id) {
          this.form.controls.userSelection['controls'].userTypeId.setValue(element.userType);
        }
      });
    }
  }
  GetAllUser() {
    console.log('GetAllUser');
    this.user = localStorage.getItem('loginuser');
    if (this.user !== undefined && this.user) {
      this.user = JSON.parse(this.user);
    }
    if (this.user !== undefined && this.user) {
      // console.log(this.user);
      if (this.user.email !== '') {
        this.email = this.user.email;
      }
    }

    this.service.getUserByTitleAndEntity( this.selectedRNCP, 'academic' ).subscribe((response) => {
      // console.log(response);
      this.AssignTo = response.data;
      this.userList = [];
      for (let i = this.AssignTo.length - 1; i >= 0; i--) {
        this.userList.push({
          id: this.AssignTo[i]._id,
          text: this.AssignTo[i].firstName + ' ' + this.AssignTo[i].lastName
        });
        if (this.AssignTo[i].email === this.email) {
          this.AssignTo.splice(i, 1);
        }
      }
      this.userList = this.userList.sort(this.keysrt('text'));
      this.AssignTo = this.AssignTo.sort(this.keysrt('firstName'));
    });

    this.loginData = this._login.getLoggedInUser();
    console.log("LoginData", this.loginData);

    this.service.getUserTypesByEntities('academic').subscribe((response) => {
      this.userTypeList = [];
      let items = response.data;
      items = items.sort(this.keysrt('name'));
      // console.log(response);
      items.forEach((item) => {
        this.userTypeList.push({ '_id': item._id, 'name': this.getTranslateADMTCSTAFFKEY(item.name) });
        // console.log("userList", this.userTypeList);
      });
    });

  }

  toggleFinalScore(event: MdSlideToggleChange) {
    this.userCatStatus = event.checked;
    console.log("Toggle Value : ", this.userCatStatus);
    if (event.checked) {
      this.form.controls.userSelection['controls'].userId.disable();
      this.form.controls.userSelection['controls'].userTypeId.enable();
    } else {
      this.form.controls.userSelection['controls'].userTypeId.disable();
      this.form.controls.userSelection['controls'].userId.enable();
    }
  }

  cancel() {
    this.dialogRef.close(false);
  }

  AddinitializeFormGroup() {
    this.selectedRNCP = this.modify ? this.task.rncp['_id'] : '';
    this.form = new FormGroup({
      rncp: new FormControl(this.modify ? [{ id: this.task.rncp['_id'], text: this.task.rncp['shortName'] }] : [], [Validators.required]),
      userSelection: this.fb.group({
        'selectionType': new FormControl([this.modify ? (this.task.userSelection.selectionType === 'user' ? false : true) : false], [Validators.required]),
        'userTypeId': new FormControl([this.modify && this.task.userSelection.selectionType === 'userType' ? this.task.userSelection.userTypeId._id : ''], [Validators.required]),
        'userId': new FormControl([this.modify && this.task.userSelection.selectionType === 'user' ? [{ id: this.task.userSelection.userId._id, text: this.task.userSelection.userId.firstName + ' ' + this.task.userSelection.userId.lastName }] : ''], [Validators.required])
      }),
      description: new FormControl(this.modify ? this.task.description : '', Validators.required),
      subject: new FormControl(this.modify ? this.subject : '', Validators.required)
    });

    if (this.userCatStatus) {
      this.form.controls.userSelection['controls'].userId.disable();
      this.form.controls.userSelection['controls'].userTypeId.enable();
    } else {
      this.form.controls.userSelection['controls'].userTypeId.disable();
      this.form.controls.userSelection['controls'].userId.enable();
    }
  }

  getTranslateADMTCSTAFFKEY(name) {
    const value = this.translate.instant('ADMTCSTAFFKEY.' + name.toUpperCase());
    return value !== 'ADMTCSTAFFKEY.' + name.toUpperCase() ? value : name;
  }

  sendMailUrgent() {
    // console.log('sendMailUrgent');
    this.submitted = true;
    if (this.form.valid) {
      var receiversArray = [];
      // let userValue;
      let multimails = [];
      let UserMail;
      if (this.form.value.userSelection.selectionType === true) {
        //userValue = this.form.value.userSelection.userTypeId;
        let userType;
        for (var i = 0; i < this.userTypeList.length; i++) {
          if (this.userTypeList[i]._id === this.form.value.userSelection.userTypeId) {
            userType = this.userTypeList[i].name;
          }
        }

        // console.log('UserType:' + userType);
        // Get users linked to the RNCP title and userType
        const userFilter = new UserFilter();
        userFilter.userType = this.form.value.userSelection.userTypeId;
        userFilter.rncpTitle = this.form.value.rncp[0].id;

        this.user = localStorage.getItem('loginuser');
        if (this.user !== undefined && this.user) {
          this.user = JSON.parse(this.user);
        }

        this.service.userByFilter(userFilter, 0, 100).subscribe((users) => {
          // console.log('Users Returned by Filter:', users);
          if (users.data.length > 0) {
            if (users.data.length === 1 && this.user.email === users.data[0].email) {
              console.log('Single user Found');
              this.showNoUsersFoundMessage(userType);
            }
            else {
              users.data.forEach(element => {
                if (this.user.email !== element.email) {
                  receiversArray.push({ "recipient": element.email, "rank": 'a', "mailType": "inbox" });
                }
              });
              this.sendEmail(receiversArray);
            }
          }
          else {
            this.showNoUsersFoundMessage(userType);
          }
        });

        // for (var j = 0; j < this.ListAllUsers.length; j++) {
        //   if (this.ListAllUsers[j].types.length > 0) {
        //     if (this.ListAllUsers[j].types[0].entityTitleEN === catName) {
        //       multimails.push(this.ListAllUsers[j].email);
        //     }
        //   }
        // }

        // if (multimails.length > 0) {
        //   console.log("multimails", multimails);
        //   console.log("Before Splice : ", multimails)
        //   this.user = localStorage.getItem('loginuser');
        //   if (this.user !== undefined && this.user) {
        //     this.user = JSON.parse(this.user);
        //   }
        //   if (this.user !== undefined && this.user) {
        //     console.log(this.user);
        //     if (this.user.email !== '') {
        //       this.email = this.user.email;
        //     }
        //   }

        //   for (let i = multimails.length - 1; i >= 0; i--) {
        //     if (multimails[i] === this.email) {
        //       multimails.splice(i, 1);
        //     }
        //   }

        //   console.log("After Splice : ", multimails);

        //   for (var i = 0; i < multimails.length; i++) {
        //     if (this.validateEmail(multimails[i])) {
        //       receiversArray.push({ "recipient": multimails[i], "rank": 'a', "mailType": "inbox" });
        //       console.log("receiversArray", receiversArray);

        //     }
        //   }
        // }
      }
      else {
        // userValue = this.form.value.userSelection.userId;
        if (this.selectedUser[0]) {
          for (var i = 0; i < this.AssignTo.length; i++) {
            if (this.AssignTo[i]._id === this.selectedUser[0].id) {
              UserMail = this.AssignTo[i];
            }
          }
          receiversArray.push({ "recipient": UserMail.email, "rank": 'a', "mailType": "inbox" });
          this.sendEmail(receiversArray);
        }
      }
    }
  }

  sendEmail(receiversArray) {
    let new_mail = new Mail();
    new_mail.emails = receiversArray;
    new_mail.message = this.form.value.description;
    new_mail.subject = this.form.value.subject;
    new_mail.isSent = true;
    new_mail.attachments = this.attachmnetsPaths;
    new_mail.tags = ["compose-new"];
    new_mail.isUrgentMail = true;

    this.mailService.sendMail(new_mail).then(
      task => {
        this.composeProcess = false;
        this.dialogRef.close('updateMailList');
        // this.snackBar.open("Mail Sent", 'Ok', { duration: 2000 });
        swal({
          title: this.translate.instant('TESTCORRECTIONS.GROUP.SAVESUCCESSTITLE'),
          html: this.translate.instant('TASK.MESSAGE.URGENT_MESSAGE_SENT'),
          type: 'success',
          confirmButtonText: this.translate.instant('TASK.MESSAGE.URGENT_MESSAGE_BUTTON')
        }
        );
      },
      (error) => {
        this.dialogRef.close('updateMailList');
        swal({
          title: this.translate.instant('TASK.MESSAGE.NOTABLETODELETETITLE'),
          text: error,
          type: 'error',
          confirmButtonText: this.translate.instant('TASK.MESSAGE.URGENT_MESSAGE_BUTTON')
        });
        this.composeProcess = false;
      }
    );
  }

  showNoUsersFoundMessage(userType) {
    const userTypeName = this.getTranslateADMTCSTAFFKEY(userType);
    swal({
      title: this.translate.instant('TASK.MESSAGE.NOTABLETODELETETITLE'),
      html: this.translate.instant('TASK.MESSAGE.URGENT_MAIL_NO_USERS', { UserType: userTypeName }),
      type: 'error',
      confirmButtonText: this.translate.instant('TASK.MESSAGE.OK')
    });
  }
  // validateEmail(email) {
  //   var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  //   return re.test(email);
  // }
}
