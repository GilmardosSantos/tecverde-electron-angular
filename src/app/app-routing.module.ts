import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TermoComponent } from './pages/main/termo/termo.component';

const routes: Routes = [
  {
    path:'',
    component:TermoComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
