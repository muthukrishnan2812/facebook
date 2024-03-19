import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
body:any
todo:any
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
