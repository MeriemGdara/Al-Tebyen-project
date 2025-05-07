import { Component, OnDestroy, OnInit } from '@angular/core';
import { QuizService } from '../quiz.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit, OnDestroy {
  classes: string[] = ['الطهارة', 'السيرة النبوية', 'القرآن', 'الصلاة', 'الزكاة'];
  selectedClass: string = '';
  questions: any[] = [];
  currentIndex: number = 0;
  currentQuestion: any;
  score: number = 0;
  quizStarted: boolean = false;
  quizFinished: boolean = false;

  minutes: number = 0;
  seconds: number = 0;
  timer: any;

  userAnswers: { question: string, selected: string, correct: string }[] = [];

  constructor(private quizService: QuizService) {}

  ngOnInit(): void {}

  startQuiz(): void {
    this.quizService.getQuiz(this.selectedClass).subscribe(data => {
      this.questions = data;
      this.currentIndex = 0;
      this.score = 0;
      this.userAnswers = [];
      this.quizFinished = false;
      this.quizStarted = true;
      this.currentQuestion = this.questions[this.currentIndex];
      this.startTimer(5); // durée en minutes
    });
  }

  startTimer(durationInMinutes: number): void {
    this.minutes = durationInMinutes;
    this.seconds = 0;
    this.timer = setInterval(() => {
      if (this.seconds === 0) {
        if (this.minutes === 0) {
          this.endQuiz();
        } else {
          this.minutes--;
          this.seconds = 59;
        }
      } else {
        this.seconds--;
      }
    }, 1000);
  }

  checkAnswer(option: string): void {
    this.userAnswers.push({
      question: this.currentQuestion.question,
      selected: option,
      correct: this.currentQuestion.answer
    });

    if (option === this.currentQuestion.answer) {
      this.score++;
    }

    this.currentIndex++;

    if (this.currentIndex < this.questions.length) {
      this.currentQuestion = this.questions[this.currentIndex];
    } else {
      this.endQuiz();
    }
  }

  endQuiz(): void {
    this.quizFinished = true;
    this.quizStarted = false;
    clearInterval(this.timer);
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }
}
