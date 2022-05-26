import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {Page1Component} from "./index/page1/page1.component";
import {IndexComponent} from "./index/index.component";
import {Page2Component} from "./index/page2/page2.component";
import { HonglaoPage1Component } from './honglao/honglao-page1/honglao-page1.component';
import { HonglaoAlarmPage2Component } from './honglao/honglao-alarm-page2/honglao-alarm-page2.component';

const routes: Routes = [
  {
    path: '', component: IndexComponent, children: [
      { path: '', pathMatch: 'full', redirectTo: '/honglao' },
      { path: 'honglao', component: HonglaoPage1Component },
      { path: 'honglaoAlarm', component: HonglaoAlarmPage2Component },
      { path: 'history', component: Page2Component },
      { path: '**', redirectTo: '/honglao' },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
