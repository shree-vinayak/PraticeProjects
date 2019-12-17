import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-assign-animator',
  templateUrl: './assign-animator.component.html',
  styleUrls: ['./assign-animator.component.css']
})
export class AssignAnimatorDialogComponent implements OnInit {
  task;
  businessGameArray: any;
  users: any;
  constructor(
              private assignAnimatorDialogRef: MdDialogRef<AssignAnimatorDialogComponent>
            ) { }

  ngOnInit() {
    this.businessGameArray = [
      {
        userId: '1',
        session_1: {
          startDate: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString() ,
          endDate: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString() 
        },
        session_2: {
          startDate: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString() ,
          endDate: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString() 
        },
        test_session: {
          startDate: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString() ,
          endDate: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString() 
        }
      },
      {
        userId: '2',
        session_1: {
          startDate: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString() ,
          endDate: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString() 
        },
        session_2: {
          startDate: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString() ,
          endDate: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString() 
        },
        test_session: {
          startDate: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString() ,
          endDate: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString() 
        }
      }
    ];

    this.users = [
      { name: 'One', id: '1' }, 
      { name: 'Two', id: '2' }
    ];
  }

  closeDialog(status: boolean) {
    this.assignAnimatorDialogRef.close(status);
  }

}
