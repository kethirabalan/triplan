import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AiPlanPage } from './ai-plan.page';

describe('AiPlanPage', () => {
  let component: AiPlanPage;
  let fixture: ComponentFixture<AiPlanPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AiPlanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
