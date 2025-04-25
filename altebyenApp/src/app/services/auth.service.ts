import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/register';  // URL du serveur Node.js
  private users: User[] = [];

  constructor(private http: HttpClient) {}

  // Authentifie l'utilisateur en vérifiant ses identifiants
  authenticate(email: string, password: string): Observable<User | null> {
    return this.http.post<User | null>('http://localhost:3000/login', { email, password }).pipe(
      catchError(error => {
        console.error('Erreur lors de l\'authentification:', error);
        return throwError(() => new Error('Échec de l\'authentification'));
      })
    );
  }

  // Enregistre un nouvel utilisateur
  register(email: string, password: string): Observable<User> {
    return this.http.post<User>(this.apiUrl, { email, password }).pipe(
      catchError(error => {
        console.error('Erreur lors de l\'enregistrement:', error);
        return throwError(() => new Error('Échec de l\'enregistrement'));
      })
    );
  }

  // Vérifie si l'email existe déjà dans la base de données
  isEmailTaken(email: string): Observable<boolean> {
    return this.http.get<boolean>(`http://localhost:3000/emailExists?email=${email}`).pipe(
      catchError(error => {
        console.error('Erreur lors de la vérification de l\'email:', error);
        return throwError(() => new Error('Erreur lors de la vérification de l\'email'));
      })
    );
  }

  // Déconnecte un utilisateur
  logout(): void {
    console.log('Utilisateur déconnecté.');
  }
}
