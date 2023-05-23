import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
@Component({
  selector: 'ng-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent{
  @Input() formFieldClass = '';
  @Input() model:any = {};
  @Input() label = ''
  @Input() value = ''
  @Input() name = ''
  @Input() icon = '';
  @Input() formControlName:any
  @Input() form: any
  @Output() modelChange = new EventEmitter<any>()


  constructor(
    
  ){
    // console.clear()
    console.log(this)
  }

  emitChanges(){
    console.log(this.model)
    this.modelChange.emit(this.model);
  }

}
