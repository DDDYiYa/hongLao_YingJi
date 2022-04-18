import { Component, OnInit } from '@angular/core';
import {STATUS_EXCEPT} from '../../setting';
import {STATUS_SUCCESS} from '../../setting';
import {CommonService} from "../../service/common.service";
import {EChartsType} from "echarts/types/dist/echarts";
import {ActivatedRoute, Router} from "@angular/router";
import * as echarts from "echarts";

@Component({
  selector: 'app-page2',
  templateUrl: './page2.component.html',
  styleUrls: ['./page2.component.css']
})
export class Page2Component implements OnInit {
  myChart?: EChartsType | any
  // @ViewChild('map') map: any;
  today: any = new Date();
  timer: any;
  companyClicked: any;
  isVisible = false;
  companyScoreInformation = [{name: 'avg_score', value: 0}, {name: 'scoreAll', value: 0}, {name: '一般火灾', value: 0},
    {name: '较大火灾', value: 0}, {name: '重大火灾', value: 0}, {name: '特别重大火灾', value: 0},
    {name: '地区', value: '辽宁省'}];
  optionCompanyScore: any = {};
  listOfCompanyMaxData: any[] = [];
  listOfCompanyMaxData_: any[] = [];
  isVisibleWXY = false;
  listOfCompanyMaxDataExtend: any;
  optionResidentsWXY1: any = {};
  optionCityWXY1: any = {};
  optionCityWXY2: any = {};
  companyInfo1: any[] = [];
  companyInfo2: any;
  companyInfo3 = {cityName: '', countyName: '', companyName: '', score: 0};
  city1 = '';
  city2 = '';
  city3 = '';
  city1V1 = 0;
  city1V2 = 0;
  city1V3 = 0;
  city1V3Str = '';
  city2V1 = 0;
  city2V2 = 0;
  city2V3 = 0;
  city2V3Str = '';
  city3V1 = 0;
  city3V2 = 0;
  city3V3 = 0;
  city3V3Str = '';
  city1Name: any[] = [];
  city2Name: any[] = [];
  city3Name: any[] = [];
  region = '';
  BarFireNumAreaByCity: any;
  BarFireNumAreaByYear: any;
  constructor(private commonService: CommonService, private route: ActivatedRoute, private router: Router) {}

  handleOK() {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel() {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }

  handleOk_WXY() {
    console.log('Button ok clicked!');
    this.isVisibleWXY = false;
  }

  handleCancel_WXY() {
    console.log('Button cancel clicked!');
    this.isVisibleWXY = false;
  }

  showModal_WXY() {
    this.isVisibleWXY = true;
  }

  strToParamData(n: any): any {
    let paramData = {};
    // tslint:disable-next-line:variable-name
    let paramData_ = {};
    if (n === '辽宁') {
      paramData = {level: 'Province', city: '辽宁省'};
      // tslint:disable-next-line:variable-name
      paramData_ = {level: 'Province', city: '辽宁省', num: 5};
      console.log(paramData);
    } else {
      // tslint:disable-next-line:variable-name
      const n_2 = n.split('');
      n_2.splice(-1, 1);
      if (n === '葫芦岛市') {
        paramData = {level: 'City', city: n_2[0] + n_2[1] + n_2[2] + '市'};
        paramData_ = {level: 'City', city: n_2[0] + n_2[1] + n_2[2] + '市', num: 5};
      } else {
        paramData = {level: 'City', city: n_2[0] + n_2[1] + '市'};
        paramData_ = {level: 'City', city: n_2[0] + n_2[1] + '市', num: 5};
      }
      console.log(paramData);
    }
    return [paramData, paramData_];
  }

  // 数字转换成字符串(为显示",")
  numberToStr(inputNumber: any): string {
    let Str = '';
    if (inputNumber.toString().length > 6) {
      // tslint:disable-next-line:max-line-length
      Str = inputNumber.toString().slice(0, inputNumber.toString().length - 3) + ',' + inputNumber.toString().slice(inputNumber.toString().length - 3, inputNumber.toString().length - 6) +
        ',' + inputNumber.toString().slice(inputNumber.toString().length - 6, inputNumber.toString().length);
    } else if (inputNumber.toString().length > 3) {
      // tslint:disable-next-line:max-line-length
      Str = inputNumber.toString().slice(0, inputNumber.toString().length - 3) + ',' + inputNumber.toString().slice(inputNumber.toString().length - 3, inputNumber.toString().length);
    } else {
      Str = inputNumber.toString();
    }
    return Str;
  }

  // 左上角饼状图企业危险程度分布
  getPieData(DataList: any) {
    this.optionCompanyScore = {
      color: ['#2eff2e', '#ffff00',  '#FF8000', '#FF0000'],
      legend: {
        icon: 'circle',
        orient: 'vertical',
        textStyle: {color: 'white', fontSize: 17},
        top: 60,
        left: 10,
        itemGap: 20,
        itemWidth: 20,
        itemHeight: 20,
        data: ['一般火灾', '较大火灾', '重大火灾', '特别重大火灾']
      },
      graphic: {
        type: 'text',
        left: 'center',
        top: 'middle',
        style: {
          fill: '#666',
          text: '',
          font: '20px Microsoft YaHei'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}个 ({d}%)'
      },
      calculable: true,
      series: {
        name: '',
        type: 'pie',
        radius: ['50%', '85%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        label: {
          normal: {
            show: false,
            position: 'inside',
            formatter: '{text|{b}}\n{value|{d}%}',
            rich: {
              text: {
                color: '#666',
                fontSize: 14,
                align: 'center',
                verticalAlign: 'middle',
                padding: 5
              },
              value: {
                color: '#666',
                fontSize: 24,
                align: 'center',
                verticalAlign: 'middle',
              },
            }
          },
          emphasis: {
            show: true,
            textStyle: {
              fontSize: 46,
            }
          }
        },
        data: DataList
      }
    };
  }

  // 右上饼图危险源企业附近活跃居民分布
  getPieData2() {
    this.optionResidentsWXY1 = {
      color: ['#fccb00', '#62b62f'],
      tooltip: {
        trigger: 'item',
      },
      legend: [{
        left: 'center',
        top: 5,
        textStyle: {color: 'white', fontSize: 17},
        itemGap: 220
      }],
      title: [{
        text: this.city1Name,
        left: 70,
        bottom: 'top',
        textStyle: {
          fontSize: 20,
          color: 'white',
        }
      }, {
        text: this.city2Name,
        left: 'center',
        bottom: 'top',
        textStyle: {
          fontSize: 20,
          color: 'white',
        }
      }, {
        text: this.city3Name,
        left: 430,
        bottom: 'top',
        textStyle: {
          fontSize: 20,
          color: 'white',
        }
      }],
      series: [
        {
          type: 'pie',
          radius: ['60%', '70%'],
          center: ['17%', '50%'],
          label: {
            normal: {
              position: 'center',
              formatter: '' + this.city1V3Str,
              textStyle: {
                color: '#fff',
                fontSize: 20
              }
            },
          },
          data: [{value: this.city1V1, name: '城镇居民数'},
            {value: this.city1V2, name: '乡村居民数'}]
        }, {
          type: 'pie',
          radius: ['60%', '70%'],
          center: ['50%', '50%'],
          label: {
            normal: {
              position: 'center',
              formatter: '' + this.city2V3Str,
              textStyle: {
                color: '#fff',
                fontSize: 20
              }
            },
          },
          data: [{value: this.city2V1, name: '城镇居民数'},
            {value: this.city2V2, name: '乡村居民数'}]
        },
        {
          type: 'pie',
          radius: ['60%', '70%'],
          center: ['83%', '50%'],
          label: {
            normal: {
              position: 'center',
              formatter: '' + this.city3V3Str,
              textStyle: {
                color: '#fff',
                fontSize: 20
              }
            },
          },
          data: [{value: this.city3V1, name: '城镇居民数'},
            {value: this.city3V2, name: '乡村居民数'}]
        }]
    };
  }

  // 右下角饼图危险源企业地区分布
  getPieData3(CityNameList: any, dataCompanyCity: any) {
    this.optionCityWXY1 = {
      title: {
        text: '所有等级',
        left: 125,
        bottom: 'bottom',
        textStyle: {
          fontSize: 17,
          color: '#fff',
          fontFamily: 'Microsoft YaHei',
          fontWeight: 'lighter'
        }
      },
      legend: {
        data: CityNameList,
        top: 'center',
        left: 0,
        show: true,
        orient: 'vertical',
        textStyle: {
          fontSize: 15,
          color: '#fff',
          fontFamily: 'Microsoft YaHei',
          fontWeight: 'lighter'
        }
      },
      series: [{
        left: 70,
        type: 'pie',
        radius: [50, 70],
        center: ['50%', '50%'],
        // roseType: 'area',
        itemStyle: {borderRadius: 8},
        avoidLabelOverlap: false,
        label: {
          normal: {
            value: 276,
            position: 'center',
            show: false
          },
          emphasis: {
            formatter: '{b}\n{c}\n占比{d}',
            show: true,
            textStyle: {
              fontSize: 17,
              color: '#fff',
              fontFamily: 'Microsoft YaHei',
              fontWeight: 'lighter'
            }
          }
        },
        data: dataCompanyCity
      }]
    };
  }

  // 当地图变化时改变数据
  getChangeData(paramData1: any, paramData2: any) {
    // this.commonService.company_max(paramData2).subscribe(
    this.commonService.company_max(paramData1).subscribe(
      (res) => {
        if (res.status === STATUS_SUCCESS) {
          console.log('company_max', res.data);
          this.listOfCompanyMaxData = res.data;
        } else if (res.status === STATUS_EXCEPT) {
          console.log('获取company_max数据Except');
        } else {
          console.log('获取company_max数据Fail');
        }
      }
    );
    // this.commonService.company_max_extend(paramData1).subscribe(
    this.commonService.company_max_extend(paramData2).subscribe(
      (res) => {
        if (res.status === STATUS_SUCCESS) {
          console.log(res.data);
          this.listOfCompanyMaxDataExtend = res.data;
        } else if (res.status === STATUS_EXCEPT) {
          console.log('获取company_max_extend数据Except');
        } else {
          console.log('获取company_max_extend数据Fail');
        }
      }
    );
    this.commonService.company_information(paramData1).subscribe(
      (res) => {
        if (res.status === STATUS_SUCCESS) {
          console.log(res.data);
          console.log(this.companyScoreInformation);
          // tslint:disable-next-line:no-shadowed-variable prefer-for-of
          for (let i = 0; i < res.data.length; i++) {
            this.companyScoreInformation[0].value = res.data[i].avgScore.toFixed(4);
            this.companyScoreInformation[1].value = res.data[i].count1;
            this.companyScoreInformation[2].value = res.data[i].count2;
            this.companyScoreInformation[3].value = res.data[i].count3;
            this.companyScoreInformation[4].value = res.data[i].count4;
            this.companyScoreInformation[5].value = res.data[i].count5;
            // this.companyScoreInformation[6].value = res.data[i].count6;
            this.companyScoreInformation[6].value = paramData1.city;
          }
          console.log(this.companyScoreInformation);
          const DataList = [this.companyScoreInformation[2], this.companyScoreInformation[3],
            this.companyScoreInformation[4], this.companyScoreInformation[5]];
          this.getPieData(DataList);
        } else if (res.status === STATUS_EXCEPT) {
          console.log('获取company_information数据Except');
        } else {
          console.log('获取company_information数据Fail');
        }
      },
      err => console.log(err),
    );
  }

  // 初始数据,不随地图变化
  getOriginalData() {
    this.city1 = '沈阳市';
    this.city2 = '大连市';
    this.city3 = '抚顺市';
    this.commonService.company_nearby_residents({
      level: 'City',
      cityList: [this.city1, this.city2, this.city3]
    }).subscribe(
      res1 => {
        if (res1.status === STATUS_SUCCESS) {
          this.city1V1 = res1.data[0].residents[0];
          this.city1V2 = res1.data[0].residents[1];
          this.city1V3 = this.city1V1 + this.city1V2;
          this.city1Name = res1.data[0].cityName;
          this.city1V3Str = this.numberToStr(this.city1V3);
          console.log('城镇居民数', this.city1V1, '乡村居民数', this.city1V2, '总计居民', this.city1V3);
          this.city2V1 = res1.data[1].residents[0];
          this.city2V2 = res1.data[1].residents[1];
          this.city2V3 = this.city2V1 + this.city2V2;
          this.city2Name = res1.data[1].cityName;
          this.city2V3Str = this.numberToStr(this.city2V3);
          console.log('城镇居民数', this.city2V1, '乡村居民数', this.city2V2, '总计居民', this.city2V3);
          this.city3V1 = res1.data[2].residents[0];
          this.city3V2 = res1.data[2].residents[1];
          this.city3V3 = this.city3V1 + this.city3V2;
          this.city3Name = res1.data[2].cityName;
          this.city3V3Str = this.numberToStr(this.city3V3);
          console.log('城镇居民数', this.city3V1, '乡村居民数', this.city3V2, '总计居民', this.city3V3);
          this.getPieData2();
        } else if (res1.status === STATUS_EXCEPT) {
          console.log('获取company_nearby_residents数据Except');
        } else {
          console.log('获取company_nearby_residents数据Fail');
        }
      }
    );
    this.commonService.company_count_top3({level: 'City'}).subscribe(
      (res) => {
        if (res.status === STATUS_SUCCESS) {
          const dataCompanyCity = [];
          const CityNameList = [];
          // tslint:disable-next-line:variable-name
          const Company_count = [];
          // tslint:disable-next-line:prefer-for-of no-shadowed-variable
          for (let i = 0; i < res.data.length; i++) {
            CityNameList.push(res.data[i].CityName);
            Company_count.push(res.data[i].Company_Count);
            dataCompanyCity.push({value: res.data[i].Company_Count, name: res.data[i].CityName});
          }
          console.log(dataCompanyCity);
          this.getPieData3(CityNameList, dataCompanyCity);
        } else if (res.status === STATUS_EXCEPT) {
          console.log('获取company_count_top3数据Except');
        } else {
          console.log('获取company_count_top3数据Fail');
        }
      },
      err => console.log(err),
    );
    this.commonService.company_high_count({level: 'City'}).subscribe(
      (res) => {
        if (res.status === STATUS_SUCCESS) {
          const dataCompanyCity = [];
          const CityNameList = [];
          // tslint:disable-next-line:variable-name
          const Company_count = [];
          // tslint:disable-next-line:prefer-for-of no-shadowed-variable
          for (let i = 0; i < res.data.length; i++) {
            CityNameList.push(res.data[i].CityName);
            Company_count.push(res.data[i].Company_Count);
            dataCompanyCity.push({value: res.data[i].Company_Count, name: res.data[i].CityName});
          }
          console.log(dataCompanyCity);
          this.optionCityWXY2 = {
            title: {
              text: '较大火灾及以上',
              left: 30,
              bottom: 'bottom',
              textStyle: {
                fontSize: 17,
                color: '#fff',
                fontFamily: 'Microsoft YaHei',
                fontWeight: 'lighter'
              }
            },
            legend: {
              data: CityNameList,
              top: 'center',
              right: 'right',
              show: true,
              textStyle: {
                fontSize: 15,
                color: '#fff',
                fontFamily: 'Microsoft YaHei',
                fontWeight: 'lighter'
              }
            },
            series: [{
              left: -80,
              type: 'pie',
              radius: [50, 70],
              center: ['50%', '50%'],
              // roseType: 'area',
              itemStyle: {borderRadius: 8},
              avoidLabelOverlap: false,
              label: {
                normal: {
                  value: 276,
                  position: 'center',
                  show: false
                },
                emphasis: {
                  formatter: '{b}\n{c}\n占比{d}%',
                  show: true,
                  textStyle: {
                    fontSize: 17,
                    color: '#fff',
                    fontFamily: 'Microsoft YaHei',
                    fontWeight: 'lighter'
                  }
                }
              },
              data: dataCompanyCity
            }]
          };
        } else if (res.status === STATUS_EXCEPT) {
          console.log('获取company_high_count数据Except');
        } else {
          console.log('获取company_high_count数据Fail');
        }
      }
    );
    this.getBarFireNumAreaByCity();
    this.getBarFireNumAreaByYear();
  }

  // 单个公司数据，根据选中的公司变化
  getSingleCompanyData(param: { companyCode: any; }) {
    this.commonService.company(param).subscribe(
      res => {
        if (res.status === STATUS_SUCCESS) {
          this.companyInfo1 = res.data[0];
          this.companyInfo2 = res.data[1][0];
          this.companyInfo3 = res.data[2][0];
          this.isVisible = true;
        } else if (res.status === STATUS_EXCEPT) {
          console.log('获取company数据Except');
        } else {
          console.log('获取company数据Fail');
        }
      },
      err => console.log(err)
    );
  }

  ngOnInit() {
    /*const paramData = this.strToParamData('辽宁')[0];
    // tslint:disable-next-line:variable-name
    const paramData_ = this.strToParamData('辽宁')[1];
    console.log(paramData);
    this.getChangeData(paramData_, paramData);*/
    this.getOriginalData();
    let option: any
    const elementById: HTMLElement | null = document.getElementById('map1');
    let staticinfo: any[] = [];
    if (elementById) {
      this.route.queryParams.subscribe(value => {
        if (this.myChart) {
          this.myChart.dispose()
        }
        this.region = value['city']
        //市
        if (this.region) {
          const paramData = this.strToParamData(this.region)[0];
          // tslint:disable-next-line:variable-name
          const paramData_ = this.strToParamData(this.region)[1];
          this.getChangeData(paramData_, paramData);
          // 企业状态
          this.commonService.company_list(paramData).subscribe(
            res => {
              if (res.status === STATUS_SUCCESS) {
                staticinfo = [];
                console.log(res.data);
                // tslint:disable-next-line:prefer-for-of no-shadowed-variable
                for (let i = 0; i < res.data.length; i++) {
                  const info: any = {name: '', value: []};
                  info.name = res.data[i].companyName;
                  info.value.push(res.data[i].x);
                  info.value.push(res.data[i].y);
                  info.value.push(res.data[i].score);
                  info.value.push(res.data[i].companyId);
                  staticinfo.push(info);
                }
                console.log(staticinfo);
                this.myChart = echarts.init(elementById)
                this.commonService.getCityMap(this.region).subscribe(value => {
                  console.log(this.listOfCompanyMaxData_)
                  echarts.registerMap(this.region, value)
                  option = {
                    tooltip: {
                      textStyle: {
                        fontSize: 20
                      },
                      trigger: 'item',
                      formatter(params: any) {
                        let s = '';
                        s += '发生时间: ' + '2021年10月30日' + '<br>';
                        s += '伤亡情况: ' + '无人伤亡';
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
                      {
                        data: staticinfo,
                        name: '点',
                        type: 'effectScatter',
                        coordinateSystem: 'geo',
                        encode: {value: 2},
                        symbolSize: 20,
                        itemStyle: {
                          color: "red",
                        },
                      },
                      /*{
                        data: staticinfo.slice(0, 3),
                        name: 'Top3',
                        type: 'effectScatter',
                        coordinateSystem: 'geo',
                        encode: {value: 2},
                        symbolSize(val: any) {
                          return val[2] * 2 + 10;
                        },
                        itemStyle: {
                          color: "red",
                        },
                      }*/
                    ]
                  };
                  this.myChart.off('click');
                  this.myChart.setOption(option);
                })
              } else if (res.status === STATUS_EXCEPT) {
                console.log('获取company_list数据Except');
              } else {
                console.log('获取company_list数据Fail');
              }
            });
          // this.commonService.getCompanyList(value['city']).subscribe(value1 => {
          //   this.listOfCompanyMaxData_ = value1
          //
          // })
        }
        // 辽宁省
        else {
          console.log('这里是辽宁省地图')
          const paramData = this.strToParamData('辽宁')[0];
          const paramData_ = this.strToParamData('辽宁')[1];
          // 获得环和表格数据
          this.getChangeData(paramData_, paramData);
          this.commonService.company_list(paramData).subscribe(value1 => {
            this.listOfCompanyMaxData_ = value1
            this.myChart = echarts.init(elementById)
            this.commonService.getLNMap().subscribe(value => {
              let seriesData: any = {}
              for (let i = 0; i < value1.data.length; i++) {
                if (seriesData[value1.data[i].cityName]) {
                  seriesData[value1.data[i].cityName]++
                } else {
                  seriesData[value1.data[i].cityName] = 1
                }
              }
              console.log('seriesData', seriesData)

              echarts.registerMap('辽宁', value)
              let max_value = 0;
              Object.keys(seriesData).map(city => {
                max_value = Math.max(seriesData[city], max_value)
              })
              option = {
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
                  min: 0,
                  max: max_value,
                  left: 'left',
                  top: '5%',
                  textStyle: {
                    color: '#ffffff',
                    fontSize: 17
                  },
                  seriesIndex: 0,
                  splitList: [
                    {
                      gt: 50,
                      color: 'rgb(1,100,132)',
                      label: '发生山火次数大于50次'
                    },
                    {
                      gte: 15,
                      lte: 50,
                      color: 'rgb(1,157,169)',
                      label: '发生山火次数25-50次'
                    },
                    {
                      gte: 5,
                      lte: 15,
                      color: 'rgb(4,199,201)',
                      label: '发生山火次数10-25次'
                    },
                    {
                      lte: 5,
                      color: 'rgb(25,253,255)',
                      label: '发生山火次数小于10次'
                    },

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
                    symbolSize: 20,
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
                  }
                ]
              };
              this.myChart.on('click', (params: {
                seriesIndex: number;
                name: string; }) => {
                if (params.seriesIndex === 0) {
                  this.router.navigate(['history'], {queryParams: {city: params.name}}).then(() => {
                    }
                  )
                }

              })
              this.myChart.setOption(option);
            })
          })
        }
      })
    }

    // tslint:disable-next-line:variable-name
    const _this = this;
    const count:any = {
      沈阳市: [], 大连市: [], 鞍山市: [], 抚顺市: [], 本溪市: [], 丹东市: [], 锦州市: [], 营口市: [], 阜新市: [],
      辽阳市: [], 盘锦市: [], 铁岭市: [], 朝阳市: [], 葫芦岛市: []
    };

  }
  getBarFireNumAreaByCity() {
    this.BarFireNumAreaByCity = {
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
        data: ['沈阳市', '大连市', '鞍山市', '抚顺市', '本溪市', '丹东市', '锦州市', '营口市', '阜新市', '辽阳市', '盘锦市', '铁岭市', '朝阳市', '葫芦岛市']
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
          name: '面积/平方千米',
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
          name: '发生山火次数',
          type: 'line',
          data: [1,2,0,2,1,0,1,2,0,2,1,0,1,2],
          color: '#FF4500',
        },
        {
          name: '发生山火面积',
          data: [10,20,0,20,10,0,10,20,0,20,10,0,10,20],
          type: 'bar',
          yAxisIndex: 1
        },
      ]
    };
  }
  getBarFireNumAreaByYear() {
    this.BarFireNumAreaByYear = {
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
        data: ['2016', '2017', '2018', '2019', '2020', '2021', '2022']
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
          name: '面积/平方千米',
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
          name: '发生山火次数',
          type: 'line',
          data: [1,2,0,2,1,0,1,2,0,2,1,0,1,2],
          color: '#FF4500',
        },
        {
          name: '发生山火面积',
          data: [10,20,0,20,10,0,10,20,0,20,10,0,10,20],
          type: 'bar',
          yAxisIndex: 1,
          // color:  '#00FFFF',
        },
      ]
    };
  }
}

