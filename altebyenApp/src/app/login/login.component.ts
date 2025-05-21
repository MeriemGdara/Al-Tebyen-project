import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  showError = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
  console.log('onSubmit appelé');
  console.log('Form valid?', this.loginForm.valid);
  console.log('Form values:', this.loginForm.value);
  alert(JSON.stringify(this.loginForm.value));

  if (this.loginForm.invalid) {
    this.showError = true;
    return;
  }

  const { email, password } = this.loginForm.value;

  this.authService.authenticate(email, password).pipe(
    catchError(error => {
      console.error('Erreur d\'authentification:', error);
      this.showError = true;
      return of(null);
    })
  ).subscribe(user => {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user)); // ✅ optionnel ici, déjà fait dans AuthService
      this.authService.login(user); // ✅ MET À JOUR l’état global
      this.showError = false;
      console.log('✅ Connexion réussie avec :', user.email);

      this.router.navigate(['/quiz']).then(
        (success) => {
          if (success) {
            console.log('Navigation vers /quiz réussie');
          } else {
            console.error('❌ Échec de la navigation vers /quiz');
          }
        },
        (error) => {
          console.error('Erreur lors de la navigation vers /quiz:', error);
          this.showError = true;
        }
      );
    } else {
      this.showError = true;
    }
  });
}

}
