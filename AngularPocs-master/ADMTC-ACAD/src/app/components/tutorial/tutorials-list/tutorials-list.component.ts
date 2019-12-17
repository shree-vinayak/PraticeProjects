import { AddTutorialDialogComponent } from './../add-tutorial-dialog/add-tutorial-dialog.component';
import { TutorialsService } from './../tutorials.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Page } from '../../../models/page.model';
import { Sort } from '../../../models/sort.model';
import { TranslateService } from 'ng2-translate';
import { Subscription } from 'rxjs/Subscription';
import { UserService } from '../../../services/users.service';
import { UtilityService } from '../../../services/utility.service';
import { SendTutorialDialogComponent } from '../send-tutorial-dialog/send-tutorial-dialog.component';
import { MdDialog } from '@angular/material';
import _ from 'lodash';
declare var swal: any;

// required for logging
import { Log } from 'ng2-logger';
const log = Log.create('TutorialsListComponent');
log.color = 'green';

@Component({
  selector: 'app-tutorials-list',
  templateUrl: './tutorials-list.component.html',
  styleUrls: ['./tutorials-list.component.scss']
})
export class TutorialsListComponent implements OnInit, OnDestroy {

  page = new Page();
  sort = new Sort();
  tutorialList = [];
  ngxDtCssClasses = {
    sortAscending: 'fa fa-caret-up',
    sortDescending: 'fa fa-caret-down',
    pagerLeftArrow: 'icon-left',
    pagerRightArrow: 'icon-right',
    pagerPrevious: 'icon-prev',
    pagerNext: 'icon-skip'
  };

  searchTutorialText = '';
  searchTutorialType: any = null;
  allUserTypes: any = [];
  userTypes: any = [];
  private _subscription: Subscription;

  isSearching = false;
  debounceTitleSearch = _.debounce(this.searchBasedOnText, 1000);
  tutorialFilterObj = {
    title: '',
    userType: ''
  };

  isAdmtcadmtcDirSales = false;

  constructor(private translate: TranslateService,
              private userService: UserService,
              private tutorialsService: TutorialsService,
              private dialog: MdDialog,
              private utilityService: UtilityService) {
  }

  ngOnInit() {
    this.isAdmtcadmtcDirSales = this.utilityService.checkUserIsDirectorSalesAdmin();
    this.getAllTutorials();
    this.getUserTypesNTranslate();
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  getAllTutorials() {
    this.tutorialsService.getAllTutorials().subscribe(
      (response) => {
        log.data('tutorialsService.getAllTutorials', response);
        if (response.data && response.data.length) {
          this.tutorialList = response.data;
        } else {
          this.tutorialList = [];
        }
      });
  }

  changePage(event) {

  }

  sortPage(event) {

  }

  getTranslateUserType(name) {
    const value = this.translate.instant('ADMTCSTAFFKEY.' + name.toUpperCase());
    return value !== 'ADMTCSTAFFKEY.' + name.toUpperCase() ? value : name;
  }

  getTutotialTitleTranslated(title) {
    const value = this.translate.instant('TUTORIALS_List.' + title.toUpperCase());
    return value !== 'TUTORIALS_List.' + title.toUpperCase() ? value : title;
  }

  openTutorialLink(link){
    if (link) {
      const tutorialLink = document.createElement('a');
      tutorialLink.target = '_blank';
      tutorialLink.href = link;    tutorialLink.setAttribute('visibility', 'hidden');
      document.body.appendChild(tutorialLink);
      tutorialLink.click();
      document.body.removeChild(tutorialLink);
    }
  }

  deleteTutorial(tutorial) {

    const deleteSucessSwal = () => {
      swal({
        title: this.translate.instant('TUTORIAL_MENU.TUTO_S6.TITLE'),
        html: this.translate.instant('TUTORIAL_MENU.TUTO_S6.TEXT'),
        type: 'success',
        allowEscapeKey: true,
        confirmButtonText: 'OK'
      })
    };

    const deleteTutorialCall = () => {
      this.tutorialsService.deleteTutorial(tutorial._id).subscribe(
        (response) => {
          log.data('tutorialsService.deleteTutorial', response);
          if (response.data) {
            deleteSucessSwal();
            this.searchModeUpdateList();
          }
        });
    };

    swal({
    title: 'Attention',
    html: this.translate.instant('TUTORIAL_MENU.TUTO_S5.TEXT', {tutorialName: this.getTutotialTitleTranslated(tutorial.title)}),
    type: 'question',
    allowEscapeKey: true,
    showCancelButton: true,
    cancelButtonText: this.translate.instant('CANCEL'),
    confirmButtonText: this.translate.instant('TUTORIAL_MENU.TUTO_S5.CONFIRM')
    }).then(deleteTutorialCall);

  }

  getUserTypesNTranslate() {
    this.userService.getUserTypesByIsUserCollection().subscribe(response => {
      if (this.isAdmtcadmtcDirSales) {
        this.allUserTypes = response;
      } else if ( this.utilityService.checkUserIsAcademicDirector() ) {
        this.allUserTypes = [...response.filter(type => type.entity && type.entity.toLowerCase() === 'academic')];
      }
      this.userTypes = [];

      this.allUserTypes.forEach(item => {
        const typeEntity =
          this.getTranslateADMTCSTAFFKEY(item.name) +
          ' / ' +
          this.getTranslateENTITY(item.entity);
        this.userTypes.push({ id: item._id, text: typeEntity });
      });
      this.userTypes = [..._.orderBy(this.userTypes, ['text'], ['asc'])];
    });
    this._subscription = this.translate.onLangChange.subscribe(params => {
      if (this.allUserTypes !== []) {
        this.userTypes = [];
        this.allUserTypes.forEach(item => {
          const typeEntity =
            this.getTranslateADMTCSTAFFKEY(item.name) +
            ' / ' +
            this.getTranslateENTITY(item.entity);
          this.userTypes.push({ id: item._id, text: typeEntity });
        });
        this.userTypes = [..._.orderBy(this.userTypes, ['text'], ['asc'])];
      }
    });
  }

  getUserTypesToDisp(types) {
    if (types && types.length) {
      if ( this.utilityService.checkUserIsAcademicDirector() ) {
        const acadUserTypes = [...types.filter(type => type.entity && type.entity.toLowerCase() === 'academic')];
        return acadUserTypes;
      }
      return types;
    }
    return [];
  }

  getTranslateADMTCSTAFFKEY(name) {
    const value = this.translate.instant('ADMTCSTAFFKEY.' + name.toUpperCase());
    return value !== 'ADMTCSTAFFKEY.' + name.toUpperCase() ? value : name;
  }

  getTranslateENTITY(name) {
    const value = this.translate.instant('SETTINGS.USERTYPES.ENTITYNAME.' + name.toUpperCase());
    return value !== 'SETTINGS.USERTYPES.ENTITYNAME.' + name.toUpperCase() ? value : name;
  }

  selectedUserType(event) {
    log.data('selectedUserType', event);
    if (event.id) {
      this.tutorialFilterObj.userType = event.id;
      this.filterTutorialList();
    }
  }

  searchBasedOnText() {
    log.data('searchBasedOnText', this.searchTutorialText);
    this.tutorialFilterObj.title = this.searchTutorialText;
    this.filterTutorialList();
  }

  resetSearch() {
    log.info('resetSearch');
    this.isSearching = false;
    this.searchTutorialText = '';
    this.searchTutorialType = null;
    this.page.pageNumber = 0;
    this.tutorialFilterObj = {
      title: '',
      userType: ''
    };
    this.getAllTutorials();
  }

  filterTutorialList() {
    this.isSearching = true;
    this.tutorialsService.filterTutorialList(this.tutorialFilterObj).subscribe(
      (response) => {
        log.data('tutorialsService.filterTutorialList', response);
        if (response.data && response.data.length) {
          this.tutorialList = response.data;
        } else {
          this.tutorialList = [];
        }
      });
  }

  searchModeUpdateList() {
    if (this.isSearching) {
      this.filterTutorialList();
    } else {
      this.getAllTutorials();
    }
  }

  addTutorial(tutorial) {
    const addTutDialog = this.dialog.open(AddTutorialDialogComponent, {
      disableClose: false,
      width: '600px'});
      addTutDialog.componentInstance.selectedTutorial = tutorial;
      addTutDialog.afterClosed().subscribe(
        (tutorialState) => {
          log.data('addTutDialog.afterClosed( .addTutDialog.afterClosed(', tutorialState);
          if (tutorialState._id) {
            this.searchModeUpdateList();
          }
      });
  }


  sendTutorial(tutorial) {
    const sendTutDialog = this.dialog.open(SendTutorialDialogComponent, {
      disableClose: false,
      width: '600px'});
      sendTutDialog.componentInstance.selectedTutorial = tutorial;
      sendTutDialog.afterClosed().subscribe(
        (tutorialState) => {
          log.data('sendTutorial.afterClosed( .sendTutorial.afterClosed(', tutorialState);
          if (tutorialState._id) {
            // this.searchModeUpdateList();
          }
      });
  }
}
