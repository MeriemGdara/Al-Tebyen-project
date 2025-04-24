import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  showError = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {  // Assure-toi d'utiliser authService ici
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.authenticate(email, password).subscribe(user => {  // Et ici aussi, utilise authService
        if (user) {
          console.log('Connexion réussie avec :', user.email);
          this.showError = false;
          // Tu peux rediriger l'utilisateur vers une autre page ou initialiser une session
        } else {
          console.log('Identifiants incorrects');
          this.showError = true;
        }
      });
    } else {
      this.showError = true;
    }
  }
}
