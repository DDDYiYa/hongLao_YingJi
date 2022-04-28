import { Injectable } from '@angular/core';
import {SERVERADDRESS} from "../setting";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private http: HttpClient) { }

  // 今年和去年各个市变电站的故障次数
  lefttop(): Observable<any> {
    const lefttop_url = SERVERADDRESS + 'honglao/lefttop';
    return this.http.get(lefttop_url);
  }


  // 本年度变电站各个月份故障次数
  leftbottom(): Observable<any> {
    const leftbottom_url= SERVERADDRESS + 'honglao/leftbottom';
    return this.http.get(leftbottom_url);
  }


  // 本年度变电站近一周故障次数
  righttbottom(): Observable<any> {
    const rightbottom_url= SERVERADDRESS + 'honglao/rightbottom';
    return this.http.get(rightbottom_url);
  }


  // 获取json格式的辽宁省地图
  public getLNMap(): Observable<any> {
    return this.http.get('./assets/map/json/province/liaoning.json')
  }
  // 获取json格式的城市地图
  public getCityMap(city: string): Observable<any> {
    return this.http.get(`./assets/map/liaoning/${city}.json`)
  }

  public getMapInfo(region? :any): Observable<any>{
    if (region) {
      return this.http.get(`./assets/map/liaoning/${region}.json`)
    } else {
      return this.http.get('./assets/map/json/province/liaoning.json')
    }

  }

  options = {withCredentials: true, headers: new HttpHeaders({'Content-Type': 'application/json'})};

  // 本年度每个市变电站的故障次数
  bdz_count(): Observable<any> {
    // tslint:disable-next-line:variable-name
    const bdz_countUrl = SERVERADDRESS + 'honglao/bdz_fail/count_thisYear';
    return this.http.get(bdz_countUrl);
  }

  // 获取某个市的发生故障的变电站信息，包括变电站名称、经纬度
  bdz_list(param: any): Observable<any> {
    const bdz_listUrl = SERVERADDRESS + 'honglao/bdz_fail/list'
    return this.http.post(bdz_listUrl, param,  this.options);
  }

  // 获取变电站信息，包括变电站名称、经纬度
  bdz_list_limited(param: any): Observable<any> {
    const bdz_list_limitedUrl = SERVERADDRESS + 'fire/bdz/list/limit'
    return this.http.post(bdz_list_limitedUrl, param, this.options);
  }










  recordFire(param: any): Observable<any> {
    const recordFireUrl = SERVERADDRESS + 'fire/record'
    return this.http.post(recordFireUrl, param, this.options);
  }
  // 根据距离获取用户信息
  getUserDis(param: any): Observable<any> {
    const getUserDisUrl = SERVERADDRESS + 'fire/user/dis'
    return this.http.post(getUserDisUrl, param, this.options)
  }
  // 根据类型获得用户信息
  getUserType(): Observable<any> {
    const getUserTypeUrl = SERVERADDRESS + 'fire/user/type'
    return this.http.get(getUserTypeUrl)
  }
  // 根据城市获得用户信息
  getUserCity(): Observable<any> {
    const getUserCityUrl = SERVERADDRESS + 'fire/user/city'
    return this.http.get(getUserCityUrl)
  }

  // 获取用户最多城市
  getMaxNumCity(): Observable<any> {
    const getMaxNumCityUrl = SERVERADDRESS + 'fire/max/num'
    return this.http.get(getMaxNumCityUrl)
  }

  // 获取历史火点查询信息
  getHistoryQuery(): Observable<any> {
    const getHistoryQueryUrl = SERVERADDRESS + 'fire/history/query'
    return this.http.get(getHistoryQueryUrl)
  }


  BdzUser_max_extend(param: any): Observable<any> {
    // tslint:disable-next-line:variable-name
    const Bdzuser_max_extendUrl = SERVERADDRESS + 'api/bdzUser/max/extend';
    // tslint:disable-next-line:max-line-length
    return this.http.post(Bdzuser_max_extendUrl, param, {withCredentials: true, headers: new HttpHeaders({'Content-Type': 'application/json'})});
  }
  // 获取某城市变电站与起火点之间的距离
  changeDis(param: any): Observable<any> {
    const changeDisUrl = SERVERADDRESS + 'fire/bdz/dis/change';
    return this.http.post(changeDisUrl, param, this.options);
  }
  // 获取各类型用户数量
  getFireTypeNum(param: any): Observable<any> {
    const getFireTypeNumUrl = SERVERADDRESS + 'fire/type/dis';
    return this.http.post(getFireTypeNumUrl, param, this.options);
  }

  company_list(param: any): Observable<any> {
    // tslint:disable-next-line:variable-name
    const company_listUrl = SERVERADDRESS + 'api/company/list';
    // tslint:disable-next-line:max-line-length
    return this.http.post(company_listUrl, param, {withCredentials: true, headers: new HttpHeaders({'Content-Type': 'application/json'})});
  }

  // 返回单个变电站所有信息
  company(param: any): Observable<any> {
    // tslint:disable-next-line:variable-name
    const company_Url = SERVERADDRESS + 'api/company';
    return this.http.post(company_Url, param, {withCredentials: true, headers: new HttpHeaders({'Content-Type': 'application/json'})});
  }

  company_max(param: any): Observable<any> {
    // tslint:disable-next-line:variable-name
    const company_maxUrl = SERVERADDRESS + 'api/company/max';
    return this.http.post(company_maxUrl, param, {withCredentials: true, headers: new HttpHeaders({'Content-Type': 'application/json'})});
  }
  company_max_extend(param: any): Observable<any> {
    // tslint:disable-next-line:variable-name
    const company_max_extendUrl = SERVERADDRESS + 'api/company/max/extend';
    // tslint:disable-next-line:max-line-length
    return this.http.post(company_max_extendUrl, param, {withCredentials: true, headers: new HttpHeaders({'Content-Type': 'application/json'})});
  }


  // 返回某地区危险源附近居民(城镇居民+农村居民)
  company_nearby_residents(param: any): Observable<any> {
    // tslint:disable-next-line:variable-name
    const companyNearbyResidentsUrl = SERVERADDRESS + 'api/company/nearby/residents';
    // tslint:disable-next-line:max-line-length
    return this.http.post(companyNearbyResidentsUrl, param, {withCredentials: true, headers: new HttpHeaders({'Content-Type': 'application/json'})});
  }

  company_count(param: any): Observable<any> {
    // tslint:disable-next-line:variable-name
    const company_countUrl = SERVERADDRESS + 'api/company/count';
    return this.http.post(company_countUrl, param, {withCredentials: true, headers: new HttpHeaders({'Content-Type': 'application/json'})});
  }
  company_count_top3(param: any): Observable<any> {
    // tslint:disable-next-line:variable-name
    const company_countUrl = SERVERADDRESS + 'api/company/count/top3';
    return this.http.post(company_countUrl, param, {withCredentials: true, headers: new HttpHeaders({'Content-Type': 'application/json'})});
  }
  company_high_count(param: any): Observable<any> {
    // tslint:disable-next-line:variable-name
    const company_high_countUrl = SERVERADDRESS + 'api/company/high/count';
    // tslint:disable-next-line:max-line-length
    return this.http.post(company_high_countUrl, param, {withCredentials: true, headers: new HttpHeaders({'Content-Type': 'application/json'})});
  }

  company_information(param: any): Observable<any> {
    // tslint:disable-next-line:variable-name
    const company_informationUrl = SERVERADDRESS + 'api/company/information';
    // tslint:disable-next-line:max-line-length
    return this.http.post(company_informationUrl, param, {withCredentials: true, headers: new HttpHeaders( {'Content-Type': 'application/json'})});
  }



}
