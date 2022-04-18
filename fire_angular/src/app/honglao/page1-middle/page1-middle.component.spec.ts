import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Page1MiddleComponent } from './page1-middle.component';

describe('Page1MiddleComponent', () => {
  let component: Page1MiddleComponent;
  let fixture: ComponentFixture<Page1MiddleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Page1MiddleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Page1MiddleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
