import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }
  certBlob:Blob;
  generate() {
   
 
    this.http.get("http://localhost:8080/api/pdf/customers").subscribe(
     (data) => {
        //  let dataType = data.type;
         let binaryData = [];
         binaryData.push(data);
         this.certBlob = new Blob(binaryData);
     });
     return this.certBlob;
  }
}
