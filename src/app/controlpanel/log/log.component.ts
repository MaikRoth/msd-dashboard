import { Component, OnDestroy, OnInit } from '@angular/core';
import { GamesService } from '../../games.service';
import { Subscription, interval, switchMap } from 'rxjs';
import { Router } from '@angular/router';

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
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrl: './log.component.css',
  providers: [GamesService]
})
export class LogComponent implements OnInit, OnDestroy {

  games: Game[];
  private gamesSubscription: Subscription;
  fetching = true;

  constructor(private gamesService: GamesService, private router : Router) {

  }
  ngOnInit() {
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
  }
}
