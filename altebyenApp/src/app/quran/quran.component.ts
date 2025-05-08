import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { QuranService } from '../services/quran.service';

@Component({
  selector: 'app-quran',
  templateUrl: './quran.component.html',
  styleUrls: ['./quran.component.css']
})
export class QuranComponent implements OnInit {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef;
  surahs: any[] = [];
  currentSurah: any;
  currentAyah: any;
  audioUrl: string | null = null;
  currentReciter = 'ar.alafasy';

  constructor(private quranService: QuranService) { }

  ngOnInit() {
    this.loadSurahs();
  }

  loadSurahs() {
    this.quranService.getSurahs().subscribe({
      next: (response: any) => {
        this.surahs = response.data.surahs;
        this.loadSurah(1); // Charger la première sourate par défaut
      },
      error: (err) => console.error('Erreur:', err)
    });
  }

  loadSurah(surahNumber: number) {
    this.quranService.getSurahDetails(surahNumber).subscribe({
      next: (response: any) => {
        this.currentSurah = response.data;
        this.currentAyah = this.currentSurah.ayahs[0];
        this.updateAudio();
      }
    });
  }

  updateAudio() {
    if (this.currentAyah) {
      this.quranService.getAyahAudio(
        this.currentSurah.number,
        this.currentAyah.numberInSurah,
        this.currentReciter
      ).subscribe({
        next: (response: any) => {
          this.audioUrl = response.data.audio;
          this.playAudio();
        }
      });
    }
  }

  playAudio() {
    const audio = this.audioPlayer.nativeElement;
    audio.load();
    audio.play().catch((err: any) => console.error('Erreur audio:', err));
  }

  nextAyah() {
    const index = this.currentSurah.ayahs.indexOf(this.currentAyah);
    if (index < this.currentSurah.ayahs.length - 1) {
      this.currentAyah = this.currentSurah.ayahs[index + 1];
      this.updateAudio();
    }
  }

  previousAyah() {
    const index = this.currentSurah.ayahs.indexOf(this.currentAyah);
    if (index > 0) {
      this.currentAyah = this.currentSurah.ayahs[index - 1];
      this.updateAudio();
    }
  }
}
