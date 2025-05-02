import { Component } from '@angular/core';

@Component({
  selector: 'app-zakat',
  templateUrl: './zakat.component.html',
  styleUrls: ['./zakat.component.css']
})
export class ZakatComponent {
  selectedCard: string | null = null;
  

  cards = [
    {
      key: 'definition',
      icon: 'fas fa-info-circle',
      title: 'ماهي الزكاة؟',
      bubble: 'الزكاة ركن من أركان الإسلام تطهر النفس والمال.'
    },
    {
      key: 'who-should-pay',
      icon: 'fas fa-user-check',
      title: 'من تجب عليه الزكاة؟',
      bubble: 'تجب الزكاة على المسلم البالغ الحر العاقل.'
    },
    {
      key: 'nisab',
      icon: 'fas fa-balance-scale',
      title: 'ماهو النصاب؟',
      bubble: 'النصاب هو الحد الأدنى من المال الذي تجب فيه الزكاة.'
    },
    {
      key: 'benefits',
      icon: 'fas fa-gift',
      title: 'فوائد الزكاة',
      bubble: 'تزيد الزكاة من البركة وتحقق التكافل الاجتماعي.'
    },
    {
      key: 'calculation',
      icon: 'fas fa-calculator',
      title: 'كيفية حساب الزكاة؟',
      bubble: 'تحسب بنسبة 2.5% من المال إذا بلغ النصاب ومضى عليه الحول.'
    },
    {
      key: 'eligible',
      icon: 'fas fa-users',
      title: 'من يستحق الزكاة؟',
      bubble: 'يستحقها الفقراء والمساكين وغيرهم من الأصناف الثمانية.'
    }
  ];

  selectCard(cardKey: string) {
    if (this.selectedCard === cardKey) {
      this.selectedCard = null; // si je reclique sur la même, je la ferme
    } else {
      this.selectedCard = cardKey;
    }
  }

  selectedContent: string | null = null;

showContent(content: string) {
  // Fermer l'ancienne bulle d'abord
  this.selectedContent = null;

  // Puis attendre 50ms avant d'afficher la nouvelle (petite pause douce)
  setTimeout(() => {
    this.selectedContent = content;
  }, 50);
}


montant: number = 0;  // Déclarez la propriété montant
type: string = 'argent';
zakatResult: number | null = null;

calculerZakat() {
  // La zakat est 2.5% du montant qui dépasse le seuil (Nisab)
  const nisab = 5000; // Exemple de seuil (Nisab) en dinars
  let zakat = 0;

  if (this.montant >= nisab) {
    zakat = (this.montant - nisab) * 0.025;
  }

  this.zakatResult = zakat;
}

}
