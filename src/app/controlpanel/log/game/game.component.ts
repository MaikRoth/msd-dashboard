import { Component, Input } from '@angular/core';
import { GamesService } from '../../../games.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent {
  @Input() game;
  @Input() planets;
  @Input() robots;

  constructor(private gamesService : GamesService, private router : Router){}

  onStartGame(id: string) {
    this.gamesService.startGame(id).subscribe(() => {
      this.redirectToMap()
    })
  }
  redirectToMap() {
    this.router.navigate(['/map']);
  }
  redirectToControlPanel(){
    this.router.navigate(['/controlpanel'])
  }
  onEndGame(id: string) {
    this.gamesService.endGame(id).subscribe(() => {this.redirectToControlPanel() })
  }
}
