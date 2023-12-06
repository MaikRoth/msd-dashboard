import { Component, OnInit } from '@angular/core';
import { GamesService } from '../games.service';
import { Store } from '@ngrx/store';
import { GameState, AddCustomGame } from './game.state';



@Component({
  selector: 'app-controlpanel',
  templateUrl: './controlpanel.component.html',
  styleUrl: './controlpanel.component.css',
})
export class ControlpanelComponent implements OnInit {

  players: number = 6;
  rounds: number = 120;
  duration: number = 15000;
  customGames: {
    players: number,
    rounds: number,
    duration: number
  }[] = [];

  gameCreationErrorText: string;
  status: string;
  shouldShake: boolean = false;


  constructor(private gamesService: GamesService, private store: Store<{ game: GameState }>) { }
  
  ngOnInit() {
    this.store.select('game').subscribe(gameState => {
      this.customGames = [{ players: 6, rounds: 50, duration: 15000 }, ...gameState.customGames];
    });
  
  }
  
  onSelectCustomGame(){
    this.gamesService.createCustom(this.players, this.rounds, this.duration).subscribe(() => {});
  }
  onCreateCustomGame() {
    if (this.checkForDuplicates(this.players, this.rounds, this.duration)) {
      this.triggerShake();
    } else {
      this.store.dispatch(new AddCustomGame({ players: this.players, rounds: this.rounds, duration: this.duration }));
      this.onSelectCustomGame();
    }
  }
  triggerShake() {
    this.shouldShake = true;
    setTimeout(() => this.shouldShake = false, 820); 
  }
  checkForDuplicates(pla: number, rou: number, dur: number) {
    return this.customGames.some(game => game.players === pla && game.rounds === rou && game.duration === dur);
  }
}
