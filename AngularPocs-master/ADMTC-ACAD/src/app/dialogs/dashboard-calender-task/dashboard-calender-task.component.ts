import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { Tasks } from '../../models/tasks.model';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { UtilityService } from 'app/services/utility.service';
@Component({
  selector: 'app-dashboard-calender-task',
  templateUrl: './dashboard-calender-task.component.html',
  styleUrls: ['./dashboard-calender-task.component.css']
})
export class DashboardCalenderTaskComponent implements OnInit {

  task: Tasks;
  testName: string;
  testCompDate;
  constructor(private dialogRef: MdDialogRef<DashboardCalenderTaskComponent>,
    private translate: TranslateService,
    public utilityservice: UtilityService) { }

  ngOnInit() {
    console.log(this.task);
  }
  closeDialog() {
    this.dialogRef.close();
  }
  getTranslatedTaskName(name,task?: any) {
    if(task){
      if(task.type.toLowerCase() ==='employabilitysurveyforstudent'){
        const dueDate = new Date(task.dueDate);
        const dateString = dueDate.getDate()+"/"+(dueDate.getMonth()+1) +"/"+dueDate.getFullYear();
        if (this.translate.currentLang.toLowerCase() === 'en') {
        return "Employability Survey to complete before "+dateString;
        }else{
          return "Enquête d'employabilité à completer avant le "+dateString;
        }
      }
      else if (name) {
        const value = this.translate.instant('TEST.AUTOTASK.' + name.toUpperCase());
        return value !== 'TEST.AUTOTASK.' + name.toUpperCase() ? value : name;
      }
    }
    
  }

}
