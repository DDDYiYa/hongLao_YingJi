import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {EChartsType} from "echarts/types/dist/echarts";
import {CommonService} from "../../service/common.service";
import {STATUS_EXCEPT, STATUS_SUCCESS} from "../../setting";
import * as echarts from "echarts";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-page1',
  templateUrl: './page1.component.html',
  styleUrls: ['./page1.component.css']
})
export class Page1Component implements OnInit {
  myChart?: EChartsType | any
  region = '';
  bdzXYNList: any[] = [];
  cityOption = {};
  provinceOption = {};
  listOfBdzCount:any[] = [];
  validateForm !: FormGroup;
  Valid = true;
  fireX ?: number;
  fireY ?: number;
  isFire ?: boolean;
  list: { name: any; value: any[]; }[] | undefined;
  BarFive ?: any;
  BarTen ?: any;
  BarFifteen ?: any;
  tabs = [1, 2, 3];
  selectedIndex: any;
  inputFireLoading = false;
  historyData ?: any;
  nowData = new Date().getDate();
  nowYear = new Date().getFullYear();
  nowMouth = new Date().getMonth() + 1;
  nowHours = new Date().getHours();
  nowMinutes = new Date().getMinutes();
  nowSeconds = new Date().getSeconds();
  dataTime = this.nowYear + '/' + this.nowMouth + '/' + this.nowData + '/' + this.nowHours + ':' + this.nowMinutes + ':' + this.nowSeconds;
  userInform ?: any;
  userTypeNum ?: any;
  userCity ?: any;
  BarResUserNumByCity ?: any;
  BarEnpUserNumByCity ?: any;
  RCity ?: any;
  RNum ?: any;
  ECity ?: any;
  ENum ?: any;
  PieFive?: any;
  PieFive2?: any;
  PieTen?: any;
  PieTen2?: any;
  PieFifteen?: any;
  PieFifteen2?: any;
  submitFireLoading: any;
  isVisibleMoreHis: any;

  constructor(private route: ActivatedRoute, private commonService: CommonService, private router: Router,
              private formBuilder: FormBuilder) { }


  ngOnInit(): void {
    
    this.commonService.bdz_count().subscribe(
      bdzNum => {
        if (bdzNum.status === STATUS_SUCCESS) {
          console.log('获取各地级市变电站数目SUCCESS');
          this.listOfBdzCount = bdzNum.data;
        }
      }
    )

    /*this.commonService.getUserType().subscribe(
      typeNum => {
        if (typeNum.status === STATUS_SUCCESS) {
          this.userTypeNum = typeNum.data
          console.log('typeNum.data', typeNum.data)
        }
      }, error => {
        console.log('getUserTypeError')
      }, () => {
        this.getPieUserType();
      }
    )*/
    this.commonService.getMaxNumCity().subscribe(
      MaxNumCity => {
        if (MaxNumCity.status == STATUS_SUCCESS) {
          this.RCity = MaxNumCity.data.RCity
          this.ECity = MaxNumCity.data.ECity
          this.RNum = MaxNumCity.data.RNum
          this.ENum = MaxNumCity.data.ENum
        }
      }
    )
    this.commonService.getHistoryQuery().subscribe(
      HistoryQuery => {
        if (HistoryQuery.status === STATUS_SUCCESS) {
          this.historyData = HistoryQuery.data
        }
      })
    // 根据id获取地图
    const elementById: HTMLElement | null = document.getElementById('fireMap');
    if (elementById) {
      this.route.queryParams.subscribe(value => {
        // 清空myChart
        if (this.myChart) {
          this.myChart.dispose()
        }
        // 只显示省级地图，不显示市级地图
        this.myChart = echarts.init(elementById)
        this.getProvinceMapData();
      })
    }

    // 起火点输入框
    this.validateForm = this.formBuilder.group({
      city: [null, [Validators.required]],
      longitude: [null, [Validators.required]],
      latitude: [null, [Validators.required]],
    })

  }


  // 获取省级地图数据
  getProvinceMapData() {
    this.commonService.getUserCity().subscribe(
      userNum => {
        if (userNum.status === STATUS_SUCCESS) {
          // this.listOfBdzCount = userNum.data;
          this.commonService.getLNMap().subscribe(ProvinceMapValue => {
            let seriesData: any = {}
            const cityList = Object.keys(userNum.data);
            for (let city of cityList) {
              seriesData[city + '市'] = userNum.data[city]['城镇居民'] + userNum.data[city]['乡村居民'] +
                userNum.data[city]['第一产业'] + userNum.data[city]['第二产业'] + userNum.data[city]['第三产业']
            }
            this.userCity = userNum.data;
            this.getBarResUserNumByCity();
            this.getBarEnpUserNumByCity();
            echarts.registerMap('辽宁', ProvinceMapValue)
            let max_value = 0;
            let min_value = 0;
            Object.keys(seriesData).map(city => {
              max_value = Math.max(seriesData[city], max_value)
              min_value = Math.min(seriesData[city], min_value)
            })
            const jg = 5000;
            this.provinceOption = {
              tooltip: {
                formatter: '{b}',
                textStyle: {
                  fontSize: 20,
                }
              },
              legend: {
                show: true,
                top: '1%',
                orient: 'horizontal',
                left: 'center',
                textStyle: {
                  fontSize: 18,//字体大小
                  color: '#ffffff'//字体颜色
                },
              },
              grid: {
                top: '1%'
              },
              visualMap: {
                type: 'piecewise',
                show: true,
                min: min_value,
                max: max_value,
                left: 'left',
                top: '1%',
                textStyle: {
                  color: '#ffffff',
                  fontSize: 17
                },
                seriesIndex: 0,
                splitList: [
                  {
                    gt: Math.floor(((max_value-min_value)/4*3 + min_value)/jg)*jg,
                    color: 'rgb(1,100,132)',
                    label: '总用户数目大于'+ (Math.floor(((max_value-min_value)/5*4 + min_value)/jg)*jg).toString() +'个'
                  },
                  {
                    gte: Math.floor(((max_value-min_value)/4*2 + min_value)/jg)*jg,
                    lte: Math.floor(((max_value-min_value)/4*3 + min_value)/jg)*jg,
                    color: 'rgb(1,157,169)',
                    label: '总用户数目'+(Math.floor(((max_value-min_value)/4*2 + min_value)/jg)*jg).toString()+'-'+(Math.floor(((max_value-min_value)/4*3 + min_value)/jg)*jg)+'个'
                  },
                  {
                    gte: Math.floor(((max_value-min_value)/4 + min_value)/jg)*jg,
                    lte: Math.floor(((max_value-min_value)/4*2 + min_value)/jg)*jg,
                    color: 'rgb(4,199,201)',
                    label: '总用户数目'+(Math.floor(((max_value-min_value)/4 + min_value)/jg)*jg).toString()+'-'+(Math.floor(((max_value-min_value)/4*2 + min_value)/jg)*jg).toString()+'个'
                  },
                  {
                    lte: Math.floor(((max_value-min_value)/4 + min_value)/jg)*jg,
                    color: 'rgb(25,253,255)',
                    label: '总用户数目小于'+(Math.floor(((max_value-min_value)/4 + min_value)/jg)*jg).toString()+'个'
                  }
                ],
                calculable: true
              },
              geo: {
                map: '辽宁',
                roam: false,
                zoom: 1,
                label: {
                  position: 'center',
                  normal: {
                    show: true,
                    textStyle: {
                      color: 'black',
                      fontSize: 19,
                      fontWeight: 550
                    }
                  }
                },
                itemStyle: {
                  normal: {
                    borderColor: 'rgba(0, 0, 0, 0.2)'
                  },
                  emphasis: {
                    areaColor: null,
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    shadowBlur: 20,
                    borderWidth: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              },
              series: [
                {
                  type: 'map',
                  coordinateSystem: 'geo',
                  geoIndex: 0,
                  // symbolSize: 20,
                  symbol: 'none',
                  symbolRotate: 35,
                  label: {
                    normal: {
                      formatter: '{b}',
                      position: 'right',
                      show: false
                    },
                    emphasis: {
                      show: true
                    }
                  },
                  itemStyle: {
                    normal: {
                      color: '#F06C00'
                    }
                  }
                },
                {
                  type: 'map',
                  geoIndex: 0,
                  data: Object.keys(seriesData).map(city=>{ return { name: city, value:seriesData[city], label: null } })
                }
              ]
            };
            console.log('this.provinceOption1', this.provinceOption);
            this.myChart.setOption(this.provinceOption);
            this.myChart.off('click');
          })
        } else if (userNum.status === STATUS_EXCEPT) {
          console.log('获取各地级市变电站数目Except');
        } else {
          console.log('获取各地级市变电站数目Fail');
        }
      },
    )
  }

  // 获取城市地图数据
  getCityMapDataLimited(limitedDis: number) {
    // 获取变电站list信息
    const paramData = {city: this.region, dis: limitedDis}
    this.commonService.bdz_list_limited(paramData).subscribe(
      bdzValue => {
        this.bdzXYNList = []
        if (bdzValue.status === STATUS_SUCCESS) {
          console.log('获取变电站数据列表SUCCESS');
          for (let i = 0; i < bdzValue.data.length; i++) {
            const info: { companyName: string, x: number, y: number }[] = [];
            info[0] = bdzValue.data[i].bdz_name;
            info[1] = bdzValue.data[i].bdz_x;
            info[2] = bdzValue.data[i].bdz_y;
            this.bdzXYNList.push(info);
          }
          // 将获取到的变电站list信息加入map信息
          this.commonService.getCityMap(this.region).subscribe(
            cityMapValue => {
              echarts.registerMap(this.region, cityMapValue);
              this.list = this.bdzXYNList.map(com => {
                return {
                  name: com[0],
                  value: [com[1], com[2]],
                }
              })
              console.log('this.list', this.list)
              // 地图上标注起火点
              this.cityOption = {
                legend: {
                  show: false
                },
                tooltip: {
                  confine: true,
                  textStyle: {
                    fontSize: 20
                  },
                  formatter(params: any) {
                    const s = params.name;
                    return s;
                  }
                },
                geo: {
                  itemStyle: {
                    normal: {
                      borderWidth: 2,
                      borderColor: '#19fdfd',
                      areaColor: '#45C2E0',
                    },
                  },
                  map: this.region,
                  roam: false,
                  zoom: 1,
                  label: {
                    normal: {
                      show: true,
                      textStyle: {
                        color: 'rgba(0,0,0,0.4)',
                        fontSize: 20,
                        fontWeight: 'bold',
                      }
                    }
                  },
                },
                series: [
                  /*{
                    data: this.list,
                    name: '变电站',
                    type: 'scatter',
                    // geoIndex: 0,
                    coordinateSystem: 'geo',
                    symbolSize: 5,
                    zlevel: 0,
                    itemStyle: {
                      color: 'rgb(102,255,36)'
                    }
                  },*/
                  {
                    data: [{name: '起火点',
                      value: [this.fireX, this.fireY]}],
                    // name: '起火点',
                    showEffectOn: 'render',
                    zlevel: 2,
                    // data: [[this.fireX, this.fireY]],
                    // add: 3213,
                    type: 'effectScatter',
                    coordinateSystem: 'geo',
                    symbolSize: 3 + limitedDis,
                    itemStyle: {
                      color: 'red'
                    }
                  },
                ]
              };
            }, error => {
              console.log(error);
            }, () => {
              this.myChart.setOption(this.cityOption)
              this.myChart.off('click');
            }
          )
        }
        else if (bdzValue.status === STATUS_EXCEPT) {
          console.log('获取变电站数据列表Except');
        } else {
          console.log('获取变电站数据列表Fail')
        }
      }
    )
  }

  // 数字转换成字符串(为显示",")
  showFireInform =  false;
  inputFireInformShow = false;

  fireCity: any;



  // 弹出起火点输入框
  ShowInputFireInform() {
    this.commonService.getHistoryQuery().subscribe(
      HistoryQuery => {
        if (HistoryQuery.status === STATUS_SUCCESS) {
          this.historyData = HistoryQuery.data
          this.inputFireInformShow = true;
        }
    })
  }

  // 提交起火点信息，弹出山火影响范围框
  NextModal() {
    console.log('submit', this.validateForm.value);
    this.region = '辽宁省';
    this.fireX = this.validateForm.value.longitude;
    this.fireY = this.validateForm.value.latitude;
    this.isFire = true;
    this.inputFireLoading = true;
    this.submitFireLoading = true;
    this.commonService.changeDis({city: this.region, X: this.fireX, Y: this.fireY, datetime: this.dataTime}).subscribe(
      res => {
        if (res.status === STATUS_SUCCESS) {
          this.inputFireLoading = false;
          this.userInform = res.data;
          console.log('this.userInform', this.userInform)
          this.commonService.getUserDis({dis: 5}).subscribe(
            res1 => {
              if (res1.status === STATUS_SUCCESS) {
                this.getFireProvinceMapData();
                this.submitFireLoading = false;
                this.showFireInform = true;
                this.getPieFive();
                this.getPieFive2(this.userInform);
                console.log('res1.data', res1.data)
                this.getBarFive(res1.data);
                this.getPieTen();
                this.getPieTen2(this.userInform);
                this.getBarTen(res1.data);
                this.getPieFifteen();
                this.getPieFifteen2(this.userInform);
                this.getBarFifteen(res1.data);
              }
            }
          )
        }
      }
    )
  }

  getPieFive() {
    this.PieFive = {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'horizontal',
        left: '2%',
        right: '2%',
        bottom: '3%',
        textStyle: {
          // color: 'white',
          fontSize: 13,
        },
        formatter: (params: any) => {
          return params.slice(0,4)
        }
      },
      series: [
        {
          name: '用户数量',
          type: 'pie',
          center: ['50%','40%'],
          radius: ['45%','60%'],
          label: {
            show: true,
            fontSize: 16,
          },
          data: [
            {
              name: '城镇居民', value: this.userInform['5km']['城镇居民'], itemStyle: {color: '#2db7f5'}
            },
            {
              name: '乡村居民', value: this.userInform['5km']['乡村居民'], itemStyle: {color: 'rgb(25,253,255)'}
            },
            {
              name: '第一产业', value: this.userInform['5km']['第一产业'], itemStyle: {color: '#cd201f'}
            },
            {
              name: '第二产业', value: this.userInform['5km']['第二产业'], itemStyle: {color: '#f35336'}
            },
            {
              name: '第三产业', value: this.userInform['5km']['第三产业'], itemStyle: {color: '#8c4356'}
            }
          ]
        },
      ]
    };

  }
  getPieFive2(userInform: any) {
    this.PieFive2 = {
      color: ['#2db7f5', '#f50'],
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'horizontal',
        left: '24%',
        right: '24%',
        bottom: '3%',
        textStyle: {
          // color: 'white',
          fontSize: 16,
        },
        formatter: (params: any) => {
          return params.slice(0,4)
        }
      },
      series: [
        {
          type: 'pie',
          radius: ['60%', '70%'],
          center: ['50%', '40%'],
          label: {
            normal: {
              position: 'center',
              formatter:  this.numberToStr(userInform['5km']['城镇居民']+userInform['5km']['乡村居民']+userInform['5km']['第一产业']+userInform['5km']['第二产业']+userInform['5km']['第三产业']),
              textStyle: {
                fontSize: 20
              }
            },
          },
          data: [{value: userInform['5km']['城镇居民']+userInform['5km']['乡村居民'], name: '居民用户数量'},
            {value: userInform['5km']['第一产业']+userInform['5km']['第二产业']+userInform['5km']['第三产业'], name: '企业用户数量'}]
        },
        ]
    };
  }
  getBarFive(userDis: any) {
    this.BarFive = {
      color: [ '#45C2E0'],
      tooltip: {
        trigger: 'item',
      },
      grid: {
        left: '1%',
        right: '15%',
        bottom: '5%',
        top: '15%',
        containLabel: true
      },
      xAxis:
        {
          type: 'category',
          data: ['0-1km', '1-2km', '2-3km', '3-4km', '4-5km'],
          axisLabel: {
            textStyle: {
              fontSize: 16,
              color: 'lightBlack'
            },
            rotate: 50,
          },
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              type: 'dashed',
              color: 'rgba(69,105,144,0.3)',
            }
          }
        },
      yAxis: {
        type: 'value',
        name: '单位：户',
        minInterval: 1,
        splitNumber: 4,
        nameTextStyle: {
          fontSize: 16,
        },
        axisLabel: {
          textStyle: {
            fontSize: 16,
          }
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
          // name: '用户按距离分布',
          type: 'bar',
          stack: 'ad',
          barWidth: 20,
          emphasis: {
            focus: 'axis'
          },
          data: [userDis['one'], userDis['two'], userDis['three'], userDis['four'], userDis['five']],
        },
      ]
    };
  }

  getPieTen() {
    this.PieTen = {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'horizontal',
        left: '2%',
        right: '22%',
        bottom: '3%',
        textStyle: {
          // color: 'white',
          fontSize: 13,
        },
        /*formatter: (params: any) => {
          return params.slice(0,4)
        }*/
      },
      series: [
        {
          name: '用户数量',
          type: 'pie',
          center: ['50%','40%'],
          radius: ['45%','60%'],
          label: {
            show: true,
            fontSize: 16,
          },
          data: [
            {
              name: '城镇居民', value: this.userInform['10km']['城镇居民'], itemStyle: {color: '#2db7f5'}
            },
            {
              name: '乡村居民', value: this.userInform['10km']['乡村居民'], itemStyle: {color: 'rgb(25,253,255)'}
            },
            {
              name: '第一产业', value: this.userInform['10km']['第一产业'], itemStyle: {color: '#cd201f'}
            },
            {
              name: '第二产业', value: this.userInform['10km']['第二产业'], itemStyle: {color: '#f35336'}
            },
            {
              name: '第三产业', value: this.userInform['10km']['第三产业'], itemStyle: {color: '#8c4356'}
            }
          ]
        },
      ]
    };

  }
  getPieTen2(userInform: any) {
    this.PieTen2 = {
      color: ['#2db7f5', '#f50'],
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'horizontal',
        left: '24%',
        right: '24%',
        bottom: '3%',
        textStyle: {
          // color: 'white',
          fontSize: 16,
        },
        formatter: (params: any) => {
          return params.slice(0,4)
        }
      },
      series: [
        {
          type: 'pie',
          radius: ['60%', '70%'],
          center: ['50%', '40%'],
          label: {
            normal: {
              position: 'center',
              formatter:  this.numberToStr(userInform['10km']['城镇居民']+userInform['10km']['乡村居民']+userInform['10km']['第一产业']+userInform['10km']['第二产业']+userInform['10km']['第三产业']),
              textStyle: {
                fontSize: 20
              }
            },
          },
          data: [{value: userInform['10km']['城镇居民']+userInform['10km']['乡村居民'], name: '居民用户数量'},
            {value: userInform['10km']['第一产业']+userInform['10km']['第二产业']+userInform['10km']['第三产业'], name: '企业用户数量'}]
        },
      ]
    };
  }
  getBarTen(userDis: any) {
    this.BarTen = {
      color: [ '#45C2E0'],
      tooltip: {
        trigger: 'item',
      },
      grid: {
        left: '1%',
        right: '15%',
        bottom: '5%',
        top: '15%',
        containLabel: true
      },
      xAxis:
        {
          type: 'category',
          data: ['5-6km', '6-7km', '7-8km', '8-9km', '9-10km'],
          axisLabel: {
            textStyle: {
              fontSize: 16,
              color: 'lightBlack'
            },
            rotate: 50,
          },
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              type: 'dashed',
              color: 'rgba(69,105,144,0.3)',
            }
          }
        },
      yAxis: {
        type: 'value',
        name: '单位：户',
        minInterval: 1,
        splitNumber: 4,
        nameTextStyle: {
          fontSize: 16,
        },
        axisLabel: {
          textStyle: {
            fontSize: 16,
          }
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
          type: 'bar',
          stack: 'ad',
          barWidth: 20,
          emphasis: {
            focus: 'axis'
          },
          data: [userDis['one'], userDis['two'], userDis['three'], userDis['four'], userDis['five']],
        },
      ]
    };
  }

  getPieFifteen() {
    this.PieFifteen = {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'horizontal',
        left: '2%',
        right: '2%',
        bottom: '3%',
        textStyle: {
          fontSize: 13,
        },
        formatter: (params: any) => {
          return params.slice(0,4)
        }
      },
      series: [
        {
          name: '用户数量',
          type: 'pie',
          center: ['50%','40%'],
          radius: ['45%','60%'],
          label: {
            show: true,
            fontSize: 16,
          },
          data: [
            {
              name: '城镇居民', value: this.userInform['15km']['城镇居民'], itemStyle: {color: '#2db7f5'}
            },
            {
              name: '乡村居民', value: this.userInform['15km']['乡村居民'], itemStyle: {color: 'rgb(25,253,255)'}
            },
            {
              name: '第一产业', value: this.userInform['15km']['第一产业'], itemStyle: {color: '#cd201f'}
            },
            {
              name: '第二产业', value: this.userInform['15km']['第二产业'], itemStyle: {color: '#f35336'}
            },
            {
              name: '第三产业', value: this.userInform['15km']['第三产业'], itemStyle: {color: '#8c4356'}
            }
          ]
        },
      ]
    };

  }
  getPieFifteen2(userInform: any) {
    this.PieFifteen2 = {
      color: ['#2db7f5', '#f50'],
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'horizontal',
        left: '24%',
        right: '24%',
        bottom: '3%',
        textStyle: {
          fontSize: 16,
        },
        formatter: (params: any) => {
          return params.slice(0,4)
        }
      },
      series: [
        {
          type: 'pie',
          radius: ['60%', '70%'],
          center: ['50%', '40%'],
          label: {
            normal: {
              position: 'center',
              formatter:  this.numberToStr(userInform['15km']['城镇居民']+userInform['15km']['乡村居民']+userInform['15km']['第一产业']+userInform['15km']['第二产业']+userInform['15km']['第三产业']),
              textStyle: {
                fontSize: 20
              }
            },
          },
          data: [{value: userInform['15km']['城镇居民']+userInform['15km']['乡村居民'], name: '居民用户数量'},
            {value: userInform['15km']['第一产业']+userInform['15km']['第二产业']+userInform['15km']['第三产业'], name: '企业用户数量'}]
        },
      ]
    };
  }
  getBarFifteen(userDis: any) {
    this.BarFifteen = {
      color: [ '#45C2E0'],
      tooltip: {
        trigger: 'item',
      },
      grid: {
        left: '1%',
        right: '15%',
        bottom: '5%',
        top: '15%',
        containLabel: true
      },
      xAxis:
        {
          type: 'category',
          data: ['10-11km', '11-12km', '12-13km', '13-14km', '14-15km'],
          axisLabel: {
            textStyle: {
              fontSize: 16,
              color: 'lightBlack'
            },
            rotate: 50,
          },
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              type: 'dashed',
              color: 'rgba(69,105,144,0.3)',
            }
          }
        },
      yAxis: {
        type: 'value',
        name: '单位：户',
        minInterval: 1,
        splitNumber: 4,
        nameTextStyle: {
          fontSize: 16,
        },
        axisLabel: {
          textStyle: {
            fontSize: 16,
          }
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
          type: 'bar',
          stack: 'ad',
          barWidth: 20,
          emphasis: {
            focus: 'axis'
          },
          data: [userDis['one'], userDis['two'], userDis['three'], userDis['four'], userDis['five']],
        },
      ]
    };
  }

  getBarResUserNumByCity() {
    const cityList = Object.keys(this.userCity)
    const UrbanUser = []
    const RuralUser = []
    for (let city of cityList) {
      UrbanUser.push(this.userCity[city]['城镇居民'])
      RuralUser.push(this.userCity[city]['乡村居民'])
    }
    this.BarResUserNumByCity = {
      color: [ '#45C2E0','#DC143C'],
      tooltip: {
        trigger: 'item',
      },
      legend: {
        bottom: '0%',
        left: 'center',
        itemGap: 30,
        textStyle: {
          color: 'white',
          fontSize: 16,
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '5%',
        top: '25%',
        containLabel: true
      },
      xAxis:
        {
          type: 'category',
          data: cityList,
          axisLabel: {
            textStyle: {
              color: 'white',
              fontSize: 16,
            },
            rotate: 50,
          },
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              type: 'dashed',
              color: 'rgba(69,105,144,0.3)',
            }
          }
        },
      yAxis: {
        type: 'value',
        name: '单位：户',
        minInterval: 1,
        splitNumber: 4,
        nameTextStyle: {
          color: 'white',
          fontSize: 16,
          padding: [0,0,0,20]
        },
        axisLabel: {
          textStyle: {
            color: 'white',
            fontSize: 16,
          }
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
          name: '城镇居民',
          type: 'bar',
          stack: 'ad',
          barWidth: 20,
          emphasis: {
            focus: 'series'
          },
          data: UrbanUser
        },
        {
          name: '乡村居民',
          type: 'bar',
          stack: 'ad',
          barWidth: 20,
          emphasis: {
            focus: 'series'
          },
          data: RuralUser
        },
      ]
    };

  }

  getBarEnpUserNumByCity() {
    const cityList = Object.keys(this.userCity)
    const FirIndustryUser = []
    const SenIndustryUser = []
    const ThrIndustryUser = []
    for (let city of cityList) {
      FirIndustryUser.push(this.userCity[city]['第一产业'])
      SenIndustryUser.push(this.userCity[city]['第二产业'])
      ThrIndustryUser.push(this.userCity[city]['第三产业'])
    }
    this.BarEnpUserNumByCity = {
      color: ['#FF8C00', '#45C2E0','#DC143C'],
      tooltip: {
        trigger: 'item',
      },
      legend: {
        bottom: '0%',
        left: 'center',
        itemGap: 30,
        textStyle: {
          color: 'white',
          fontSize: 16,
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '5%',
        top: '25%',
        containLabel: true
      },
      xAxis:
        {
          type: 'category',
          data: cityList,
          axisLabel: {
            textStyle: {
              color: 'white',
              fontSize: 16,
            },
            rotate: 50,
          },
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              type: 'dashed',
              color: 'rgba(69,105,144,0.3)',
            }
          }
        },
      yAxis: {
        type: 'value',
        name: '单位：户',
        minInterval: 1,
        splitNumber: 4,
        nameTextStyle: {
          color: 'white',
          fontSize: 16,
          padding: [0,0,0,20]
        },
        axisLabel: {
          textStyle: {
            color: 'white',
            fontSize: 16,
          }
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
          name: '第一产业',
          type: 'bar',
          stack: 'ad',
          barWidth: 20,
          emphasis: {
            focus: 'series'
          },
          data: FirIndustryUser
        },
        {
          name: '第二产业',
          type: 'bar',
          stack: 'ad',
          barWidth: 20,
          emphasis: {
            focus: 'series'
          },
          data: SenIndustryUser
        },
        {
          name: '第三产业',
          type: 'bar',
          stack: 'ad',
          barWidth: 20,
          emphasis: {
            focus: 'series'
          },
          data: ThrIndustryUser
        }
      ]
    };
  }


  /*getPieUserType() {
    /!*this.PieUserType = {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'horizontal',
        left: '24%',
        right: '24%',
        bottom: '3%',
        textStyle: {
          color: 'white',
          fontSize: 16,
        },
        formatter: (params: any) => {
          return params.slice(0,4)
        }
      },
      series: [
        {
          name: '用户数量',
          type: 'pie',
          center: ['50%','40%'],
          radius: ['45%','60%'],
          label: {
            show: true,
            color: 'white',
            fontSize: 16,
            /!*formatter: (params: any) => {
              return params.data.name.slice(0,3) + ': ' + (params.data.value * 100 / CompanySumNumber).toFixed(2) + '%'
            },*!/
          },
          data: [
            {
              name: '城镇居民', value: this.userTypeNum['城镇居民'], itemStyle: {color: '#3b5999'}
            },
            {
              name: '乡村居民', value: this.userTypeNum['乡村居民'], itemStyle: {color: '#98bed8'}
            },
            {
              name: '第一产业', value: this.userTypeNum['第一产业'], itemStyle: {color: '#cd201f'}
            },
            {
              name: '第二产业', value: this.userTypeNum['第二产业'], itemStyle: {color: '#f35336'}
            },
            {
              name: '第三产业', value: this.userTypeNum['第三产业'], itemStyle: {color: '#8c4356'}
            }
          ]
        },
        {
          name: '用户数量',
          type: 'pie',
          radius: ['0%','30%'],
          center: ['50%','40%'],
          label: {
            show: false
          },
          labelLine: {
            lineStyle: {
              width: 2,
              color: 'white'
            },
          },
          data: [
            {
              name: '居民用户', value: this.userTypeNum['城镇居民'] + this.userTypeNum['乡村居民'], itemStyle: {color: '#2db7f5'}
            },
            {
              name: '企业用户', value: this.userTypeNum['第一产业'] + this.userTypeNum['第二产业'] + this.userTypeNum['第三产业'], itemStyle: {color: '#f50'}
            },
          ]
        }
      ]
    };*!/
  }*/

  // 关闭山火影响范围框
  showFireInformCancel() {
    this.validateForm.reset();
    this.commonService.getLNMap().subscribe(ProvinceMapValue => {
      let seriesData: any = {}
      const cityList = Object.keys(this.userCity);
      for (let city of cityList) {
        seriesData[city + '市'] = this.userCity[city]['城镇居民'] + this.userCity[city]['乡村居民'] +
          this.userCity[city]['第一产业'] + this.userCity[city]['第二产业'] + this.userCity[city]['第三产业']
      }
      echarts.registerMap('辽宁', ProvinceMapValue)
      let max_value = 0;
      let min_value = 0;
      Object.keys(seriesData).map(city => {
        max_value = Math.max(seriesData[city], max_value)
        min_value = Math.min(seriesData[city], min_value)
      })
      const jg = 5000;
      this.provinceOption = {
        tooltip: {
          formatter: '{b}',
          textStyle: {
            fontSize: 20,
          }
        },
        legend: {
          show: true,
          top: '1%',
          orient: 'horizontal',
          left: 'center',
          textStyle: {
            fontSize: 18,//字体大小
            color: '#ffffff'//字体颜色
          },
        },
        grid: {
          top: '1%'
        },
        visualMap: {
          type: 'piecewise',
          show: true,
          min: min_value,
          max: max_value,
          left: 'left',
          top: '1%',
          textStyle: {
            color: '#ffffff',
            fontSize: 17
          },
          seriesIndex: 0,
          splitList: [
            {
              gt: Math.floor(((max_value-min_value)/4*3 + min_value)/jg)*jg,
              color: 'rgb(1,100,132)',
              label: '总用户数目大于'+ (Math.floor(((max_value-min_value)/5*4 + min_value)/jg)*jg).toString() +'个'
            },
            {
              gte: Math.floor(((max_value-min_value)/4*2 + min_value)/jg)*jg,
              lte: Math.floor(((max_value-min_value)/4*3 + min_value)/jg)*jg,
              color: 'rgb(1,157,169)',
              label: '总用户数目'+(Math.floor(((max_value-min_value)/4*2 + min_value)/jg)*jg).toString()+'-'+(Math.floor(((max_value-min_value)/4*3 + min_value)/jg)*jg)+'个'
            },
            {
              gte: Math.floor(((max_value-min_value)/4 + min_value)/jg)*jg,
              lte: Math.floor(((max_value-min_value)/4*2 + min_value)/jg)*jg,
              color: 'rgb(4,199,201)',
              label: '总用户数目'+(Math.floor(((max_value-min_value)/4 + min_value)/jg)*jg).toString()+'-'+(Math.floor(((max_value-min_value)/4*2 + min_value)/jg)*jg).toString()+'个'
            },
            {
              lte: Math.floor(((max_value-min_value)/4 + min_value)/jg)*jg,
              color: 'rgb(25,253,255)',
              label: '总用户数目小于'+(Math.floor(((max_value-min_value)/4 + min_value)/jg)*jg).toString()+'个'
            }
          ],
          calculable: true
        },
        geo: {
          map: '辽宁',
          roam: false,
          zoom: 1,
          label: {
            position: 'center',
            normal: {
              show: true,
              textStyle: {
                color: 'black',
                fontSize: 19,
                fontWeight: 550
              }
            }
          },
          itemStyle: {
            normal: {
              borderColor: 'rgba(0, 0, 0, 0.2)'
            },
            emphasis: {
              areaColor: null,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowBlur: 20,
              borderWidth: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        },
        series: [
          {
            type: 'map',
            coordinateSystem: 'geo',
            geoIndex: 0,
            // symbolSize: 20,
            symbol: 'none',
            symbolRotate: 35,
            label: {
              normal: {
                formatter: '{b}',
                position: 'right',
                show: false
              },
              emphasis: {
                show: true
              }
            },
            itemStyle: {
              normal: {
                color: '#F06C00'
              }
            }
          },
          {
            type: 'map',
            geoIndex: 0,
            data: Object.keys(seriesData).map(city => {
              return {
                name: city, value: seriesData[city], label: null
              }
            })
          },
          {
            data: [{name: '起火点',
              value: [116.23, 39.54]}],
            type: 'effectScatter',
            coordinateSystem: 'geo',
            symbolSize: 20,
            itemStyle: {
              color: 'red'
            }},
        ]
      };
      console.log('this.provinceOption1', this.provinceOption);
      this.myChart.setOption(this.provinceOption);
      this.myChart.off('click');
    },
      error => {},
      () => {
      this.inputFireInformShow = false;
      this.showFireInform = false;
      console.log('this.provinceOption', this.provinceOption);
    })
  }

  // 数字转换为字符串，目的是加入','
  numberToStr(inputNumber: { toString: () => string; }): string {
    let Str = '';
    if (inputNumber.toString().length > 6) {
      // tslint:disable-next-line:max-line-length
      Str =
        inputNumber.toString().slice(0, inputNumber.toString().length - 3) +
        ',' +
        inputNumber
          .toString()
          .slice(
            inputNumber.toString().length - 3,
            inputNumber.toString().length - 6
          ) +
        ',' +
        inputNumber
          .toString()
          .slice(
            inputNumber.toString().length - 6,
            inputNumber.toString().length
          );
    } else if (inputNumber.toString().length > 3) {
      // tslint:disable-next-line:max-line-length
      Str =
        inputNumber.toString().slice(0, inputNumber.toString().length - 3) +
        ',' +
        inputNumber
          .toString()
          .slice(
            inputNumber.toString().length - 3,
            inputNumber.toString().length
          );
    } else {
      Str = inputNumber.toString();
    }
    return Str;
  }

  changeTabs() {
    console.log('selectedIndex', this.selectedIndex)
    this.getCityMapDataLimited((this.selectedIndex+1) * 5);
    this.commonService.getUserDis({dis: (this.selectedIndex+1) * 5}).subscribe(
      res => {
        this.getBarFive(res.data);
        this.getBarTen(res.data);
        this.getBarFifteen(res.data);
    }
    )
  }

  lookDetail(x: any, y: any) {
    this.region = '辽宁省';
    this.fireX = x;
    this.fireY = y;
    this.isFire = true;
    this.commonService.changeDis({city: this.region, X: this.fireX, Y: this.fireY, datetime: this.dataTime}).subscribe(
      res => {
        if (res.status === STATUS_SUCCESS) {
          this.userInform = res.data;
          console.log('this.userInform', this.userInform)
          this.commonService.getUserDis({dis: 5}).subscribe(
            res1 => {
              if (res1.status === STATUS_SUCCESS) {
                this.commonService.getLNMap().subscribe(ProvinceMapValue => {
                    let seriesData: any = {}
                    const cityList = Object.keys(this.userCity);
                    for (let city of cityList) {
                      seriesData[city + '市'] = this.userCity[city]['城镇居民'] + this.userCity[city]['乡村居民'] +
                        this.userCity[city]['第一产业'] + this.userCity[city]['第二产业'] + this.userCity[city]['第三产业']
                    }
                    echarts.registerMap('辽宁', ProvinceMapValue)
                    let max_value = 0;
                    let min_value = 0;
                    Object.keys(seriesData).map(city => {
                      max_value = Math.max(seriesData[city], max_value)
                      min_value = Math.min(seriesData[city], min_value)
                    })
                    const jg = 5000;
                    this.provinceOption = {
                      tooltip: {
                        formatter: '{b}',
                        textStyle: {
                          fontSize: 20,
                        }
                      },
                      legend: {
                        show: true,
                        top: '1%',
                        orient: 'horizontal',
                        left: 'center',
                        textStyle: {
                          fontSize: 18,//字体大小
                          color: '#ffffff'//字体颜色
                        },
                      },
                      grid: {
                        top: '1%'
                      },
                      visualMap: {
                        type: 'piecewise',
                        show: true,
                        min: min_value,
                        max: max_value,
                        left: 'left',
                        top: '1%',
                        textStyle: {
                          color: '#ffffff',
                          fontSize: 17
                        },
                        seriesIndex: 0,
                        splitList: [
                          {
                            gt: Math.floor(((max_value-min_value)/4*3 + min_value)/jg)*jg,
                            color: 'rgb(1,100,132)',
                            label: '总用户数目大于'+ (Math.floor(((max_value-min_value)/5*4 + min_value)/jg)*jg).toString() +'个'
                          },
                          {
                            gte: Math.floor(((max_value-min_value)/4*2 + min_value)/jg)*jg,
                            lte: Math.floor(((max_value-min_value)/4*3 + min_value)/jg)*jg,
                            color: 'rgb(1,157,169)',
                            label: '总用户数目'+(Math.floor(((max_value-min_value)/4*2 + min_value)/jg)*jg).toString()+'-'+(Math.floor(((max_value-min_value)/4*3 + min_value)/jg)*jg)+'个'
                          },
                          {
                            gte: Math.floor(((max_value-min_value)/4 + min_value)/jg)*jg,
                            lte: Math.floor(((max_value-min_value)/4*2 + min_value)/jg)*jg,
                            color: 'rgb(4,199,201)',
                            label: '总用户数目'+(Math.floor(((max_value-min_value)/4 + min_value)/jg)*jg).toString()+'-'+(Math.floor(((max_value-min_value)/4*2 + min_value)/jg)*jg).toString()+'个'
                          },
                          {
                            lte: Math.floor(((max_value-min_value)/4 + min_value)/jg)*jg,
                            color: 'rgb(25,253,255)',
                            label: '总用户数目小于'+(Math.floor(((max_value-min_value)/4 + min_value)/jg)*jg).toString()+'个'
                          }
                        ],
                        calculable: true
                      },
                      geo: {
                        map: '辽宁',
                        roam: false,
                        zoom: 1,
                        label: {
                          position: 'center',
                          normal: {
                            show: true,
                            textStyle: {
                              color: 'black',
                              fontSize: 19,
                              fontWeight: 550
                            }
                          }
                        },
                        itemStyle: {
                          normal: {
                            borderColor: 'rgba(0, 0, 0, 0.2)'
                          },
                          emphasis: {
                            areaColor: null,
                            shadowOffsetX: 0,
                            shadowOffsetY: 0,
                            shadowBlur: 20,
                            borderWidth: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                          }
                        }
                      },
                      series: [
                        {
                          type: 'map',
                          coordinateSystem: 'geo',
                          geoIndex: 0,
                          // symbolSize: 20,
                          symbol: 'none',
                          symbolRotate: 35,
                          label: {
                            normal: {
                              formatter: '{b}',
                              position: 'right',
                              show: false
                            },
                            emphasis: {
                              show: true
                            }
                          },
                          itemStyle: {
                            normal: {
                              color: '#F06C00'
                            }
                          }
                        },
                        {
                          type: 'map',
                          geoIndex: 0,
                          data: Object.keys(seriesData).map(city => {
                            return {
                              name: city, value: seriesData[city], label: null
                            }
                          })
                        },
                        {
                          data: [{name: '起火点',
                            value: [this.fireX, this.fireY]}],
                          type: 'effectScatter',
                          coordinateSystem: 'geo',
                          symbolSize: 20,
                          itemStyle: {
                            color: 'red'
                          }},


                      ]
                    };
                    console.log('this.provinceOption1', this.provinceOption);
                    this.myChart.setOption(this.provinceOption);
                    this.myChart.off('click');
                  },
                  error => {console.log(error)}
                  )
                // this.getFireProvinceMapData();
                /*this.commonService.getUserCity().subscribe(
                  userNum => {
                    if (userNum.status === STATUS_SUCCESS) {
                      this.commonService.getLNMap().subscribe(ProvinceMapValue => {
                        let seriesData: any = {}
                        const cityList = Object.keys(userNum.data);
                        for (let city of cityList) {
                          seriesData[city + '市'] = userNum.data[city]['城镇居民'] + userNum.data[city]['乡村居民'] +
                            userNum.data[city]['第一产业'] + userNum.data[city]['第二产业'] + userNum.data[city]['第三产业']
                        }
                        this.userCity = userNum.data;
                        this.getBarResUserNumByCity();
                        this.getBarEnpUserNumByCity();
                        echarts.registerMap('辽宁', ProvinceMapValue)
                        let max_value = 0;
                        let min_value = 0;
                        Object.keys(seriesData).map(city => {
                          max_value = Math.max(seriesData[city], max_value)
                          min_value = Math.min(seriesData[city], min_value)
                        })
                        const jg = 5000;
                        this.provinceOption = {
                          tooltip: {
                            formatter: '{b}',
                            textStyle: {
                              fontSize: 20,
                            }
                          },
                          legend: {
                            show: true,
                            top: '1%',
                            orient: 'horizontal',
                            left: 'center',
                            textStyle: {
                              fontSize: 18,//字体大小
                              color: '#ffffff'//字体颜色
                            },
                          },
                          grid: {
                            top: '1%'
                          },
                          visualMap: {
                            type: 'piecewise',
                            show: true,
                            min: min_value,
                            max: max_value,
                            left: 'left',
                            top: '1%',
                            textStyle: {
                              color: '#ffffff',
                              fontSize: 17
                            },
                            seriesIndex: 0,
                            splitList: [
                              {
                                gt: Math.floor(((max_value-min_value)/4*3 + min_value)/jg)*jg,
                                color: 'rgb(1,100,132)',
                                label: '总用户数目大于'+ (Math.floor(((max_value-min_value)/5*4 + min_value)/jg)*jg).toString() +'个'
                              },
                              {
                                gte: Math.floor(((max_value-min_value)/4*2 + min_value)/jg)*jg,
                                lte: Math.floor(((max_value-min_value)/4*3 + min_value)/jg)*jg,
                                color: 'rgb(1,157,169)',
                                label: '总用户数目'+(Math.floor(((max_value-min_value)/4*2 + min_value)/jg)*jg).toString()+'-'+(Math.floor(((max_value-min_value)/4*3 + min_value)/jg)*jg)+'个'
                              },
                              {
                                gte: Math.floor(((max_value-min_value)/4 + min_value)/jg)*jg,
                                lte: Math.floor(((max_value-min_value)/4*2 + min_value)/jg)*jg,
                                color: 'rgb(4,199,201)',
                                label: '总用户数目'+(Math.floor(((max_value-min_value)/4 + min_value)/jg)*jg).toString()+'-'+(Math.floor(((max_value-min_value)/4*2 + min_value)/jg)*jg).toString()+'个'
                              },
                              {
                                lte: Math.floor(((max_value-min_value)/4 + min_value)/jg)*jg,
                                color: 'rgb(25,253,255)',
                                label: '总用户数目小于'+(Math.floor(((max_value-min_value)/4 + min_value)/jg)*jg).toString()+'个'
                              }
                            ],
                            calculable: true
                          },
                          geo: {
                            map: '辽宁',
                            roam: false,
                            zoom: 1,
                            label: {
                              position: 'center',
                              normal: {
                                show: true,
                                textStyle: {
                                  color: 'black',
                                  fontSize: 19,
                                  fontWeight: 550
                                }
                              }
                            },
                            itemStyle: {
                              normal: {
                                borderColor: 'rgba(0, 0, 0, 0.2)'
                              },
                              emphasis: {
                                areaColor: null,
                                shadowOffsetX: 0,
                                shadowOffsetY: 0,
                                shadowBlur: 20,
                                borderWidth: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                              }
                            }
                          },
                          series: [
                            {
                              type: 'map',
                              coordinateSystem: 'geo',
                              geoIndex: 0,
                              // symbolSize: 20,
                              symbol: 'none',
                              symbolRotate: 35,
                              label: {
                                normal: {
                                  formatter: '{b}',
                                  position: 'right',
                                  show: false
                                },
                                emphasis: {
                                  show: true
                                }
                              },
                              itemStyle: {
                                normal: {
                                  color: '#F06C00'
                                }
                              }
                            },
                            {
                              type: 'map',
                              geoIndex: 0,
                              data: Object.keys(seriesData).map(city => {
                                return {
                                  name: city, value: seriesData[city], label: null
                                }
                              })
                            },
                            {
                              data: [{name: '起火点',
                                value: [this.fireX, this.fireY]}],
                              type: 'effectScatter',
                              coordinateSystem: 'geo',
                              symbolSize: 20,
                              itemStyle: {
                                color: 'red'
                              }}
                          ]
                        };
                        this.myChart.setOption(this.provinceOption);
                        this.myChart.off('click');
                        // 不可下钻，对下钻设置进行注释
                        /!*this.myChart.on('click', (params: {
                          seriesIndex: number;
                          name: string; }) => {
                          if (params.seriesIndex === 0) {
                            this.router.navigate(['hazard'], {queryParams: {city: params.name}}).then(() => {
                              }
                            )
                          }
                        })*!/
                      })
                    } else if (userNum.status === STATUS_EXCEPT) {
                      console.log('获取各地级市变电站数目Except');
                    } else {
                      console.log('获取各地级市变电站数目Fail');
                    }
                  },
                )*/
                console.log('this.provinceOption2', this.provinceOption);
                this.showFireInform = true;
                this.getPieFive();
                this.getPieFive2(this.userInform);
                console.log('res1.data', res1.data)
                this.getBarFive(res1.data);
                this.getPieTen();
                this.getPieTen2(this.userInform);
                this.getBarTen(res1.data);
                this.getPieFifteen();
                this.getPieFifteen2(this.userInform);
                this.getBarFifteen(res1.data);
              }
            }
          )
        }
      }
    )
  }

  showMoreFire() {
    this.isVisibleMoreHis = true;
  }

  // 获取省级标注起火点后地图数据
  getFireProvinceMapData() {
    this.commonService.getUserCity().subscribe(
      userNum => {
        if (userNum.status === STATUS_SUCCESS) {
          // this.listOfBdzCount = userNum.data;
          this.commonService.getLNMap().subscribe(ProvinceMapValue => {
            let seriesData: any = {}
            const cityList = Object.keys(userNum.data);
            for (let city of cityList) {
              seriesData[city + '市'] = userNum.data[city]['城镇居民'] + userNum.data[city]['乡村居民'] +
                userNum.data[city]['第一产业'] + userNum.data[city]['第二产业'] + userNum.data[city]['第三产业']
            }
            this.userCity = userNum.data;
            this.getBarResUserNumByCity();
            this.getBarEnpUserNumByCity();
            echarts.registerMap('辽宁', ProvinceMapValue)
            let max_value = 0;
            let min_value = 0;
            Object.keys(seriesData).map(city => {
              max_value = Math.max(seriesData[city], max_value)
              min_value = Math.min(seriesData[city], min_value)
            })
            const jg = 5000;
            this.provinceOption = {
              tooltip: {
                formatter: '{b}',
                textStyle: {
                  fontSize: 20,
                }
              },
              legend: {
                show: true,
                top: '1%',
                orient: 'horizontal',
                left: 'center',
                textStyle: {
                  fontSize: 18,//字体大小
                  color: '#ffffff'//字体颜色
                },
              },
              grid: {
                top: '1%'
              },
              visualMap: {
                type: 'piecewise',
                show: true,
                min: min_value,
                max: max_value,
                left: 'left',
                top: '1%',
                textStyle: {
                  color: '#ffffff',
                  fontSize: 17
                },
                seriesIndex: 0,
                splitList: [
                  {
                    gt: Math.floor(((max_value-min_value)/4*3 + min_value)/jg)*jg,
                    color: 'rgb(1,100,132)',
                    label: '总用户数目大于'+ (Math.floor(((max_value-min_value)/5*4 + min_value)/jg)*jg).toString() +'个'
                  },
                  {
                    gte: Math.floor(((max_value-min_value)/4*2 + min_value)/jg)*jg,
                    lte: Math.floor(((max_value-min_value)/4*3 + min_value)/jg)*jg,
                    color: 'rgb(1,157,169)',
                    label: '总用户数目'+(Math.floor(((max_value-min_value)/4*2 + min_value)/jg)*jg).toString()+'-'+(Math.floor(((max_value-min_value)/4*3 + min_value)/jg)*jg)+'个'
                  },
                  {
                    gte: Math.floor(((max_value-min_value)/4 + min_value)/jg)*jg,
                    lte: Math.floor(((max_value-min_value)/4*2 + min_value)/jg)*jg,
                    color: 'rgb(4,199,201)',
                    label: '总用户数目'+(Math.floor(((max_value-min_value)/4 + min_value)/jg)*jg).toString()+'-'+(Math.floor(((max_value-min_value)/4*2 + min_value)/jg)*jg).toString()+'个'
                  },
                  {
                    lte: Math.floor(((max_value-min_value)/4 + min_value)/jg)*jg,
                    color: 'rgb(25,253,255)',
                    label: '总用户数目小于'+(Math.floor(((max_value-min_value)/4 + min_value)/jg)*jg).toString()+'个'
                  }
                ],
                calculable: true
              },
              geo: {
                map: '辽宁',
                roam: false,
                zoom: 1,
                label: {
                  position: 'center',
                  normal: {
                    show: true,
                    textStyle: {
                      color: 'black',
                      fontSize: 19,
                      fontWeight: 550
                    }
                  }
                },
                itemStyle: {
                  normal: {
                    borderColor: 'rgba(0, 0, 0, 0.2)'
                  },
                  emphasis: {
                    areaColor: null,
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    shadowBlur: 20,
                    borderWidth: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              },
              series: [
                {
                  type: 'map',
                  coordinateSystem: 'geo',
                  geoIndex: 0,
                  // symbolSize: 20,
                  symbol: 'none',
                  symbolRotate: 35,
                  label: {
                    normal: {
                      formatter: '{b}',
                      position: 'right',
                      show: false
                    },
                    emphasis: {
                      show: true
                    }
                  },
                  itemStyle: {
                    normal: {
                      color: '#F06C00'
                    }
                  }
                },
                {
                  type: 'map',
                  geoIndex: 0,
                  data: Object.keys(seriesData).map(city => {
                    return {
                      name: city, value: seriesData[city], label: null
                    }
                  })
                },
                {
                  data: [{name: '起火点',
                    value: [this.fireX, this.fireY]}],
                  type: 'effectScatter',
                  coordinateSystem: 'geo',
                  symbolSize: 20,
                  itemStyle: {
                    color: 'red'
                  }}
              ]
            };
            this.myChart.setOption(this.provinceOption);
            this.myChart.off('click');
            // 不可下钻，对下钻设置进行注释
            /*this.myChart.on('click', (params: {
              seriesIndex: number;
              name: string; }) => {
              if (params.seriesIndex === 0) {
                this.router.navigate(['hazard'], {queryParams: {city: params.name}}).then(() => {
                  }
                )
              }
            })*/
          })
        } else if (userNum.status === STATUS_EXCEPT) {
          console.log('获取各地级市变电站数目Except');
        } else {
          console.log('获取各地级市变电站数目Fail');
        }
      },
    )
  }

  handleCancel_HisInput() {
    this.isVisibleMoreHis = false;
  }


}
