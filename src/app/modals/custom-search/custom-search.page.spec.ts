import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomSearchPage } from './custom-search.page';

describe('CustomSearchPage', () => {
  let component: CustomSearchPage;
  let fixture: ComponentFixture<CustomSearchPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomSearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
