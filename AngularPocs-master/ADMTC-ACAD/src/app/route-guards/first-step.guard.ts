import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
// import { TestService } from '../services/test.service';
import { RNCPTitlesService } from '../services/rncp-titles.service';
import { AcademicKitService } from '../services/academic-kit.service';

@Injectable()
export class FirstStepGuard implements CanActivate {
  constructor(private router: Router, private acadService: AcademicKitService) {
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let stack = this.acadService.getTestStack();
    if (stack && stack.length > 0) {
      return true;
    } else {
      this.router.navigate(['dashboard']);
      return false;
    }
  }
}
