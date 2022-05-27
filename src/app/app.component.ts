import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class  AppComponent {
  title = 'bairrista';
    onActivate(event:any) {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 1000);
  }
}
