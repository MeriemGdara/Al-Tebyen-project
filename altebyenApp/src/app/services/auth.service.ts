import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators'; // Assure-toi d'importer `map`
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private registerUrl = 'http://localhost:3000/signup';
  private loginUrl = 'http://localhost:3000/login';
  private emailCheckUrl = 'http://localhost:3000/emailExists';

  constructor(private http: HttpClient) {}

  // Authentifier l'utilisateur
  authenticate(email: string, password: string): Observable<User | null> {
    return this.http.get<User[]>(`${this.loginUrl}?email=${email}&password=${password}`).pipe(
      map(users => {
        if (users.length > 0) {
          const user = users[0]; // On suppose que l'email est unique
          localStorage.setItem('currentUser', JSON.stringify(user)); // Enregistrer l'utilisateur dans le localStorage
          return user;
        } else {
          return null; // Utilisateur non trouvé
        }
      }),
      catchError(error => {
        console.error('Erreur lors de l\'authentification:', error);
        return throwError(() => new Error('Échec de l\'authentification'));
      })
    );
  }

  register(fullname: string, email: string, password: string): Observable<User> {
    return this.http.post<User>(this.registerUrl, { fullname, email, password }).pipe(
      catchError(error => {
        console.error('Erreur lors de l\'enregistrement:', error);
        return throwError(() => new Error('Échec de l\'enregistrement'));
      })
    );
  }

  isEmailTaken(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.emailCheckUrl}?email=${email}`).pipe(
      catchError(error => {
        console.error('Erreur lors de la vérification de l\'email:', error);
        return throwError(() => new Error('Erreur lors de la vérification de l\'email'));
      })
    );
  }

  logout(): void {
    // Supprime l'utilisateur connecté du localStorage
    localStorage.removeItem('currentUser');
    console.log('Utilisateur déconnecté.');
  }

  // Récupérer l'utilisateur connecté
  getCurrentUser(): User | null {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
  }

  // Vérifier si l'utilisateur est connecté
  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated(): boolean {
    // Par exemple, vérifiez la présence d'un token dans le localStorage
    const userToken = localStorage.getItem('userToken'); // ou tout autre méthode que vous utilisez pour l'authentification
    return !!userToken; // Retourne vrai si un token existe
  }
}
