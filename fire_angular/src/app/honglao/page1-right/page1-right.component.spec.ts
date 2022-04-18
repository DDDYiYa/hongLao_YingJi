import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Page1RightComponent } from './page1-right.component';

describe('Page1RightComponent', () => {
  let component: Page1RightComponent;
  let fixture: ComponentFixture<Page1RightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Page1RightComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Page1RightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
