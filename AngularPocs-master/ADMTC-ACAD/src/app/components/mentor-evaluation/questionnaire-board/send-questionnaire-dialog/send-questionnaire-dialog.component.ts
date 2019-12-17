import { Component, OnInit } from '@angular/core';
import { TranslateService } from '../../../../../../node_modules/ng2-translate';
import { RNCPTitlesService, UserService, ScholarSeasonService } from '../../../../services';
import { FormBuilder, Validators } from '../../../../../../node_modules/@angular/forms';
import { MdDialog, MdDialogRef } from '../../../../../../node_modules/@angular/material';
import { QuestionnaireService } from '../../questionnaire.service';
import { Page } from '../../../../models/page.model';
import { Sort } from '../../../../models/sort.model';


@Component({
  selector: 'app-send-questionnaire-dialog',
  templateUrl: './send-questionnaire-dialog.component.html',
  styleUrls: ['./send-questionnaire-dialog.component.scss']
})
export class SendQuestionnaireDialogComponent implements OnInit {
  questionnaireList: any = [];
  selectedQuestionnaire: any;
  rncpList: any = [];
  userList: any = [];
  schoolList: any = [];
  scholarSeasonsList: any = [];
  classList: any = [];
  selectedScholarSeason: any;
  selectedRncp: any;
  selectRncpId: any;
  selectedSchool: any;
  selectedSchoolName: any;
  selecetedClass: any;
  selecetedClassName: any;
  selectedUser: any;
  selectedUserName: any;
  validatorTypeId: any;
  selectQuesName: any;
  creatorName: any;
  form: any;
  minDate = new Date(new Date().setDate(new Date().getDate() - 1));
  public dialogref: MdDialogRef<SendQuestionnaireDialogComponent>;
  users:any =[];
  userGroupList:any = [];
  validatorUserType:any = [];
  page = new Page();
  sort = new Sort();
  recipientType= 'user';
  selectedRecipientTypeId: any;
  selectedRecipientTypeName: any;
  selectedScholarSeasonName: any;
  dialogData: any;
  typeOfQuestionnaire: any;
  userEntities = [
    { value: 'academic', view: this.translate.instant('ENTITY.ACADEMIC') },
    { value: 'company', view: this.translate.instant('ENTITY.COMPANY') },
    { value: 'admtc', view: this.translate.instant('ENTITY.ADMTC') },
    { value: 'group-of-schools', view: this.translate.instant('ENTITY.GROUPOFSCHOOLS') }
  ];
  validatorType:boolean = false;
  rejectType = [
    { type: 'Validate' , view: "Validate" },
    { type: 'Validate and Reject', view: "Validate and Reject"}
  ]
  constructor(public translate: TranslateService,
              private rncpService: RNCPTitlesService,
              private fb: FormBuilder, public matDialog: MdDialog,
              private userService: UserService, private sendDialogref: MdDialogRef<SendQuestionnaireDialogComponent>,
              private questionnaireService: QuestionnaireService,
              private scholarSeasonService: ScholarSeasonService) { }

  ngOnInit() {
    this.getQuestionnaireList()
    this.buildForm();
    this.getRNCPlist();
    
  }

  getRNCPlist(){
    this.rncpService.getAllRNCPTitlesShortName().subscribe( res=>{
      this.rncpList = res.data;
    })
  }
  onSelectQues(ques) {
    this.selectedQuestionnaire = ques.questionnaireTemplateId._id;
    this.creatorName = ques.questionnaireTemplate.createdBy;
    this.selectQuesName = ques.questionnaireName;
    this.typeOfQuestionnaire = ques.questionnaireTemplateId.questionnaireType;
  }

  onSelectRncp(title) {
    this.selectedRncp = title.shortName;
    this.selectRncpId = title._id;

    // get schools
    this.rncpService.getSchoolsByRncp(this.selectRncpId)
    .subscribe(res => {
      this.schoolList = res.data;
        });

    // get ScholerSeason
    this.scholarSeasonService.getScholarSeasonByRcnp(this.selectRncpId)
    .subscribe(res => {
      this.scholarSeasonsList = res.data;
    });

    //get Classes
    this.rncpService.getClassesNosort(this.selectRncpId)
    .subscribe( res => {
      this.classList = res.classes;
    });
  }

  onSelectScholarSeason(list) {
    this.selectedScholarSeason = list._id;
    this.selectedScholarSeasonName = list.scholarseason;
  }

  onSelectSchool(school){
    console.log(school)
    this.selectedSchool = school._id;
    this.selectedSchoolName = school.shortName;
    this.getUsers();
  }
  buildForm() {
    this.form = this.fb.group({
      questionaire: ['',Validators.required],
      title: ['', Validators.required],
      scholarseason: ['', Validators.required],
      school: ['', Validators.required],
      class: ['', Validators.required],
      date: ['', Validators.required],
      isUser: [ false, Validators.required],
      userGroup: [''],
      user: ['', Validators.required],
      entity: ['', Validators.required],
      validator_userType: ['', Validators.required],
      validationType: ['', Validators.required]
    });
  }

  toggleUsergroup() {
    if (this.form.value.isUser) {
      this.recipientType = 'user';
     this.getUsers();
    }else {
     this.getUserTypeByEntity('academic', false);
      this.recipientType = 'userType';
    }
  }

  closeDialog(){
    this.sendDialogref.close();
  }

  getUsers() {
    let data ={
      rncpTitle: this.selectRncpId,
      schoolId: this.selectedSchool,
      _data: 'minimal'
    }
    this.userService.getMinimalUserList(data).subscribe(
      res => {
        for (let userdata of res.data) {
          let data = {
            firstName: userdata.firstName,
            lastName: userdata.lastName,
            id: userdata._id
          }
          this.users.push(data);
        }
      });
  }

  onSelectClass(list){
    this.selecetedClass = list._id;
    this.selecetedClassName = list.name;
  }
  onSelectUsers(user) {
    this.selectedUser = user.id;
    this.selectedUserName = user.lastName + ' ' + user.firstName;
  }
  onSelectUsersGroup(group) {
    this.selectedRecipientTypeId = group.id;
    // this.selectedRecipientTypeName = 
  }
  onSelectEntity() {
    this.validatorType = true;
  }
  onValidate(reject) {
    this.form.validationType = reject.type;
  }
 
  getUserTypeByEntity(entity, validator) {
    this.userService.getUserTypesByEntities(entity).subscribe(res => {
      let data = res.data;
      for (let i of data) {
        if(validator) {
          this.validatorUserType.push({name: i.name , id: i._id});
        }else {
          this.userGroupList.push({ name: i.name, id: i._id });
        }
      }
    });
  }

  getQuestionnaireList() {
    this.questionnaireService.getAllQuestionnaireResponse()
    .subscribe( response => {
    this.questionnaireList = response.data;
    });
  }
  onSelectValidatorUsertype(type) {
    this.validatorTypeId = type.id;
  }

  sendQuestionnaire() {
    let recipientObj; 
    if (this.recipientType === 'user') {
      recipientObj = {
        recipientType: 'user',
        userId: this.selectedUser,
      };
    }else {
      recipientObj = {
        recipientType: 'userType',
        userTypeId: this.selectedRecipientTypeId
      };
    }
    // this.closeDialog = {

    // }

    let body = {
        scholarSeasonId: this.selectedScholarSeason,
        rncpId: this.selectRncpId,
        schoolId: this.selectedSchool,
        classId: this.selecetedClass,
        questionnaireTemplate: this.selectedQuestionnaire,
        recipientSelection: recipientObj,
        dueDate: this.form.value.date,
        validationType: this.form.value.validationType,
        validatorTypeId: this.validatorTypeId,
        createdBy: this.creatorName,
        questionnaireType: this.typeOfQuestionnaire
    };
    this.questionnaireService.postQuestionnaire(body)
    .subscribe( res => {
      // if (res.code === 200) {
        this.sendDialogref.close({body: body});
      // }
    });
  }
}
