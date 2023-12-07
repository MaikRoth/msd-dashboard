import { Component, OnInit } from '@angular/core';
import { CustomGame } from './controlpanel/controlpanel.component';
import { Store } from '@ngrx/store';
import { init } from './store/dashboard.actions';
import { Game } from './controlpanel/gameshandler/gameshandler.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    this.store.dispatch(init())
  }
  constructor(private store: Store) {

  }
}
export function saveGamesToLocalStorage(games: Game[]) {
  localStorage.setItem('games', JSON.stringify(games));
}

export function loadGamesFromLocalStorage(): Game[] {
  const savedGames = localStorage.getItem('games');
  if (savedGames) {
    return JSON.parse(savedGames);
  }
  return []
}

export function saveCustomGamesToLocalStorage(games: CustomGame[]) {
  localStorage.setItem('customGames', JSON.stringify(games));
}

export function loadCustomGamesFromLocalStorage(): CustomGame[] {
  const savedGames = localStorage.getItem('customGames');
  if (savedGames) {
    return JSON.parse(savedGames);
  }
  return []
}