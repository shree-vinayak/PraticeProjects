import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { UserTypeService } from '../../../../services/usertype.service';
import { FormControl, FormGroup, FormArray, Validators, FormBuilder } from '@angular/forms';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';
import { IdeasCategory } from '../../../../models/Ideas_category.model'
import { SchoolBoard } from '../../../../models/schoolboard_result.model'
import swal from 'sweetalert2';
import { TranslateService } from 'ng2-translate';
import { SettingService } from '../../../../services/settings.service'
import { Observable } from 'rxjs/Observable';
import { Page } from '../../../../models/page.model';
import { Sort } from '../../../../models/sort.model';
import { Entity } from '../../../../shared/enums/entity';
import { GlobalConstants } from '../../../../shared/settings/global-constants';

@Component({
  selector: 'app-usertypes',
  templateUrl: './usertypes.component.html',
  styleUrls: ['./usertypes.component.scss'],
  providers: [UserTypeService]
})

export class UserTypes implements OnInit {
  form: FormGroup;
  usertypelist = [];
  AddNewStatus = false;
  usertype;
  page = new Page();
  sort = new Sort();
  entity = Entity;
  disableElement = false;
  ngxDtCssClasses = {
    sortAscending: 'fa fa-caret-up',
    sortDescending: 'fa fa-caret-down',
    pagerLeftArrow: 'icon-left',
    pagerRightArrow: 'icon-right',
    pagerPrevious: 'icon-prev',
    pagerNext: 'icon-skip'
  };
  // Entitys = [
  //     { key: "admtc", value: "admtc" },
  //     { key: "certifier", value: "certifier" },
  //     { key: "academic", value: "academic" },
  //     { key: "preparation-center", value: "preparation-center" },
  //     { key: "CNCP", value: "CNCP" },
  //     { key: "company", value: "company" },
  //     { key: "service-provider", value: "service-provider" }
  // ];
  EditMode = false;

  constructor(
    public translate: TranslateService,
    public UserTypeService: UserTypeService,
    private fb: FormBuilder,
    private router: Router,
  ) {

  }

  ngOnInit() {
    this.page.pageNumber = 0;
    this.page.size = GlobalConstants.NoOfRecordsPerPage;
    this.page.totalElements = 0;
    this.page.totalPages = 5;
    this.sort.sortby = 'type';  
    this.sort.sortmode = 'asc';
    this.GetUserTypes();
  }

  initForm() {
    this.form = this.fb.group({
      isUserCollection: [this.usertype && this.usertype.isUserCollection ? this.usertype.isUserCollection : true ],
      name: [this.usertype ? this.translateUserTypeOnlyIfSystem(this.usertype) : '', Validators.required],
      entity: [this.usertype ? this.usertype.entity : '', Validators.required],
      description: [this.usertype ? this.usertype.description : '', Validators.required],
      studentManagement: [this.usertype ? this.usertype.studentManagement : false],
      FolderPermission: this.fb.group({
        admissions: this.fb.group({
          'status': [this.checkPermissionForPrint(this.usertype, 'admissions', 'status', '')],
          'permissions': this.fb.group({
            'view': [this.checkPermissionForPrint(this.usertype, 'admissions', 'permissions', 'view')],
            'update': [this.checkPermissionForPrint(this.usertype, 'admissions', 'permissions', 'update')],
            'download': [this.checkPermissionForPrint(this.usertype, 'admissions', 'permissions', 'download')]
          })
        }),
        annalesEpreuves: this.fb.group({
          'status': [this.checkPermissionForPrint(this.usertype, 'annalesEpreuves', 'status', '')],
          'permissions': this.fb.group({
            'view': [this.checkPermissionForPrint(this.usertype, 'annalesEpreuves', 'permissions', 'view')],
            'update': [this.checkPermissionForPrint(this.usertype, 'annalesEpreuves', 'permissions', 'update')],
            'download': [this.checkPermissionForPrint(this.usertype, 'annalesEpreuves', 'permissions', 'download')]
          })
        }),
        boiteaOutils: this.fb.group({
          'status': [this.checkPermissionForPrint(this.usertype, 'boiteaOutils', 'status', '')],
          'permissions': this.fb.group({
            'view': [this.checkPermissionForPrint(this.usertype, 'boiteaOutils', 'permissions', 'view')],
            'update': [this.checkPermissionForPrint(this.usertype, 'boiteaOutils', 'permissions', 'update')],
            'download': [this.checkPermissionForPrint(this.usertype, 'boiteaOutils', 'permissions', 'download')]
          })
        }),
        communication: this.fb.group({
          'status': [this.checkPermissionForPrint(this.usertype, 'communication', 'status', '')],
          'permissions': this.fb.group({
            'view': [this.checkPermissionForPrint(this.usertype, 'communication', 'permissions', 'view')],
            'update': [this.checkPermissionForPrint(this.usertype, 'communication', 'permissions', 'update')],
            'download': [this.checkPermissionForPrint(this.usertype, 'communication', 'permissions', 'download')]
          })
        }),
        examens: this.fb.group({
          'status': [this.checkPermissionForPrint(this.usertype, 'examens', 'status', '')],
          'permissions': this.fb.group({
            'view': [this.checkPermissionForPrint(this.usertype, 'examens', 'permissions', 'view')],
            'update': [this.checkPermissionForPrint(this.usertype, 'examens', 'permissions', 'update')],
            'download': [this.checkPermissionForPrint(this.usertype, 'examens', 'permissions', 'download')]
          })
        }),
        organisation: this.fb.group({
          'status': [this.checkPermissionForPrint(this.usertype, 'organisation', 'status', '')],
          'permissions': this.fb.group({
            'view': [this.checkPermissionForPrint(this.usertype, 'organisation', 'permissions', 'view')],
            'update': [this.checkPermissionForPrint(this.usertype, 'organisation', 'permissions', 'update')],
            'download': [this.checkPermissionForPrint(this.usertype, 'organisation', 'permissions', 'download')]
          })
        }),
        programme: this.fb.group({
          'status': [this.checkPermissionForPrint(this.usertype, 'programme', 'status', '')],
          'permissions': this.fb.group({
            'view': [this.checkPermissionForPrint(this.usertype, 'programme', 'permissions', 'view')],
            'update': [this.checkPermissionForPrint(this.usertype, 'programme', 'permissions', 'update')],
            'download': [this.checkPermissionForPrint(this.usertype, 'programme', 'permissions', 'download')]
          })
        }),
        epreuvesCertification: this.fb.group({
          'status': [this.checkPermissionForPrint(this.usertype, 'epreuvesCertification', 'status', '')],
          'permissions': this.fb.group({
            'view': [this.checkPermissionForPrint(this.usertype, 'epreuvesCertification', 'permissions', 'view')],
            'update': [this.checkPermissionForPrint(this.usertype, 'epreuvesCertification', 'permissions', 'update')],
            'download': [this.checkPermissionForPrint(this.usertype, 'epreuvesCertification', 'permissions', 'download')]
          })
        }),
        archives: this.fb.group({
          'status': [this.checkPermissionForPrint(this.usertype, 'archives', 'status', '')],
          'permissions': this.fb.group({
            'view': [this.checkPermissionForPrint(this.usertype, 'archives', 'permissions', 'view')],
            'update': [this.checkPermissionForPrint(this.usertype, 'archives', 'permissions', 'update')],
            'download': [this.checkPermissionForPrint(this.usertype, 'archives', 'permissions', 'download')]
          })
        }),
        studentaccessoption: this.fb.group({
          'status': [false]
        }),
      }),


    });


  }

  changePage(pageInfo): void {
    this.page.pageNumber = pageInfo.offset;
    this.GetUserTypes();
  }

  sortPage(sortInfo): void {
    let sortMode = sortInfo.newValue;
    let sortBy = sortInfo.column.name;
    if (sortBy != undefined && sortBy != "") {
      this.usertypelist.sort(function (a, b) {
        let a1 = a[sortBy];
        let b1 = b[sortBy];
        if (sortMode == "asc") {
          if (a1 == b1) return 0;
          return a1 < b1 ? 1 : -1;
        }
        else {
          if (a1 == b1) return 0;
          return a1 > b1 ? 1 : -1;
        }
      });
      this.usertypelist = this.usertypelist.slice();
    }
  }
  GetUserTypes() {

    this.UserTypeService.getAllUserType().subscribe((res) => {

      console.log(res);
      this.usertypelist = res.list;
      console.log(res);

    });



  }
  addNewUserType() {
    this.usertype = {};
    this.initForm();
    this.AddNewStatus = true;
  }



  cancel() {
    this.AddNewStatus = false;
  }

  saveUserType() {
    let self = this;
    console.log('api call');
    console.log(this.form.value);
    if (this.form.valid) {
      console.log(this.form.value);
      let dataPost = this.form.value;
      console.log(dataPost);
      if (dataPost.studentManagement == null) {
        dataPost.studentManagement = false;
      }
      console.log('object ID', dataPost._id);
      if (this.EditMode !== true) {
        console.log('Add');
        this.UserTypeService.createUserType(dataPost).map((data) => {
          if (data.code == 200) {
            swal({
              title: this.translate.instant('SETTINGS.USERTYPES.S1.Title'),
              html: this.translate.instant('SETTINGS.USERTYPES.S1.Text', { UserTypeName: this.form.value['name'] }),
              type: 'success',
              allowEscapeKey: true,
              showCancelButton: false,
              confirmButtonText: this.translate.instant('SETTINGS.USERTYPES.S1.Ok')
            });
            self.GetUserTypes();
            self.AddNewStatus = false;
          } else {
            console.log('There is error on create usertype');
            swal({
              title: 'Warning',
              html: data.message,
              type: 'warning',
              allowEscapeKey: true,
              showCancelButton: false,
              confirmButtonText: this.translate.instant('SETTINGS.USERTYPES.S1.Ok')
            });
          }

          return data;
        }).subscribe();
      } else {
        console.log('Update');
        if (this.usertype.isSystemType) {
          dataPost['name'] = this.usertype.name;
          dataPost['isSystemType'] = this.usertype.isSystemType;
          dataPost['entity'] = this.usertype.entity;
        }
        this.UserTypeService.updateUserType(this.usertype._id, dataPost).map((data) => {
          if (data.code == 200) {
            swal({
              title: this.translate.instant('SETTINGS.USERTYPES.S4.Title'),
              html: this.translate.instant('SETTINGS.USERTYPES.S4.Text', { UserTypeName: this.form.value['name'] }),
              type: 'success',
              allowEscapeKey: true,
              showCancelButton: false,
              confirmButtonText: this.translate.instant('SETTINGS.USERTYPES.S1.Ok')
            });
            self.GetUserTypes();
            self.AddNewStatus = false;
            self.EditMode = false;
          } else {
            swal({
              title: 'Warning',
              html: data.message,
              type: 'warning',
              showCancelButton: false,
              allowEscapeKey: true,
              confirmButtonText: this.translate.instant('SETTINGS.USERTYPES.S1.Ok')
            });
          }

          return data;
        }).subscribe();
      }

    } else {
      console.log('please validate the form');
    }

  }

  deleteUserType(data) {

    let thistranslate = this.translate;
    let self = this;



    self.UserTypeService.getUserTypeCount(data._id).map((result) => {
      console.log(result);
      if (result.code != 200) {
        return false;
      }
      if (result.data) {
        swal({
          title: thistranslate.instant('SETTINGS.USERTYPES.S3.Title'),
          html: thistranslate.instant('SETTINGS.USERTYPES.S3.Text', { counter: result.data }),
          type: 'warning',
          showCancelButton: true,
          allowEscapeKey: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'No'
        }).then(function () {

          console.log('redirect to user list');
          self.router.navigate(['/admtc-users']);

        }, function (dismiss) {
          if (dismiss === 'cancel') {

          }
        })
      } else {
        swal({
          title: thistranslate.instant('SETTINGS.USERTYPES.S2.Title'),
          html: thistranslate.instant('SETTINGS.USERTYPES.S2.Text', { UserTypeName: data['name'] }),
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: thistranslate.instant('SETTINGS.USERTYPES.S2.YES'),
          allowEscapeKey: true,
          cancelButtonText: thistranslate.instant('SETTINGS.USERTYPES.S2.NO')
        }).then(function () {
          self.UserTypeService.removeUserType(data._id).map((result) => {
            if (result['code'] == 200) {
              swal({
                title: thistranslate.instant('SETTINGS.USERTYPES.S2.DELETED'),
                html: thistranslate.instant('SETTINGS.USERTYPES.S2.success', { UserTypeName: data['name'] }),
                allowEscapeKey: true,
                type: 'success'
              });
              self.GetUserTypes();
              return data;
            } else {
              swal({
                title: 'Warning',
                text: result['message'],
                allowEscapeKey: true,
                type: 'warning'
              });
            }

          }).subscribe();

        }, function (dismiss) {
          if (dismiss === 'cancel') {

          }
        })
      }
    }).subscribe();




  }
  checkPermissionForPrint(row, field1, field2, permision) {
    if (field2 == 'status') {
      if (row && row.FolderPermission && row.FolderPermission[0] && row.FolderPermission[0][field1][field2]) {
        return true;
      }
    } else {
      if (row && row.FolderPermission && row.FolderPermission[0] && row.FolderPermission[0][field1][field2][permision]) {
        return true;
      }
    }

    return false;
  }
  EditUserType(row) {
    this.AddNewStatus = true;
    this.EditMode = true;
    this.usertype = row;
    this.initForm();
    if (row.isSystemType) {
      this.disableElement = true;
      //  this.form.get('name').disable();
      //  this.form.get('entity').disable();
    } else {
      this.disableElement = false;
      //   this.form.get('name').enable();
      //    this.form.get('entity').enable();
    }

  }

  // Translation
  translateUserTypeOnlyIfSystem(userType): string {
    if (userType.isSystemType)
      return this.getTranslateADMTCSTAFFKEY(userType.name);
    else
      return userType.name;
  }
  getTranslateADMTCSTAFFKEY(name) {
    let value = this.translate.instant('ADMTCSTAFFKEY.' + name.toUpperCase());
    return value != 'ADMTCSTAFFKEY.' + name.toUpperCase() ? value : name;
  }
  getTranslateENTITY(name) {
    let value = this.translate.instant('SETTINGS.USERTYPES.ENTITYNAME.' + name.toUpperCase());
    return value != 'SETTINGS.USERTYPES.ENTITYNAME.' + name.toUpperCase() ? value : name;
  }
}
