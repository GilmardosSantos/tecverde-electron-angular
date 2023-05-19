import { Component } from '@angular/core';

interface NavItems {
  name: string
  url: string
  icon: string
}

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  public NavigationItems = [
    {
      name:'Termos',
      url:'termos',
      icon:'assignment_add'
    },
    {
      name:'Assinaturas',
      url:'email',
      icon:'email'
    },
    {
      name:'GLPI',
      url:'glpi',
      icon:'folder_open'
    }
  ]
}
