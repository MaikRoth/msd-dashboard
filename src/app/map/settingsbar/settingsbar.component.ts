import { Component } from '@angular/core';
import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'app-settingsbar',
  templateUrl: './settingsbar.component.html',
  styleUrl: './settingsbar.component.css'
})
export class SettingsbarComponent {


  constructor(private sharedService: SharedService) {}
  scale = 1.0
  
  isCollapsed: boolean = true;
  showAchievements: boolean = false;

  toggleDarkMode(){
    this.sharedService.toggleDarkMode()
  }
  scaleMap(){
    this.sharedService.setMapScale(this.scale);

  }
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
