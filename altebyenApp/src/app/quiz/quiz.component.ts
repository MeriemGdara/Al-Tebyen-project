import { Component, OnDestroy, OnInit } from '@angular/core';
import { QuizService, Question } from '../services/quiz.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit, OnDestroy {
  classes: string[] = ['الطهارة', 'السيرة النبوية', 'القرآن', 'الصلاة', 'الزكاة'];
  selectedClass: string = '';
  questions: Question[] = [];
  currentIndex: number = 0;
  currentQuestion: Question | null = null;
  score: number = 0;
  quizStarted: boolean = false;
  quizFinished: boolean = false;

  minutes: number = 0;
  seconds: number = 0;
  timer: any;
  isLoading: boolean = false;
  isSaving: boolean = false; // Nouvel état pour le sauvegarde

  userAnswers: { question: string, selected: string, correct: string }[] = [];

  constructor(private quizService: QuizService) {}

  ngOnInit(): void {}

  startQuiz(): void {
    if (!this.selectedClass) {
      alert('الرجاء اختيار فئة قبل بدء الاختبار.');
      return;
    }

    this.isLoading = true;
    this.quizService.getQuestionsByCategory(this.selectedClass).subscribe({
      next: (data) => {
        this.isLoading = false;
        if (!data?.length) {
          this.quizStarted = false;
          alert('لا توجد أسئلة متاحة لهذه الفئة.');
          return;
        }
        this.initializeQuiz(data);
      },
      error: (error) => this.handleQuizError(error)
    });
  }

  private initializeQuiz(data: Question[]): void {
    this.questions = data;
    this.currentIndex = 0;
    this.score = 0;
    this.userAnswers = [];
    this.quizFinished = false;
    this.quizStarted = true;
    this.currentQuestion = this.questions[this.currentIndex];
    this.startTimer(5);
  }

  private handleQuizError(error: any): void {
    this.isLoading = false;
    console.error('Error loading questions:', error);
    alert('خطأ في تحميل الأسئلة. الرجاء المحاولة لاحقا.');
  }

  startTimer(durationInMinutes: number): void {
    this.minutes = durationInMinutes;
    this.seconds = 0;
    clearInterval(this.timer);
    this.timer = setInterval(() => this.updateTimer(), 1000);
  }

  private updateTimer(): void {
    if (this.seconds === 0) {
      if (this.minutes === 0) {
        this.endQuiz();
        return;
      }
      this.minutes--;
      this.seconds = 59;
    } else {
      this.seconds--;
    }
  }

  checkAnswer(option: string): void {
    if (this.quizFinished || !this.currentQuestion) return;

    this.recordAnswer(option);
    this.moveToNextQuestion();
  }

  private recordAnswer(option: string): void {
    this.userAnswers.push({
      question: this.currentQuestion!.question,
      selected: option,
      correct: this.currentQuestion!.answer
    });

    if (option === this.currentQuestion!.answer) {
      this.score++;
    }
  }

  private moveToNextQuestion(): void {
    this.currentIndex++;
    if (this.currentIndex < this.questions.length) {
      this.currentQuestion = this.questions[this.currentIndex];
    } else {
      this.endQuiz();
    }
  }

  endQuiz(): void {
    if (this.quizFinished) return;

    this.quizFinished = true;
    this.quizStarted = false;
    clearInterval(this.timer);

    this.saveQuizResults();
  }

  private saveQuizResults(): void {
    this.isSaving = true;

    const resultsData = {
      user_id: this.getUserId(),
      category: this.selectedClass,
      score: this.score,
      total_questions: this.questions.length,
      answers: this.userAnswers
    };

    this.quizService.saveQuizResults(resultsData).subscribe({
      next: () => this.handleSaveSuccess(),
      error: (err) => this.handleSaveError(err),
      complete: () => this.isSaving = false
    });
  }

  private getUserId(): number {
    // À remplacer par un vrai système d'authentification
    return Number(localStorage.getItem('user_id')) || 1;
  }

  private handleSaveSuccess(): void {
    console.log('Résultats sauvegardés avec succès');
    // Ajouter une notification utilisateur si nécessaire
  }

  private handleSaveError(err: any): void {
    console.error('Erreur de sauvegarde:', err);
    alert('خطأ في حفظ النتائج. الرجاء المحاولة لاحقا.');
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }
}
