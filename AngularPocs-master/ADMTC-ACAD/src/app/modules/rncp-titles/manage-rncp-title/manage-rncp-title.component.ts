import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RNCPTitlesService } from '../../../services/rncp-titles.service';
import { Sort } from '../../../models/sort.model';
import { Page } from '../../../models/page.model';

@Component({
  selector: 'app-manage-rncp-title',
  templateUrl: './manage-rncp-title.component.html',
  styleUrls: ['./manage-rncp-title.component.scss']
})
export class ManageRncpTitleComponent implements OnInit {

  rncpTitle: any;

  page = new Page();
  sort = new Sort();
  reorderable = true;
  isSelected = false;
  orientation = 'landscape';
  ngxDtCssClasses = {
    sortAscending: 'fa fa-caret-up',
    sortDescending: 'fa fa-caret-down',
    pagerLeftArrow: 'icon-left',
    pagerRightArrow: 'icon-right',
    pagerPrevious: 'icon-prev',
    pagerNext: 'icon-skip'
  };

  constructor(private location: Location, private titleService: RNCPTitlesService) {
    this.page.pageNumber = 0;
    this.page.size = 10;
    this.page.totalElements = 100;
    this.page.totalPages = 10;
    this.sort.sortby = '';
    this.sort.sortmode = 'asc';
  }

  ngOnInit() {
    this.titleService.getSelectedRncpTitle().subscribe(title => {
      // console.log('RNCP Title : ', title);
      this.rncpTitle = title;
    });
  }


  goBack() {
    this.location.back();
  }

}
