import { Injectable,OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SERVERADDRESS } from '../settings';

@Injectable({
  providedIn: 'root'
})
export class CommonService implements OnInit {

  constructor(private http : HttpClient) { }

  ngOnInit() { }

  helloUrl : string = SERVERADDRESS;
  loginUrl : string = SERVERADDRESS+'/auth/login'

  // 测试Angular-Flask连接是否成功，显示hello world！
  readhello()
  {
    return this.http.get<string>(this.helloUrl)
  }


  // 用户登录
  HEADERS = new HttpHeaders({'Content-Type': 'application/json'});
  userLogin(user: any): Observable<any> {
    return this.http.post<any>(this.loginUrl, user, {headers:this.HEADERS, withCredentials: true} ).pipe();
  }
}