import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-honglao-page1',
  templateUrl: './honglao-page1.component.html',
  styleUrls: ['./honglao-page1.component.css']
})
export class HonglaoPage1Component implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  regionP:string = '辽宁省';
  regionChange(region: string){
    this.regionP= region;
  }

}
