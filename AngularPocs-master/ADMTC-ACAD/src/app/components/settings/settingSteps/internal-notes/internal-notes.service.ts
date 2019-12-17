import { Http } from '@angular/http';
import { AppSettings } from './../../../../app-settings';
import { Injectable } from '@angular/core';
import { LoginService } from 'app/services';

@Injectable()
export class InternalNotesService {

  constructor(private http: Http, private login: LoginService) { }

  getAllNotes() {
    return this.http.get(`${AppSettings.urls.academic.getInternalNotes}?token=${this.login.getToken()}`)
      .map((response) => response.json());
  }
  createAdditionalNotes(body, internalNoteId) {
    return this.http.post(`${AppSettings.urls.academic.getInternalNotes}/${internalNoteId}/addComment?token=${this.login.getToken()}`, body)
      .map((response) => response.json());
  }

  getInternalNoteDetail(internalNoteId) {
    // return this.http.get(ACADEMICTASKS.url + "/" + taskId + "/details?" + 'token=' + this.loginService.getToken())
    return this.http.get(`${AppSettings.urls.academic.getInternalNotes}/${internalNoteId}?token=${this.login.getToken()}`)
      .map((response) => {
        return response.json();
      });
  }
  createInternalNote(note) {
    return this.http.post(`${AppSettings.urls.academic.getInternalNotes}?token=${this.login.getToken()}`, note)
      .map(res => {
        console.log(res);
        return res.json();
      });
  }

  updateInternalNotes(internalNoteId, data) {
    return this.http.put(`${AppSettings.urls.academic.getInternalNotes}/${internalNoteId}?token=${this.login.getToken()}`, data)
      .map((response) => response.json());
  }

  deleteInternalNote(id) {
    return this.http.delete(`${AppSettings.urls.academic.getInternalNotes}/${id}?token=${this.login.getToken()}`).map(res => {
      const response = res.json();
      console.log(response);
      if (response.status === 'OK') {
        return response.data;
      } else {
        return [];
      }
    });
  }




  getInternalNote(id) {
    return this.http.get(`${AppSettings.urls.academic.getInternalNotes}/${id}?token=${this.login.getToken()}`).map(res => {
        const response = res.json();
        if (response.status === 'OK') {
          return response.data;
        } else {
          return [];
        }
      });
  }
}