import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { Robot } from '../robot/robot.component';
import { RobotsService } from '../../robot.service'
import { Subscription, interval, timer } from 'rxjs';
import { MoneyService } from '../../money.service';
import { PlayerService, TransactionEntry } from '../../player.service';

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

  transactions: TransactionEntry[] = []
  showTransactionHistory = false;

  private playerSubscription : Subscription;
  showRobots = false;
  highlightRobots = false;

  constructor(
    private robotService: RobotsService, 
    private moneyService: MoneyService, 
    private playerService: PlayerService) {

  }

  ngOnInit(): void {
    this.playerSubscription = interval(1000).subscribe(() => {
      this.player.money = this.moneyService.getMoney(this.player.playerId) 
      this.transactions = this.playerService.getTransactionHistory(this.player.playerId)
      console.log(this.transactions);
      
    })
  }
  async copyToClipboard(value: string) {
    try {
      await navigator.clipboard.writeText(value);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }
  toggleTransactionHistory() {
    this.showTransactionHistory = !this.showTransactionHistory;
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
    this.playerSubscription.unsubscribe();
  }
}
