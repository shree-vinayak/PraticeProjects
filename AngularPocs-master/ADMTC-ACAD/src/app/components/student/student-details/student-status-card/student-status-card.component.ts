import { Component, OnInit, Input } from '@angular/core';
import { ButtonStatus } from '../../../../shared/button-status';

@Component({
  selector: 'app-student-status-card',
  templateUrl: './student-status-card.component.html',
  styleUrls: ['./student-status-card.component.scss']
})
export class StudentStatusCardComponent implements OnInit {

  public btnStatus = ButtonStatus;

  @Input() title: string;
  @Input() state: ButtonStatus;
  @Input() subtitle: string;
  @Input() bgColor: string;

  constructor() { }
  // field required for enum checks in html code.

  ngOnInit() {
  }

  getBGColor(bgcolor) {
    switch (bgcolor) {
      case 'red':
        return '#f44336';
      case 'green':
        return 'green';
      default:
       return '';
    }
  }

  getTextColor(bgcolor) {
    switch (bgcolor) {
      case 'red':
      case 'green':
        return 'white';
      default:
       return 'black';
    }
  }

}
