import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import _ from 'lodash';
import { TasksService } from '../services/tasks.service';
import { LoginService } from '../services';

@Injectable()
export class TasksGuard implements CanActivate {
  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private taskservice: TasksService,
    private loginService: LoginService
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // Checks if user is logged in or not
    const currentUser = this.loginService.getLoggedInUser();
    if (currentUser) {
      // logged in so return true

      // checks if user is Student/Mentor or any other user
      const indexOfStudentOrMentor = _.findIndex(currentUser.types, function (o) {
        return o.name === 'mentor' || currentUser.isUserStudent === true || o.name.toLowerCase() === 'corrector';
      });

      if (indexOfStudentOrMentor > -1) {
        this.router.navigate(['/admtc-acad/tasks/' + route.params['id'] + '/' + route.params['taskId']]);
        return true;
      } else {

        this.taskservice.getTaskByTaskId(route.params['taskId']).subscribe(res => {
          const task = res.data[0];
          console.log(task);
          if (task !== undefined) {
            
            // Check if the task is a manual task
            if (task.type.toLowerCase() === 'addtask') {
              this.router.navigate(['/admtc-acad/tasks/' + route.params['id'] + '/' + route.params['taskId']]);
              return true;
            } else {
              return true;
            }
          } else {
            return true;
          }
        });
        return true;
      }
    } else {
      // not logged in so redirect to login page with the return url
      console.log(state.url);
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }
}
