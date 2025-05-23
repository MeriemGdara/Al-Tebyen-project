import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MessageService {
  constructor(private http: HttpClient) {}

  getMessages(): Observable<any[]> {
    return this.http.get<any[]>('/api/messages');
  }

updateReadStatus(id: number, read: number) {
  return this.http.put(`http://localhost:3000/api/messages/${id}/read`, { read });
}


}
