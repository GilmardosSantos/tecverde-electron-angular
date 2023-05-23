import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { NavigationComponent } from './pages/layout/navigation/navigation.component';
import { NavBarComponent } from './pages/layout/nav-bar/nav-bar.component';
import { EmailComponent } from './pages/main/email/email.component';
import { CardComponent } from './pages/layout/card/card.component';
import { SharedModule } from './pages/layout/shared/shared.module';
import { InputComponent } from './components/input/input.component';
import { SelectComponent } from './components/select/select.component';
import { TableComponent } from './components/table/table.component';
import { TermoComponent } from './pages/main/termo/termo.component';
import { AutocompleteComponent } from './components/autocomplete/autocomplete.component';
import { HotToastModule } from '@ngneat/hot-toast';
import { ToastService } from './services/toast.service';


@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    NavBarComponent,
    EmailComponent,
    CardComponent,
    InputComponent,
    SelectComponent,
    TableComponent,
    TermoComponent,
    AutocompleteComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    HotToastModule.forRoot()

  ],
  providers: [ToastService],
  bootstrap: [AppComponent]
})
export class AppModule { }
