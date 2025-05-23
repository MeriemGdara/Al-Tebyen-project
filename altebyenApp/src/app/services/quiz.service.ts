import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
}

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private apiUrl = 'http://localhost:3000/api/questions';
  private apiurl = 'http://localhost:3000/api/quiz-results';

  constructor(private http: HttpClient) {}

  getQuestionsByCategory(category: string): Observable<Question[]> {
    return this.http.get<Question[]>(this.apiUrl, {
      params: { category }
    });
  }

  saveQuizResults(resultsData: any): Observable<any> {
    console.log('Envoi des données de résultats:', resultsData);

    return this.http.post(this.apiurl, resultsData); // ✅ Correction ici
  }
}
