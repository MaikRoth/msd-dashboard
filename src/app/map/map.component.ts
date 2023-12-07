import { Component, OnDestroy, OnInit } from '@angular/core';
import { MapService } from '../map.service';
import { Subscription, interval } from 'rxjs';
import { RobotsService } from '../robot.service';
import { GamesService } from '../games.service';
import { PlayerService } from '../player.service';
import { Player } from './player/player.component';
import { Robot } from './robot/robot.component';
import { Planet } from './planet/planet.component';
import { Router } from '@angular/router';
import { loadGamesFromLocalStorage, saveGamesToLocalStorage } from '../app.component';
import { Game } from '../controlpanel/gameshandler/gameshandler.component';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {
  planets: Planet[] = [];
  robots: Robot[] = [];
  grid: (Planet | null)[][] = [];
  games: Game[] = [];
  players: Player[] = [];
  private intervalTime = 5000;
  fetching = true;
  showPlanetInfo = true;

  private oldRobots: Robot[];

  private planetSubscription: Subscription;
  private robotSubscription: Subscription;
  private gamesSubscription: Subscription;
  private playerSubscription: Subscription;
  constructor(
    private mapService: MapService,
    private robotService: RobotsService,
    private gamesService: GamesService,
    private playerService: PlayerService,
    private router: Router) { }

  ngOnInit() {
    this.games = loadGamesFromLocalStorage();
    this.planetSubscription = interval(this.intervalTime).subscribe(() => this.onGetPlanets());
    this.robotSubscription = interval(this.intervalTime).subscribe(() => this.onGetRobots());
    this.onGetPlayers();
    this.playerService.getPlayers();
    this.gamesSubscription = interval(this.intervalTime).subscribe(() => this.onGetGames());
    interval(10000).subscribe(() => saveGamesToLocalStorage(this.games));
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
  onGetPlayers() {
    this.playerService.getPlayersObservable().subscribe((players: Player[]) => {
      this.players = players;
    });
  }
  redirectToControlpanel() {
    this.router.navigate(['/controlpanel']);
  }
  calculateEarningsFromCargoChange(oldCargo, newCargo) {
    let earnings = 0;
    const prices = { coal: 5, iron: 15, gem: 30, gold: 50, platin: 60 };
    for (const item in prices) {
      const soldAmount = oldCargo[item] - newCargo[item];
      if (soldAmount > 0) {
        earnings += soldAmount * prices[item];
      }
    }
    return earnings;
  }
 
  calculateSpentOnUpgrades(oldLevels, newLevels) {
    const upgradeCosts = [0, 50, 300, 1500, 4000, 15000];
    if (newLevels.miningLevel > oldLevels.miningLevel) {
      return upgradeCosts[newLevels.miningLevel];
    }
    return 0;
  }

  getOldRobotById(oldRobots, robotId) {
    return oldRobots.find(oldRobot => oldRobot.robotId === robotId) || null;
  }
  isNewRobot(oldRobots, newRobot) {
    return !oldRobots.some(oldRobot => oldRobot.robotId === newRobot.robotId);
  }
  updatePlayerBalances(players, oldRobots, newRobots) {
    newRobots.forEach(newRobot => {
      const oldRobot = this.getOldRobotById(oldRobots, newRobot.robotId);
      if (oldRobot) {
        const earningsFromCargo = this.calculateEarningsFromCargoChange(oldRobot.cargo, newRobot.cargo);
        const spentOnUpgrades = this.calculateSpentOnUpgrades(oldRobot.levels, newRobot.levels);
        const netBalance = earningsFromCargo - spentOnUpgrades;

        const player = players.find(player => player.playerId === newRobot.playerId);
        if (player) {
          player.money += netBalance;
        }
      } else if (this.isNewRobot(oldRobots, newRobot)) {
        const player = players.find(player => player.playerId === newRobot.playerId);
        if (player) {
          player.money -= 100;
        }
      }
    });
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
    for (const robot of this.robots) {
      const targetPlanet = this.planets.find(planet => planet.planetId === robot.planetId);
      if (targetPlanet) {
        const robotExistsOnPlanet = targetPlanet.robots.some(existingRobot => existingRobot.robotId === robot.robotId);
        if (!robotExistsOnPlanet) {
          targetPlanet.robots.push(robot);
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
    this.updatePlayerBalances(this.players, this.oldRobots, this.robots)
  }

  private setupGrid() {
    let maxX = Math.max(...this.planets.map(p => this.getPosition(p).x));
    let maxY = Math.max(...this.planets.map(p => this.getPosition(p).y));

    for (let i = 0; i <= maxY; i++) {
      this.grid[i] = [];
      for (let j = 0; j <= maxX; j++) {
        this.grid[i][j] = null;
      }
    }

    for (let planet of this.planets) {
      const position = this.getPosition(planet);
      this.grid[position.y][position.x] = planet;
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
    saveGamesToLocalStorage(this.games);
  }
}

