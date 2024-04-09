import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map,combineLatest,from, of } from 'rxjs';
interface Post {
  id: string; // Assuming the ID is a string
  body: string;
  imageUrl: string[];
  createdAt: Date;
}
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  body: string = '';
  imageUrl: string[] = [];
  selectedFile: File | null = null;
  posts: any;
  title: string = ''
  data: any[] = []
  today: any = new Date();
  createdAt: any
  reader: any
  liked: boolean = false;
  postData: any
  commandText: any
  likes: number = 0;
  postId: any
  selectedPostId: any
  postsCollection: any
  poststore: any[] = [];
  combinedData:any[] =[]
  constructor(private http: HttpClient, private fireStorage: AngularFireStorage, private fire: AngularFirestore) {}
  ngOnInit(): void {
    this.posts = this.fire.collection('/notes', ref => ref.orderBy('createdAt', 'desc')).snapshotChanges();
    this.postsCollection = this.fire.collection<Post>('notes');
    this.poststore = this.postsCollection.valueChanges({ idField: 'id' });
    const postsData = this.posts.pipe(
      map((x: any[]) => {
        return x.map(y => {
          const dt = y.payload.doc.data()
          const id = y.payload.doc.id;
          console.log('mapdata->', dt,'postid->',id);
          return dt;
        })
      })
    )
    const combined = combineLatest([this.poststore, postsData]);
    combined.subscribe(([poststoreData,postsData=[]])=>{
      console.log('1stpsd',poststoreData)
      console.log('2ndpostsdata->',postsData);
      this.combinedData = [poststoreData,postsData]
    });
    this.demo();
  }
 async onFileChange(event:any){
 }
  demo(){
    const data = of ([1,2,3,4,5,6,7,8,9])
    .subscribe({
      next(response){
        console.log(response);
      }
    })
  }
  theme: string = 'dark'; // Initialize theme to 'dark'

  toggleTheme(event:any) {
    this.theme = event.target.checked ? 'dark' : 'light'; // Toggle between 'dark' and 'light' based on checkbox state
    console.log(this.theme);
    
  }
}
