import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Player } from './map/player/player.component';
import { switchMap, of, Observable, map } from "rxjs";
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
    private moneyService: MoneyService) { }

  addTransaction(playerId: string, entry: TransactionEntry): void {
    const history = this.transactionHistory.get(playerId) || [];
    history.push(entry);
    this.transactionHistory.set(playerId, history);
  }

  getTransactionHistory(playerId: string): TransactionEntry[] {
    return this.transactionHistory.get(playerId) || [];
  }
  getPlayers(): Observable<Player[]> {
    return this.http.get<any[]>('http://localhost:8080/games').pipe(
      map(games => games.flatMap(game => game.participatingPlayers)),
      map(playerNames => {
        return this.http.get<{ scoreboardEntries: any[] }>('http://localhost:8089/scoreboard').pipe(
          map(scoreboard => {
            return playerNames.map(name => {
              const playerScoreboard = scoreboard.scoreboardEntries.find(entry => entry.player.name === name);
              const newPlayer: Player = {
                playerId: playerScoreboard?.player.id,
                name: name,
                robots: [],
                money: 0
              };
              this.moneyService.addMoney(newPlayer.playerId, 500);
              this.addTransaction(newPlayer.playerId, 
                {type: 'INIT', entity: "Admin", item: 'money', amount: 1, earning: 500})
              return newPlayer;
            });
          })
        );
      }),
      switchMap(playerObservable => playerObservable),
      map(players => {
        return players;
      })
    );
  }
}