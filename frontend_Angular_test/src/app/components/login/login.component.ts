import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { FormGroup } from '@angular/forms';
// import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // constructor(private commonService: CommonService, private message: NzMessageService ) {}
  constructor(private commonService: CommonService) {}
  
  validateForm: FormGroup | undefined;

  // username,userpassword 
  user: { [key:string]:any } = {};


  ngOnInit(): void 
  {
    if(this.validateForm?.valid)
    {
      this.user['username'] = this.validateForm.value.username;
      this.user['password'] = this.validateForm.value.password;

      // this.commonService.userLogin(this.user)
      //   .subscribe((loginstatus) => {
      //     if ( loginstatus.status === 0) {
      //       this.message.create('error', '用户名或密码错误！');
      //     } else {
      //       this.sendLoginMsg(loginstatus);
      //     }
      //   });

    } 
    
    // else{
    //   Object.values(this.validateForm.controls).forEach(control => {
    //     if (control.invalid) {
    //       control.markAsDirty();
    //       control.updateValueAndValidity({ onlySelf: true });
    //     }
    //   });
    // }

  }





}

