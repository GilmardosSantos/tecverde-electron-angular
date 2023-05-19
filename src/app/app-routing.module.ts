import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TermoComponent } from './pages/main/termo/termo.component';
import { EmailComponent } from './pages/main/email/email.component';

const routes: Routes = [
  {
    path:'termos',
    component:TermoComponent
  },
  {
    path:'email',
    component:EmailComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
