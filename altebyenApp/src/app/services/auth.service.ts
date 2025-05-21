import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators'; // Assure-toi d'importer `map`
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private registerUrl = 'http://localhost:3000/signup';
  private loginUrl = 'http://localhost:3000/login';
  private emailCheckUrl = 'http://localhost:3000/emailExists';

  constructor(private http: HttpClient) { }

  // Authentifier l'utilisateur
  authenticate(email: string, password: string): Observable<User | null> {
    return this.http.post<User>(this.loginUrl, { email, password }).pipe(
      map(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        return user;
      }),
      catchError(error => {
        console.error('Erreur lors de l\'authentification:', error);
        return throwError(() => new Error('Échec de l\'authentification'));
      })
    );
  }

  register(username: string, email: string, password: string): Observable<User> {
    return this.http.post<User>(this.registerUrl, { username, email, password }).pipe(
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
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  isAuthenticated(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  login(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
    this.loggedIn.next(true);
  }

  logout() {
    localStorage.removeItem('user');
    this.loggedIn.next(false);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('user');
  }


  // Récupérer l'utilisateur connecté
  getCurrentUser(): User | null {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
  }
}
