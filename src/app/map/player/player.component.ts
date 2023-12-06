import { Component, Input, OnInit } from '@angular/core';
import { Robot } from '../robot/robot.component';
import { RobotsService } from '../../robot.service'

export type Player = {
  playerId: string,
  name: string,
  robots: Robot[],
  money: number
}

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent {
  @Input() player: Player;
  @Input() tag: string;  
  showRobots = false;
  highlightRobots = false;

  constructor(private robotService : RobotsService){

  }

  toggleInspectRobots() {
    this.showRobots = !this.showRobots;
  }

  toggleHighlightRobots(){
    if (this.highlightRobots){
      this.highlightRobots = false
      this.robotService.resetHighlightOfPlayer(this.player.playerId)
    }else {
      this.highlightRobots = true
      this.robotService.highlightRobotsOfPlayer(this.player.playerId)
    }
  }

}
