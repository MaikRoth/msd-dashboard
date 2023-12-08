import { Component } from '@angular/core';
import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'app-settingsbar',
  templateUrl: './settingsbar.component.html',
  styleUrl: './settingsbar.component.css'
})
export class SettingsbarComponent {


  constructor(private sharedService: SharedService) {}

  
  isCollapsed: boolean = true;
  showAchievements: boolean = false;

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }
  changeRobotImageSize(size: string) {
    this.sharedService.setRobotImageSize(size);
  }

  toggleAchievements() {
    this.showAchievements = !this.showAchievements;
  }

  changeBackgroundColor(event: any) {
    this.sharedService.changeBackgroundColor(event.target.value);
  }
}
