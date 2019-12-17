import { Component, OnInit } from '@angular/core';
import { Question } from '../model/question';
import { QuestionService } from '../service/question.service';

@Component({
  selector: 'app-upload-question',
  templateUrl: './upload-question.component.html',
  styleUrls: ['./upload-question.component.css']
})
export class UploadQuestionComponent implements OnInit {
question:Question=new Question();
  constructor(
    private questionService:QuestionService
  ) { }

  ngOnInit() {
  }


  uploadQuestion(){
    console.log(this.question);
  this.questionService.registerStudentService(this.question).subscribe(data =>{
    this.question.question="";
    this.question.description="";

    alert("Question Created Successfully .");
  });

   
  }
}
