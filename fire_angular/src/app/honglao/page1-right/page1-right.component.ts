import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page1-right',
  templateUrl: './page1-right.component.html',
  styleUrls: ['./page1-right.component.css']
})
export class Page1RightComponent implements OnInit {

  constructor() { }

  ngOnInit(): void { this.setOption() }

  now:any = new Date();
  year = this.now.getFullYear();
  month = this.now.getMonth()+1;

  option={};
  setOption(){
    this.option={
      xAxis: {
        type: 'category',
        axisLabel: {
          interval: 0,
          rotate: 50,
          textStyle: {
            show: true,
            color: "#fff",
            fontSize: '18',
          },
        },
        data: (() => {
          var res = []
          var len = 8
          while (len--) {
            res.unshift(this.now.getDate())
            this.now = new Date(this.now - 86400000)
          }
          return res
        })()
      },
      yAxis: [{
        type: 'value',
        name: '次数',
        nameTextStyle: {
          color: 'white',
          fontSize: 16
        },
        axisLabel: {
          textStyle: {
            show: true,
            color: "#fff",
            fontSize: '18',
          },
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: 'rgba(69,105,144,0.3)',
          }
        }
      },
        {
          type: 'value',
          name: '故障处理及时率%',
          nameTextStyle: {
            color: 'white',
            fontSize: 16
          },
          axisLabel: {
            textStyle: {
              show: true,
              color: "#fff",
              fontSize: '18',
            },
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: 'rgba(69,105,144,0.3)',
            }
          }
        }],
      series: [
        {
          name: '故障次数',
          type: 'bar',
          data: (function() {
            var res = []
            var len = 8
            while (len--) {
              res.push(Math.round(Math.random() * 10))
            }
            return res
          })(),
        },
        {
          name: '故障处理及时率',
          type: 'line',
          color: '#FF4500',
          yAxisIndex: 1,
          data: (function() {
            var res = []
            var len = 0
            while (len < 8) {
              res.push((Math.random() * 90 + 5).toFixed(1))
              len++
            }
            return res
          })()
        },
      ]

    }
  }

}
