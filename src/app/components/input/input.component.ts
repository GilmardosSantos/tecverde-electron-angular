import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  @Output() modelChange = new EventEmitter<any>()

  emitChanges(){
    this.modelChange.emit(this.model);
  }

}
