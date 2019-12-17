import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { UserService } from '../services/users.service';
import { UtilityService } from '../services/utility.service';


@Injectable()
export class MentorJobDescGaurd implements CanActivate {
  constructor(private router: Router,
              private userService: UserService,
              private route: ActivatedRoute,
              private utilityService: UtilityService) {
  }

  canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot) {
      //if (localStorage.getItem('currentUser')) {
    if ( this.utilityService.checkUserIsMentor() ) {
        return true;
    } else {
            this.userService.setIsLogoutFlag();
            this.userService.mentorLoginURL = state.url;
            const idData = route.params['userId'];
            const tokenData = route.queryParams['token'];
            const setPasswordurl = '/setPassword/' + idData + '?token=' + tokenData;
            this.userService.checkSetPassword(tokenData).subscribe((response) => {
                if (!response.isValid) { 
                    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
                } else {
                    this.router.navigateByUrl(setPasswordurl, { queryParams: { returnUrl: state.url }});
                }
                return false;
            });
        }
      // not logged in so redirect to login page with the return url
    }
}
