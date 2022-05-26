import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import * as echarts from 'echarts';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndexComponent } from './index/index.component';
import { Page1Component } from './index/page1/page1.component';
import {NzMenuModule} from "ng-zorro-antd/menu";
import {NzLayoutModule} from "ng-zorro-antd/layout";
import {NzGridModule} from "ng-zorro-antd/grid";
import {HttpClientModule} from "@angular/common/http";
import {NzBreadCrumbModule} from "ng-zorro-antd/breadcrumb";
import {NzTableModule} from "ng-zorro-antd/table";
import {NzSpinModule} from "ng-zorro-antd/spin";
import {NzModalModule} from "ng-zorro-antd/modal";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzSelectModule} from "ng-zorro-antd/select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgxEchartsModule} from "ngx-echarts";
import { Page2Component } from './index/page2/page2.component';
import {NzTabsModule} from "ng-zorro-antd/tabs";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzDividerModule} from "ng-zorro-antd/divider";
import { Page1LeftComponent } from './honglao/page1-left/page1-left.component';
import { Page1MiddleComponent } from './honglao/page1-middle/page1-middle.component';
import { Page1RightComponent } from './honglao/page1-right/page1-right.component';
import { HonglaoPage1Component } from './honglao/honglao-page1/honglao-page1.component';
import { HonglaoAlarmPage2Component } from './honglao/honglao-alarm-page2/honglao-alarm-page2.component';
import { Page2LeftComponent } from './honglao/honglao-alarm-page2/page2-left/page2-left.component';
import { Page2MiddleComponent } from './honglao/honglao-alarm-page2/page2-middle/page2-middle.component';
import { Page2RightComponent } from './honglao/honglao-alarm-page2/page2-right/page2-right.component';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    Page1Component,
    Page2Component,
    Page1LeftComponent,
    Page1MiddleComponent,
    Page1RightComponent,
    HonglaoPage1Component,
    HonglaoAlarmPage2Component,
    Page2LeftComponent,
    Page2MiddleComponent,
    Page2RightComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NzMenuModule,
    NzLayoutModule,
    NzGridModule,
    HttpClientModule,
    NzBreadCrumbModule,
    NzTableModule,
    NzSpinModule,
    NzModalModule,
    BrowserAnimationsModule,
    NzInputModule,
    NzFormModule,
    NzSelectModule,
    FormsModule,
    ReactiveFormsModule,
    // NgxEchartsModule,
    NgxEchartsModule.forRoot({echarts,}),
    NzTabsModule,
    NzButtonModule,
    NzDividerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
