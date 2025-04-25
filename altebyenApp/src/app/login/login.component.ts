import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

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

    // Authentification de l'utilisateur via le service AuthService
    this.authService.authenticate(email, password).pipe(
      catchError(error => {
        console.error('Erreur d\'authentification:', error);
        this.showError = true;
        return of(null); // retourne null en cas d'erreur
      })
    ).subscribe(user => {
      if (user) {
        this.showError = false;
        console.log('✅ Connexion réussie avec :', user.email);

        // Si l'utilisateur est authentifié avec succès, redirige vers la page "home"
        this.router.navigate(['/home']);
      } else {
        // Si l'authentification échoue, afficher un message d'erreur
        this.showError = true;
      }
    });
  }
}
