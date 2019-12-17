import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { AssignmentService } from '../service/assignment.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Login } from '../model/login';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Assignment } from '../model/assignment';

@Component({
  selector: 'app-add-assignment',
  templateUrl: './add-assignment.component.html',
  styleUrls: ['./add-assignment.component.css']
})
export class AddAssignmentComponent implements OnInit {


  user: Login =new Login();
  // ngOnInit() {
  // // let id=parseInt(this.route.snapshot.paramMap.get('id'));
  // // this.departmentId=id;

  // this.route.paramMap.subscribe((params: ParamMap)=>{
  //   let id =parseInt(params.get("id"));
  //   console.log(id);
  // });
  // }
  name: string;
  selectedFiles: FileList;
  currentFileUpload: File;
  Same: boolean;
  s: string;


  // progress: { percentage: number } = { percentage: 0 };


  // constructor(
  //   private route: ActivatedRoute,
  //   private assignmentService: AssignmentService,
  //   private router: Router) { }



  selectFile(event) {

    this.selectedFiles = event.target.files;

    console.log(this.selectedFiles)

    this.currentFileUpload = this.selectedFiles.item(0);
    var f = this.currentFileUpload.size;
    if (f == 0) {

      alert("Empty file is not allowed");
    }

    else{
      this.data.file=this.currentFileUpload;

      console.log("else part",this.data.file);
    }
  }

  // upload() {
  //   this.progress.percentage = 0;
  // //  this.name = this.route.snapshot.paramMap.get('name');

  //    this.currentFileUpload = this.selectedFiles.item(0);
  //   var f=this.currentFileUpload.size;
  //   if(f==0)
  //   {

  //    alert("Empty file is not allowed");
  //   }
  //   else { this.assignmentService.pushFileToStorage(this.currentFileUpload).subscribe(event => {
  //     if (event.type === HttpEventType.UploadProgress) {
  //       this.progress.percentage = Math.round(100 * event.loaded / event.total);
  //     } else if (event instanceof HttpResponse) {

  //       console.log('File is completely uploaded!');
  //     }
  //     console.log(event.body);
  //      this.s=event.body;

  //      if(this.s=='allready have')
  //      {
  //        this.Same=true;
  //      }
  //    });

  //  console.log(this.s);

  //    this.selectedFiles = undefined;
  //  }
  // }

  ngOnInit() {
    this.user = JSON.parse(sessionStorage.getItem('user'));

  }

  constructor(
    public dialogRef: MatDialogRef<AddAssignmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Assignment) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
