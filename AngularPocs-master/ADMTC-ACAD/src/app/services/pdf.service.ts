import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Print } from '../shared/global-urls';

@Injectable()
export class PDFService {
  constructor(private http: Http) { }

  getPDF(html: string, filename: string, landscape: boolean, Margin = false) {
    return this.http.post( Print.url + 'admtc/generate-pdf/', {
      html: html,
      autoMargin: Margin,
      landscape: landscape,
      filename: filename
    }).map(res => res.json());
  }
}
