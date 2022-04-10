import { Component } from '@angular/core';
import { CommonService } from './services/common.service';

@Component({
  selector: 'app-root',   // 这个 app-root 在 index.html 中被引导 
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend_Angular_test';

  constructor(private cs : CommonService ){}

  hello_string : string = '';
  
  ngOnInit()
  {
    this.cs.readhello().subscribe( r => this.hello_string = r)
  }

}
