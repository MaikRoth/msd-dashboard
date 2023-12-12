import { Component, Input, OnInit } from '@angular/core';
import { RobotsService } from '../../robot.service';

export type Robot = {
  robotId: string,
  planetId: string,
  playerId: string,
  vitals: Vitals,
  levels: Levels,
  cargo: Cargo,
  highlighted: boolean,
  name?: string,
  img?: string
}
export type Vitals = {
  health: number,
  energy: number,
}
export type Levels = {
  health: number,
  energy: number,
  miningLevel: number,
  miningSpeed: number,
  damage: number,
  energyRegeneration: number,
  storage: number
}
export type Cargo = {
  capacity: number,
  used: number,
  free: null | number,
  coal: number,
  iron: number,
  gem: number,
  gold: number,
  platin: number
}
enum CargoState {
  Empty = "empty",
  Low = "low",
  Medium = "medium",
  High = "high",
  Full = "full",
}
const vitalColors = {
  fullHealth: "#00FF00",    // 100
  highHealth: "#66FF00",    // 95
  goodHealth: "#FFFF00",    // 75
  moderateHealth: "#FF9900",// 50
  lowHealth: "#FF6600",     // 25
  criticalHealth: "#FF0000",// 10
  nearDeath: "#990000",     // 5
  almostDead: "#660000",    // 1
};
const cargoColors = {
  [CargoState.Empty]: "#FFFFFF",    // White
  [CargoState.Low]: "#FFFF00",      // Yellow
  [CargoState.Medium]: "#FF9900",   // Orange 
  [CargoState.High]: "#FF0000",     // Red
  [CargoState.Full]: "#660000",     // Dark red
};
const energyColors = {
  fullEnergy: "#00FF00",      // 20
  highEnergy: "#66FF66",      // 16
  goodEnergy: "#99FF99",      // 12
  moderateEnergy: "#CCCC00",  // 8
  lowEnergy: "#FFCC00",       // 4
  criticalEnergy: "#FF6600",  // 2
  noEnergy: "#FF0000",        // 0
};

export enum ResourceType {
  COAL = "../../../assets/images/materials/coal.png",
  IRON = "../../../assets/images/materials/iron.png",
  GEM = "../../../assets/images/materials/gem.png",
  PLATIN = "../../../assets/images/materials/platin.png",
  GOLD = "../../../assets/images/materials/gold.png",
  NOTHING = "../../../assets/images/materials/empty.png"
}

@Component({
  selector: 'app-robot',
  templateUrl: './robot.component.html',
  styleUrl: './robot.component.css'
})
export class RobotComponent {
  @Input() robot: Robot
  @Input() infoToShow: string;

  constructor(private robotService: RobotsService) { }

  isCollapsed = true;
  isLoading = true;

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }


  toggleHighlighting() {
    if (this.robot.highlighted) {
      this.robotService.resetHighlightRobot(this.robot)
    } else {
      this.robotService.highlightRobot(this.robot);
    }
  }
  async copyToClipboard(value: string) {
    try {
      await navigator.clipboard.writeText(value);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }

  isColorDark(color: string): boolean {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);

    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance < 140;
  }

  getAdjustedColor(): string {
    const color = this.getColor();
    return this.isColorDark(color) ? "#FFFFFF" : "#000000";
  }

  getColor(): string {
    if (this.infoToShow == 'Health') {
      return this.getColorForHealth(this.robot.vitals.health)
    } else if (this.infoToShow == 'Cargo') {
      return this.getCargoColor(this.robot.cargo)
    } else if (this.infoToShow == 'Energy') {
      return this.getColorForEnergy(this.robot.vitals.energy)
    } else {
      return '#86b7fe'
    }
  }

  getMostMaterial(cargo: Cargo): string {
    let max = 0;
    if (cargo.coal > max) {
      return "coal"
    } else if (cargo.iron > max) {
      return "iron"
    } else if (cargo.gem > max) {
      return "gem"
    } else if (cargo.gold > max) {
      return "gold"
    } else if (cargo.platin > max) {
      return "pltin"
    } else {
      return "empty"
    }
  }

  getMaterialImage(material: string) {
    switch (material) {
      case 'coal':
        return '../../../assets/images/materials/32/coal.png'
      case 'iron':
        return '../../../assets/images/materials/32/iron.png'
      case 'gem':
        return '../../../assets/images/materials/32/gem.png'
      case 'gold':
        return '../../../assets/images/materials/32/gold.png'
      case 'platin':
        return '../../../assets/images/materials/32/platin.png'
      default:
        return '../../../assets/images/icons/empty.png'
    }
  }

  isLeveled(levels: Levels): boolean {
    if (
      levels.damage > 0 ||
      levels.energy > 0 ||
      levels.health > 0 ||
      levels.energyRegeneration > 0 ||
      levels.miningLevel > 0 ||
      levels.miningSpeed > 0 ||
      levels.storage > 0) {
      return true
    }
    return false
  }

  getCargoColor(cargo: Cargo): string {
    const cargoRatio = cargo.used / cargo.capacity;
    if (cargoRatio === 0) {
      return cargoColors[CargoState.Empty];
    } else if (cargoRatio <= 0.25) {
      return cargoColors[CargoState.Low];
    } else if (cargoRatio <= 0.5) {
      return cargoColors[CargoState.Medium];
    } else if (cargoRatio <= 0.75) {
      return cargoColors[CargoState.High];
    } else {
      return cargoColors[CargoState.Full];
    }
  }

  getColorForEnergy(energy: number): string {
    if (energy >= 16) {
      return energyColors.fullEnergy;
    } else if (energy >= 12) {
      return energyColors.highEnergy;
    } else if (energy >= 8) {
      return energyColors.goodEnergy;
    } else if (energy >= 4) {
      return energyColors.moderateEnergy;
    } else if (energy >= 2) {
      return energyColors.lowEnergy;
    } else if (energy > 0) {
      return energyColors.criticalEnergy;
    }
  }

  getColorForHealth(health: number): string {
    if (health >= 10) {
      return vitalColors['fullHealth'];
    } else if (health >= 9) {
      return vitalColors['highHealth'];
    } else if (health >= 7) {
      return vitalColors['goodHealth'];
    } else if (health >= 6) {
      return vitalColors['moderateHealth'];
    } else if (health >= 4) {
      return vitalColors['lowHealth'];
    } else if (health >= 3) {
      return vitalColors['criticalHealth'];
    } else if (health >= 2) {
      return vitalColors['nearDeath'];
    } else {
      return vitalColors['almostDead'];
    }
  }
}
