import { Component, Input } from '@angular/core';
import { Robot } from '../robot/robot.component';

export type Planet = {
  planetId: string;
  resourceType: string | null;
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
export class PlanetComponent {
  @Input() planet : Planet;
  @Input() robots : Robot[];
  @Input() showInfo: boolean;

  copiedClass = '';

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
  
}
