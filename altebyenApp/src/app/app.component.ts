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
    // Vérifier si l'utilisateur est connecté au chargement du composant
    const user = this.authService.getCurrentUser();
    if (user) {
      this.isAuthenticated = true;
      this.userName = user.fullname;
    }
  }

  // Méthode pour se déconnecter
  logout(): void {
    this.authService.logout();
    this.isAuthenticated = false;
    this.userName = null;
  }
}
