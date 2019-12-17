import { UtilityService } from './../../services/utility.service';
import {
  AfterViewChecked,
  Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer,
  ViewChild
} from '@angular/core';
import { IdeasSuggestionService } from '../../services/ideas-suggestion.service';
import { Router } from '@angular/router';
import { Page } from '../../models/page.model';
import { FormsModule } from '@angular/forms';
import { Sort } from '../../models/sort.model';
import { TranslateService } from 'ng2-translate';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';
import { AddAcademicSuggestionDialogComponent } from '../../dialogs/add-academic-suggestion-dialog/add-academic-suggestion-dialog.component';
import { PDFService } from '../../services/pdf.service';
import { LoginService } from '../../services/login.service';
import { Print } from '../../shared/global-urls';
import { PRINTSTYLES } from './styles';
import swal from 'sweetalert2';
import _ from 'lodash';
import { Idea } from '../../models/idea.model';
import { Document } from 'app/models/document.model';
import { UserService } from '../../services/users.service';
import { Subscription } from 'rxjs';
import { ReplyMailComponent } from '../../components/Mail/reply-mail/reply-mail.component';
import { ComposeMailComponent } from 'app/components/Mail/compose-mail/compose-mail.component';
import { loadavg } from 'os';
import { log } from 'util';
declare var jsPDF: any;
declare var html2canvas: any;


@Component({
  selector: 'app-one-thousand-ideas',
  templateUrl: './one-thousand-ideas.component.html',
  styleUrls: ['./one-thousand-ideas.component.scss']
})
export class OneThousandIdeasComponent implements OnInit {

  @Output() expandView: EventEmitter<boolean> = new EventEmitter();
  @Input() expanded;
  @ViewChild('document') el: ElementRef;
  @ViewChild('pagesElement') documentPagesRef: ElementRef;
  @ViewChild('docRender') elRend: ElementRef;
  @ViewChild('documentLink') docLink: ElementRef;


  oneThousandIdeas: any = [];
  page = new Page();
  sort = new Sort();
  IdeaList: Idea[];
  displayCheckbox: boolean = false;
  currentUser: any;
  reorderable = true;
  isSelected = false;
  searcModeSuggestionList = [];
  copyIdeasList = [];
  allUserTypes = [];
  private _subscription: Subscription = new Subscription();
  userTypes = [];
  isSearching: boolean = false;
  orientation = 'landscape';
  ngxDtCssClasses = {
    sortAscending: 'fa fa-caret-up',
    sortDescending: 'fa fa-caret-down',
    pagerLeftArrow: 'icon-left',
    pagerRightArrow: 'icon-right',
    pagerPrevious: 'icon-prev',
    pagerNext: 'icon-skip'
  };
  searchText: string = '';
  userTypeBind = '';
  configCat: MdDialogConfig = {
    disableClose: true,
    width: '600px',
    data: { category: '', suggestion: '' }
  };
  mailDialogConfig: MdDialogConfig = {
    disableClose: true,
    width: '720px',
    height: '530px'
  };
  addAcademicSuggestionDialog: MdDialogRef<AddAcademicSuggestionDialogComponent>;
  replyIdeaDialog: MdDialogRef<ReplyMailComponent>;
  forwardIdeaDialog: MdDialogRef<ComposeMailComponent>;
  isAutorized = false;
  searcModeIdeaList: any;
  TotalIdesList: any;
  ideasList: any[];

  configReply: MdDialogConfig = {
    disableClose: true,
    width: '720px',
    height: '530px',
    data: { selectedIea: '' }
  };

  checkIsDirectorSalesAdmin = false;

  constructor(private service: IdeasSuggestionService,
    private router: Router,
    private translate: TranslateService,
    private dialog: MdDialog,
    private renderer: Renderer,
    private _login: LoginService,
    private pdfService: PDFService,
    public utilityService: UtilityService,
    private userService: UserService) {
    this.page.pageNumber = 0;
    this.page.size = 10;
    this.page.totalElements = 100;
    this.page.totalPages = 10;
    this.sort.sortby = '';
    this.sort.sortmode = 'asc';
  }

  ngOnInit() {
    this.getIdeaList();
    /* current login user detail */
    this.currentUser = this._login.getLoggedInUser();
    this.checkIsDirectorSalesAdmin = this.utilityService.checkUserIsDirectorSalesAdmin();
    console.log(this.currentUser);

    this.currentUser.types.forEach(type => {
      if (type.entity.toLowerCase() === "admtc") {
        const typeOfUser = type.name.toLowerCase();
        if (typeOfUser === 'sales' ||
          typeOfUser === 'admin' ||
          typeOfUser === 'director') {
          this.displayCheckbox = true;
        }
      }
    });


    this.userService.getUserTypesByIsUserCollection(true).subscribe((response) => {
      this.allUserTypes = response;
      console.log(response);
      this.userTypes = [];

      this.allUserTypes.forEach((item) => {
        const typeEntity = this.utilityService.getTranslateADMTCSTAFFKEY(item.name)
          + ' / ' + this.utilityService.getTranslateENTITY(item.entity);
        this.userTypes.push({ id: item._id, text: typeEntity });
      });
      this.userTypes = this.userTypes.sort(this.keysrt('text'));
    });
    this._subscription = this.translate.onLangChange.subscribe((params) => {
      if (this.allUserTypes !== []) {
        this.userTypes = [];
        this.allUserTypes.forEach((item) => {
          const typeEntity = this.utilityService.getTranslateADMTCSTAFFKEY(item.name)
            + ' / ' + this.utilityService.getTranslateENTITY(item.entity);
          this.userTypes.push({ id: item._id, text: typeEntity });
        });
        this.userTypes = this.userTypes.sort(this.keysrt('text'));
      }
    });
  }

  ngAfterViewChecked() {
    //console.log("View chnged");
  }

  getTranslated(text: string) {
    return this.translate.instant(text);
  }

  getIdeaList(): void {
    this.page.pageNumber = 0;
    this.service.getOneThousandIdeas(this.page, this.sort).subscribe((ideas) => {
      console.log(ideas);
      if (ideas.code == 200) {
        this.isAutorized = true;
        this.oneThousandIdeas = ideas.data;
        this.page.totalElements = ideas.total;
        this.copyIdeasList = this.oneThousandIdeas;
        this.TotalIdesList = this.oneThousandIdeas;
      } else {
        swal({
          title: 'Warning',
          html: ideas.message,
          type: 'warning',
          allowEscapeKey: true,
          showCancelButton: false,
          confirmButtonText: this.translate.instant('SETTINGS.USERTYPES.S1.Ok')
        });
      }
    });
  }


  changePage(pageInfo): void {
    this.page.pageNumber = pageInfo.offset;
    // this.getIdeaList();
  }

  keysrt(key) {
    return function (a, b) {
      if (a[key] > b[key]) { return 1; }
      else if (a[key] < b[key]) { return -1; };
      return 0;
    };
  }

  /* sorting of user types in language change by KIRAN NAIK */
  sortPage(sortInfo): void {
    this.sort.sortby = sortInfo.column.prop;
    this.sort.sortmode = sortInfo.newValue;
    this.page.pageNumber = 0;
    
    let self = this;
    if (this.sort.sortby === 'user.types[0].name') {
      var arr = this.oneThousandIdeas.map(function (x) {
        if (x.user != null) {
          if (x.user.types[0].name != null) {
            x.sortName = self.utilityService.getTranslateADMTCSTAFFKEY(x.user.types[0].name);
          }
        }
        return x;
      })
      this.oneThousandIdeas = _.orderBy(this.oneThousandIdeas, ['sortName'], [this.sort.sortmode]);
    }

    if (this.sort.sortby === 'category') {
      var arr = this.oneThousandIdeas.map(function (x) {
        if (x.category != null) {
          x.sortName = self.getTranslated(x.category);
        }
        return x;
      })
      this.oneThousandIdeas = _.orderBy(this.oneThousandIdeas, ['sortName'], [this.sort.sortmode]);
    }

    if (this.sort.sortby !== 'user.types[0].name' && this.sort.sortby !== 'category' && this.sort.sortby !== 'points_count') {
      this.oneThousandIdeas = _.orderBy(this.oneThousandIdeas, [this.sort.sortby], [this.sort.sortmode]);
    }

    if (this.sort.sortby === 'points_count') {
      if (this.sort.sortmode === 'desc') {
        this.oneThousandIdeas.sort(function (a, b) {
          return b.points.length - a.points.length;
        });
      } else {
        this.oneThousandIdeas.sort(function (a, b) {
          return a.points.length - b.points.length;
        });
      }
    }
}





  addNewAcademicSuggestion() {
    this.addAcademicSuggestionDialog = this.dialog.open(AddAcademicSuggestionDialogComponent, this.configCat);
    this.addAcademicSuggestionDialog.afterClosed().subscribe((value) => {
      this.getIdeaList();
    });
  }

  goToDetails(ideaObject) {
    this.addAcademicSuggestionDialog = this.dialog.open(AddAcademicSuggestionDialogComponent, { disableClose: false, width: '400px', data: { category: ideaObject.category, idea: ideaObject } });
    this.addAcademicSuggestionDialog.afterClosed().subscribe((value) => {
      this.getIdeaList();
    });
  }

  getLastPage() {
    return 'last'; //testing purpose
  }

  clickOnLike(idea) {
    console.log(idea);
    const lang = {
      lang: this.translate.currentLang.toUpperCase()
    }
    this.service.doLike(lang, idea).subscribe(res => {
      console.log(res);
      if (res) {
        this.oneThousandIdeas.forEach(element => {
          if (element._id === res.ideaId) {
            element.points.push(res.point);
          }
        });
      }
    });
  }

  searchSuggestionList(isFirst: boolean): void {
    this.isSearching = true;
    let self = this;
    console.log(this.searchText);
    const val = this.searchText.toLowerCase();
    this.oneThousandIdeas = this.copyIdeasList;
    console.log("copyIdeasList", this.copyIdeasList);
    const temp = this.oneThousandIdeas.filter(function (d) {
      console.log(d);
      return (
        (d.category !== '' && d.category.toLowerCase().indexOf(val) !== -1) ||
        (d.suggestion !== '' && d.suggestion.toLowerCase().indexOf(val) !== -1) ||
        (d.user && d.user.firstName !== '' && d.user.firstName.toLowerCase().indexOf(val) !== -1) ||
        (self.searchinUser(d).toLowerCase().indexOf(val) !== -1)
      );
    });
    this.oneThousandIdeas = temp;
    this.page.totalElements = this.oneThousandIdeas.length;
    this.page.pageNumber = 0;
  }

  searchSuggestionListKeyup(event) {
    if (this.searchText !== '' && event.keyCode == 13) {
      this.searchSuggestionList(true);
    } else {
      this.oneThousandIdeas = this.copyIdeasList;
      this.page.totalElements = this.oneThousandIdeas.length;
      this.page.pageNumber = 0;
    }
    this.isSearching = true;
  }

  searchinUser(idea): string {
    if (idea.userSelection) {
      if (idea.userSelection.selectionType) {
        if (idea.userSelection.selectionType === 'user') {
          return idea.userSelection.userId.lastName;
        } else if (idea.userSelection.selectionType === 'userType') {
          return idea.userSelection.userTypeId.name;
        } else { return ''; }
      } else { return ''; }
    } else { return ''; }
  }


  ChangeUserTitle(event) {
    if (event.id) {
      this.searchText = '';
      console.log(event);
      let userTypeFilterString = '';
      this.allUserTypes.forEach((item) => {
        if (item._id === event.id) {
          userTypeFilterString = item.name;
        }
      });
      console.log(userTypeFilterString);
      this.ideasList = [];
      this.TotalIdesList.forEach((ideas) => {
        if (ideas.user) {
          ideas.user.types.forEach(type => {
            if (type.name && type.name === userTypeFilterString) {
              this.ideasList.push(ideas);
            }
          });
        }
      });
      this.oneThousandIdeas = this.ideasList;
      this.page.totalElements = this.ideasList.length;
      this.isSearching = true;
      this.page.pageNumber = 0;
    }
  }



  resetSearch() {
    this.searchText = '';
    this.ideasList = this.copyIdeasList;
    this.oneThousandIdeas = this.copyIdeasList;
    this.searcModeIdeaList = this.copyIdeasList;
    this.isSearching = false;
    this.userTypeBind = '';
    this.page.totalElements = this.copyIdeasList.length;
  }


  // Notice the parameters from the service call that give me back my filtered datas
  exportDatas() {
    const target = this.documentPagesRef.nativeElement.children;
    const outer = document.createElement('div');
    outer.innerHTML = '';
    let html = PRINTSTYLES;
    html += `<div class="ql-editor document-parent"><div>`;
    for (let element of target) {
      const wrap = document.createElement('div');
      let el = element.cloneNode(true);
      el.style.display = 'block';
      wrap.appendChild(el);
      html += wrap.innerHTML;
    }
    html += `</div></div>`;
    html += this.getLastPage();
    // console.log(html);
    const filename = 'abc';
    const landscape = this.orientation === 'landscape' ? true : false;
    this.pdfService.getPDF(html, filename, landscape).subscribe(res => {
      if (res.status === 'OK') {
        const element = document.createElement('a');
        element.href = Print.url + res.filePath;
        element.target = '_blank';
        element.setAttribute('download', res.filename);
        element.click();
      }
    });
  }

  /* reply mail to 1001 ideas */
  openReplyDialog(selectedIdea) {
    this.configReply.data = selectedIdea;
    this.replyIdeaDialog = this.dialog.open(ReplyMailComponent, this.configReply);
    this.replyIdeaDialog.afterClosed().subscribe((value) => {
    });
  }

  /* share mail to 1001 ideas */
  OpenShareDialog(data, tag) {
    this.mailDialogConfig.data = data;
    this.forwardIdeaDialog = this.dialog.open(ComposeMailComponent, this.mailDialogConfig);
    this.forwardIdeaDialog.componentInstance.tags = [tag];
    this.forwardIdeaDialog.afterClosed().subscribe(result => {
      this.forwardIdeaDialog = null;
    });
  }


  deleteIdea(ideaId) {
    let self = this;
    const lang = self.translate.currentLang.toUpperCase();
    swal({
      title: self.translate.instant('IDEAS.IDEASDELETE.TITLE'),
      html: self.translate.instant('IDEAS.IDEASDELETE.TEXT'),
      type: "question",
      allowEscapeKey: true,
      showCancelButton: true,
      confirmButtonClass: "btn-danger",
      confirmButtonText: self.translate.instant('IDEAS.IDEASDELETE.DELETE'),
      cancelButtonClass: "btn-danger",
      cancelButtonText: self.translate.instant('JOBDESCRIPTIONFORM.S5.CANCEL')
    }).then(function (isConfirm) {
      if (isConfirm) {
        self.service.deleteIdea(ideaId).subscribe(res => {
          if (res) {
            self.getIdeaList();
            swal({
              title: self.translate.instant('IDEAS.IDEASDELETE.DELETED'),
              // html: self.translate.instant('IDEAS.IDEASDELETE.ONSUCCESS'),
              type: "success",
              confirmButtonClass: "btn-danger",
              allowEscapeKey: true,
              confirmButtonText: self.translate.instant('IDEAS.IDEASDELETE.THANK_YOU')
            });
          } else {
            swal({
              title: self.translate.instant('IDEAS.IDEASDELETE.SORRY'),
              html: self.translate.instant('IDEAS.IDEASDELETE.ONFAIL'),
              allowEscapeKey: true,
              type: 'warning',
              confirmButtonText: self.translate.instant('IDEAS.IDEASDELETE.UNDERSTOOD')
            });
          }
        });
      }
    });
  }
  onActivate($event) {
  }
}
