import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  searchInput:string='';
  onInputChange(value: string) {
    this.searchInput = value.trim();
  }
}
