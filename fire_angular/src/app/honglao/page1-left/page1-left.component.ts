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
  
  constructor(private http: CommonService ) { }

  ngOnInit(): void {
    this.setOption();
    this.setOption2();
  }

  // 获取当前时间
  now:any = new Date();
  year = this.now.getFullYear();
  month = this.now.getMonth()+1;

  // 各地市变电站故障次数 今年去年同期
  option={};
  setOption(){
    this.option = {

      tooltip: {
        trigger:'axis',
        axisPointer:{
          type:'shadow'
        },
      },

      legend: {
        top: 20,
        textStyle: {
          color: "#fff",
          fontSize:18
        },
        itemWidth: 10,  // 设置宽度
        itemHeight: 10, // 设置高度
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
        name: '故障次数',
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
          // data: [3201,2530,1151,733,542,471,443,439,433,374,339,330,313,312],   //近十年累计变电站故障次数
          data: (function() {
            var res = []
            var len = 14
            while (len--) {
              res.push(Math.round(Math.random() * 100))
            }
            return res
          })(),
          type: 'bar',
          name:'2022',
          barWidth: 10,
          itemStyle: {
            normal: {
                barBorderRadius: 50,
                color: "#446ACF",
            }
          },
        },
        {
          data: (function() {
            var res = []
            var len = 14
            while (len--) {
              res.push(Math.round(Math.random() * 100))
            }
            return res
          })(),
          type: 'bar',
          name:'2021',
          barWidth: 10,
          itemStyle: {
            normal: {
                barBorderRadius: 50,
                color: "#4fb69d",
            }
          },
        }
      ]

    };

  }

  
  // 本年度各月份变电站故障次数统计
  option2={};
  setOption2(){

    this.option2 = {

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
           data: ['6月上旬', '6月中旬','6月下旬', '7月上旬', 
                  '7月中旬', '7月下旬', '8月上旬', '8月中旬',
                  '8月下旬', '9月上旬', '9月中旬', '9月下旬'],
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
        name: '故障次数',
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
          data: (function() {
            var res = []
            var len = 13
            while (len--) {
              res.push(Math.round(Math.random() * 100))
            }
            return res
          })(),
          type: 'bar',
        }
      ]

    };

  }


}
