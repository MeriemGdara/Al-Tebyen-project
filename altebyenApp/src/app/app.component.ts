import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service'; // Importer le service d'authentification

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'altebyenApp';
  isAuthenticated: boolean = false;
  userName: string | null = null;
  isAdmin: boolean = false;



  constructor(private authService: AuthService,private router: Router) {}

  ngOnInit(): void {
  this.authService.isAuthenticated().subscribe((status: boolean) => {
    this.isAuthenticated = status;

    const user = this.authService.getCurrentUser();
    if (status && user) {
      this.userName = user.fullname;
      this.isAdmin = user.role === 'admin'; // <-- ✅ ici
    } else {
      this.userName = null;
      this.isAdmin = false;
    }
  });
}


  // Méthode pour se déconnecter
  logout(): void {
    this.authService.logout();
    this.isAuthenticated = false;
    this.userName = null;
        this.router.navigate(['/']); // <-- Redirection après logout

  }
}
