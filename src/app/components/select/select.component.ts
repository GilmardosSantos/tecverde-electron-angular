import { Component, Input } from '@angular/core';

interface select {
  label:string;
  value:string;
}

@Component({
  selector: 'ng-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent {

  @Input() label = ""
  @Input() options = new Array<select>()
  @Input() multiple = 'true'

}
