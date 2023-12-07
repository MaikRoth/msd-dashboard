import { Component, OnInit } from '@angular/core';
import { GamesService } from '../games.service';
import { Store } from '@ngrx/store';
import { addCustomGame } from '../store/dashboard.actions';
import { Observable, map } from 'rxjs';

export type CustomGame = {
  players: number,
  rounds: number,
  duration: number
}

@Component({
  selector: 'app-controlpanel',
  templateUrl: './controlpanel.component.html',
  styleUrl: './controlpanel.component.css',
})
export class ControlpanelComponent implements OnInit {

  players: number = 6;
  rounds: number = 50;
  duration: number = 15000;
  customGames$: Observable<{customGames:CustomGame[]}>;
  gameCreationErrorText: string;
  status: string;
  shouldShake: boolean = false;


  constructor(
    private gamesService: GamesService, 
    private store: Store<{customGames: {customGames:CustomGame[]}}>) { }

  ngOnInit() {
    this.customGames$ = this.store.select('customGames')
  }

  onSelectCustomGame() {
    this.gamesService.createCustom(this.players, this.rounds, this.duration).subscribe(() => { });
  }
  onCreateCustomGame() {
    this.checkForDuplicates(this.players, this.rounds, this.duration).subscribe(isDuplicate => {
      if (isDuplicate) {
        this.triggerShake();
      } else {
        this.store.dispatch(addCustomGame({ players: this.players, rounds: this.rounds, duration: this.duration }));
        this.onSelectCustomGame();
      }
    });
  }
  triggerShake() {
    this.shouldShake = true;
    setTimeout(() => this.shouldShake = false, 820);
  }
  checkForDuplicates(pla: number, rou: number, dur: number): Observable<boolean> {
    return this.customGames$.pipe(
      map(games => games.customGames.some(game => game.players === pla && game.rounds === rou && game.duration === dur))
    );
  }

}
