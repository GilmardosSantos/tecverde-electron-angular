import { Component, EventEmitter, Input, Output } from '@angular/core';

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
  @Input() model: any 
  @Input() name:any
  @Input() form:any
  @Output() modelChange = new EventEmitter<any>()

  emitChanges(){
    console.log(this.model)
    this.modelChange.emit(this.model)
    // this.model = this.model.value
  }
}
