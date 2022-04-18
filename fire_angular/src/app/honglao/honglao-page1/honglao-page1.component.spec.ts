import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HonglaoPage1Component } from './honglao-page1.component';

describe('HonglaoPage1Component', () => {
  let component: HonglaoPage1Component;
  let fixture: ComponentFixture<HonglaoPage1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HonglaoPage1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HonglaoPage1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
