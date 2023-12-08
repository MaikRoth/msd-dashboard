import { Component, Input, OnInit } from '@angular/core';
import { GamesService } from '../../../games.service';
import { Router } from '@angular/router';
import { Game } from '../gameshandler.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent implements OnInit {
  @Input() game: Game;
  @Input() planets;
  @Input() robots;
  
  collapsedStates: Map<string, boolean> = new Map(); // Track collapsed state for each game

  constructor(private gamesService: GamesService, private router: Router) {}

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
      this.redirectToMap()
    })
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
  }
}
