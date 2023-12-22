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
  robotImageType: string = 'random'; 
  isCollapsed: boolean = true;
  showAchievements: boolean = false;
  showLandscape = false;

  toLandscapeBackgroundImage() {
    this.sharedService.setLandscapeBackground(this.showLandscape);  
  }
  toggleDarkMode(){
    this.sharedService.toggleDarkMode()
  }
  scaleMap(){
    this.sharedService.setMapScale(this.scale);

  }
  changeRobotImage() {
    this.sharedService.setRobotImageType(this.robotImageType);
  }
  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleAchievements() {
    this.showAchievements = !this.showAchievements;
  }

  changeBackgroundColor(event: any) {
    this.sharedService.changeBackgroundColor(event.target.value);
  }
}
