import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { User } from '../models/user.model';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private registerUrl = 'http://localhost:3000/signup';
  private loginUrl = 'http://localhost:3000/login';
  private emailCheckUrl = 'http://localhost:3000/emailExists';

  constructor(private http: HttpClient) {}

  authenticate(email: string, password: string): Observable<User | null> {
    return this.http.post<User | null>(this.loginUrl, { email, password }).pipe(
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
    console.log('Utilisateur déconnecté.');
  }
}
