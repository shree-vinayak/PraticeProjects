import { Component, OnInit, ViewChild } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { SearchService } from '../../services/search.service';
import { AcademicKitService } from '../../services/academic-kit.service';
import { RNCPTitlesService } from '../../services/rncp-titles.service';

@Component({
  selector: 'app-duplicate-test-dialog',
  templateUrl: './duplicate-test-dialog.component.html',
  styleUrls: ['./duplicate-test-dialog.component.scss']
})
export class DuplicateTestDialogComponent implements OnInit {

  searchResults: any[];
  showHint = true;
  searching: boolean;
  titleID: string;
  @ViewChild('searchInput') searchInput: HTMLInputElement;

  constructor(private dialogRef: MdDialogRef<DuplicateTestDialogComponent>,
    private searchService: SearchService,
    private acadService: AcademicKitService,
    private appService: RNCPTitlesService) {
  }

  ngOnInit() {
    this.appService.getSelectedRncpTitle().subscribe((title) => {
      this.titleID = title ? title._id : '';
    });
  }

  refreshSearch(keyword: string) {
    if (keyword.trim().length >= 2) {
      this.showHint = false;
      this.searching = true;
      this.searchService.searchTests(keyword).subscribe(results => {
        this.searchResults = results;
        this.searching = false;
      });
    } else {
      this.showHint = true;
      this.searching = false;
    }
  }

  duplicateTest(result: any) {
    console.log(result.test.id);
    console.log(result);
    this.acadService.getTest(result.test.id).subscribe(test => {
      console.log('Duplicate:', test);
      delete test['_id'];
      // test._id = null;
      this.dialogRef.close(test);
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
