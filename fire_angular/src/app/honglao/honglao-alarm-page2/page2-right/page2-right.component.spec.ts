import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Page2RightComponent } from './page2-right.component';

describe('Page2RightComponent', () => {
  let component: Page2RightComponent;
  let fixture: ComponentFixture<Page2RightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Page2RightComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Page2RightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
