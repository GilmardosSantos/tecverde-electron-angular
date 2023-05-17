import { Component } from '@angular/core';
import { asapScheduler } from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {
    constructor(){
    }
    public NavIcons = [
      {
        name:'close'
      },
      {
        name:'fullscreen'
      },
      {
        name:'remove'
      },
    ]
}