
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MdDialogRef} from '@angular/material';
import { UserService } from '../../services/users.service';
import { AcademicKitService } from '../../services/academic-kit.service';
import _ from 'lodash';

@Component({
  selector: 'app-acadkit-create-helper',
  templateUrl: './acadkit-create-helper.component.html',
  styleUrls: ['./acadkit-create-helper.component.scss'],
  encapsulation: ViewEncapsulation.None,
  inputs: ['activeColor', 'baseColor', 'overlayColor']
})
export class acadkitCreateHelperComponent implements OnInit {

  RNCPTitles: any = [];

  rncpTitle;
  showRNCPList = false;

  rncpCloneObject: any = null;

  constructor(
    private service: UserService,
    public dialogRef: MdDialogRef<acadkitCreateHelperComponent>,
    private acadService: AcademicKitService,
  ) {

  }

  ngOnInit(): void {
    this.service.getAllRNCPTitlesShortName().subscribe((response) => {
      this.RNCPTitles = response.data;
      this.RNCPTitles = this.RNCPTitles.filter(rncp => rncp._id !== this.rncpTitle._id);
      this.RNCPTitles = [..._.orderBy(this.RNCPTitles, ['shortName'], ['asc'])];
    });
  }

  onClick(e) {
    this.RNCPTitles.pop(e.value);
  }

  changeRNCPTitles(element) {
    if (element.value) {
      this.rncpCloneObject = {
        to : this.rncpTitle._id,
        from : element.value
      };
    }
  }

  duplicateFromRNCP() {
    if ( this.rncpCloneObject.from ) {
      this.acadService.clonekit(this.rncpCloneObject).subscribe(c => {
        this.dialogRef.close({ success: true, data: c });
      });
    }
  }

  CreateDuplicate() {
    this.showRNCPList = true;

  }
  CreateBasic() {
    this.showRNCPList = false;
    const data = {
      id: this.rncpTitle._id
    };
    this.acadService.addBasicKit(data).subscribe(c => {
      this.dialogRef.close({ success: true, data: c });
    });
  }
  closeDialog() {
    this.dialogRef.close({ success: false, data: [] });
  }

  onClicked() {
  }

}
