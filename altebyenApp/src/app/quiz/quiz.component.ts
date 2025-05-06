import { Component, OnInit } from '@angular/core';
import { QuizService } from '../quiz.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  classes: string[] = ['الطهارة', 'السيرة النبوية', 'القرآن الكريم']; // ajoute ici les classes que tu as dans ton JSON
  selectedClass: string = '';
  questions: any[] = [];
  currentIndex: number = 0;
  currentQuestion: any;
  score: number = 0;
  quizStarted: boolean = false;
  quizFinished: boolean = false;

  constructor(private quizService: QuizService) {}

  ngOnInit() {}

  startQuiz() {
    this.quizService.getQuiz(this.selectedClass).subscribe(data => {
      this.questions = data;
      this.currentIndex = 0;
      this.score = 0;
      this.quizFinished = false;
      this.quizStarted = true;
      this.currentQuestion = this.questions[this.currentIndex];
    });
  }

  checkAnswer(selectedOption: string) {
    if (selectedOption === this.currentQuestion.answer) {
      this.score++;
    }

    this.currentIndex++;

    if (this.currentIndex < this.questions.length) {
      this.currentQuestion = this.questions[this.currentIndex];
    } else {
      this.quizFinished = true;
      this.quizStarted = false;
    }
  }
}
