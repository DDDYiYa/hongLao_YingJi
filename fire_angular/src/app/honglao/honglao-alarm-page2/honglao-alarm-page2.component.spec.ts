import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HonglaoAlarmPage2Component } from './honglao-alarm-page2.component';

describe('HonglaoAlarmPage2Component', () => {
  let component: HonglaoAlarmPage2Component;
  let fixture: ComponentFixture<HonglaoAlarmPage2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HonglaoAlarmPage2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HonglaoAlarmPage2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
