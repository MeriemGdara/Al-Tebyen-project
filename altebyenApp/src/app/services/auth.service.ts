import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'assets/bd.json'; // Le chemin vers ton fichier JSON

  constructor(private http: HttpClient) {}

  // Fonction pour vérifier l'utilisateur dans la base de données simulée
  authenticate(email: string, password: string): Observable<any> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(users => {
        return users.find(user => user.email === email && user.password === password);
      })
    );
  }
}
