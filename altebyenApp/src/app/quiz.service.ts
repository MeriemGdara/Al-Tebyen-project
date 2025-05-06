import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  constructor(private http: HttpClient) {}

  getQuiz(classe: string) {
    return this.http.get<any>('assets/quiz.json').pipe(
      map(data => data[classe])
    );
  }
}
