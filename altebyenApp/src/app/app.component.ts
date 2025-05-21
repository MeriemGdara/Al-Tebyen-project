import { Component, OnInit } from '@angular/core';
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


  constructor(private authService: AuthService) {}

  ngOnInit(): void {
  // Abonnement pour mise à jour automatique
  this.authService.isAuthenticated().subscribe((status: boolean) => {
    this.isAuthenticated = status;

    const user = this.authService.getCurrentUser();
    if (status && user) {
      this.userName = user.fullname;
    } else {
      this.userName = null;
    }
  });
}

  // Méthode pour se déconnecter
  logout(): void {
    this.authService.logout();
    this.isAuthenticated = false;
    this.userName = null;
  }
}
