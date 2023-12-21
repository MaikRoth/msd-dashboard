import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
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
export class PlayerComponent implements OnInit, OnDestroy {
  @Input() player: Player;
  @Input() tag: string;
  showRobots = false;
  highlightRobots = false;

  constructor(private robotService: RobotsService) {

  }

  ngOnInit(): void {
    const money = localStorage.getItem(`[Money] ${this.player.playerId}`)
    if(money){
      this.player.money = +money
    }    
  }
  async copyToClipboard(value: string) {
    try {
      await navigator.clipboard.writeText(value);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }
  toggleInspectRobots() {
    this.showRobots = !this.showRobots;
  }
  toggleCollapse(element: ElementRef): void {
    (element.nativeElement).collapse('toggle');
  }
  toggleHighlightRobots() {
    if (this.highlightRobots) {
      this.highlightRobots = false
      this.robotService.resetHighlightOfPlayer(this.player.playerId)
    } else {
      this.highlightRobots = true
      this.robotService.highlightRobotsOfPlayer(this.player.playerId)
    }
  }
  ngOnDestroy(): void {
      localStorage.setItem(this.player.money.toString(), `[Money] ${this.player.playerId}`)
  }
}
