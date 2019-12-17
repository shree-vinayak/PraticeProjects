import { Injectable } from '@angular/core';

import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {



  private baseUrl = 'http://localhost:2017/api';

  constructor(private http: HttpClient) { }


  // getAssignment(): Observable<any> {
  //   return this.http.get(`${this.baseUrl}` + `/assignment`);
  // }

  // updateAssignment(name:string, value: any): Observable<Object> {
  //   return this.http.put(`${this.baseUrl}/${name}`, value);
  // }

  pushFileToStorage(file: File): Observable<any> {

    const formdata: FormData = new FormData();
    console.log("frontend service hit");

    formdata.append('file', file);

    const req = new HttpRequest('POST', 'http://localhost:2017/assignment/files', formdata, {
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req);
  }

  //   getAssignmentDetail(name: string): Observable<any> {
  //    console.log("Assignment Service");
  //     const httpOptions = {
  //       'responseType'  : 'arraybuffer' as 'json'
  //        //'responseType'  : 'blob' as 'json'        //This also worked
  //     };
  //   return this.http.get(this.baseUrl+'/detail/'+name,httpOptions);
  //  }
}
