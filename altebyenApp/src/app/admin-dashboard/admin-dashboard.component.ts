import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  activeSection = 'users';
  users: any[] = [];
  messages: any[] = [];
  categories: any[] = [];
  questions: any[] = [];
  options: any[] = [];

  newCategory = { name: '' };
  newQuestion = { category_id: null, question_text: '', answer_text: '' };
  newOption = { question_id: null, option_text: '' };

  newUser = {
    id: null as number | null,
    username: '',
    email: '',
    password: ''
  };

  isEditing = false;
  repliedEmails: string[] = [];

  constructor(private http: HttpClient, private messageService: MessageService) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadMessages();
    this.loadCategories();
    this.loadQuestions();
    this.loadOptions();

    const stored = localStorage.getItem('repliedEmails');
    if (stored) {
      this.repliedEmails = JSON.parse(stored);
    }
  }

  // ✅ Bouton répondre Gmail + sauvegarde couleur
  replyToEmail(email: string) {
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`, '_blank');

    if (!this.repliedEmails.includes(email)) {
      this.repliedEmails.push(email);
      localStorage.setItem('repliedEmails', JSON.stringify(this.repliedEmails));
    }
  }
toggleButtonColor(msg: any): void {
  msg.isClicked = !msg.isClicked;
}
toggleRead(msg: any): void {
  const newReadValue = msg.read === 1 ? 0 : 1;

  // Appel au service pour mettre à jour côté back-end
  this.messageService.updateReadStatus(msg.id, newReadValue).subscribe(() => {
    msg.read = newReadValue; // mettre à jour localement après succès
  }, error => {
    console.error("Erreur lors de la mise à jour du statut du message", error);
  });
}
  // ✅ Chargement des messages de contact
  loadMessages() {
    this.http.get<any[]>('http://localhost:3000/api/contact-messages').subscribe(
      data => this.messages = data,
      err => console.error('Erreur chargement messages', err)
    );
  }

  // ✅ Gestion des utilisateurs
  loadUsers() {
    this.http.get<any[]>('http://localhost:3000/api/users').subscribe({
      next: data => this.users = data,
      error: err => console.error('Erreur chargement utilisateurs', err)
    });
  }

  onAddUser() {
    if (!this.newUser.username || !this.newUser.email || !this.newUser.password) {
      alert('Tous les champs sont requis.');
      return;
    }

    this.http.post('http://localhost:3000/signup', this.newUser).subscribe({
      next: () => {
        this.newUser = { id: null, username: '', email: '', password: '' };
        this.loadUsers();
      },
      error: err => console.error('Erreur ajout utilisateur', err)
    });
  }

  onEditUser(user: any) {
    this.newUser = { ...user, password: '' };
    this.isEditing = true;
  }

  onUpdateUser() {
    if (!this.newUser.username || !this.newUser.email) {
      alert('Nom et email requis.');
      return;
    }

    this.http.put(`http://localhost:3000/api/users/${this.newUser.id}`, this.newUser).subscribe({
      next: () => {
        this.newUser = { id: null, username: '', email: '', password: '' };
        this.isEditing = false;
        this.loadUsers();
      },
      error: err => console.error('Erreur mise à jour', err)
    });
  }

  onDeleteUser(id: number) {
    if (confirm('Confirmer la suppression ?')) {
      this.http.delete(`http://localhost:3000/api/users/${id}`).subscribe({
        next: () => this.loadUsers(),
        error: err => console.error('Erreur suppression', err)
      });
    }
  }

  onCancelEdit() {
    this.isEditing = false;
    this.newUser = { id: null, username: '', email: '', password: '' };
  }

  // ✅ Chargement des listes
  loadCategories() {
    this.http.get<any[]>('http://localhost:3000/api/categories').subscribe(data => this.categories = data);
  }

  loadQuestions() {
    this.http.get<any[]>('http://localhost:3000/api/question').subscribe(data => this.questions = data);
  }

  loadOptions() {
    this.http.get<any[]>('http://localhost:3000/api/options').subscribe(data => this.options = data);
  }

  // ✅ Ajout catégorie
  addCategory() {
    if (!this.newCategory.name.trim()) return alert('Nom de catégorie requis');
    this.http.post('http://localhost:3000/api/categories', this.newCategory).subscribe(() => {
      this.newCategory.name = '';
      this.loadCategories();
    });
  }

  // ✅ Ajout question
  addQuestion() {
    if (!this.newQuestion.category_id || !this.newQuestion.question_text.trim() || !this.newQuestion.answer_text.trim()) {
      return alert('Tous les champs de la question sont requis');
    }
    this.http.post('http://localhost:3000/api/questions', this.newQuestion).subscribe(() => {
      this.newQuestion = { category_id: null, question_text: '', answer_text: '' };
      this.loadQuestions();
    });
  }

  // ✅ Ajout option
  addOption() {
    if (!this.newOption.question_id || !this.newOption.option_text.trim()) {
      return alert('Tous les champs de l\'option sont requis');
    }
    this.http.post('http://localhost:3000/api/options', this.newOption).subscribe(() => {
      this.newOption = { question_id: null, option_text: '' };
      this.loadOptions();
    });
  }
}
