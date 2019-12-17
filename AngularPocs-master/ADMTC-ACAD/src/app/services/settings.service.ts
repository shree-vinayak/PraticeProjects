// import { Subject } from 'rxjs/Rx';
import { EventEmitter, Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { RncpTitle, ScholerSeason, Server, Calenderstep } from '../shared/global-urls';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/catch';
import { IdeasCategory } from '../models/Ideas_category.model';
import { SchoolBoard } from '../models/schoolboard_result.model';
import { StudentStatusModel } from '../models/studentStatus.model';
import { QuestionAnswerModel } from '../models/question-answers.model';
import { CalenderStep } from '../models/calendarstep.model';

import { Season } from '../models/scholerseason.model';


@Injectable()
export class SettingService {
    currentLoginUser: any = '';
    ideasCategory: IdeasCategory[] = [];
    schoolBoardResult: SchoolBoard[] = [];
    StudentStatuslist: StudentStatusModel[] = []
    studentStatus: StudentStatusModel;
    questionAnswerModellist: QuestionAnswerModel[] = [];
    constructor(private http: Http) {

    }

    getToken() {
        const token = localStorage.getItem('token');
        if (token !== null && token !== '') {
            return token;
        }
    }

    addIdeaCategory(ideasCategory: IdeasCategory) {
        this.getLastUserId(this.ideasCategory).subscribe(val =>
            ideasCategory._id = val);
        this.ideasCategory.push(ideasCategory);
        console.log(this.ideasCategory);
    }


    getIdeaCategory() {
        return Observable.of(this.ideasCategory).map((response) => {
            return response;
        });
    }

    getIdeasCategoryById(id): any {
        return Observable.of(this.ideasCategory).map((res) => {
            let response = this.ideasCategory;
            if (id !== null) {
                response = response.filter(a => {
                    return (a._id === id);
                });
            }
            return response[0];
        });
    }

    deleteIdeaCategory(id) {
        return this.getIdeasCategoryById(id).subscribe(response => {
            const index = this.ideasCategory.indexOf(response)
            if (index !== -1) {
                this.ideasCategory.splice(index, 1);
                return true;
            } else {
                return false;
            }
        });
    }

    addSchoolBoardCategory(schoolBoard: SchoolBoard) {
        this.getLastUserId(this.schoolBoardResult).subscribe(val =>
            schoolBoard._id = val);
        this.schoolBoardResult.push(schoolBoard);
        console.log(this.schoolBoardResult);
    }

    getSchoolBoardCategory() {
        return Observable.of(this.schoolBoardResult).map((response) => {
            return response;
        });
    }

    getSchoolBoardCategoryById(id): any {
        return Observable.of(this.schoolBoardResult).map((res) => {
            let response = this.schoolBoardResult;
            if (id !== null) {
                response = response.filter(a => {
                    return (a._id === id);
                });
            }
            return response[0];
        });
    }

    deleteSchoolCategory(id) {
        return this.getSchoolBoardCategoryById(id).subscribe(response => {
            const index = this.schoolBoardResult.indexOf(response)
            if (index !== -1) {
                this.schoolBoardResult.splice(index, 1);
                return true;
            } else {
                return false;
            }
        });
    }

    addStudentStatusCategory(studentStatus: StudentStatusModel) {
        this.getLastUserId(this.StudentStatuslist).subscribe(val => studentStatus._id = val);
        this.StudentStatuslist.push(studentStatus);
        console.log(this.StudentStatuslist);
    }


    getStudentStatusCategory() {
        return Observable.of(this.StudentStatuslist).map((response) => {
            return response;
        });
    }

    getStudentStatusCategoryById(id): any {
        return Observable.of(this.StudentStatuslist).map((res) => {
            let response = this.StudentStatuslist;
            if (id !== null) {
                response = response.filter(a => {
                    return (a._id === id);
                });
            }
            return response[0];
        });
    }

    deleteStudentStatusCategory(id) {
        return this.getStudentStatusCategoryById(id).subscribe(response => {
            const index = this.StudentStatuslist.indexOf(response);
            if (index !== -1) {
                this.StudentStatuslist.splice(index, 1);
                return true;
            } else {
                return false;
            }
        });
    }


    getLastUserId(objects): any {
        // return Observable.of(this.userList).map((response) => {
        return Observable.of(objects).map((response) => {
            if (response.length > 0) {
                const lastuser = response[response.length - 1];
                if (lastuser != null) {
                    return (parseInt(lastuser._id) + 1).toString();
                }
            } else {
                return '1';
            }
        });
    }

    addQuestionAnswers(questionAnswerModel: QuestionAnswerModel) {
        this.getLastUserId(this.questionAnswerModellist).subscribe(val =>
            questionAnswerModel._id = val);
        this.questionAnswerModellist.push(questionAnswerModel);
        console.log(this.questionAnswerModellist);
    }

    getQuestionAnswer() {
        return Observable.of(this.questionAnswerModellist).map((response) => {
            return response;
        });
    }

    getQuestionAnswerById(id): any {
        return Observable.of(this.questionAnswerModellist).map((res) => {
            let response = this.questionAnswerModellist;
            if (id !== null) {
                response = response.filter(a => {
                    return (a._id === id);
                });
            }
            return response[0];
        });
    }

    deleteQuestionAnswer(id) {
        return this.getQuestionAnswerById(id).subscribe(response => {
            const index = this.questionAnswerModellist.indexOf(response);
            if (index !== -1) {
                this.questionAnswerModellist.splice(index, 1);
                return true;
            } else {
                return false;
            }
        });
    }


}
