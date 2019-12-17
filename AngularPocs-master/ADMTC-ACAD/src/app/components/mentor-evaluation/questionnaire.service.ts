import { Injectable } from '@angular/core';
import { Questionnaire } from './questionnaire.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Http, RequestOptions } from '@angular/http';
import { Headers } from '@angular/http';
import { LoginService } from 'app/services/login.service';
import { Base, QuestionnaireTools } from '../../shared/global-urls';
import { ApplicationUrls } from '../../shared/settings';
@Injectable()
export class QuestionnaireService {
  private headers = new Headers({
    'Content-Type': 'application/json',
    Accept: 'application/json'
  });
  private messageSource = new BehaviorSubject<string>('default message');
  questionnaireDetail = this.messageSource.asObservable();

  questionnaire = new BehaviorSubject<Questionnaire>(new Questionnaire());
  formValid = new BehaviorSubject<boolean>(false);
  formSubmited = new BehaviorSubject<boolean>(false);
  constructor(private http: Http, private loginService: LoginService) {}

  questionnaireData(message: string) {
    this.messageSource.next(message);
  }

  updateQuestionData() {
    return this.http
      .post(
        Base.url +
          'addNewQuestionnaire?token=' +
          this.loginService.getToken(),
        { data: [this.questionnaire.getValue()] }
      )
      .map(response => {
        return response.json();
      });
  }

  saveQuestionnaire() {
    this.questionnaire.getValue()._id = null;
    return this.http
      .post(
        Base.url +
          'addNewQuestionnaire?token=' +
          this.loginService.getToken(),
        { data: [this.questionnaire.getValue()] }
      )
      .map(response => {
        return response.json();
      });
  }

  getquestionnaireById(id: string) {
    return this.http
      .get(
        Base.url +
          'getQuestionnaireById' +
          '/' +
          id +
          '?token=' +
          this.loginService.getToken()
      )
      .map(response => {
        return response.json();
      });
  }

  updateQuestionnaire(questionnaire) {
    this.questionnaire.next(questionnaire);
  }
  getQuestionnaire() {
    return this.questionnaire;
  }

  updateFormValidateStatus(status) {
    this.formValid.next(status);
  }
  getFormValidateStatus() {
    return this.formValid;
  }
  updateFormValidateIndicate(status) {
    this.formSubmited.next(status);
  }
  getFormValidateIndicate() {
    return this.formSubmited;
  }

  listQuestionnaire() {
    return this.http
      .get(
        Base.url +
          'getQuestionnaireName?token=' +
          this.loginService.getToken() +
          '&type=' +
          'mentor-evaluation'
      )
      .map(response => {
        return response.json();
      });
  }

  /*  Questionnaire Search */
  filterQuestionnaire(questionnaireName) {
    const options = new RequestOptions({ headers: this.headers });
    return this.http
      .post(
        Base.url +
          'mentorEvaluation/questionnaireSearch' +
          '?token=' +
          localStorage.getItem('token'),
        questionnaireName,
        options
      )
      .map(response => {
        const data = response.json();
        return data;
      })
      .catch(error => {
        if (error.status === 0) {
        }
        return error;
      });
  }

  // Get All Questionnaires For Grid in Questionnaire-template tab
  getAllQuestionnaires(pageNumber) {
    return this.http.get(Base.url + 'getQuestionnaireListView' + '?token=' + this.loginService.getToken() + '&page=' + pageNumber + '&limit=' + '10').map( response => {
      return response.json();
    });
  }

  // Clone Questionnaire
  cloneQuestionnaire(questionnaireId, questionnaireName) {
    const QuesObject = {
      questionnaireId,
      questionnaireName
    };

    return this.http.post(QuestionnaireTools.cloneQuestUrl + '?token=' + this.loginService.getToken(), QuesObject).map( response => {
      return response.json();
    });
  }

  deleteQuestionnaireById(questionnaireId) {
    return this.http.delete(QuestionnaireTools.deleteQuestionnaire + questionnaireId + '?token=' + this.loginService.getToken()).map( questionnaire => {
      return questionnaire.json().data;
    });
  }

  getQuestionnaireTableContent() {
    return this.http.get( ApplicationUrls.questionnaire.questionnaireTable + '?token=' + this.loginService.getToken())
    .map( res => res.json())
  }
  // get questionnaire res
  getAllQuestionnaireResponse() {
    return this.http.get(ApplicationUrls.questionnaire.allQuestionnaire + `?token=` + this.loginService.getToken())
    .map(res=> res.json())
  }
  // post questionnaire
  postQuestionnaire(data) {
    return this.http.post(ApplicationUrls.questionnaire.saveIssueQuestionnaire + `?token=` + this.loginService.getToken(), data)
      .map(res => res.json());
  }

  //get list of creator
  getCreatorList() {
    return this.http.get(ApplicationUrls.questionnaire.creatorList + `?token=${this.loginService.getToken()}`)
    .map(res => res.json());
  }

  //get recepient table data
    getRecepientTableData(limit) {
      return this.http.get(ApplicationUrls.questionnaire.questionnaireRecipient + `?token=${this.loginService.getToken()}&limit=${limit}`)
      .map(res => res.json());
  }
}
