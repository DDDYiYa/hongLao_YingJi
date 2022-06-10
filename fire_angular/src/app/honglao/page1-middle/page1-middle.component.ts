import { Component, EventEmitter, OnInit, Output} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as echarts from 'echarts';
import { STATUS_EXCEPT, STATUS_SUCCESS } from 'src/app/setting';
import { CommonService } from 'src/app/service/common.service';
import { Router} from "@angular/router";

@Component({
  selector: 'app-page1-middle',
  templateUrl: './page1-middle.component.html',
  styleUrls: ['./page1-middle.component.css']
})
export class Page1MiddleComponent implements OnInit {
  constructor(private cs:CommonService, private http:HttpClient, private router:Router) { }

  ngOnInit(): void {

    // 获取辽宁地图配置
    this.setLiaoningOption();
    // this.setCityOption('沈阳市')

  }


  // 声明变量
  option={};
  optionCity={};
  data_bdz_count=[];
  data_bdz_fail:any[]=[];
  Map: echarts.EChartsType | any;
  mapTurnBack:boolean=false;
  regionC2:string='';
  @Output()
  regionEvent = new EventEmitter()

  setLiaoningOption(){
    if (this.Map) { this.Map.dispose() }
    this.regionC2='辽宁省';
    this.regionEvent.emit(this.regionC2);
    this.mapTurnBack=false;
    // 获取dom元素，并用echart初始化
    this.Map = echarts.init(document.getElementById('map')!);
    // 获取辽宁地图
    this.http.get('assets/map/json/province/liaoning.json')
      .subscribe(geoJson=>{echarts.registerMap('辽宁省', (geoJson) as any)})
    // 获取后端数据，配置辽宁地图option
    this.cs.bdz_count().subscribe((res)=>{
      if (res.status === STATUS_SUCCESS) {
        // 获取变电站数量
        this.data_bdz_count = res.data
        this.cs.bdz_fail_today().subscribe((res1)=>{
          if (res1.status === STATUS_SUCCESS) {
            // 获取当日故障变电站坐标
            for (let i = 0; i < res1.data.length; i++) {
              this.data_bdz_fail.push([(res1.data[i].x), res1.data[i].y]) 
            }
            // 配置地图option
            this.getLiaoningOption();
            this.Map.setOption(this.option)
            // 省地图点击下钻
            this.Map.on('click', (params: any) => {
              console.log(params.name)
              this.setCityOption(params.name)
            })
          } else if (res.status === STATUS_EXCEPT) {
            console.log('获取地图今日变电站故障坐标Except');
          } else {
            console.log('获取地图今日变电站故障坐标Fail');
          }
        })        

      } else if (res.status === STATUS_EXCEPT) {
        console.log('获取地图变电站数量Except');
      } else {
        console.log('获取地图变电站数量Fail');
      }
    })


  }

  setCityOption(city:string){
    this.regionC2=city;
    this.regionEvent.emit(this.regionC2);
    this.mapTurnBack=true;
    // 获取地级市地铁
    this.http.get(`./assets/map/liaoning/${city}.json`)
      .subscribe(geoJson=>{echarts.registerMap(city, (geoJson) as any)})
    // 获取后端数据，配置辽宁地图option
    this.cs.bdz_count().subscribe((res)=>{
      if (res.status === STATUS_SUCCESS) {
        // 获取变电站数量
        this.data_bdz_count = res.data
        this.cs.bdz_fail_today().subscribe((res1)=>{
          if (res1.status === STATUS_SUCCESS) {
            // 获取当日故障变电站坐标
            for (let i = 0; i < res1.data.length; i++) {
              this.data_bdz_fail.push([(res1.data[i].x), res1.data[i].y]) 
            }
            // 配置地图option
            this.getCityOption(city);
            this.Map.setOption(this.option)
            this.Map.off('click')
          } else if (res.status === STATUS_EXCEPT) {
            console.log('获取地图今日变电站故障坐标Except');
          } else {
            console.log('获取地图今日变电站故障坐标Fail');
          }
        })        

      } else if (res.status === STATUS_EXCEPT) {
        console.log('获取地图变电站数量Except');
      } else {
        console.log('获取地图变电站数量Fail');
      }
    })


  }

  // 配置辽宁省地图option
  getLiaoningOption(){
    this.option={
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
        },
      },
      series: [
        {
        name:'变电站数量',
        type: 'map',
        geoIndex: 0,
        // data: this.bdz_data,
        data: this.data_bdz_count
        },
        {
          name: '故障变电站',
          type: 'scatter',
          coordinateSystem: 'geo',
          visualMap: false,
          itemStyle: {
            color: 'red',
            borderColor: "#fff", //边框白色
            borderWidth: 2,      //边框宽度
          },
          tooltip:{
            show:true,
            formatter:"故障变电站"
          },
          data: this.data_bdz_fail,
        }
      ],
      legend: {
        data:['故障变电站'],
        textStyle: {
          color: '#fff',
          fontSize: 16,
        },
      },
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

  // 配置辽宁省地图option
  getCityOption(city:string){
    this.option={
      tooltip: { show: true },
      geo: {
        geoIndex: 0,
        name: city,
        map: city,
        top: 'middle',
        bottom: 'auto',
        label: {
          show: true,
          textStyle: {
            color: 'black',
            fontSize: 18
          },
        },
        itemStyle: {
          areaColor: 'rgb(25,253,255)',
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
        },
      },
      series: [
        {
          name: '故障变电站',
          type: 'scatter',
          coordinateSystem: 'geo',
          visualMap: false,
          itemStyle: {
            color: 'red',
            borderColor: "#fff", //边框白色
            borderWidth: 2,      //边框宽度
          },
          tooltip:{
            show:true,
            formatter:"故障变电站"
          },
          data: this.data_bdz_fail,
        }
      ],
      visualMap: {
        show:false,
      },
      legend: {
        data:['故障变电站'],
        textStyle: {
          color: '#fff',
          fontSize: 16,
        },
      },

    };
  }

}
