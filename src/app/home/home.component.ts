import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  isTabOpen: boolean = false;

  toggleTab() {
    this.isTabOpen = !this.isTabOpen;
  }
}
