import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-mentor-evaluation',
  templateUrl: './mentor-evaluation.component.html',
  styleUrls: ['./mentor-evaluation.component.scss']
})
export class MentorEvaluationComponent implements OnInit {

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
   ) { }

  ngOnInit() {
    let user = JSON.parse(localStorage.getItem('loginuser'));
    let flag = false;
    console.log("User Type", user.types);
    if (user.types) {
      for (let i = 0; i < user.types.length; i++) {
        if (user.types[i].entity.toLowerCase() === 'admtc') {
          flag = true;
        }
      }
    }
    if (!flag) {
      this.router.navigate(['/']);
    }
  }

}
