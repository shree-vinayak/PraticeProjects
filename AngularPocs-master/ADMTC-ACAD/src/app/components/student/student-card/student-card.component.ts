import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { StudentModel } from "../student-list/student.model";
import { Student } from "../../../models/student.model";
import { StudentsService } from "../../../services/students.service";
import { TranslateService } from "ng2-translate";
import { ApplicationUrls } from "../../../shared/settings";
// import { SendStudentMailComponent } from "../../../dialogs/send-student-mail/send-student-mail.component";
import { MdDialog, MdDialogRef, MdDialogConfig } from "@angular/material";
import { ComposeMailComponent } from "app/components/Mail/compose-mail/compose-mail.component";
// required for logging
import { Log } from "ng2-logger";
import { UtilityService } from "app/services/utility.service";
import { DownloadAnyFileOrDocFromS3 } from "../../../shared/global-urls";
const log = Log.create("StudentCardComponent");
log.color = "blue";

declare var swal: any;

@Component({
  selector: "app-student-card",
  templateUrl: "./student-card.component.html",
  styleUrls: ["./student-card.component.css"]
})
export class StudentCardComponent implements OnInit {
  /*************************************************************************
   *   VARIABLES
   *************************************************************************/
  @Input() studentEmit: StudentModel;
  @Input() student: StudentModel;
  @Input() isActive: boolean;
  @Input() changedStudent;
  // student: any;

  imgUrl = ApplicationUrls.imageBasePath + "assets/images/default_img.png";
  imgUrlFemale = ApplicationUrls.imageBasePath + "assets/images/default_female_img.png";
  status = false;
  popStudent = true;
  selectedStudent = [];
  public dialogRef: MdDialogRef<ComposeMailComponent>;
  serverimgPath = ApplicationUrls.baseApi;

  isCardSelected = false;
  s3FilePath = DownloadAnyFileOrDocFromS3.download;

  sendMailBox: MdDialogConfig = {
    disableClose: true,
    width: '800px',
    height: '530px'
  };

  /*************************************************************************
   *   CONSTRUCTOR
   *************************************************************************/
  constructor(
    private studentService: StudentsService,
    private translate: TranslateService,
    public dialog2: MdDialog,
    public utility: UtilityService
  ) {
    log.info('Constructor Invoked!');
  }

  /*************************************************************************
   *   EVENTS
   *************************************************************************/
  ngOnInit() { }

  /*************************************************************************
   *   METHODS
   *************************************************************************/

  activeStudent(student) {
    console.log(student);
  }

  sendMail(data) {
    console.log(data);
    console.log("data");
    console.log(data);
    this.selectedStudent.push(data);
    this.dialogRef = this.dialog2.open(
      ComposeMailComponent,
      this.sendMailBox
    );
    // this.dialogRef.componentInstance.studentId = data._id;
    this.dialogRef.componentInstance.student = data;
    // this.dialogRef.componentInstance.selectedStudent = this.selectedStudent;
    this.dialogRef.afterClosed().subscribe(result => {
      this.dialogRef = null;
    });
    return false;
  }
  encodeURL(x){
    return encodeURI(x);
  }
}
