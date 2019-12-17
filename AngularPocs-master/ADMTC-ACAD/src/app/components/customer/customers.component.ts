import { Component } from '@angular/core';
import { TranslateService } from 'ng2-translate/ng2-translate';

@Component({
  selector: 'admtc-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent{


  constructor(translate: TranslateService){
    // translate.addLangs(['en', 'fr']);
    // translate.setDefaultLang('fr');


    // const browserLang: string = translate.getBrowserLang();
    // console.log(browserLang,"browserLang");
    // translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');
  }


}
