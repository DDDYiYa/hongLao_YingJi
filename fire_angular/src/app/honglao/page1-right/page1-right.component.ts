import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/service/common.service';
import { STATUS_EXCEPT, STATUS_SUCCESS } from 'src/app/setting';

@Component({
  selector: 'app-page1-right',
  templateUrl: './page1-right.component.html',
  styleUrls: ['./page1-right.component.css']
})
export class Page1RightComponent implements OnInit {

  constructor(private cs: CommonService ) { }

  ngOnInit(): void { this.setOption() }

  now:any = new Date();
  year = this.now.getFullYear();
  month = this.now.getMonth()+1;
  day = this.now.getDate()
  option={};
  setOption(){
    this.cs.rightbottom().subscribe((res)=>{
      if (res.status === STATUS_SUCCESS) {
        // 获取数据
        const dataB_x=[];
        const dataB_y=[];
        for (let i = 0; i < res.data.length; i++) {
          dataB_x.push(res.data[i].time)
          dataB_y.push(res.data[i].count)
        }

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
            // data: dataB_x
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
              name: '故障处理率%',
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
              data: dataB_y,
              // data: (function() {
              //   var res = []
              //   var len = 8
              //   while (len--) {
              //     res.push(Math.round(Math.random() * 10))
              //   }
              //   return res
              // })(),
            },
            {
              name: '故障处理率',
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
      } else if (res.status === STATUS_EXCEPT) {
        console.log('获取左下数据Except');
      } else {
        console.log('获取左下数据Fail');
      }

    })

  }

}
