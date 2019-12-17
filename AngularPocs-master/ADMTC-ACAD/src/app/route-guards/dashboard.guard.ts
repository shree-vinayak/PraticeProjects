import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { RNCPTitlesService } from '../services/rncp-titles.service';

@Injectable()
export class DashboardGuard implements CanActivate {
  constructor(private router: Router,
              private appService: RNCPTitlesService) {
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // console.log(this.appService.getSelectedRncpTitle());
    return this.appService.getSelectedRncpTitle().map(value => {
      if(value){
        return true;
      } else {
        this.router.navigate(['']);
        return false;
      }
      // return value ? true : false;
    });
    // if(this.appService.getSelectedRncpTitle().getValue())
    // return ;
  }
}
