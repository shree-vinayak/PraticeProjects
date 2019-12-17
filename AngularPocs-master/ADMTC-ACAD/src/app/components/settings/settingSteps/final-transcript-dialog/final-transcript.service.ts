import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { LoginService } from 'app/services/login.service';
import { Observable } from 'rxjs/Observable';
import { AppSettings } from '../../../../app-settings';
import { TranslateService } from 'ng2-translate';

@Injectable()
export class FinalTranscriptService {

  private academictUrl = AppSettings.urls.academic;
  private headers = new Headers({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });

  studentArray = null;

  constructor(private http: Http,
    private loginService: LoginService,
    private translateService: TranslateService) { }

  getRecordsForFinalTranscript(params) {
    return this.http.post(`${this.academictUrl.studentsForFinalTranscript}?token=${this.loginService.getToken()}`, params)
    .map(response => {
      const res = response.json();
      return res;
    })
    .catch(this.handleError);
  }

  getSchoolRedirect(params) {
    return this.http.post(`${this.academictUrl.inputFinalDecision}?token=${this.loginService.getToken()}`  +
    '&lang=' + this.translateService.currentLang.toLowerCase(), params)
    .map(response => {
      const res = response.json();
      return res;
    })
    .catch(this.handleError);
  }

  getTranscriptState(id) {
    return this.http.get(this.academictUrl.finalTranscript + id + '?token=' + this.loginService.getToken())
      .map((response) => {
        return response.json();
      })
      .catch(this.handleError);
  }

  updateTranscript(transcriptId, payload) {
    return this.http.put(
      this.academictUrl.updateFinalTranscriptForStudent + transcriptId + '?token=' + this.loginService.getToken() +
        '&lang=' + this.translateService.currentLang.toLowerCase(),
      payload)
      .map((response) => {
        return response.json();
      })
      .catch(this.handleError);
  }

  updatefinalTranscriptStudentsDecision(transcriptId, payload) {
    return this.http.put(
      this.academictUrl.finalTranscriptStudentsDecision + transcriptId + '?token=' + this.loginService.getToken() +
        '&lang=' + this.translateService.currentLang.toLowerCase(),
      payload)
      .map((response) => {
        return response.json();
      })
      .catch(this.handleError);
  }

  getAcadBlockState(schoolId, rncpId) {
    return this.http.get(
      this.academictUrl.finalTranscriptAcadBlock + schoolId + '/' + rncpId + '?token=' + this.loginService.getToken())
      .map((response) => {
        return response.json();
      })
      .catch(this.handleError);
  }

  getFinalTranscriptStatusForAcadKit(studentId) {
    return this.http.get(this.academictUrl.finalTranscriptStatusForAcadKit + studentId + '?token=' + this.loginService.getToken())
    .map(res => {
      const response = res.json();
      if (response.status === 'OK') {
        return response;
      } else {
        return null;
      }
    });
  }


  getAcadBlockStateByJuryState(schoolId, rncpId, testId) {
    return this.http.get(
      this.academictUrl.finalTranscriptJuryDecisionAcadBlock + schoolId + '/' + rncpId + '/' + testId + '?token=' + this.loginService.getToken())
      .map((response) => {
        return response.json();
      })
      .catch(this.handleError);
  }

  getStudentsFinalTranscriptRetake(rncpId, schoolId, classId) {
    return this.http.get(this.academictUrl.studentFinalTranscriptRetake + rncpId + '/' + schoolId + '/' + classId +
    '?token=' + this.loginService.getToken())
      .map((response) => {
        return response.json();
      })
      .catch(this.handleError);
  }


  getFinalTranscriptStatus(payLoad) {
    return this.http.post(this.academictUrl.finalTranscriptStatus +
    '?token=' + this.loginService.getToken(), payLoad)
      .map((response) => {
        return response.json();
      })
      .catch(this.handleError);
  }

  finalTranscriptJuryFinalDecision(payLoad) {
    return this.http.post(this.academictUrl.finalTranscriptJuryFinalDecision +
    '?token=' + this.loginService.getToken(), payLoad)
      .map((response) => {
        return response.json();
      })
      .catch(this.handleError);
  }

  getFinalTranscriptTestsForFinalRetake(payLoad) {
    return this.http.post(this.academictUrl.finalTranscriptGetTestsForFinalRetake +
    '?token=' + this.loginService.getToken(), payLoad)
      .map((response) => {
        return response.json();
      })
      .catch(this.handleError);
  }

  getFinalTranscriptgetCorrectionsPDF(payLoad) {
    return this.http.post(this.academictUrl.finalTranscriptgetCorrectionsPDF +
    '?token=' + this.loginService.getToken(), payLoad)
      .map((response) => {
        return response.json();
      })
      .catch(this.handleError);
  }

  getFinalTranscriptStatisticPassFail(payLoad) {
    return this.http.post(this.academictUrl.finalTranscriptStatisticPassFail +
    '?token=' + this.loginService.getToken(), payLoad)
      .map((response) => {
        return response.json();
      })
      .catch(this.handleError);
  }

  getFinalTranscriptStudentStatistic(payLoad) {
    return this.http.post(this.academictUrl.finalTranscriptStudentStatistic +
    '?token=' + this.loginService.getToken(), payLoad)
      .map((response) => {
        return response.json();
      })
      .catch(this.handleError);
  }

  handleError(error: Response) {
    console.error('Error :', error);
    return Observable.throw(error);
  }
}
