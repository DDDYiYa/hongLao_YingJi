import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as echarts from 'echarts';

@Component({
  selector: 'app-page1-middle',
  templateUrl: './page1-middle.component.html',
  styleUrls: ['./page1-middle.component.css']
})
export class Page1MiddleComponent implements OnInit {
  constructor(private http:HttpClient) { }


  ngOnInit(): void {
    // 获取辽宁地图
    this.http.get('assets/map/json/province/liaoning.json')
      .subscribe(geoJson=>{echarts.registerMap('辽宁省', (geoJson) as any)})

    // 获取地图配置
    // this.getOptions();
    this.getOption2();

  }

  // bdz_data=[{name:'沈阳市',value:364}, {name:'大连市',value:307},     // 本年度变电站故障次数
  //         {name:'鞍山市',value:142}, {name:'抚顺市',value:70},
  //         {name:'本溪市',value:34}, {name:'丹东市',value:53},
  //         {name:'锦州市',value:40}, {name:'营口市',value:93},
  //         {name:'阜新市',value:35}, {name:'辽阳市',value:46},
  //         {name:'盘锦市',value:64}, {name:'铁岭市',value:52},
  //         {name:'朝阳市',value:55}, {name:'葫芦岛市',value:40}];

  bdz_data=[{name:'沈阳市',value:45381}, {name:'大连市',value:35605},     // 变电站数目
          {name:'鞍山市',value:16311}, {name:'抚顺市',value:7210},
          {name:'本溪市',value:4780}, {name:'丹东市',value:5960},
          {name:'锦州市',value:4334}, {name:'营口市',value:10669},
          {name:'阜新市',value:4384}, {name:'辽阳市',value:5358},
          {name:'盘锦市',value:4334}, {name:'铁岭市',value:6069},
          {name:'朝阳市',value:6267}, {name:'葫芦岛市',value:4077}];

  bdz_fail=[[121.549,38.9704],[121.752,39.0614],[122.959,41.1197],
            [122.98,39.6705],[121.864,39.0542],[121.652,39.0307],
            [119.737,41.108],[122.227,40.6569],[120.457,41.5706]];

  mapOptions={};

  getOptions(){
    this.mapOptions = {
      textStyle: { fontSize:18 },
      series: [ 
        {
          name: '跳闸变电站',
          type: 'scatter',
          mapType: "辽宁",
          coordinateSystem: 'geo',
          data: this.bdz_fail,
          visualMap: false,
          itemStyle: {
            color: '#FF0000',
            borderColor: "#fff", //边框白色
            borderWidth: 2,
          }
        },
        {
          type: 'map',
          mapType: "辽宁",
          itemStyle: {
            normal: {
                borderColor: 'black',
                borderType: 'dashed',
                borderWidth: 1,
                label: { show: true, color: 'black' },
            },
            emphasis: {
                borderColor: 'white',
                borderType: 'dashed',
                borderWidth: 2,
                areaColor: 'rgb(1,157,169)',
                label: { show: true, color: 'white' }
            }
          },
          data: this.bdz_data
        },
      ],
      visualMap: {
        left: '5%',
        bottom: '5%',
        min: 45381,
        max: 4077,
        text: ['高', '低'],
        textStyle: {
          fontSize: 18,
          color: 'white'
        },
        realtime: false,
        inRange: {
            color: ['#19fdff','#019da9']
        }
      },
    }
  }
  option2={};
  getOption2(){
    this.option2={
      tooltip: { show: true },
      geo: {
        geoIndex: 0,
        name: '辽宁省',
        map: '辽宁省',
        top: '5%',
        label: {
          show: true,
          textStyle: {
            color: 'black',
            fontSize: 18
          },
        },
        itemStyle: {
          borderColor: 'black',
          borderType: 'dashed',
          borderWidth: 1,
        },
        emphasis: {
          label: {
            color: 'white'
          },
          itemStyle: {
            areaColor: 'rgb(1,157,169)',
            borderColor: 'white',
            borderWidth: 2,
          }
        }
      },
      legend: {
        show: {
          'map': false,
        },
        textStyle: {
          color: '#fff',
          fontSize: 16,
        },
      },
      series: [
        {
        name:'变电站数量',
        type: 'map',
        geoIndex: 0,
        data: this.bdz_data,
        },
        {
          name: '故障变电站',
          type: 'scatter',
          coordinateSystem: 'geo',
          data: this.bdz_fail,
          visualMap: false,
          itemStyle: {
            color: 'red',
            borderColor: "#fff", //边框白色
            borderWidth: 2,      //边框宽度
          },
        }
      ],
      visualMap: {
        left: '5%',
        bottom: '5%',
        show: true,
        type: 'piecewise',
        seriesIndex: 0,
        splitList: [
          {
            lte: 5000,
            color: 'rgb(25,253,255)',
            label: '变电站数量小于5000'
          },
          {
            lt: 10000,
            gt: 5000,
            color: 'rgb(4,199,201)',
            label: '变电站数量大于5000小于10000'
          },
          {
            gte: 10000,
            color: 'rgb(1,157,169)',
            label: '变电站数量大于10000'
          }
        ],
        textStyle: {
          fontSize: 18,
          color: 'white'
        },
      },

    };


  }

}
