import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../service/question.service';
import { AuthenticationService } from '../service/authentication.service';
import { AddAssignmentComponent } from '../add-assignment/add-assignment.component';
import { MatDialog } from '@angular/material';
import { Assignment } from '../model/assignment';


@Component({
  selector: 'app-show-question',
  templateUrl: './show-question.component.html',
  styleUrls: ['./show-question.component.css']
})
export class ShowQuestionComponent implements OnInit {

  question: any = [];
  assignment : Assignment = new Assignment();

  constructor(private questionService: QuestionService,
    private loginService: AuthenticationService,
    public dialog: MatDialog
  ) { }
  

  ngOnInit() {

    this.questionService.getQuestion().subscribe(data => {
      this.question = data;
      console.log(this.question);
    });

  }

  deleteQuestion(id) {
    console.log(id);
    this.questionService.deleteQuestion(id).subscribe(() => {
      this.ngOnInit();
      alert("delete Successfuly");
    })
  }

  addAssignment(id){
    console.log(id);
    this.assignment.id=id;
    console.log(this.assignment.id);
   
   this.openDialog()

    
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddAssignmentComponent, {
      width: '250px',
      data: {id:this.assignment.id, file:this.assignment.file}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.assignment.file = result;

      console.log(this.assignment.file,'question');
    });

    console.log(this.assignment.id);
  }
}
