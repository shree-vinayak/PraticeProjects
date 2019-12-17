import { UtilityService } from './../../services/utility.service';
import { Component, OnInit, Inject } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { MdDialogRef, MD_DIALOG_DATA,MdSnackBar } from '@angular/material';
import { Idea } from '../../models/idea.model';
import { IdeasSuggestionService } from '../../services/ideas-suggestion.service';

declare var swal: any;

@Component({
  selector: 'app-add-academic-suggestion-dialog',
  templateUrl: './add-academic-suggestion-dialog.component.html',
  styleUrls: ['./add-academic-suggestion-dialog.component.scss']
})

export class AddAcademicSuggestionDialogComponent implements OnInit {

  public form: FormGroup;
  public modify: boolean;
  public suggestionObj: Idea;
  submitdisabled: boolean = false;
 
  suggestions = [{ value: 'SUGGESTION.IDEAS_CATEGORIES.ONE', viewValue: 'SUGGESTION.IDEAS_CATEGORIES.ONE' },
    { value: 'SUGGESTION.IDEAS_CATEGORIES.TWO', viewValue: 'SUGGESTION.IDEAS_CATEGORIES.TWO' },
    { value: 'SUGGESTION.IDEAS_CATEGORIES.THREE', viewValue: 'SUGGESTION.IDEAS_CATEGORIES.THREE' },
    { value: 'SUGGESTION.IDEAS_CATEGORIES.FOUR', viewValue: 'SUGGESTION.IDEAS_CATEGORIES.FOUR' },
    { value: 'SUGGESTION.IDEAS_CATEGORIES.FIVE', viewValue: 'SUGGESTION.IDEAS_CATEGORIES.FIVE' },
    { value: 'SUGGESTION.IDEAS_CATEGORIES.SIX', viewValue: 'SUGGESTION.IDEAS_CATEGORIES.SIX' }
  ];

  constructor(
    private dialogRef: MdDialogRef < AddAcademicSuggestionDialogComponent > ,
    @Inject(MD_DIALOG_DATA) public data: any,
    private translate: TranslateService,
    private ideaSubmitService: IdeasSuggestionService,
    private snackBar: MdSnackBar,
    private utilityService: UtilityService) {}

  ngOnInit() {
    console.log('MD_DIALOG_DATA', this.data);
    // if(this.data.category === '' || this.data.suggestion === ''){
    //   this.submitdisabled = false;
    // }
    this.modify = this.data && this.data.idea ? true : false;
    if(this.data && this.data.idea) {
      this.suggestionObj = new Idea(
        this.data.category, 
        this.data.idea.suggestion
      );
      this.suggestionObj._id = this.data.idea._id;
    }
    this.form = new FormGroup({
      suggestionTitle: new FormControl(this.modify ? this.data.category : '', [Validators.required, this.utilityService.noWhitespaceValidator]),
      suggestionDescription: new FormControl(this.modify ? this.data.idea.suggestion: '', [Validators.required, this.utilityService.noWhitespaceValidator]),
      date: new FormControl(Date.now()),
    });
  }

  continue () {
      if (this.form.valid) {
        if (this.modify) {
          let idea: Idea = Object.assign({}, this.suggestionObj);
          idea.suggestion = this.form.value.suggestionDescription;
          idea.category = this.form.value.suggestionTitle;
          let currrentUser = JSON.parse(localStorage.getItem('loginuser'));
          if(currrentUser.entity.type === 'academic'){
            idea.school = currrentUser.entity.school._id
          }else{
            idea.school = null;
          }
          idea.user = currrentUser._id;
          this.ideaSubmitService.editIdeas(idea).subscribe(res => {
            swal({
              title: this.translate.instant('SUGGESTION.SUCCESS'),
              html:  this.translate.instant('SUGGESTION.SWEET_ALERT'),
              allowEscapeKey:true,
              type: 'success',
              confirmButtonText: this.translate.instant('SUGGESTION.OK')
            });
            this.dialogRef.close(idea);
          });
        } else {
          let newIdea = new Idea(this.form.value.suggestionTitle, this.form.value.suggestionDescription);
           let currrentUser = JSON.parse(localStorage.getItem('loginuser'));
          if(currrentUser.entity.type === 'academic'){
            newIdea.school = currrentUser.entity.school._id
          }else{
            newIdea.school = null;
          }
          newIdea.user = currrentUser._id;
          
          this.ideaSubmitService.addIdeas(newIdea).subscribe(res => {
            swal({
              title: this.translate.instant('SUGGESTION.SUCCESS'),
              html:  this.translate.instant('SUGGESTION.SWEET_ALERT'),
              allowEscapeKey:true,
              type: 'success',
              confirmButtonText: this.translate.instant('SUGGESTION.OK')
            });
            this.dialogRef.close(newIdea);
          });
        }
      }
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
