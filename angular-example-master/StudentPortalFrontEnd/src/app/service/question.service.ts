import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Question } from '../model/question';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(
    private httpClient:HttpClient
  ) { }



  registerStudentService(question:Question){
    console.log("inside register service")
    return this.httpClient.post<Question>("http://localhost:2017/question/uploadQuestion",question);

  }

  getQuestion(){
    return this.httpClient.get<Question>("http://localhost:2017/question/getQuestion");
  }

  deleteQuestion( id){
    return this.httpClient.delete("http://localhost:2017/question/deleteQuestion"+"/"+id);
  }
}
