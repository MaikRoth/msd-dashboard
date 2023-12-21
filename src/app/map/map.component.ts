import { Component, OnDestroy, OnInit } from '@angular/core';
import { MapService } from '../map.service';
import { Subscription, interval, switchMap, takeWhile } from 'rxjs';
import { RobotsService } from '../robot.service';
import { GamesService } from '../games.service';
import { PlayerService } from '../player.service';
import { Player } from './player/player.component';
import { Robot } from './robot/robot.component';
import { Planet } from './planet/planet.component';
import { Router } from '@angular/router';
import { loadGamesFromLocalStorage, saveGamesToLocalStorage } from '../app.component';
import { Game } from '../controlpanel/gameshandler/gameshandler.component';
import { Store } from '@ngrx/store';
import { SharedService } from '../shared/shared.service';
import { MoneyService } from '../money.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {
  planets: Planet[] = [];
  robots: Robot[] = [];
  grid: (Planet | null)[][] = [];
  players: Player[] = [];
  games: Game[]

  private intervalTime = 5000;
  fetching = true;
  showPlanetInfo = true;
  errorUrl: string = "";

  private oldRobots: Robot[];
  private backgroundSubscription: Subscription;
  private planetSubscription: Subscription;
  private robotSubscription: Subscription;
  private gamesSubscription: Subscription;
  private playerSubscription: Subscription;
  constructor(
    private moneyService: MoneyService,
    private sharedService: SharedService,
    private mapService: MapService,
    private robotService: RobotsService,
    private gamesService: GamesService,
    private playerService: PlayerService,
    private router: Router,
    private store: Store<{ robot: Robot[], player: Player[], }>) { }

  ngOnInit() {
    this.games = loadGamesFromLocalStorage();
    this.planetSubscription = interval(this.intervalTime).subscribe(() => this.onGetPlanets());
    this.robotSubscription = interval(this.intervalTime).subscribe(() => this.onGetRobots());
    this.pollForPlayers();
    this.gamesSubscription = interval(this.intervalTime).subscribe(() => this.onGetGames());
    document.addEventListener('DOMContentLoaded', () => {
      this.backgroundSubscription = this.sharedService.backgroundColor.subscribe(color => {
        const mapContainer = document.getElementById('map-container');
        if (mapContainer) {
          mapContainer.style.backgroundColor = color;
        }
      });
    });
  }

  handleMouseMove(event: MouseEvent, imageId: string) {
    const img = document.getElementById(imageId) as HTMLImageElement;

    const { width, height, left, top } = img.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    const deltaX = (mouseX - centerX) / width;
    const deltaY = (mouseY - centerY) / height;

    const tiltX = deltaY * 20;
    const tiltY = deltaX * -20;

    img.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.05)`;
  }

  resetTilt(imageId: string) {
    const img = document.getElementById(imageId) as HTMLImageElement;
    img.style.transform = 'none';
  }

  private getPosition(planet: Planet): { x: number; y: number } {
    return planet.position || { x: 0, y: 0 };
  }

  onGetRobots() {
    this.oldRobots = this.robots;
    this.robots = this.robotService.getRobots();
    this.updatePlanets();
    this.updatePlayers();
  }

  onGetPlanets() {
    this.planets = this.mapService.getPlanets();
    this.setupGrid();
    this.fetching = false;
  }
  trackByRowIndex(index: number, row: any): number {
    return index;
  }
  trackByPlanetId(index: number, planet: Planet | null): string | null {
    return planet ? planet.planetId : null;
  }

  onGetGames() {
    this.gamesService.fetchGames().subscribe((games: Game[]) => {
      this.games = games
      if (this.games) {
        this.intervalTime = this.games[0].roundLengthInMillis
      }
      if (this.games.length === 0) {
        this.players = [];
        this.robots = [];
        this.planets = [];
      }
      saveGamesToLocalStorage(this.games);
    })
  }

  pollForPlayers() {
    interval(1000)
      .pipe(
        switchMap(() => this.gamesService.getPlayingPlayers()),
        switchMap((participatingPlayers: string[]) => {
          if (this.players.length !== participatingPlayers.length) {
            return this.playerService.getPlayers();
          } else {
            throw new Error('Polling completed');
          }
        }),
        takeWhile(() => true, true)
      )
      .subscribe({
        next: (players: Player[]) => {
          this.players = players;
        },
        error: (err) => {
        }
      });
  }
  redirectToControlpanel() {
    this.router.navigate(['/controlpanel']);
  }
  calculateEarningsFromCargoChange(playerId, oldRobot, newRobot) {
    const oldCargo = oldRobot.cargo;
    const newCargo = newRobot.cargo;
    let earnings = 0;
    const prices = { coal: 5, iron: 15, gem: 30, gold: 50, platin: 60 };
    for (const item in prices) {
      const soldAmount = oldCargo[item] - newCargo[item];
      if (soldAmount > 0) {
        this.playerService.addTransaction(playerId, { type: 'SELL', entity: oldRobot.name, item: item, amount: soldAmount, earning: soldAmount * prices[item] })
        earnings += soldAmount * prices[item];
      }
    }
    this.moneyService.addMoney(playerId, earnings);
  }

  calculateSpentOnUpgrades(robot, playerId, oldLevels, newLevels) {
    const upgradeCosts = [0, 50, 300, 1500, 4000, 15000];
    let totalCost = 0;

    const calculateCostForLevel = (oldLevel, newLevel, levelName) => {
      let cost = 0;
      for (let level = oldLevel + 1; level <= newLevel; level++) {
        cost += upgradeCosts[level] || 0;
        if (cost !== 0) {
          this.playerService.addTransaction(playerId, { type: 'BUY', entity: robot.name, item: levelName, amount: newLevel, earning: -upgradeCosts[level] })
        }
      }
      return cost;
    };

    totalCost += calculateCostForLevel(oldLevels.miningLevel, newLevels.miningLevel, 'miningLevel');
    totalCost += calculateCostForLevel(oldLevels.storage, newLevels.storage, 'storage');
    totalCost += calculateCostForLevel(oldLevels.miningSpeed, newLevels.miningSpeed, 'miningSpeed');
    totalCost += calculateCostForLevel(oldLevels.damage, newLevels.damage, 'damage');
    totalCost += calculateCostForLevel(oldLevels.energyRegeneration, newLevels.energyRegeneration, 'energyRegeneration');
    totalCost += calculateCostForLevel(oldLevels.health, newLevels.health, 'health');
    totalCost += calculateCostForLevel(oldLevels.energy, newLevels.energy, 'energy');
    this.moneyService.subtractMoney(playerId, totalCost)
  }

  getOldRobotById(oldRobots, robotId) {
    return oldRobots.find(oldRobot => oldRobot.robotId === robotId) || null;
  }

  updatePlayerBalances(oldRobots, newRobots) {
    newRobots.forEach(newRobot => {
      const oldRobot = this.getOldRobotById(oldRobots, newRobot.robotId);
      const playerId = newRobot.playerId;
      if (oldRobot) {
        this.calculateEarningsFromCargoChange(playerId, oldRobot, newRobot);
        this.calculateSpentOnUpgrades(newRobot, playerId, oldRobot.levels, newRobot.levels);
      } else {
        this.moneyService.subtractMoney(playerId, 100)
        this.playerService.addTransaction(playerId, { type: 'BUY', entity: "", item: "robot", amount: 1, earning: -100 })
      }
    });
  }

  getPlayerById(id: string): Player {
    return this.players.find(player => player.playerId === id)
  }
  hasHighlightedRobot(planet: Planet): boolean {
    for (const robot of planet.robots) {
      if (robot.highlighted) {
        return true;
      }
    }
    return false;
  }

  private updatePlanets() {
    this.planets.forEach(planet => {
      planet.highlighted = false;
      planet.robots = [];
    });

    for (const robot of this.robots) {
      const targetPlanet = this.planets.find(planet => planet.planetId === robot.planetId);
      
      if (targetPlanet) {
        targetPlanet.robots.push(robot);

        if (robot.highlighted) {
          targetPlanet.highlighted = true;
        }
      }
    }
}
  private updatePlayers() {
    this.players.forEach(player => {
      this.robots.forEach(robot => {
        if (robot.playerId === player.playerId) {
          const existingRobotIndex = player.robots.findIndex(prevRobot => prevRobot.robotId === robot.robotId);
          if (existingRobotIndex !== -1) {
            if (!this.robotService.areAttributesEqual(player.robots[existingRobotIndex], robot)) {
              Object.assign(player.robots[existingRobotIndex], robot);
            }
          } else {
            player.robots.push(robot);
          }
        }
      });
    });

    this.updatePlayerBalances(this.oldRobots, this.robots)
  }

  private setupGrid() {
    let maxX = Math.max(...this.planets.map(p => this.getPosition(p).x));
    let maxY = Math.max(...this.planets.map(p => this.getPosition(p).y));

    for (let i = 0; i <= maxX; i++) {
      this.grid[i] = [];
      for (let j = 0; j <= maxY; j++) {
        this.grid[i][j] = null;
      }
    }

    for (let planet of this.planets) {
      const position = this.getPosition(planet);
      this.grid[position.x][position.y] = planet;      
    }
  }

  ngOnDestroy() {
    if (this.robotSubscription) {
      this.robotSubscription.unsubscribe();
    }
    if (this.planetSubscription) {
      this.planetSubscription.unsubscribe();
    }
    if (this.gamesSubscription) {
      this.gamesSubscription.unsubscribe();
    }
    if (this.playerSubscription) {
      this.playerSubscription.unsubscribe();
    }
    if (this.backgroundSubscription) {
      this.backgroundSubscription.unsubscribe();
    }
    saveGamesToLocalStorage(this.games);
  }
}

