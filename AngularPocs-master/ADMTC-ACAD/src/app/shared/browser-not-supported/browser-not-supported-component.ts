import { Component, OnInit, Input } from '@angular/core';
import { GlobalConstants } from '../settings';

declare var swal: any;

@Component({
  selector: 'app-browser-not-supported',
  templateUrl: './browser-not-supported-component.html',
  styleUrls: ['./browser-not-supported-component.scss']
})
export class BrowserNotSupportedComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    this.showIncompatibleSwal();
  }

  showIncompatibleSwal() {
    let lang = localStorage.getItem(GlobalConstants.lang);

    let message =
        "<span style='text-align:center;'><h3 style='color:#ffd740;'>ADMTC</h3></br><img width='60%' src='assets/images/Thinking_Face_Emoji.png'/></br></br><b style='color:white;font-size:20px;'>Désolé…<br/>ADMTC.PRO est<br/>optimisé pour Google<br/>Chrome Ordinateur<br/>uniquement.<br/></b></span>";
    let btn = 'J’ai compris';

    if ( lang === 'en' ) {
      message = 
        "<span style='text-align:center;'><h3 style='color:#ffd740;'>ADMTC</h3></br><img width='60%' src='assets/images/Thinking_Face_Emoji.png'/></br></br><b style='color:white;font-size:20px;'>Sorry…<br/>ADMTC.PRO is<br/>optimized for Google<br/>Chrome Desktop<br/>only.<br/></b></span>";
      btn = 'Understood';
    }

    swal({
          html: message ,
          confirmButtonText:btn,
          confirmButtonColor: '#ffd740',
          customClass:"customClassDialog",
          background:'#353535'
         });
  }
}
