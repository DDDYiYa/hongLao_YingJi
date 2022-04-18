import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Page1LeftComponent } from './page1-left.component';

describe('Page1LeftComponent', () => {
  let component: Page1LeftComponent;
  let fixture: ComponentFixture<Page1LeftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Page1LeftComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Page1LeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
