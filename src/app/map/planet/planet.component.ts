import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ResourceType, Robot } from '../robot/robot.component';
import { Subscription } from 'rxjs';
import { SharedService } from '../../shared/shared.service';

export type Planet = {
  planetId: string;
  resourceType: ResourceType | null;
  resource: Resource | null;
  movementDifficulty: number;
  position: { x: number; y: number } | null;
  robots: Robot[],
  highlighted: boolean
}

export type Resource = {
  amount: number;
  capacity: number;
}

@Component({
  selector: 'app-planet',
  templateUrl: './planet.component.html',
  styleUrl: './planet.component.css'
})
export class PlanetComponent implements OnInit, OnDestroy {
  @Input() planet: Planet;
  @Input() showInfo: boolean;

  robotsLoading: Record<string, boolean> = {};
  robotImageSize: string;
  copiedClass = '';

  private imageSizeSubscription: Subscription;

  constructor(private sharedService: SharedService) { }

  ngOnInit() {
    this.imageSizeSubscription = this.sharedService.robotImageSize.subscribe(size => {
      this.robotImageSize = size;
    });
    this.planet.robots.forEach(robot => {
      this.robotsLoading[robot.robotId] = true; 
    });
  }
  onRobotImageLoad(robotId: string) {
    this.robotsLoading[robotId] = false; 
  }

  allRobotsLoaded(): boolean {
    return Object.values(this.robotsLoading).every(status => !status);
  }

  formatNumber(num: number): string {
    if (num >= 1000) {
      return (Math.floor(num / 100) / 10).toFixed(1) + 'k';
    } else {
      return num.toString();
    }
  }
  async copyToClipboard(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      this.copiedClass = 'visible';
      setTimeout(() => this.copiedClass = '', 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  } 
  
  ngOnDestroy() {
    if (this.imageSizeSubscription) {
      this.imageSizeSubscription.unsubscribe();
    }
  }
}
