import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-biblio',
  templateUrl: './biblio.component.html',
  styleUrls: ['./biblio.component.css']
})
export class BiblioComponent {
  videos = [
    { titre: '🕌 الصلاة في الإسلام', url: 'https://www.youtube.com/embed/cEgLPdur4T4?si=IRUrNc5OcMXXegk-' },
    { titre:' 📖قيام الليل ', url: 'https://www.youtube.com/embed/-dNvW7azAPU?si=VQV8OFcs1a4owKwL' },
    { titre: '🤝 البركة في الحياة', url: 'https://www.youtube.com/embed/xkcJIXDP9sw?si=m_wCsV4Qo24Ca6Wx' },
    { titre: '🌙 شهر رمضان المبارك', url: 'https://www.youtube.com/embed/4nDI1qzd7q0?si=jNolFwkPoGAe69Vs' },
    { titre: '📖 حسن الظن بالله', url: 'https://www.youtube.com/embed/0Xj4o0mFhT4?si=lcx7hIWW4HDVeBgb' },
    { titre: '🕋 الطريق الى الله', url: 'https://www.youtube.com/embed/vU1jcbqvZvo?si=KzZpzygroPZZCtgX' },
    { titre: '👪 الطريق الى النجاح', url: 'https://www.youtube.com/embed/kRgcmYTwVz4?si=XCWVojs4XNpZd3D3' },
  ];

  selectedVideo: SafeResourceUrl;
  currentVideo: any;

  constructor(private sanitizer: DomSanitizer) {
    this.currentVideo = this.videos[0];
    this.selectedVideo = this.sanitizeUrl(this.currentVideo.url);
  }

  sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  selectVideo(video: any) {
    this.currentVideo = video;
    this.selectedVideo = this.sanitizeUrl(video.url);
  }
}
