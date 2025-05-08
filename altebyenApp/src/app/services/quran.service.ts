import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QuranService {
  private readonly apiUrl = 'http://api.alquran.cloud/v1';

  constructor(private http: HttpClient) { }

  getSurahs(edition: string = 'quran-uthmani') {
    return this.http.get(`${this.apiUrl}/quran/${edition}`);
  }

  getAyahAudio(surahNumber: number, ayahNumber: number, reciter: string = 'ar.alafasy') {
    return this.http.get(`${this.apiUrl}/ayah/${surahNumber}:${ayahNumber}/${reciter}`);
  }

  getSurahDetails(surahNumber: number) {
    return this.http.get(`${this.apiUrl}/surah/${surahNumber}/ar.alafasy`);
  }
}
