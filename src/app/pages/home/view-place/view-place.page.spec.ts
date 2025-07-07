import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewPlacePage } from './view-place.page';

describe('ViewPlacePage', () => {
  let component: ViewPlacePage;
  let fixture: ComponentFixture<ViewPlacePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPlacePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
