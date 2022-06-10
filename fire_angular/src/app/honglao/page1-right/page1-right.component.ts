import { Component, OnInit, Input } from '@angular/core';
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
  ngOnChanges(): void { this.setOption() }

  bdz_count = new Map<string,number> ([
    ['沈阳市',45381], ['大连市' ,35605],['鞍山市',16311], ['抚顺市',7210],
    ['本溪市',4780 ], ['丹东市'  ,5960],['锦州市',4334], ['营口市',10669],
    ['阜新市',4384 ], ['辽阳市'  ,5358],['盘锦市',4334], ['铁岭市',6069],
    ['朝阳市',6267 ], ['葫芦岛市',4077], ['辽宁省',22457]]);
  bdz_fail = new Map<string,number> ([
    ['沈阳市',381], ['大连市'  ,5605],['鞍山市',311], ['抚顺市',10],
    ['本溪市',80 ], ['丹东市'  ,960],['锦州市',34], ['营口市',669],
    ['阜新市',84 ], ['辽阳市'  ,358],['盘锦市',34], ['铁岭市',69],
    ['朝阳市',67 ], ['葫芦岛市',77], ['辽宁省',457]]);
  bdz_count_city = this.bdz_count.get('辽宁省')
  bdz_fail_city = this.bdz_count.get('辽宁省')
  now:any = new Date();
  year = this.now.getFullYear();
  month = this.now.getMonth()+1;
  day = this.now.getDate()
  option={};
  @Input() regionC3:string = '';
  setOption(){
    this.bdz_count_city = this.bdz_count.get(this.regionC3)
    this.bdz_fail_city = this.bdz_fail.get(this.regionC3)
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
