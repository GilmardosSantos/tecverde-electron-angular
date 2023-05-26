import { Component, Input, Output, EventEmitter, OnInit} from '@angular/core';

@Component({
  selector: 'ng-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteComponent implements OnInit {

  ngOnInit(): void {
      this.filteredOptions = this.options
  }

  @Input() formFieldClass = '';
  @Input() model:any = {};
  @Input() label = ''
  @Input() value = ''
  @Input() name = ''
  @Input() icon = '';
  @Input() options = <any>[];
  @Input() formControlName:any
  @Input() form:any
  @Input() disable = false
  @Input() filteredOptions = <any>[]
  inputedvalued = ''

  @Output() modelChange = new EventEmitter<any>()



  emitChanges(event:any,a?:string){
    console.log(this)
    const value = event
    this.filteredOptions = this._filter(value)
    this.modelChange.emit(this.model);
    this.inputedvalued = this.model
  }

  callClick(event:any){
    console.clear()
    console.log(`clicked`,event)
    // console.log(this.filteredOptions)
    // let value = this.filteredOptions.find((option:any) => option.value == event)
    // console.log(value)
    // this.modelChange.emit(value.label)
  }

  private _filter(value:string){
    const filterValue = value.toLowerCase();
    return this.options.filter((option:any) => option.label.toLowerCase().includes(filterValue))
  }

}
