import { UtilityService } from './../../services/utility.service';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../../services/users.service';
import { Page } from '../../models/page.model';
import { Sort } from '../../models/sort.model';
import _ from 'lodash';
import { ADMTCStaffDialogComponent } from '../../dialogs/admtc-staff-menu-dialog/admtc-staff-menu-component';
import { PCUserDialogComponent } from '../../dialogs/pc-user-menu-dialog/pc-user-menu-component';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';
import { TranslateService } from 'ng2-translate';
import { UserFilter } from '../../models/userfilter.model';
import { Subscription } from 'rxjs/Subscription';
// import { SendStudentMailComponent } from '../../dialogs/send-student-mail/send-student-mail.component';

declare var swal: any;

// required for logging
import { Log } from "ng2-logger";
import { ComposeMailComponent } from '../Mail/compose-mail/compose-mail.component';
const log = Log.create("PreparationCenterComponent");
log.color = "purple";

@Component({
    selector: 'app-pcusers',
    templateUrl: './preparation-center-component.html',
    styleUrls: ['./preparation-center-component.scss']
})
export class PreparationCenterComponent implements OnInit {
    users: any = [];
    certifiers: any = [];
    RNCPTitles: any = [];
    preparationCenter: any = [];
    userTypes: any = [];
    userList: any = [];
    currentLoginUser: any = '';
    certifier: string;
    rncptitle: string = '';
    schoolID: string = '';
    usertypeSearch: string = '';
    selectedPrecenter: string = '';
    searchText: string = '';
    preparationcenter1: string;
    isAcadDir: boolean = false;
    usertypes: string;
    loggedInUserId: string;
    userTypeBind;
    isSearching = false;
    page = new Page();
    sort = new Sort();
    reorderable = true;
    selectedUser = [];
    private _subscription: Subscription = new Subscription();
    sendMailBox: MdDialogConfig = {
        disableClose: false,
        width: "1000px",
        height: "80%"
    };

    userFilterObject: UserFilter = new UserFilter();
    ngxDtCssClasses = {
        sortAscending: 'fa fa-caret-up',
        sortDescending: 'fa fa-caret-down',
        pagerLeftArrow: 'icon-left',
        pagerRightArrow: 'icon-right',
        pagerPrevious: 'icon-prev',
        pagerNext: 'icon-skip'
    };

    admtcStaffDialogComponent: MdDialogRef<ADMTCStaffDialogComponent>;
    public dialogRef: MdDialogRef<ComposeMailComponent>;
    // ADMTC staff dialog property
    configCat: MdDialogConfig = {
        disableClose: false,
        width: '400px'
    };

    // PC dialog object
    PCDialogComponent: MdDialogRef<PCUserDialogComponent>;
    configPC: MdDialogConfig = {
        disableClose: false,
        width: '450px'
    };

    isUserCertifierAdmin: boolean = false;


    constructor(private service: UserService,
        private router: Router,
        private dialog: MdDialog,
        private translate: TranslateService,
        public dialog2: MdDialog,
        private utilityService: UtilityService) {
    }

    ngOnInit() {
        // this.currentLoginUser = this.service.getRole();
        this.isAcadDir = this.utilityService.checkUserIsAcademicDirector();
        this.isUserCertifierAdmin = this.utilityService.checkUserIsAdminOfCertifier();
        const logInUser = JSON.parse(localStorage.getItem('loginuser'));
        this.loggedInUserId = logInUser._id;
        if (logInUser.entity.school) {
            this.schoolID = logInUser.entity.school._id;
            log.data('This data logInUser', this.schoolID);
        }

        this.page.pageNumber = 0;
        this.page.size = 1000;
        this.page.totalElements = 0;
        this.page.totalPages = 5;
        this.sort.sortby = '';
        this.sort.sortmode = 'asc';

        this.getUserList();

        let userTypesArray = [];
        this.service.getUserTypesWithIsUserCollection(this.isUserCertifierAdmin ? 'certifier' : 'academic', true)
            .subscribe((response) => {
            this.userTypes = [];
            userTypesArray = response.data;
            log.data('getUserTypesWithIsUserCollection', response);

            userTypesArray.forEach((item) => {
                this.userTypes.push({ id: item._id, text: this.getTranslateADMTCSTAFFKEY(item.name) });
            });
            this.userTypes = this.userTypes.sort(this.keysrt('text'));
            //    response.data = this.translate.instant('ADMTCSTAFFKEY.' + response.data.toUpperCase());
        });

        this._subscription = this.translate.onLangChange.subscribe((params) => {
            if (this.userTypes !== []) {
                this.userTypes = [];
                userTypesArray.forEach((item) => {
                    this.userTypes.push({ id: item._id, text: this.getTranslateADMTCSTAFFKEY(item.name) });
                });
                this.userTypes = this.userTypes.sort(this.keysrt('text'));
            }
        });
    }

    ngOnDestroy() {
        // Called once, before the instance is destroyed.
        // Add 'implements OnDestroy' to the class.
        this._subscription.unsubscribe();
    }


    getUserList(): void {
        if (this.isUserCertifierAdmin) {
            this.searchText = '';
            this.usertypeSearch = '';
            this.rncptitle = '';
            this.searchUserList();
        } else {
            // All Records Fetched in One call hence Page no. should be 1 by default
            const noOfRecords = 0;
            this.service.getAllUsersListView().subscribe((response) => {
                    this.userList = null;
                    this.userList = response.data;
                    this.page.totalElements = response.total;
                });
        }
    }

    searchUserList(isFirst?: boolean): void {
        this.isSearching = true;
        this.userFilterObject.userName = this.searchText !== '' ? this.searchText : '';
        this.userFilterObject.rncpTitle = this.rncptitle !== '' ? this.rncptitle : '';
        this.userFilterObject.schoolId = this.schoolID;
        this.userFilterObject.userType = this.usertypeSearch !== '' ?
            this.usertypeSearch : '';
        this.userFilterObject.searchBy = this.isUserCertifierAdmin ?
                                         'certifier' : 'preparation-center';
        this.page.size = 100;
        this.page.totalElements = 0;
        this.page.totalPages = 5;
        // All Records Fetched in One call hence Page no. should be 1 by default
        const pageNumber = 0;
        this.service.getFilteredUserListView(this.userFilterObject, pageNumber, this.page.size).
            subscribe((response) => {
                this.userList = null;
                this.userList = response.data;
                this.page.totalElements = response.total;
                this.page.pageNumber = response.paginate.page - 1;
                this.page.size = response.paginate.limit;
            });
    }

    changePage(pageInfo): void {
        this.page.pageNumber = pageInfo.offset;
        if (this.isSearching) {
            this.searchUserList(false);
        } else {
            this.getUserList();
        }
    }

    changeUpdatePage(): void {
        if (this.isSearching) {
            this.searchUserList(false);
        } else {
            this.getUserList();
        }
    }



    /* sorting by KIRAN NAIK */
    sortPage(sortInfo): void {
        const sortMode = sortInfo.newValue;
        const sortBy = sortInfo.column.name;
        this.page.pageNumber = 0;
        const self = this;

        // Implemented sort for assignT0 in all lang
        if (sortInfo.column.name === 'lastName') {
            this.userList = _.orderBy(this.userList, [sortBy], [sortMode]);
        }

        // Implemented sort for usertypes in all lang
        if (sortInfo.column.name === 'types[0].name') {
            const arr = this.userList.map(function (x) {
                if (x.types !== null) {
                    if (x.types.length !== 0) {
                        x.sortName = self.getTranslateUserType(x.types[0].name);
                    }
                }
                return x;
            });
            this.userList = _.orderBy(this.userList, ['sortName'], [sortInfo.newValue]);
        }

        // Implemented sort for entityTypes in all lang
        if (sortInfo.column.name === 'entity.type') {
            const arr = this.userList.map(function (x) {
                if (x.entity !== null) {
                    if (x.entity.type !== undefined) {
                        x.sortName = self.translate.instant(x.entity.type);
                    }
                }
                return x;
            });
            this.userList = _.orderBy(this.userList, ['sortName'], [sortInfo.newValue]);
        }
    }


    setLoginUser(id) {
        this.service.loginUser = id;
    }

    ADMTCStaffDialog() {
        // 1 for Admin User
        this.service.loginUser = 1;
        this.admtcStaffDialogComponent = this.dialog.open(ADMTCStaffDialogComponent, this.configCat);
        this.admtcStaffDialogComponent.afterClosed().subscribe((newCompanyName) => {
            if (newCompanyName !== undefined) {
                this.service.addClass(newCompanyName).subscribe((response) => {
                });
            }
            this.changeUpdatePage();
        });
    }

    UsermenuDialog(record) {
        this.PCDialogComponent = this.dialog.open(PCUserDialogComponent, this.configPC);

        if (record !== null) {
            // this.admtcStaffDialogComponent.componentInstance.user = record;
            this.PCDialogComponent.componentInstance.userid = record;
        }
        this.PCDialogComponent.afterClosed().subscribe((newCompanyName) => {

            // this.getUserList();
            this.changeUpdatePage();
            if (newCompanyName !== undefined) {
                this.service.addClass(newCompanyName).subscribe((response) => {
                });
            }
        });
    }


    // NewThings
    deleteRegisteredUser(id: string, firstname: string) {
        swal({
            title: 'Attention',
            text: this.translate.instant('USERS.MESSAGE.DELETECONFIRMMESSAGE') + ' ' + firstname + '  ?',
            type: 'question',
            allowEscapeKey: true,
            showCancelButton: true,
            cancelButtonText: this.translate.instant('NO'),
            confirmButtonText: this.translate.instant('YES')
        }).then(() => {
            this.service.deleteRegisteredUser(id).subscribe(status => {
                if (status) {
                    this.changeUpdatePage();
                    swal({
                        title: this.translate.instant('USERS.MESSAGE.ADDTITLE'),
                        text: this.translate.instant('USERS.MESSAGE.DELETESUCCESS'),
                        allowEscapeKey: true,
                        type: 'success',
                        confirmButtonText: this.translate.instant('JOBDESCRIPTIONFORM.S6.OK'),
                    });
                } else {
                    swal({
                        title: 'Attention',
                        text: this.translate.instant('USERS.MESSAGE.DELETEFAILED'),
                        allowEscapeKey: true,
                        type: 'warning'
                    });
                }
            });
        }, function (dismiss) {
            if (dismiss === 'cancel') {
            }
        });
        this.page.pageNumber = 0;
    }

    openPopUpForEditDialog(id) {
        this.PCDialogComponent = this.dialog.open(PCUserDialogComponent, this.configPC);
        if (id !== null) {
            console.log('@@@', id);
            this.PCDialogComponent.componentInstance.userid = id;
        }
        this.PCDialogComponent.afterClosed().subscribe((record) => {
            this.changeUpdatePage();
        });
    }

    keysrt(key) {
        return function (a, b) {
            if (a[key] > b[key]) { return 1; }
            else if (a[key] < b[key]) { return -1; };
            return 0;
        };
    }
    getTranslateENTITY(name) {
        let value = this.translate.instant('SETTINGS.USERTYPES.ENTITYNAME.' + name.toUpperCase());
        return value != 'SETTINGS.USERTYPES.ENTITYNAME.' + name.toUpperCase() ? value : name;
      }
    getTranslateADMTCSTAFFKEY(name) {
        const value = this.translate.instant('ADMTCSTAFFKEY.' + name.toUpperCase());
        return value !== 'ADMTCSTAFFKEY.' + name.toUpperCase() ? value : name;
    }

    getTranslateUserType(name) {
        const value = this.translate.instant('ADMTCSTAFFKEY.' + name.toUpperCase());
        return value !== 'ADMTCSTAFFKEY.' + name.toUpperCase() ? value : name;
    }

    resetSearch() {
        this.userFilterObject = new UserFilter();
        this.searchText = '';
        this.rncptitle = '';
        this.selectedPrecenter = '';
        this.usertypeSearch = '';
        this.userTypeBind = '';

        log.data('resetSearch userFilterObject', this.userFilterObject);
        this.page.pageNumber = 0;
        this.page.size = 10;
        this.page.totalElements = 0;
        this.page.totalPages = 5;
        this.sort.sortby = '';
        this.sort.sortmode = 'asc';
        this.getUserList();
        this.isSearching = false;
    }

    sendMail(data) {
        console.log(data);
        console.log('data');
        console.log(data);
        this.selectedUser.push(data);
        this.dialogRef = this.dialog2.open(
            ComposeMailComponent,
            this.sendMailBox
        );
        this.dialogRef.componentInstance.student = data;
        this.dialogRef.afterClosed().subscribe(result => {
            this.dialogRef = null;
        });
        return false;
    }

    ChangeUserTitle(event) {
        if (event.id) {
            this.usertypeSearch = event.id;
            this.searchUserList(true);
        }
    }

    KeyPressSearchUserList(event) {
        if (event.keyCode === 13) {
            this.searchUserList(true);
        }
    }
}

