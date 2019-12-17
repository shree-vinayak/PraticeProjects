import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MdDialogRef } from '@angular/material';
import { TranslateService } from 'ng2-translate';
import { UserService } from '../../../services/users.service';
import { TutorialsService } from '../tutorials.service';
declare var swal: any;
import _ from 'lodash';

// required for logging
import { Log } from 'ng2-logger';
const log = Log.create('TutorialsListComponent');
log.color = 'green';

@Component({
  selector: 'app-add-tutorial-dialog',
  templateUrl: './add-tutorial-dialog.component.html',
  styleUrls: ['./add-tutorial-dialog.component.scss']
})
export class AddTutorialDialogComponent implements OnInit {

  tutorialForm: FormGroup;
  selectedUsertype: any = [];
  allUserTypes: any = [];
  userTypes: any = [];
  selectedTutorial:any = null;

  constructor(private _formBuilder: FormBuilder,
    public dialogRef: MdDialogRef<AddTutorialDialogComponent>,
    private translate: TranslateService,
    private userService: UserService,
    private tutorialsService: TutorialsService) {
  }

  ngOnInit() {
    this.initializeForm();
    this.getUserTypesNTranslate();
  }

  initializeForm() {
    this.tutorialForm = this._formBuilder.group({
      title: [this.selectedTutorial ? this.selectedTutorial.title : null, Validators.required],
      description: [this.selectedTutorial ? this.selectedTutorial.description : null, Validators.required],
      userType: [null, Validators.required],
      link: [this.selectedTutorial ? this.selectedTutorial.link : null, Validators.required],
      message: [this.selectedTutorial ? this.selectedTutorial.message : this.translate.instant('TUTORIAL_MENU.MESSAGE_TEMPLATE')]
    });
  }

  getUserTypesNTranslate() {
    this.userService.getUserTypesByIsUserCollection().subscribe(response => {
      this.allUserTypes = response;
      this.userTypes = [];

      this.allUserTypes.forEach(item => {
        const typeEntity =
          this.getTranslateADMTCSTAFFKEY(item.name) +
          ' / ' +
          this.getTranslateENTITY(item.entity);
        this.userTypes.push({ id: item._id, text: typeEntity });
      });
      this.userTypes = [..._.orderBy(this.userTypes, ['text'], ['asc'])];
      if (this.selectedTutorial && this.selectedTutorial.userType) {
        this.setUserTypeOnEdit();
      }
    });
  }

  setUserTypeOnEdit() {
    const assignedCorrectors = _.intersectionWith(this.userTypes, this.selectedTutorial.userType, (userType, selectUserType) => {
      return (userType.id === selectUserType._id);
    });
    this.tutorialForm.get('userType').setValue(assignedCorrectors);
  }

  getTranslateADMTCSTAFFKEY(name) {
    const value = this.translate.instant('ADMTCSTAFFKEY.' + name.toUpperCase());
    return value !== 'ADMTCSTAFFKEY.' + name.toUpperCase() ? value : name;
  }

  getTranslateENTITY(name) {
    const value = this.translate.instant('SETTINGS.USERTYPES.ENTITYNAME.' + name.toUpperCase());
    return value !== 'SETTINGS.USERTYPES.ENTITYNAME.' + name.toUpperCase() ? value : name;
  }

  submit() {
    log.data('submit this.tutorialForm.value', this.tutorialForm.value);
    const formValue = this.tutorialForm.value;
    formValue.userType = [...formValue.userType.map((type) => type.id )];
    log.data('submit formValue', formValue);
    if (this.selectedTutorial && this.selectedTutorial._id) {
      this.ediTutorial(formValue);
    } else {
      this.addNewTutorial(formValue);
    }
  }

  addNewTutorial(payload) {
    this.tutorialsService.addnewTutorial(payload).subscribe(
      (respone) => {
        log.data('addNewTutorial this.tutorialForm.addnewTutorial', respone);
        if (respone.data && respone.data._id) {
          this.newSaveSuccess();
          this.closeDialog(respone.data);
        }
      }
    )
  }

  newSaveSuccess() {
    swal({
      title: 'Bravo!',
      html: this.translate.instant('TUTORIAL_MENU.TUTO_S1.TEXT'),
      type: 'success',
      allowEscapeKey: true,
      confirmButtonText: 'OK'
    });
  }

  editSaveSuccess(tutorialName) {
    swal({
      title: 'Bravo!',
      html: this.translate.instant('TUTORIAL_MENU.TUTO_S2.TEXT', {
        tutorialName: tutorialName
      }),
      type: 'success',
      allowEscapeKey: true,
      confirmButtonText: 'OK'
    });
  }

  closeDialog(state: any = false) {
    this.dialogRef.close(state);
  }

  getTutotialTitleTranslated(title) {
    const value = this.translate.instant('TUTORIALS_List.' + title.toUpperCase());
    return value !== 'TUTORIALS_List.' + title.toUpperCase() ? value : title;
  }

  ediTutorial(payload) {
    this.tutorialsService.ediTutorial(this.selectedTutorial._id, payload).subscribe(
      (respone) => {
        log.data('addNewTutorial this.tutorialForm.ediTutorial', respone);
        if (respone.data && respone.data._id) {
          this.editSaveSuccess(payload.title);
          this.closeDialog(respone.data);
        }
      }
    )
  }
}
