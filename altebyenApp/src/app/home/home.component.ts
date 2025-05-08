import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  hadith: string = '';
  dhikr: string = '';
  ayah: string = '';

  contact = {
    name: '',
    email: '',
    message: ''
  };

  private ahadith: string[] = [
    'إنما الأعمال بالنيات',
    'لا يؤمن أحدكم حتى يحب لأخيه ما يحب لنفسه',
    'الدين النصيحة',
    'من لا يشكر الناس لا يشكر الله',
    'أحب الأعمال إلى الله أدومها وإن قل',
    'المرء مع من أحب',
    'من غشنا فليس منا',
    'إذا أراد الله بعبده خيرًا عجل له العقوبة في الدنيا',
    'من صبر ظفر',
    'الكلمة الطيبة صدقة'
  ];

  private adhkar: string[] = [
    'سبحان الله وبحمده، سبحان الله العظيم',
    'لا إله إلا الله وحده لا شريك له',
    'اللهم صل وسلم على نبينا محمد',
    'استغفر الله',
    'اللهم إني أسالك العفو والعافية',
    'سبحان الله والحمد لله ولا إله إلا الله والله أكبر',
    'اللهم لا سهل إلا ما جعلته سهلًا',
    'اللهم اجعلنا من أهل القرآن',
    'اللهم أجرنا من النار',
    'اللهم إني أعوذ بك من شر ما عملت'
  ];

  private ayat: string[] = [
    'وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ – هود: 88',
    'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا – الشرح: 6',
    'إِنَّ اللَّهَ مَعَ الصَّابِرِينَ – البقرة: 153',
    'إِنَّ مَعَ الْعُسْرِ يُسْرًا – الشرح: 6',
    'قُلْ رَبُّ زِدْنِي عِلْمًا – طه: 114',
    'إِنَّ اللَّهَ غَفُورٌ رَحِيمٌ – النساء: 96',
    'إِنَّ اللَّهَ قَوِيٌّ عَزِيزٌ – الفتح: 21',
    'إِنَّ اللَّهَ يَأْمُرُكُمْ أَنْ تَؤَدُّوا الأَمَانَاتِ إِلَى أَهْلِهَا – النساء: 58',
    'يُحْشَرُونَ إِلَى جَهَنَّمَ جَثِيًّا – الأنبياء: 98',
    'وَقُل رَّبُّ أَعُوذُ بِكَ مِنْ هَمَزَاتِ الشَّيَاطِينِ – المؤمنون: 97'
  ];

  constructor(private http: HttpClient) {} // ✅ injection du service HTTP

  ngOnInit() {
    this.hadith = this.getRandomItem(this.ahadith);
    this.dhikr = this.getRandomItem(this.adhkar);
    this.ayah = this.getRandomItem(this.ayat);
  }

  private getRandomItem(arr: string[]): string {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  onSubmit() {
    if (!this.contact.name || !this.contact.email || !this.contact.message) {
      alert('Veuillez remplir tous les champs.');
      return;
    }

    // Sauvegarde locale (optionnelle si tu veux garder cette partie)
    let messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    messages.push(this.contact);
    localStorage.setItem('contactMessages', JSON.stringify(messages));

    // Envoi vers serveur backend Node.js
    this.http.post('http://localhost:3000/contact', this.contact).subscribe({
      next: () => {
        alert('Message envoyé et sauvegardé avec succès !');
        this.contact = { name: '', email: '', message: '' }; // Réinitialisation
      },
      error: () => alert('Erreur lors de l\'envoi au serveur.')
    });
  }
}
