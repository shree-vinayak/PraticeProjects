import { Injectable } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor() { }

  intercept(req, next) {
    if (req.url === "http://localhost:8762/login" || req.url === "http://localhost:8762/userRegistration"
      || req.url === "http://localhost:8762/packages") {
      return next.handle(req);
    }
    else {
      let tokenizedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`
        }
      })
      console.log("token ", sessionStorage.getItem('token'));
      console.log('tokenizedReq', tokenizedReq);
      return next.handle(tokenizedReq);
    }
  }
}
