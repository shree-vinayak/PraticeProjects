import { Component } from '@angular/core';
import { AuthService } from './service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'appTest';
  blob:Blob;
  constructor(private auth: AuthService){
 this.blob= this.auth.generate()

 console.log(this.blob);
  }


}
