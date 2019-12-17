import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class RncpTitleGuard implements CanActivate {
  user: any = {};
  constructor(private router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    this.user = localStorage.getItem('loginuser');
    if (this.user !== undefined && this.user) {
      this.user = JSON.parse(this.user);
    }
    if (this.user !== undefined && this.user) {
      if ((this.user.entity.type === 'admtc') || ( (this.user.entity.type === 'academic') && (this.user.isUserStudent !== true))) {
        return true;
      } else if ((this.user.entity.type === 'company') || (this.user.isUserStudent === true)) {
        return false;
      }
    }
  }

}
