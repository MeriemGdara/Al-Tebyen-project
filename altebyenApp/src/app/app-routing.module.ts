import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { QuizComponent } from './quiz/quiz.component';
import { SignupComponent } from './signup/signup.component';
import { ZakatComponent } from './zakat/zakat.component';
import { QuranComponent } from './quran/quran.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { BiblioComponent } from './biblio/biblio.component';

const routes: Routes = [
  { path: 'Login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: '', component: HomeComponent},
  { path: 'zakat', component: ZakatComponent},
  { path: 'quran', component: QuranComponent},
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: 'quiz', component: QuizComponent},
  { path: 'admin', component: AdminDashboardComponent},
  { path: 'biblio', component: BiblioComponent}

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
