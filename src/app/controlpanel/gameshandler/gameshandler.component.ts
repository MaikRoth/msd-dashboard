import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, interval, switchMap } from 'rxjs';
import { loadGamesFromLocalStorage, saveGamesToLocalStorage } from '../../app.component';
import { GamesService } from '../../games.service';

export type Game = {
  gameId: string,
  currentRoundNumber: number | null,
  gameStatus: string,
  maxPlayers: number,
  maxRounds: number,
  participatingPlayers: string[],
  roundLengthInMillis: number,
}


@Component({
  selector: 'app-gameshandler',
  templateUrl: './gameshandler.component.html',
  styleUrl: './gameshandler.component.css'
})
export class GameshandlerComponent implements OnInit, OnDestroy {
  games: Game[];
  private gamesSubscription: Subscription;
  fetching = true;

  constructor(private gamesService: GamesService) {

  }
  ngOnInit() {
    const games = loadGamesFromLocalStorage()
    console.log(games);
    
    if (games) {
      this.games = games
      this.fetching = false
    }
    this.gamesSubscription = interval(2000)
      .pipe(switchMap(() => this.gamesService.fetchGames()))
      .subscribe(res => {
        this.games = res;
        this.fetching = false;
      });
  }

  ngOnDestroy() {
    if (this.gamesSubscription) {
      this.gamesSubscription.unsubscribe();
    }
    saveGamesToLocalStorage(this.games)
  }
}
