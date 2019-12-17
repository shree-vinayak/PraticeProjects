import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/users.service';
import { FormControl, FormGroup, FormArray, Validators, FormBuilder } from '@angular/forms';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';
import { IdeasCategory } from '../../models/Ideas_category.model'
import { SchoolBoard } from '../../models/schoolboard_result.model'
import { StudentStatusModel } from '../../models/studentStatus.model'
import { TranslateService } from 'ng2-translate';
import { Page } from '../../models/page.model';
import { Sort } from '../../models/sort.model';
import { SettingService } from '../../services/settings.service'
import { Observable } from 'rxjs/Observable';

declare var swal: any;

@Component({
    selector: 'app-settings',
    templateUrl: './settings-component.html',
    styleUrls: ['./settings-component.scss']
})
export class SettingComponent implements OnInit {
    form: FormGroup;
    activatedTag = '';
    tabflage = 1;
    ideasCategoryList: IdeasCategory[];
    ideasCategory: IdeasCategory;
    schoolBoardCategoryList: SchoolBoard[];
    schoolBoard: SchoolBoard;
    studentStatusList: StudentStatusModel[];
    studentStatus: StudentStatusModel;
    currencyList: any[] = [
        { value: 'EUR', view: 'EUR' },
        { value: 'USD', view: 'USD' },
    ];

    countryList: any[] = [

        { id: '1', countryName: 'France' },
        { id: '2', countryName: 'Afghanistan' },
        { id: '3', countryName: 'South Africa' },
        { id: '4', countryName: 'Albanie' },
        { id: '5', countryName: 'Algeria' },
        { id: '6', countryName: 'Germany' },
        { id: '7', countryName: 'Angola' },
        { id: '8', countryName: 'Anguilla' },
        { id: '9', countryName: 'Antarctique' },
        { id: '10', countryName: 'Antigua and Barbuda' },
        { id: '11', countryName: 'Netherlands Antilles' },
        { id: '12', countryName: 'Saudi Arabia' },
        { id: '13', countryName: 'Argentina' },
        { id: '14', countryName: 'Armenia' },
        { id: '15', countryName: 'Aruba' },
        { id: '16', countryName: 'Australia' },
        { id: '17', countryName: 'Austria' },
        { id: '18', countryName: 'Azerbaijan' },
        { id: '19', countryName: 'bahamas' },
        { id: '20', countryName: 'Bahrain' },
        { id: '21', countryName: 'Bangladesh' },
        { id: '22', countryName: 'Barbados' },
        { id: '23', countryName: 'Belarus' },
        { id: '24', countryName: 'Belgium ' },
        { id: '25', countryName: 'Belize' },
        { id: '26', countryName: 'Benin' },
        { id: '27', countryName: 'Bermuda' },
        { id: '28', countryName: 'Bhutan' },
        { id: '29', countryName: 'Bolivia ' },
        { id: '30', countryName: 'Bosnia and Herzegovina' },
        { id: '31', countryName: 'Botswana' },
        { id: '32', countryName: 'Brazil' },
        { id: '33', countryName: 'Brunei Darussalam ' },
        { id: '34', countryName: 'Bulgaria' },
        { id: '35', countryName: 'Burkina Faso' },
        { id: '36', countryName: 'Cambodia ' },
        { id: '37', countryName: 'Cape Verde  ' },
        { id: '38', countryName: 'Chile' },
        { id: '39', countryName: 'China ' },
        { id: '40', countryName: 'Cyprus ' },
        { id: '41', countryName: 'Colombia' },
        { id: '42', countryName: 'Costa Rica' },
        { id: '43', countryName: 'Ivory Coast' },
        { id: '44', countryName: 'Croatia' },
        { id: '45', countryName: 'Cuba' },
        { id: '46', countryName: 'Denmark ' },
        { id: '47', countryName: 'Djibouti ' },
        { id: '48', countryName: 'Dominique' },
        { id: '49', countryName: 'Egypt' },
        { id: '50', countryName: 'El Salvador' },
        { id: '51', countryName: 'United Arab Emirates' },
        { id: '52', countryName: 'Ecuador ' },
        { id: '53', countryName: 'Eritrea ' },
        { id: '54', countryName: 'Spain' },
        { id: '55', countryName: 'Estonia ' },
        { id: '56', countryName: 'Federated States of Micronesia' },
        { id: '57', countryName: 'United States ' },
        { id: '58', countryName: 'Ethiopia' },
        { id: '59', countryName: 'Russian Federation ' },
        { id: '60', countryName: 'Fiji' },
        { id: '61', countryName: 'Finland ' },
        { id: '62', countryName: 'Gabon' },
        { id: '63', countryName: 'Gambia' },
        { id: '64', countryName: 'Georgia' },
        { id: '65', countryName: 'Ghana' },
        { id: '66', countryName: 'Gibraltar' },
        { id: '67', countryName: 'Greece' },
        { id: '68', countryName: 'Granada' },
        { id: '69', countryName: 'Greenland' },
        { id: '70', countryName: 'Guadeloupe' },
        { id: '71', countryName: 'Guam ' },
        { id: '72', countryName: 'Guatemala ' },
        { id: '73', countryName: 'Guinea ' },
        { id: '74', countryName: 'Guinea-Bissau' },
        { id: '75', countryName: 'Equatorial Guinea' },
        { id: '76', countryName: 'Guyana' },
        { id: '77', countryName: 'French Guiana' },
        { id: '78', countryName: 'Haiti' },
        { id: '79', countryName: 'Honduras' },
        { id: '80', countryName: 'Hong Kong' },
        { id: '81', countryName: 'France' },
        { id: '82', countryName: 'Hungary' },
        { id: '83', countryName: 'Bouvet Island ' },
        { id: '84', countryName: 'Christmas Island' },
        { id: '85', countryName: 'Isle of Man' },
        { id: '86', countryName: 'Norfolk Island' },
        { id: '87', countryName: 'Islands (malvinas) Falkland' },
        { id: '88', countryName: '�land Islands' },
        { id: '89', countryName: 'Cocos (Keeling) Islands ' },
        { id: '90', countryName: 'Cook Islands' },
        { id: '91', countryName: 'Faroe Islands' },
        { id: '92', countryName: 'Solomon Islands' },
        { id: '93', countryName: 'Turks and Caicos Islands' },
        { id: '94', countryName: 'British Virgin Islands' },
        { id: '95', countryName: 'United States Virgin Islands' },
        { id: '96', countryName: 'India' },
        { id: '97', countryName: 'Indonesia ' },
        { id: '98', countryName: 'Iraq ' },
        { id: '99', countryName: 'Ireland' },
        { id: '100', countryName: 'Iceland' },
        { id: '101', countryName: 'Israel' },
        { id: '102', countryName: 'Italy' },
        { id: '103', countryName: 'Libyan Arab Jamahiriya' },
        { id: '104', countryName: 'Jamaica' },
        { id: '105', countryName: 'Japan' },
        { id: '106', countryName: 'Jordan' },
        { id: '107', countryName: 'Kazakhstan' },
        { id: '108', countryName: 'Kenya' },
        { id: '109', countryName: 'Kyrgyzstan' },
        { id: '110', countryName: 'Kiribati' },
        { id: '111', countryName: 'Kuwait ' },
        { id: '112', countryName: 'Lesotho' },
        { id: '113', countryName: 'Latvia' },
        { id: '114', countryName: 'Lebanon' },
        { id: '115', countryName: 'Liberia' },
        { id: '116', countryName: 'Liechtenstein' },
        { id: '117', countryName: 'Lithuania' },
        { id: '118', countryName: 'Luxembourg' },
        { id: '119', countryName: 'Macau' },
        { id: '120', countryName: 'Macau' },
        { id: '121', countryName: 'Malaysia' },
        { id: '122', countryName: 'Malawi' },
        { id: '123', countryName: 'Maldives' },
        { id: '124', countryName: 'Mali' },
        { id: '125', countryName: 'Malta' },
        { id: '126', countryName: 'Morocco' },
        { id: '127', countryName: 'Martinique' },
        { id: '128', countryName: 'Mauritius' },
        { id: '129', countryName: 'Mauritania' },
        { id: '130', countryName: 'Mayotte' },
        { id: '131', countryName: 'Mexico' },
        { id: '132', countryName: 'Monaco' },
        { id: '133', countryName: 'Mongolia' },
        { id: '134', countryName: 'Montserrat' },
        { id: '135', countryName: 'Mozambique' },
        { id: '136', countryName: 'Myanmar' },
        { id: '137', countryName: 'Namibia' },
        { id: '138', countryName: 'Nauru' },
        { id: '139', countryName: 'Nepal' },
        { id: '140', countryName: 'Nicaragua' },
        { id: '141', countryName: 'Niger' },
        { id: '142', countryName: 'Nigeria' },
        { id: '143', countryName: 'Niue' },
        { id: '144', countryName: 'Norway' },
        { id: '145', countryName: 'New Caledonia' },
        { id: '146', countryName: 'New Zealand' },
        { id: '147', countryName: 'Oman' },
        { id: '148', countryName: 'Uganda' },
        { id: '149', countryName: 'Uzbekistan' },
        { id: '150', countryName: 'Pakistan ' },
        { id: '151', countryName: 'Palau' },
        { id: '152', countryName: 'Panama' },
        { id: '153', countryName: 'Papua New Guinea' },
        { id: '154', countryName: 'Netherlands' },
        { id: '155', countryName: 'Peru' },
        { id: '156', countryName: 'Philippines' },
        { id: '157', countryName: 'Pitcairn ' },
        { id: '158', countryName: 'Poland ' },
        { id: '159', countryName: 'French Polynesia' },
        { id: '160', countryName: 'Puerto Rico' },
        { id: '161', countryName: 'Portugal' },
        { id: '162', countryName: 'Qatar' },
        { id: '163', countryName: 'Syrian Arab Republic' },
        { id: '164', countryName: 'Central African Republic' },
        { id: '165', countryName: 'Republic of Korea' },
        { id: '166', countryName: 'Republic of Moldova' },
        { id: '167', countryName: 'Democratic Republic of Congo' },
        { id: '168', countryName: 'Lao Peoples Democratic Republic' },
        { id: '169', countryName: 'Dominican Republic' },
        { id: '170', countryName: 'Islamic Republic of Iran' },
        { id: '171', countryName: 'Democratic Peoples Republic of Korea' },
        { id: '172', countryName: 'Czech Republic' },
        { id: '173', countryName: 'United Republic of Tanzania' },
        { id: '174', countryName: 'Meeting' },
        { id: '175', countryName: 'United Kingdom' },
        { id: '176', countryName: 'Rwanda' },
        { id: '177', countryName: 'Western Sahara' },
        { id: '178', countryName: 'Saint Kitts and Nevis' },
        { id: '179', countryName: 'San Marino' },
        { id: '180', countryName: 'Holy See (state of Vatican City)' },
        { id: '181', countryName: 'Saint Vincent and the Grenadines' },
        { id: '182', countryName: 'Sainte-H�l�ne' },
        { id: '183', countryName: 'Saint Lucia' },
        { id: '184', countryName: 'Samoa' },
        { id: '185', countryName: 'American Samoa' },
        { id: '186', countryName: 'Sao Tome and Principe' },
        { id: '187', countryName: 'Senegal ' },
        { id: '188', countryName: 'Serbia and Montenegro' },
        { id: '189', countryName: 'Seychelles' },
        { id: '190', countryName: 'Sierra Leone' },
        { id: '191', countryName: 'Singapore' },
        { id: '192', countryName: 'Slovakia' },
        { id: '193', countryName: 'Slovenia' },
        { id: '194', countryName: 'Somalia' },
        { id: '195', countryName: 'Sudan' },
        { id: '196', countryName: 'Sri Lanka' },
        { id: '197', countryName: 'Sweden' },
        { id: '198', countryName: 'Suriname' },
        { id: '199', countryName: 'Swaziland' },
        { id: '200', countryName: 'Tajikistan' },
        { id: '201', countryName: 'Taiwan' },
        { id: '202', countryName: 'Chad' },
        { id: '203', countryName: 'Palestinian Territory Occupied' },
        { id: '204', countryName: 'Thailand' },
        { id: '205', countryName: 'Timor-Leste' },
        { id: '206', countryName: 'Togo' },
        { id: '207', countryName: 'Tokelau' },
        { id: '208', countryName: 'Tonga' },
        { id: '209', countryName: 'Trinidad and Tobago' },
        { id: '210', countryName: 'Tunisia' },
        { id: '211', countryName: 'Turkmenistan' },
        { id: '212', countryName: 'Turkey' },
        { id: '213', countryName: 'Tuvalu' },
        { id: '214', countryName: 'Ukraine' },
        { id: '215', countryName: 'Uruguay' },
        { id: '216', countryName: 'Vanuatu' },
        { id: '217', countryName: 'Venezuela' },
        { id: '218', countryName: 'Viet Nam' },
        { id: '219', countryName: 'Wallis and Futuna' },
        { id: '220', countryName: 'Yemen' },
        { id: '221', countryName: 'Zambia ' },
        { id: '222', countryName: 'Zimbabwe' }
    ];
    constructor(private service: UserService,
        private router: Router,
        private dialog: MdDialog,
        private translate: TranslateService,
        private settingService: SettingService) {

    }
    ngOnInit() {
        this.form = new FormGroup({
            categoryName: new FormControl('', Validators.required)
        });

        this.form = new FormGroup({
            schoolBoardCategoryName: new FormControl('', Validators.required)
        });

        this.form = new FormGroup({
            statusName: new FormControl('', Validators.required),
            statusDescription: new FormControl('', Validators.required)
        });
        this.activatedTag = 'scholer-season';
    }

    changeRoute() {
        const name = '/tools/settings/' + this.activatedTag;
        this.router.navigate([name]);
    }

    checkIsActive(name) {
        name = '/tools/settings/' + name;
        if (name === this.router.url) {
            return 'menu-active';
        }
        return '';
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
                allowEscapeKey:true,
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
            console.log('Response');
            this.ideasCategoryList = response;
            console.log(this.ideasCategoryList);
        });
    }

    deleteIdeaCategory(id) {
        return this.settingService.deleteIdeaCategory(id).subscribe(response => {
            console.log(response);
        });
    }


    ChangeTab(tabflage) {
        this.tabflage = tabflage;
        //1.General
        //2.ADMTC Papaer header
        //3.1001 Ideas Categories
        //4.ADMTC Papaer footer
        //5.School brand results
        //6.Invoice
        //7.Student Status
        //8.Contact Details
        //9.CNCP Information
    }


    addSchoolBoardCategory() {
        if (this.form.valid) {
            this.schoolBoard = new SchoolBoard();
            Object.assign(this.schoolBoard, this.form.value)
            this.settingService.addSchoolBoardCategory(this.schoolBoard);
            swal({
                title: 'Success',
                text: this.translate.instant('SETTINGS.MESSAGE.SUCESSSCHOOLBOARD'),
                type: 'success',
                allowEscapeKey:true,
                confirmButtonText: 'OK'
            }).then(function () {
                //let categoryname = this.form.get("categoryName");
                //categoryname.setValue("");
                this.getSchoolBoardCategory();
            }.bind(this));
        }
    }

    getSchoolBoardCategory() {
        this.settingService.getSchoolBoardCategory().subscribe((response) => {
            console.log('Response');
            this.schoolBoardCategoryList = response;
            console.log(this.schoolBoardCategoryList);
        });
    }

    deleteSchoolBoardCategory(id) {
        return this.settingService.deleteSchoolCategory(id).subscribe(response => {
            console.log(response);
        });
    }


    //Student Status
    addStudentStatusCategory() {
        if (this.form.valid) {
            this.studentStatus = new StudentStatusModel();
            Object.assign(this.studentStatus, this.form.value)
            this.settingService.addStudentStatusCategory(this.studentStatus);
            swal({
                title: 'Success',
                text: this.translate.instant('SETTINGS.MESSAGE.STUDENTSTATUS'),
                type: 'success',
                allowEscapeKey:true,
                confirmButtonText: 'OK'
            }).then(function () {
                // let categoryname = this.form.get("categoryName");
                // categoryname.setValue("");
                this.getStudentStatusCategory();
            }.bind(this));
        }
    }

    getStudentStatusCategory() {
        this.settingService.getStudentStatusCategory().subscribe((response) => {
            console.log('Response');
            this.studentStatusList = response;
            console.log(this.studentStatusList);
        });
    }

    deleteStudentStatusCategory(id) {
        return this.settingService.deleteStudentStatusCategory(id).subscribe(response => {
            console.log(response);
        });
    }

}

