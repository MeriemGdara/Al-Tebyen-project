import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuranService {

  private apiUrl = 'http://api.alquran.cloud/v1/quran';  // Base URL for the Quran API

  constructor(private http: HttpClient) { }

  // Function to get Quran in text or audio format based on the edition
  getQuran(edition: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${edition}`);
  }
}
