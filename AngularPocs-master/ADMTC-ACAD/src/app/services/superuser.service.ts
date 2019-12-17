import { UtilityService } from './utility.service';
import { LoginService } from './login.service';
import { ApplicationUrls, GlobalConstants } from 'app/shared/settings';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { TranslateService } from 'ng2-translate';
import { UserService } from './users.service';
import { TableFilterStateService } from './table-fliter-state.service';
declare var swal: any;
import * as moment from 'moment';

// Required for logging
import { Log } from 'ng2-logger';
const log = Log.create('SuperuserService');
log.color = 'red';

@Injectable()
export class SuperuserService {

  constructor(
    private http: Http,
    private router: Router,
    private loginService: LoginService,
    private translateService: TranslateService,
    private utilityService: UtilityService,
    private userService: UserService,
    private tableFilterStateService: TableFilterStateService
  ) { log.info('Construtor Invoked')}

  startSuperUserMode(userId: string) {
    return this.http.get(ApplicationUrls.academic.superUser +  userId + '?token=' + this.loginService.getToken())
      .map(
        response => response.json().data
      )
      .do(
        (responseData) => {
          log.data('responseData', responseData);
          if ( responseData.user && responseData.token ) {
            this.userService.setIsLogoutFlag();
            const civility = this.utilityService.computeCivility(responseData.user.sex, this.translateService.currentLang.toLowerCase());
            swal({
              type: 'success',
              title: this.translateService.instant('SUCCESS'),
              html: this.translateService.instant('USER_S7_SUPERUSER.TEXT', {
                UserCivility: civility,
                UserFirstName: responseData.user.firstName,
                UserLastName: responseData.user.lastName
              }),
              allowEscapeKey: true,
              confirmButtonText: this.translateService.instant('BACKEND.STUDENT.UNDERSTOOD')
            });
            this.router.navigate(['/mailbox']);
            this._setLocalStoargeValue(responseData);
            this.loginService.updateFolderPermission();
            this.userService.setIsLoginFlag(true);
            this.tableFilterStateService.resetFiltersStates();
          }
        }
      )
      .catch(
        (error) => {
          log.error('error', error);
          return 'Error Occured While Processing SuperUser';
        }
      );
  }

  private _setLocalStoargeValue(responseData) {
    localStorage.setItem(GlobalConstants.localStorageKeys.loggedUser, JSON.stringify(responseData.user));
    localStorage.setItem(GlobalConstants.localStorageKeys.tokenName, responseData.token);
    localStorage.setItem(GlobalConstants.localStorageKeys.timeStamp, moment(new Date()).format('YYYY-MM-DD HH:mm:ss'));
  }
}
