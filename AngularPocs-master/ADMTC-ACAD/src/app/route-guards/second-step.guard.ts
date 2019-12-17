import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { TestService } from '../services/test.service';

@Injectable()
export class SecondStepGuard implements CanActivate {
  constructor(private router: Router, private testService: TestService) {
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.testService.checkFirstStep()) {
      return true;
    } else {
      this.router.navigate(['create-test', 'first']);
      return false;
    }
  }
}
