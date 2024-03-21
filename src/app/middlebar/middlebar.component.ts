import { HttpClient } from '@angular/common/http';
import { Component, OnInit,EventEmitter,Output } from '@angular/core';

@Component({
  selector: 'app-middlebar',
  templateUrl: './middlebar.component.html',
  styleUrl: './middlebar.component.scss'
})
export class MiddlebarComponent implements OnInit{
body:any
todo:any
image:any
title:string=''
data:any[]=[]
isVisible:any
today:any=new Date();
constructor(private http:HttpClient){}
ngOnInit(): void {
  this.getData();
  this.getImage();
}


postData(){
  return this.http.post(`https://jsonplaceholder.typicode.com/posts/`,{body:this.body})
  .subscribe(res=>{
    console.log(res);
    this.todo=res;
    console.log(typeof res)
    alert('data posted succesfully')
  })
 }
 getData(){
  return this.http.get(`https://jsonplaceholder.typicode.com/posts/`)
  .subscribe(data=>{
    console.log(data);
    this.todo=data;
  })
 }
 getImage(){
  return this.http.get(`https://source.unsplash.com/random/`)
  .subscribe(data=>{
    console.log(data);
    // this.image=data;
  })
 }
 close(): void {
  this.closeClicked.emit();
  console.log('closebuttonclicked');
  this.isVisible = true;
}
@Output() closeClicked: EventEmitter<void> = new EventEmitter<void>();
}
