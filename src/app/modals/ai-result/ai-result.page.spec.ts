import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AiResultPage } from './ai-result.page';

describe('AiResultPage', () => {
  let component: AiResultPage;
  let fixture: ComponentFixture<AiResultPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AiResultPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
