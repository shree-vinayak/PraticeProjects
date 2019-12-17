import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatTableDataSource } from '@angular/material';

import { IssueService } from '../../service/issue.service';
import { Issue } from '../../model/issue.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  issues: Issue[];
  displayedColumns = ['title', 'responsible', 'severity', 'status', 'actions'];

  constructor(private issueService: IssueService, private router: Router) { }

  ngOnInit() {
    this.fetchIssues();
  }

  fetchIssues() {
    this.issueService
      .getIssue()
      .subscribe((data: Issue[]) => {
        this.issues = data;
        console.log('Data Requested ..');
        console.log('this.issues');
      })
  }

  editIssue(id) {
    this.router.navigate([`/edit/${id}`]);
  }

  deleteIssue(id) {
    this.issueService.deleteIssue(id).subscribe(() => {
      this.fetchIssues();
    });
  }

}
