import { Component,Input, Output, EventEmitter, OnInit, OnChanges} from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnChanges{


  ngOnChanges(){
  }

  ngOnInit(): void {

  }
  @Input() header = new Array<any>()
  @Input() table = new Array<any>()
  

}
