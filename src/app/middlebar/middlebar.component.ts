import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-middlebar',
  templateUrl: './middlebar.component.html',
  styleUrl: './middlebar.component.scss'
})
export class MiddlebarComponent {
body:any
todo:any
today:any=new Date();
constructor(private http:HttpClient){}

postData(){
  return this.http.post(`https://jsonplaceholder.typicode.com/posts/`,{body:this.body})
  .subscribe(res=>{
    console.log(res);
    this.todo=res;
    console.log(typeof res)
    alert('data posted succesfully')
  })
 }
}
