import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';

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

  constructor(private http: HttpClient, private fireStorage: AngularFireStorage, private fire: AngularFirestore) {}

  ngOnInit(): void {
    // No need to call onFileChange here
    this.posts = this.getPost();
  }

  async onFileChange(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      console.log(file);

      // Display preview image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const previewImage = document.getElementById('previewImage') as HTMLImageElement;
        previewImage.src = e.target.result;
        previewImage.style.display = 'block';
      };
      reader.readAsDataURL(file);

      // Store the selected file for later use
      this.selectedFile = file;
    }
    file.value = '';
  }

  async uploadImage(event:any) {
    if (this.selectedFile) {
      const path = `fbpost/${this.selectedFile.name}`;
      const uploadTask = this.fireStorage.upload(path, this.selectedFile);

      try {
        const snapshot = await uploadTask;
        const url = await snapshot.ref.getDownloadURL();
        console.log(url);
        this.imageUrl.push(url);
        // Image upload successful, now add post
        this.addPost();
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    } else {
      console.warn('No file selected.');
    }
    event.preventDefault();
  }

  addPost() {
    if (this.body.trim() !== '') {
      const post = {
        body: this.body,
        imageUrl: this.imageUrl
        // You can add more properties here if needed
      };

      this.fire.collection('/notes').add(post)
        .then(() => {
          console.log('Post added successfully!');
          this.body = ''; // Clear the input field after adding post
          this.imageUrl = [];
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
}
