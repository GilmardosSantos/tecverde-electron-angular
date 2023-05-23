import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatFormFieldModule } from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {MatSidenavModule} from "@angular/material/sidenav"
import {MatCardModule} from '@angular/material/card'
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select'
import {MatButtonModule} from '@angular/material/button'
import {MatTableModule} from '@angular/material/table'

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatIconModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    FormsModule,
    MatSidenavModule,
    MatCardModule,
    MatInputModule,
    MatTableModule,


  ],exports:[
    MatIconModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatSidenavModule,
    MatButtonModule,
    MatTableModule,
  ]
})
export class SharedModule { }
