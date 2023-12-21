import { Injectable } from "@angular/core";
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

  }
  clearTransactionHistory(): void {
    this.transactionHistory.clear();
    this.saveTransactionHistoryToLocalStorage(); 
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
}