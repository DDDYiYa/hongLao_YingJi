import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Page2MiddleComponent } from './page2-middle.component';

describe('Page2MiddleComponent', () => {
  let component: Page2MiddleComponent;
  let fixture: ComponentFixture<Page2MiddleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Page2MiddleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Page2MiddleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
