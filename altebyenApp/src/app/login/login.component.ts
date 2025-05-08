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
        localStorage.setItem('currentUser', JSON.stringify(user)); // Stocker l'utilisateur dans le localStorage
        this.showError = false;
        console.log('✅ Connexion réussie avec :', user.email);
        this.router.navigate(['/home']);
      } else {
        this.showError = true;
      }
    });
  }

}
