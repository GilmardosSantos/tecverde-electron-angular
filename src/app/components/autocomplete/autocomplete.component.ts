import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';

@Component({
  selector: 'ng-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteComponent{

  
  @Input() formFieldClass = '';
  @Input() model:any = {};
  @Input() label = ''
  @Input() value = ''
  @Input() name = ''
  @Input() icon = '';
  @Input() options = <any>[];
  @Input() formControlName:any
  @Input() form:any
  @Output() modelChange = new EventEmitter<any>()

  emitChanges(event:any){
    console.log(this)
    console.log('changing')
    this.modelChange.emit(this.model);
  }

}
