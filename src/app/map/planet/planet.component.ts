import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ResourceType, Robot } from '../robot/robot.component';
import { Subscription } from 'rxjs';
import { SharedService } from '../../shared/shared.service';
import { PlanetService } from '../../planet.service';
import { PlayerService } from '../../player.service';

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

  showLandscapeBackground: boolean = false;
  robotsLoading: Record<string, boolean> = {};
  copiedClass = '';
  robotImageType: string;

  private imageTypeSubscription: Subscription; 
  private landscapeBackgroundSubscription: Subscription;

  constructor(
    private sharedService: SharedService,
    private planetService: PlanetService,
    private playerService: PlayerService) { }

  ngOnInit() {
    this.planet.robots.forEach(robot => {
      this.robotsLoading[robot.robotId] = true;
    });
    this.landscapeBackgroundSubscription = this.sharedService.landscapeBackground.subscribe(show => {
      this.showLandscapeBackground = show;
    });
    this.imageTypeSubscription = this.sharedService.robotImageType.subscribe(type => {
      this.robotImageType = type;
    });
  }
  onRobotImageLoad(robotId: string) {
    this.robotsLoading[robotId] = false;
  }

  calculateRobotProportions(): string {
    const playerColors = this.playerService.getPlayerColorMap()
    const robots = this.planet.robots
    const totalCount = robots.length;
    const countPerPlayer = new Map<string, number>();
  
    robots.forEach(robot => {
      const playerId = robot.playerId;
      const currentCount = countPerPlayer.get(playerId) || 0;
      countPerPlayer.set(playerId, currentCount + 1);
    });
  
    let gradientString = '';
    let accumulatedPercentage = 0;
  
    countPerPlayer.forEach((count, playerId) => {
      const playerPercentage = (count / totalCount) * 100;
      const color = playerColors.get(playerId) || 'transparent';
      gradientString += `${color} ${accumulatedPercentage}% ${accumulatedPercentage + playerPercentage}%, `;
      accumulatedPercentage += playerPercentage;
    });
  
    return gradientString.slice(0, -2);
  }

  getResourceName(resourceType: ResourceType) {

    switch (resourceType) {
      case ResourceType.COAL:
        return "Coal"
      case ResourceType.IRON:
        return "Iron"
      case ResourceType.GEM:
        return "Gem"
      case ResourceType.GOLD:
        return "Gold"
      case ResourceType.PLATIN:
        return "Platin"
      default:
        return 'nothing'
    }

  }
  getTeamRobotImage(color: string) {
    switch (color) {
      case 'black':
        return '../../../assets/images/robots/black-robot.png'
      case 'blue':
        return '../../../assets/images/robots/blue-robot.png'
      case 'green':
        return '../../../assets/images/robots/green-robot.png'
      case 'grey':
        return '../../../assets/images/robots/grey-robot.png'
      case 'orange':
        return '../../../assets/images/robots/orange-robot.png'
      case 'purple':
        return '../../../assets/images/robots/purple-robot.png'
      case 'red':
        return '../../../assets/images/robots/red-robot.png'
      case 'silver':
        return '../../../assets/images/robots/silver-robot.png'
      case 'yellow':
        return '../../../assets/images/robots/yellow-robot.png'
      default:
        return ""
    }
  }
  getBackgroundImage(type: any): string {
    if (this.showLandscapeBackground) {
      switch (type) {
        case ResourceType.COAL:
          return `url('../assets/images/landscapes/coal.png')`
        case ResourceType.IRON:
          return `url('../assets/images/landscapes/iron.png')`
        case ResourceType.GEM:
          return `url('../assets/images/landscapes/gem.png')`
        case ResourceType.GOLD:
          return `url('../assets/images/landscapes/gold.png')`
        case ResourceType.PLATIN:
          return `url('../assets/images/landscapes/platin.png')`
        default:
          return `url('../assets/images/landscapes/nothing.png')`
      }
    }
    return ""
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
    if (this.landscapeBackgroundSubscription) {
      this.landscapeBackgroundSubscription.unsubscribe();
    }
    if (this.imageTypeSubscription) {
      this.imageTypeSubscription.unsubscribe();
    }
  }
}
