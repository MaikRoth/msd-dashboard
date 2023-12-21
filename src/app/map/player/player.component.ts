import { AfterViewChecked, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
export class PlayerComponent implements OnInit, OnDestroy, AfterViewChecked {
  @Input() player: Player;
  @Input() tag: string;
  @ViewChild('tableContainer') private tableContainer: ElementRef;

  private playerSubscription : Subscription;
  private transactionAddedSubscription: Subscription;

  showTransactionHistory = false;
  clickedCells: {[entity: string]: boolean} = {}; 
  showRobots = false;
  highlightRobots = false;
  searchTerm: string = ''; 
  transactions: TransactionEntry[] = []
  get filteredTransactions(): TransactionEntry[] {
    if (!this.searchTerm) {
      return this.transactions; 
    }
    return this.transactions.filter(transaction => 
      transaction.entity.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

  robotSearchTerm: string = '';
  get filteredRobots(): Robot[] {
    if (!this.robotSearchTerm) {
      return this.player.robots;
    }
    return this.player.robots.filter(robot => 
      robot.name.toLowerCase().includes(this.robotSearchTerm.toLowerCase()));
  }

  constructor(
    private robotService: RobotsService, 
    private moneyService: MoneyService, 
    private playerService: PlayerService) {
      this.transactionAddedSubscription = this.playerService.transactionAdded.subscribe(() => {
        this.scrollToBottom();
      });
  }


  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.tableContainer.nativeElement.scrollTop = this.tableContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
  handleClickedCell(entity: string) {
    if (entity && entity !== 'Admin') {
      if (this.clickedCells[entity]){
        this.robotService.resetHighlightRobotByName(entity)
      } else {
        this.robotService.highlightRobotByName(entity)
      }
      this.clickedCells[entity] = !this.clickedCells[entity];
    }
  }
  ngOnInit(): void {
    this.playerSubscription = interval(1000).subscribe(() => {
      this.player.money = this.moneyService.getMoney(this.player.playerId) 
      this.transactions = this.playerService.getTransactionHistory(this.player.playerId)
      
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
    this.transactionAddedSubscription.unsubscribe();
  }
}
