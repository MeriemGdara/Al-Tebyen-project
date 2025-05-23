import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { QuizComponent } from './quiz/quiz.component';
import { SignupComponent } from './signup/signup.component';
import { ZakatComponent } from './zakat/zakat.component';
import {QuranComponent} from './quran/quran.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { BiblioComponent } from './biblio/biblio.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    ZakatComponent,
    QuizComponent,
    QuranComponent,
    AdminDashboardComponent,
    BiblioComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
