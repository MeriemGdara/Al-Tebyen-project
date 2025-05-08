import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuranReaderComponent } from './quran.component';

describe('QuranComponent', () => {
  let component: QuranReaderComponent;
  let fixture: ComponentFixture<QuranReaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuranReaderComponent]
    });
    fixture = TestBed.createComponent(QuranReaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
