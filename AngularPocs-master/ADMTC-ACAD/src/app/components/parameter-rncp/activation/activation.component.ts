import {Component, ViewChild, OnInit, Pipe, PipeTransform, OnDestroy} from '@angular/core';
import {RNCPTitlesService} from '../../../services/rncp-titles.service';
import {Router} from '@angular/router';
import {Page} from '../../../models/page.model';
import {Sort} from '../../../models/sort.model';
import {TranslateService} from 'ng2-translate';
import {MdButtonToggleGroup,MdSlideToggleChange} from '@angular/material';
import _ from 'lodash';
import { Subject } from '../../../../../node_modules/rxjs';
declare var swal: any;
@Component({
  selector: 'app-activation',
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.scss']
})
export class ActivationComponent implements OnInit, OnDestroy {

  @ViewChild(MdButtonToggleGroup) mdToggleButtonGroup: MdButtonToggleGroup;
  RNCPSearchItem;
  textSearch = '';
  rncpTitles: any = [];
  page = new Page();
  sort = new Sort();
  reorderable = true;
  ngxDtCssClasses = {
    sortAscending: 'fa fa-caret-up',
    sortDescending: 'fa fa-caret-down',
    pagerLeftArrow: 'icon-left',
    pagerRightArrow: 'icon-right',
    pagerPrevious: 'icon-prev',
    pagerNext: 'icon-skip'
  };
  certifier;
  serchedCertifier = [];
  private ngUnsubscribe: Subject<any> = new Subject<any>();

  constructor(private service: RNCPTitlesService,
    private router: Router,
    private translate: TranslateService) {
    this.page.pageNumber = 0;
    this.page.size = 100;
    this.page.totalElements = 100;
    this.page.totalPages = 10;
    this.sort.sortby = '';
    this.sort.sortmode = 'asc';
  }
  doButtonReset() {
    this.mdToggleButtonGroup.selected = null;
  }

  ngOnInit() {
    this.service.resetState();
    this.getTitleList();
    this.doButtonReset();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  automate() {
    const demoId = '1';
    this.service.selectRncpTitle(demoId).subscribe(title => {
      this.router.navigate(['dashboard']);
    });
  }

  getTranslated(text: string) {
    return this.translate.instant(text);
  }



  getTitleList(): void {
    this.service.getRNCPTitlesOPtimized(this.page, this.sort)
    .takeUntil(this.ngUnsubscribe)
    .subscribe((titles) => {
      this.rncpTitles = titles.titles;
      this.RNCPSearchItem = this.rncpTitles;
      this.page.totalElements = titles.total;
      const a = _.uniqBy(this.rncpTitles, 'certifier.shortName');
      this.certifier = _.sortBy(a, 'certifier.shortName');
    });
  }


  changePage(pageInfo): void {
    this.page.pageNumber = pageInfo.offset;
    this.getTitleList();
  }

  sortPage(sortInfo): void {
    this.sort.sortby = sortInfo.column.prop;
    this.sort.sortmode = sortInfo.newValue;
    console.log('Sort :', this.sort);
    this.page.pageNumber = 0;
    this.getTitleList();
  }

  searchRNCP(event) {
    this.doButtonReset();
    if (this.RNCPSearchItem !== '' && event.target.value) {
      const val = event.target.value.toLowerCase();
      const temp = _.filter(this.RNCPSearchItem, function(d) {
        if (d.shortName && d.shortName) {
          return ((d.shortName !== '' && d.shortName.toLowerCase().indexOf(val) !== -1) ||
            (d.longName.toLowerCase().indexOf(val) !== -1 && d.longName !== '') ||
            (d.certifier && d.certifier.shortName !== '' && d.certifier.shortName.toLowerCase().indexOf(val) !== -1) ||
            (d.certifier && d.certifier.longName.toLowerCase().indexOf(val) !== -1 && d.certifier.longName !== ''));
        }
      });
      this.rncpTitles = temp;
    } else {
      this.rncpTitles = this.RNCPSearchItem;
    }
  }

  toggleFinalScore(event: MdSlideToggleChange,data) {
    console.log(event.checked);
    console.log(data);
    const self = this;
    let status = "deactivate";
    if(event.checked){
      status = "activate";
    }

    data.isPublished = event.checked;
    const id = data._id;
    delete data._id;
    let messageType = 1;
    if (event.checked) {
      messageType = 1;
    }else {
      messageType = 2;
    }

    swal({
      // html: true,
      title: self.translate.instant('PARAMETERS-RNCP.Activation.S' + messageType + '.Title'),
      html: self.translate.instant('PARAMETERS-RNCP.Activation.S' + messageType + '.Text', { TitleShortName: data.shortName, TitleLongName: data.longName, rncpLevel: data.rncpLevel ? data.rncpLevel : "" }),
      type: 'warning',
      showCancelButton: true,
      allowEscapeKey:true,
      confirmButtonText: self.translate.instant('YES'),
      cancelButtonText: self.translate.instant('NO')
    }).then(function () {
      console.log(id, data);
      if (id) {
        self.service.updateStatus(id,status).subscribe(result => {
          if (result) {
            swal({
              title: self.translate.instant('PARAMETERS-RNCP.Activation.S'+messageType+'.successTitle'),
              html: self.translate.instant('PARAMETERS-RNCP.Activation.S'+messageType+'.successMessage',{TitleShortName:data.shortName,TitleLongName:data.longName,rncpLevel:data.rncpLevel ? data.rncpLevel : ""}),
              allowEscapeKey:true,
              type: 'success'
            });
            self.getTitleList();
            return result;
          }
        }, (error) => {});
      }
    }, function (dismiss) {
      if (dismiss === 'cancel') {
        self.getTitleList();
      }
    });


  }
  select(val) {
    console.log(val);
    if (val) {
      if (val === 'All') {
        this.rncpTitles = this.RNCPSearchItem;
        this.textSearch = '';
        this.doButtonReset();
      } else {
        const dataList = _.filter(this.RNCPSearchItem, function(d) {
          if (d.certifier && d.certifier.shortName) {
            return d.certifier.shortName === val;
          }
        });
        this.textSearch = '';
        this.rncpTitles = dataList;
      }
    }
  }
}
