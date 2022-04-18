import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/service/common.service';
import {DatePipe} from "@angular/common";
import {NzMessageService} from "ng-zorro-antd/message";

@Component({
  selector: 'app-page1-left',
  templateUrl: './page1-left.component.html',
  styleUrls: ['./page1-left.component.css'],
  providers: [DatePipe, NzMessageService]
})
export class Page1LeftComponent implements OnInit {
  
  constructor(private http: CommonService, 
              private datePipe: DatePipe, 
              private message: NzMessageService) { }

  option={};

  ngOnInit(): void {
    this.setOption();
  }

  setOption(){

    this.option = {

      tooltip: {
        trigger:'axis',
        axisPointer:{
          type:'shadow'
        },
      },

      toolbox:{
        show: true,
        itemSize:25,
        itemGap: 15,
        showTitle:true,
        top:'4%',
        right:'8%',
        iconStyle:{
          color: 'rgba(69,105,144,0.3)',
          // borderColor: 'rgba(69,105,144,0.3)',
          // borderColor: '#fff'
        },
        feature:{
          // dataView:{
          //   show:true,
          //   title: '数据视图',
          //   lang: ['数据视图', '关闭', '刷新'],
          //   readOnly: true,
          //   backgroundColor: '#fff'
          // },
          saveAsImage:{
            title: '保存为图片'
          },
        }
      },

      xAxis: [
        {
           type: 'category',
           data: ['沈阳市', '大连市', '鞍山市', '抚顺市', '本溪市', '丹东市', '锦州市',
                 '营口市', '阜新市', '辽阳市', '盘锦市', '铁岭市', '朝阳市', '葫芦岛市'],
           axisLabel: {
             interval: 0,
             rotate: 50,
             textStyle: {
               show: true,
               color: "#fff",
               fontSize: '18',
             },
           },
           axisTick: {
             alignWithLable:true
           }
        }
      ],

      yAxis: {
        type: 'value',
        name: '跳闸次数/次',
        minInterval: 1,
        splitNumber: 4,
        nameTextStyle: {
          color: 'white',
          fontSize: 16,
          padding: [0,0,0,20]
        },
        axisLabel: {
          textStyle: {
            show: true,
            color: "#fff",
            fontSize: '16',
          },
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: 'rgba(69,105,144,0.3)',
          }
        }
      },

      series: [
        {
          // data: [364,307,142,70,34,53,40,93,35,46,64,52,55,40],
          data: [364,307,142,70,34,53,40,93,35,46,64,52,55,40],
          type: 'bar',
        }
      ]

    };

  }

}
