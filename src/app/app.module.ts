import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationComponent } from './pages/layout/navigation/navigation.component';
import { NavBarComponent } from './pages/layout/nav-bar/nav-bar.component';

import { EmailComponent } from './pages/main/email/email.component';
import { CardComponent } from './pages/layout/card/card.component';
import { SharedModule } from './pages/layout/shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    NavBarComponent,
    EmailComponent,
    CardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
