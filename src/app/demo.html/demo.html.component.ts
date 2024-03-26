import { Component } from '@angular/core';

@Component({
  selector: 'app-demo.html',
  templateUrl: './demo.html.component.html',
  styleUrl: './demo.html.component.scss'
})
export class DemoHtmlComponent {
  liked: boolean = false;
  likes: number = 0;
  clickCount: number = 0;
  clickTimeout: any;

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
}
