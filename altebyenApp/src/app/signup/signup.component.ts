import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  emailExists = false;
  success = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      fullname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const { fullname, email, password } = this.signupForm.value;

      this.authService.isEmailTaken(email).subscribe(isTaken => {
        if (isTaken) {
          this.emailExists = true;
          this.success = false;
        } else {
          this.authService.register(fullname, email, password).subscribe(user => {
            console.log('Utilisateur enregistré :', user.email);
            this.success = true;
            this.emailExists = false;
            this.signupForm.reset();
            this.router.navigate(['/Login']);
          });
        }
      });
    }
  }
}
