import { TranslateService } from 'ng2-translate';
import { LoginService } from 'app/services/login.service';
import { ConfigService } from './../../../../services/config.service';
import { Component, OnInit, Input } from '@angular/core';
import { Page } from 'app/models/page.model';
import { Sort } from 'app/models/sort.model';
import { InternalNotesService } from './internal-notes.service';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import * as _ from 'lodash';
import { Log } from 'ng2-logger';
import { MdDialogRef, MdDialogConfig, MdDialog } from '@angular/material';
import { Router } from '@angular/router';
import { AddAdditionalNoteDialogComponent } from './add-additional-note-dialog/add-additional-note-dialog.component';
import { UtilityService } from 'app/services';
import { AddInternalNoteDialogComponent } from './add-internal-note-dialog/add-internal-note-dialog.component';
import swal from 'sweetalert2';
import { ComposeInternalNoteEmailDialogComponent } from './compose-internal-note-email-dialog/compose-internal-note-email-dialog.component';
const log = Log.create('InternalNotesComponent');

@Component({
  selector: 'app-internal-notes',
  templateUrl: './internal-notes.component.html',
  styleUrls: ['./internal-notes.component.scss'],
  providers: [InternalNotesService, DatePipe],

})
export class InternalNotesComponent implements OnInit {
  reorderable = true;

  notesList: any[];
  allNotesList: any[];
  page = new Page();
  sort = new Sort();

  ngxDtCssClasses = {
    sortAscending: 'fa fa-caret-up',
    sortDescending: 'fa fa-caret-down',
    pagerLeftArrow: 'icon-left',
    pagerRightArrow: 'icon-right',
    pagerPrevious: 'icon-prev',
    pagerNext: 'icon-skip',
  };

  selectedNote = [];
  allNotesSelected: boolean = false;


  display_INTERNAL_NOTES: false;
  selected = [];
  selectedNoteDetails = null;

  addAdditionalNoteDialog: MdDialogRef<AddAdditionalNoteDialogComponent>;
  addAddInternalNoteDialog: MdDialogRef<AddInternalNoteDialogComponent>;
  composeMail: MdDialogRef<ComposeInternalNoteEmailDialogComponent>;
  configAddAdditionalNoteDialog: MdDialogConfig = {
    disableClose: false,
    width: '600px',
    backdropClass: 'urgentMsg-backdrop'
  };
  configAddInternalNoteDialog: MdDialogConfig = {
    disableClose: false,
    width: '600px',
    backdropClass: 'urgentMsg-backdrop'
  };
  sendMailBox: MdDialogConfig = {
    disableClose: false,
    width: '1000px',
    height: '80%'
  };

  constructor(private internalNotesService: InternalNotesService,
    public loginService: LoginService,
    public utilityService: UtilityService,
    public translate: TranslateService,
    public dialog: MdDialog,
    private router: Router) {
  }

  ngOnInit() {
    this.page.pageNumber = 0;
    this.page.size = 20;
    this.page.totalElements = 0;
    this.sort.sortby = 'createdAt';
    this.sort.sortmode = 'desc';
    this.getAllInternalNotes();
    // this.updateUnreadCount();
    const mailCounter = Observable.interval(300000);
  }

  sortPage(sortInfo): void {
    this.sort.sortby = sortInfo.column.name;
    this.sort.sortmode = sortInfo.newValue;
    this.page.pageNumber = 0;
    this.getAllInternalNotes();
  }

  changePage(pageInfo): void {
    if (this.page.pageNumber !== pageInfo.offset) {
      this.page.pageNumber = pageInfo.offset;
      this.getAllInternalNotes();
    }
  }

  onSort(event, data) {

    const prop = event.column.prop;
    const dir = event.newValue;
    const rows = [..._.orderBy([...this.allNotesList], [prop], [dir])];

    this.allNotesList = [...rows];
  }
  onSelect(selectedNote) {
    this.handleNoteSelection(selectedNote);
  }
  handleNoteSelection(id) {
    log.data('handleNoteSelection row', id);
    this.internalNotesService.getInternalNoteDetail(id).subscribe(noteDetail => {
      log.data('internalNotesService.getInternalNoteDetail', noteDetail);
      this.selectedNoteDetails = noteDetail.data;
      console.log('selectedNoteDetails', this.selectedNoteDetails);

    });
  }

  getAllInternalNotes() {
    // New Things
    // All Records Fetched in One call hence Page no. should be 1 by default
    const noOfRecords = 0;

    this.internalNotesService.getAllNotes().subscribe(response => {
      this.allNotesList = null;
      this.allNotesList = response.data;
      console.log('allNotesList', this.allNotesList);

      this.page.totalElements = response.total;
    });

  }
  goToAddAdditionlNote(row) {
    this.addAdditionalNoteDialog = this.dialog.open(AddAdditionalNoteDialogComponent, this.configAddAdditionalNoteDialog);
    this.addAdditionalNoteDialog.componentInstance.selectedInternalNote = row._id;
    this.addAdditionalNoteDialog.afterClosed().subscribe(result => {
      log.data('result', result);
      if (result) {
        this.getAllInternalNotes();
      }
    });
  }
  goToaddInternalNote() {
    this.addAddInternalNoteDialog = this.dialog.open(AddInternalNoteDialogComponent, this.configAddInternalNoteDialog);
    this.addAddInternalNoteDialog.afterClosed().subscribe(result => {
      log.data('result', result);
      if (result) {
        this.getAllInternalNotes();
      }
    });
  }
  goToUpdateInternalNote(row) {
    this.addAddInternalNoteDialog = this.dialog.open(AddInternalNoteDialogComponent, this.configAddInternalNoteDialog);
    this.addAddInternalNoteDialog.componentInstance.selectedInternalNoteEdit = row;
    this.addAddInternalNoteDialog.componentInstance.isNoteEdit = true;
    this.addAddInternalNoteDialog.afterClosed().subscribe(result => {
      log.data('result', result);
      if (result) {
        this.getAllInternalNotes();
      }
    });
  }
  forwardInternalNote(row) {
    console.log(row);
    this.composeMail = this.dialog.open(ComposeInternalNoteEmailDialogComponent, this.sendMailBox);
    this.composeMail.componentInstance.composeInternalNoteMail = row;
    this.composeMail.afterClosed().subscribe(result => {
      this.composeMail = null;
    });
  }

  deleteInternalNote(data) {

    const self = this;
    swal({
      title: this.translate.instant('INTERNAL_NOTE.NOTE_S2.Title'),
      text: this.translate.instant('INTERNAL_NOTE.NOTE_S2.Text'),
      type: 'warning',
      allowEscapeKey: true,
      showCancelButton: true,
      cancelButtonText: this.translate.instant('INTERNAL_NOTE.NOTE_S2.NO'),
      confirmButtonText: this.translate.instant('INTERNAL_NOTE.NOTE_S2.OK'),
    }).then(() => {
      if (data._id) {
        self.internalNotesService.deleteInternalNote(data._id).subscribe((note) => {
          // swal('Success', self.translate.instant('INTERNAL_NOTE.NOTE_S3.Title'), 'success').then(() => {
          //   self.getAllInternalNotes();
          // });
          // return;
          swal({
            title: 'Success',
            text: this.translate.instant('INTERNAL_NOTE.NOTE_S3.Title'),
            allowEscapeKey: true,
            type: 'success',
            confirmButtonText: this.translate.instant('INTERNAL_NOTE.NOTE_S3.Ok'),
          }).then(function () {
            self.getAllInternalNotes();
          });
        });
      }

    }, function (dismiss) {
      if (dismiss === 'cancel') {
      }
    });
  }
}
