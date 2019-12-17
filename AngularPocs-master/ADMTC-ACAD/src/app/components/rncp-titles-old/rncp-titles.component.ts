import { Component, OnInit } from '@angular/core';
import { RNCPTitlesService } from '../../services/rncp-titles.service';
import { Router } from '@angular/router';
import { Page } from '../../models/page.model';
import { Sort } from '../../models/sort.model';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'app-rncp-titles',
  templateUrl: './rncp-titles.component.html',
  styleUrls: ['./rncp-titles.component.scss']
})
export class RncpTitlesOldComponent implements OnInit {

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

  constructor(private service: RNCPTitlesService,
              private router: Router,
              private translate: TranslateService) {
    this.page.pageNumber = 0;
    this.page.size = 10;
    this.page.totalElements = 100;
    this.page.totalPages = 10;
    this.sort.sortby = '';
    this.sort.sortmode = 'asc';
  }

  ngOnInit() {
    this.service.resetState();
    this.getTitleList();
    // this.automate();
  }

  automate() {
    const demoId = '1';
    this.service.selectRncpTitle(demoId).subscribe(title => {
      this.router.navigate(['dashboard']);
    });
  }

  getTranslated(text: string){
    return this.translate.instant(text);
  }

  goToRncpTitle(id: any): void {
    this.service.selectRncpTitle(id).subscribe(() => {
      this.router.navigate(['dashboard']);
    });

  }

  getTitleList(): void {
    this.service.getRNCPTitles(this.page, this.sort).subscribe((titles) => {
      this.rncpTitles = titles.titles;
      this.page.totalElements = titles.total;
    });
  }


  changePage(pageInfo): void {
    this.page.pageNumber = pageInfo.offset;
    this.getTitleList();
  }

  sortPage(sortInfo): void {
    this.sort.sortby = sortInfo.column.prop;
    this.sort.sortmode = sortInfo.newValue;
    console.log("Sort :" ,this.sort);
    this.page.pageNumber = 0;
    this.getTitleList();
  }

}
