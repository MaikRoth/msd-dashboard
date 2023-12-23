import { ElementRef, EventEmitter, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Player } from './map/player/player.component';
import { switchMap, of, Observable, map, forkJoin } from "rxjs";
import { MoneyService } from "./money.service";
import { Robot } from "./map/robot/robot.component";

export type TransactionEntry = {
  type: 'BUY' | 'SELL' | 'INIT',
  entity: string,
  item: string,
  amount: number
  earning: number
};
@Injectable({ providedIn: 'root' })
export class PlayerService {

  private transactionHistory = new Map<string, TransactionEntry[]>();
  transactionAdded = new EventEmitter<void>();
  private teamColors = [ 'blue', 'green', 'orange', 'purple', 'red', 'yellow']; // add this if more than 6 player. 'grey', 'silver', 'black',
  private playerColorsMap = new Map<string, string>();

  constructor(
    private http: HttpClient,
    private moneyService: MoneyService) {
    this.loadTransactionHistoryFromLocalStorage();
  }

  addTransaction(playerId: string, entry: TransactionEntry): void {
    const history = this.transactionHistory.get(playerId) || [];
    history.push(entry);
    this.transactionHistory.set(playerId, history);
    this.saveTransactionHistoryToLocalStorage();
    this.transactionAdded.emit();
  }
  clearTransactionHistory(): void {
    this.transactionHistory.clear();
    this.saveTransactionHistoryToLocalStorage();
  }
  getPlayerColor(playerId: string): string {
    return this.playerColorsMap.get(playerId);
  }
  getPlayerColorMap(){
    return this.playerColorsMap
  }
  clearColorMap(){
    this.playerColorsMap.clear();
  }
  getUnusedColor(): string {
    const usedColors = new Set(this.playerColorsMap.values());
    const availableColors = this.teamColors.filter(color => !usedColors.has(color));

    if (availableColors.length === 0) {
      throw new Error('No more unique colors available');
    }

    const randomColor = availableColors[Math.floor(Math.random() * availableColors.length)];
    return randomColor;
  }
  getRandomColor(): string {
    return this.teamColors[Math.floor(Math.random() * this.teamColors.length)];
  }
  getTransactionHistory(playerId: string): TransactionEntry[] {
    return this.transactionHistory.get(playerId) || [];
  }
  getPlayers(): Observable<Player[]> {
    const gamesRequest = this.http.get<any[]>('http://localhost:8080/games').pipe(
      map(games => games.flatMap(game => game.participatingPlayers))
    );

    const scoreboardRequest = this.http.get<{ scoreboardEntries: any[] }>('http://localhost:8089/scoreboard');

    return forkJoin([gamesRequest, scoreboardRequest]).pipe(
      map(([playerNames, scoreboard]) => {
        return playerNames.map(name => {
          const playerScoreboard = scoreboard.scoreboardEntries.find(entry => entry.player.name === name);

          if (playerScoreboard && playerScoreboard.player.id) {
            const randomColor = this.getUnusedColor();
            this.playerColorsMap.set(playerScoreboard.player.id, randomColor);
            const newPlayer: Player = {
              playerId: playerScoreboard.player.id,
              name: name,
              robots: [],
              money: 0
            };
            this.moneyService.setMoney(newPlayer.playerId, 500);
            this.addTransaction(newPlayer.playerId, { type: 'INIT', entity: "Admin", item: 'money', amount: 1, earning: 500 });
            return newPlayer;
          }
          return null;
        }).filter(player => player !== null);
      })
    );
  }

  private saveTransactionHistoryToLocalStorage(): void {
    const serializedHistory = JSON.stringify(Array.from(this.transactionHistory.entries()));
    localStorage.setItem('transactionHistory', serializedHistory);
  }

  private loadTransactionHistoryFromLocalStorage(): void {
    const serializedHistory = localStorage.getItem('transactionHistory');
    if (serializedHistory) {
      const history = new Map<string, TransactionEntry[]>(JSON.parse(serializedHistory));
      this.transactionHistory = history;
    }
  }
}