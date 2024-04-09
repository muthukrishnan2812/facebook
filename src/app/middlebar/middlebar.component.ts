import { HttpClient } from '@angular/common/http';
import { Component, OnInit, EventEmitter, Output, OnDestroy, Inject, inject, DestroyRef } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, Subject, Subscription, catchError, combineLatest, filter, from, mergeMap, switchMap, takeUntil, tap, throwError } from 'rxjs';
import { map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
interface Post {
  id: string; // Assuming the ID is a string
  body: string;
  imageUrl: string[];
  createdAt: Date;
}
@Component({
  selector: 'app-middlebar',
  templateUrl: './middlebar.component.html',
  styleUrl: './middlebar.component.scss'
})
export class MiddlebarComponent implements OnInit,OnDestroy {
  body: any
  title: string = ''
  data: any[] = []
  today: any = new Date();
  imageUrl: string[] = []
  posts!: Observable<any[]>;
  createdAt: any
  selectedFile: any
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
  takeDestroy = inject(DestroyRef)
  private unSubscribe$:Subject<void> = new Subject<void>();
  constructor(private http: HttpClient, private fireStorage: AngularFireStorage, private fire: AngularFirestore) {
    console.log('fire->', fire.collection('notes'));
  }
  ngOnInit(): void {
    this.posts = this.fire.collection('/notes', ref => ref.orderBy('createdAt', 'desc')).snapshotChanges();
    this.postsCollection = this.fire.collection<Post>('notes');
    this.poststore = this.postsCollection.valueChanges({ idField: 'id' });
    const postsData$ = this.posts.pipe((takeUntilDestroyed(this.takeDestroy)),
      map((x: any[]) => {
        return x.map(y => {
          const dt = y.payload.doc.data()
          const id = y.payload.doc.id;
          console.log('mapdata->', dt,'postid->',id);
          return dt;
        })
      })
    )
    const combined = combineLatest([this.poststore, postsData$])
    combined.pipe(takeUntil(this.unSubscribe$))
    .subscribe(([poststoreData,postsData=[]])=>{
      console.log('1stpsd',poststoreData)
      console.log('2ndpostsdata->',postsData);
      this.combinedData = [poststoreData,postsData]
    })
  }
  ngOnDestroy(): void {
    console.log('coimbined data destroyed');
    this.takeDestroy.onDestroy;
    console.log('unsubscribed data');
  }


  formatTimestamp(timestamp: any) {
    if (timestamp) {
      const now = new Date();
      const postDate = timestamp.toDate();
      const diff = now.getTime() - postDate.getTime(); // Difference in milliseconds
      const diffHours = diff / (1000 * 60 * 60); // Convert difference to hours

      if (diffHours < 1) {
        // Less than 1 hour, display minutes
        const diffMinutes = Math.round(diff / (1000 * 60)); // Convert difference to minutes
        return diffMinutes + ' minutes ago';
      } else if (diffHours >= 1 && diffHours < 24) {
        // Between 1 and 24 hours, display hours
        return Math.round(diffHours) + ' hours ago';
      } else {
        // More than 24 hours, display date
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return postDate.toLocaleDateString('en-US', options);
      }
    } else {
      return ''; // or any default value you prefer if timestamp is missing
    }
  }
  //post store in firebase database
  async addPost() {
    if (this.body.trim() !== '') {
      const previewImage = document.getElementById('previewImage') as HTMLImageElement;
      previewImage.style.display = 'none';
      const post = {
        body: this.body,
        imageUrl: this.imageUrl,
        createdAt: new Date()
      };
      await this.fire.collection('/notes').add(post)
      console.log('Post added successfully!');
      this.body = ''; // Clear the input field after adding post
      this.imageUrl = [];
      this.reader = '';
      console.warn('body is empty', this.body.trim == '');
    } else {
      console.warn('Body cannot be empty!');
    }
  }
  //image store in firebase storage
  async onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      console.log(file);
      // Display preview image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const previewImage = document.getElementById('previewImage') as HTMLImageElement;
        previewImage.src = e.target.result;
        previewImage.style.display = 'block';
        e.preventDefault();
      };
      reader.readAsDataURL(file);
      const path = `fbpost/${file.name}`;
      const uploadTask = this.fireStorage.upload(path, file);
      try {
        const snapshot = await uploadTask;
        const url = await snapshot.ref.getDownloadURL();
        console.log(url);
        // Ensure this.imageUrl is initialized as an array
        if (!Array.isArray(this.imageUrl)) {
          this.imageUrl = [];
        }
        this.imageUrl.push(url); // Store the URL in the array
        console.log(this.imageUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  }

  //delete post in firebase database
  async deletePost(postId: string) {
    const postRef = this.fire.collection('notes').doc(postId);
    await postRef.delete();
    alert('post deleted succesfully');
    console.log('post deleted succesfully', 'postid->', postId, 'postobj->', postRef);
  }

  //command post in firebase posts
  commandPost(postId: string): void {
    const postReference = this.fire.collection('/notes').doc(postId);
    postReference.update({
      command: this.commandText
    });
    this.commandText = '';
  }

  //postLike
  // Inside MiddlebarComponent class
  toggleLike(postId: string): void {
    const postReff = this.fire.collection('notes').doc(postId);

    postReff.get().subscribe(doc => {
      if (doc.exists) {
        const postData = doc.data() as { likes: number, liked: boolean };
        console.log('like->', postData);

        // Initialize likes count to 0 if it's NaN
        if (isNaN(postData.likes)) {
          postData.likes = 0;
        }
        // Increment or decrement likes count based on current like state
        postData.likes += postData.likes ? -1 : 1;
        console.log(postData.likes ? 'liked' : 'unliked');
        // Update document in Firestore with updated likes count
        postReff.update({ likes: postData.likes })
          .then(() => console.log(postReff ? 'Post liked' : 'unliked successfully!'))
          .catch(error => console.error('Error toggling like:', error));
      } else {
        console.warn('Post does not exist!');
      }
    });
  }
}

