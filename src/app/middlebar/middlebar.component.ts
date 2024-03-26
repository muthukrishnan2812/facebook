import { HttpClient } from '@angular/common/http';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
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
export class MiddlebarComponent implements OnInit {
  body: any
  todo: any
  image: any
  title: string = ''
  data: any[] = []
  isVisible: any
  today: any = new Date();
  imageUrl: string[] = []
  posts: any
  date: any
  createdAt: any
  selectedFile: any
  reader: any
  liked: boolean = false;
  likes: number = 0;
  clickCount: number = 0;
  clickTimeout: any;
  postId: any
  postsCollection: AngularFirestoreCollection<Post>;
  poststore: Observable<Post[]>;
  constructor(private http: HttpClient, private fireStorage: AngularFireStorage, private fire: AngularFirestore) {
    console.log('fire->',fire.collection('notes'));
    
    this.postsCollection = fire.collection<Post>('notes');
    this.poststore = this.postsCollection.valueChanges({ idField: 'id' });
  }
  ngOnInit(): void {
    this.getData();
    this.getImage();
    this.posts = this.getPost();
    this.posts = this.posts.sort((a: any, b: any) => b.createdAt.toDate() - a.createdAt.toDate());
    this.onFileChange(event);
  }


  // postData(){
  //   return this.http.post(`https://jsonplaceholder.typicode.com/posts/`,{body:this.body})
  //   .subscribe(res=>{
  //     console.log(res);
  //     this.todo=res;
  //     console.log(typeof res)
  //     alert('data posted succesfully')
  //   })
  //  }
  getData() {
    return this.http.get(`https://jsonplaceholder.typicode.com/photos/`)
      .subscribe(data => {
        console.log(data);
        this.todo = data;
      })
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


  getImage() {
    return this.http.get(`https://source.unsplash.com/random/`)
      .subscribe(data => {
        console.log(data);
        // this.image=data;
      })
  }
  //  close(): void {
  //   this.closeClicked.emit();
  //   console.log('closebuttonclicked');
  //   this.isVisible = true;
  // }
  addPost(event: any) {
    if (this.body.trim() !== '') {
      const previewImage = document.getElementById('previewImage') as HTMLImageElement;
      previewImage.style.display = 'none';
      const post = {
        body: this.body,
        imageUrl: this.imageUrl,
        createdAt: new Date()
        // You can add more properties here if needed
      };

      this.fire.collection('/notes').add(post)
        .then(() => {
          console.log('Post added successfully!');
          this.body = ''; // Clear the input field after adding post
          this.imageUrl = [];
          this.reader = '';
        })
        .catch(error => {
          console.error('Error adding post:', error);
        });
    } else {
      console.warn('Body cannot be empty!');
    }
  }
  getPost() {
    return this.fire.collection('/notes').snapshotChanges();
  }
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
  deletePost(postId: string,) {
    // Reference to the post document in Firestore
    const postRef = this.fire.collection('notes').doc(postId);
    console.log(postRef);
    // Delete the post document
    postRef.delete()


      .then(() => {
        alert('post deleted successfully');
        console.log('Post deleted successfully!');
      })
      .catch(error => {
        console.error('Error deleting post:', error);
      });
  }

  //postLike
  likeOrDislike(): void {
    this.clickCount++;
    clearTimeout(this.clickTimeout);
    this.clickTimeout = setTimeout(() => {
      if (this.clickCount === 1) {
        this.toggleLike();
      }
      this.clickCount = 0;
    }, 250); // Change this value according to your preference for the double-click delay
  }

  toggleLike(): void {
    this.liked = !this.liked;
    this.likes += this.liked ? 1 : -1;
  }
  @Output() closeClicked: EventEmitter<void> = new EventEmitter<void>();
}
