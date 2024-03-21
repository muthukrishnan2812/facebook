import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  searchInput:string='';
  isActive: boolean = true;

  onInputChange(value: string) {
    this.searchInput = value.trim();
  }
  toggleActive() {
    this.isActive = !this.isActive;
  }
}
