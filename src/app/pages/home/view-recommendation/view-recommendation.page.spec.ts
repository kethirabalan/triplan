import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewRecommendationPage } from './view-recommendation.page';

describe('ViewRecommendationPage', () => {
  let component: ViewRecommendationPage;
  let fixture: ComponentFixture<ViewRecommendationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRecommendationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
