import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { RNCPTitlesService } from '../services/rncp-titles.service';

@Injectable()
export class TitleSelectedGuard implements CanActivate {

  constructor(private appService: RNCPTitlesService, private router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return Observable.create(observer => {
      this.appService.getSelectedRncpTitle().subscribe(title => {
        if (title) {
          observer.next(true);
        } else {
          this.router.navigate(['dashboard']);
          observer.next(false);
        }
      });
    });
  }
}
