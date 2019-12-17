import { Test } from '../../../../models/test.model';
import { TestService } from '../../../../services/test.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { Router } from '@angular/router';
import { IdeasCategory } from '../../../../models/Ideas_category.model'
import { SettingService } from '../../../../services/settings.service'
import { UserService } from '../../../../services/users.service';
import { TranslateService } from 'ng2-translate';
declare var swal: any;

@Component({
    selector: 'app-IdeaCategories',
    templateUrl: './1001IdeaCategories.component.html'
})
export class IdeaCategories implements OnInit {
    form: FormGroup;
    ideasCategoryList: IdeasCategory[];
    ideasCategory: IdeasCategory;

    constructor(private service: UserService, private router: Router,private translate: TranslateService, private settingService: SettingService) {
        this.form = new FormGroup({
            categoryName: new FormControl('', Validators.required)
        })
    }

    ngOnInit() {

    }



    addIdeasCategory() {
        if (this.form.valid) {
            this.ideasCategory = new IdeasCategory();
            Object.assign(this.ideasCategory, this.form.value)
            this.settingService.addIdeaCategory(this.ideasCategory);
            swal({
                title: 'Success',
                text: this.translate.instant('SETTINGS.MESSAGE.SUCCESSIDEACATEGORY'),
                type: 'success',
                allowEscapeKey: true,
                confirmButtonText: 'OK'
            }).then(function () {
                //let categoryname = this.form.get("categoryName");
                //categoryname.setValue("");
                this.getIdeaCategory();
            }.bind(this));
        }
    }

    getIdeaCategory() {
        this.settingService.getIdeaCategory().subscribe((response) => {
            console.log("Response");
            this.ideasCategoryList = response;
            console.log(this.ideasCategoryList);
        });
    }

    deleteIdeaCategory(id) {
        return this.settingService.deleteIdeaCategory(id).subscribe(response => {
            console.log(response);
        });
    }

}
