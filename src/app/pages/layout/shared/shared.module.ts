import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatFormFieldModule } from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {MatSidenavModule} from "@angular/material/sidenav"
import {MatCardModule} from '@angular/material/card'
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
    MatCardModule

  ],exports:[
    MatIconModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    FormsModule,
    MatSidenavModule,
    MatCardModule

  ]
})
export class SharedModule { }
