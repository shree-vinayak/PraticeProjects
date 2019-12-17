import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Category } from '../../models/category.model';
import { AcademicKitService } from '../../services/academic-kit.service';
import { TranslateService } from 'ng2-translate';
import { RNCPTitlesService } from '../../services/rncp-titles.service';

declare var swal: any;

@Component({
  selector: 'app-add-category-dialog',
  templateUrl: './add-category-dialog.component.html',
  styleUrls: ['./add-category-dialog.component.scss']
})
export class AddCategoryDialogComponent implements OnInit {
  form: FormGroup;
  public modify: boolean;
  public category: Category;
  public parentCategory: string;
  rncpTitleID: string;
  constructor(private dialogRef: MdDialogRef<AddCategoryDialogComponent>,
    private acadService: AcademicKitService,
    private appService: RNCPTitlesService,
    private translate: TranslateService) {
  }

  ngOnInit() {
    this.appService.getSelectedRncpTitle().subscribe(title => {
      this.rncpTitleID = title._id;
    });
    this.form = new FormGroup({
      title: new FormControl(this.modify ? this.category.title : '', Validators.required),
      description: new FormControl(this.modify ? this.category.description : ''),
      date: new FormControl(Date.now())
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  continue() {
    if (this.form.valid) {
      if (this.modify) {
        let cat: Category = Object.assign({}, this.category);
        cat.description = this.form.value.description;
        cat.title = this.form.value.title;
        console.log(cat);
        this.dialogRef.close(cat);
      } else {
        let newCat = new Category(this.form.value.title, null, this.rncpTitleID, this.form.value.description);
        this.dialogRef.close(newCat);
      }
    }
  }
  onBlurMethod(event,name) {
    this.form.controls[name].setValue(event.target.value.trim());

  }
}
