import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Page2LeftComponent } from './page2-left.component';

describe('Page2LeftComponent', () => {
  let component: Page2LeftComponent;
  let fixture: ComponentFixture<Page2LeftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Page2LeftComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Page2LeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
