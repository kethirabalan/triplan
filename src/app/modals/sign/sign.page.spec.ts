import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignPage } from './sign.page';

describe('SignPage', () => {
  let component: SignPage;
  let fixture: ComponentFixture<SignPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SignPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
