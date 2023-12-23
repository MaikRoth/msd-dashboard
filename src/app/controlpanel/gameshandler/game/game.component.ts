import { Component, Input, OnInit } from '@angular/core';
import { GamesService } from '../../../games.service';
import { Router } from '@angular/router';
import { Game } from '../gameshandler.component';
import { MoneyService } from '../../../money.service';
import { PlayerService } from '../../../player.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent implements OnInit {
  @Input() game: Game;
  @Input() planets;
  @Input() robots;
  @Input() totalScore;
  @Input() achievements;
  
  collapsedStates: Map<string, boolean> = new Map();

  constructor(
    private gamesService: GamesService, 
    private router: Router, 
    private moneyService: MoneyService,
    private playerService: PlayerService) {}

  ngOnInit() {
    this.initializeCollapsedState();
  }

  initializeCollapsedState() {
    const collapsedState = this.getCollapsedStateFromLocalStorage(this.game.gameId);
    this.collapsedStates.set(this.game.gameId, collapsedState);
  }

  getCollapsedStateFromLocalStorage(gameId: string) {
    return localStorage.getItem(`game-collapsed-${gameId}`) === 'true';
  }

  setCollapsedStateInLocalStorage(gameId: string, isCollapsed: boolean) {
    localStorage.setItem(`game-collapsed-${gameId}`, String(isCollapsed));
  }

  toggleCollapse(gameId: string) {
    const currentCollapsedState = this.collapsedStates.get(gameId) || false;
    const newCollapsedState = !currentCollapsedState;
    this.collapsedStates.set(gameId, newCollapsedState);
    this.setCollapsedStateInLocalStorage(gameId, newCollapsedState);
  }

  onStartGame(id: string) {
    this.gamesService.startGame(id).subscribe(() => {
      this.redirectToMap();
    })
    this.moneyService.clear();
    this.playerService.clearColorMap();
  }

  redirectToMap() {
    this.router.navigate(['/map']);
  }

  redirectToControlPanel() {
    this.router.navigate(['/controlpanel'])
  }

  onEndGame(id: string) {
    this.gamesService.endGame(id).subscribe(() => {
      this.redirectToControlPanel()
    })
    this.moneyService.clear()
    this.playerService.clearColorMap();
  }
}
