import { Injectable } from "@angular/core";
import { GamesService } from "./games.service";
import { HttpClient } from "@angular/common/http";
import { Player } from './map/player/player.component';
import { switchMap, of, catchError, Subject, Observable, map } from "rxjs";

type Entrie = {
  player: {
    id: string,
    name: string
  },
  gameId: string,
  achievements: {
    name: string,
    image: string,
    category: string
  }
}
type Scoreboard = {
  gameId: string,
  gameStatus: string,
  roundNumber: number,
  scoreboardEntries: ScoreboardEntries[]
}
type ScoreboardEntries = {
  player: {
    id: string,
    name: string,
  },
  totalScore: number,
  fightingScore: number,
  miningScore: number,
  tradingScore: number,
  travelingScore: number
}
type AchievementsResponse = {
  gameId: string,
  playerAchievements: Entrie[]
}

@Injectable({ providedIn: 'root' })
export class PlayerService {
  
  private players: Player[] | null = null;

  constructor(
    private http: HttpClient) { }



  getPlayers(): Observable<Player[]> {
    const storedPlayers = this.loadPlayersFromLocalStorage();
    if (storedPlayers) {
      this.players = storedPlayers;
      return of(storedPlayers);
    }
    return this.http.get<any[]>('http://localhost:8080/games').pipe(
      map(games => games.flatMap(game => game.participatingPlayers)),
      map(playerNames => {
        return this.http.get<{ scoreboardEntries: any[] }>('http://localhost:8089/scoreboard').pipe(
          map(scoreboard => {
            return playerNames.map(name => {
              const playerScoreboard = scoreboard.scoreboardEntries.find(entry => entry.player.name === name);
              return {
                playerId: playerScoreboard?.player.id,
                name: name,
                robots: [],
                money: 500
              };
            });
          })
        );
      }),
      switchMap(playerObservable => playerObservable),
      map(players => {
        this.players = players; 
        this.savePlayersToLocalStorage(players);
        return players;
      })
    );
  }
  savePlayersToLocalStorage(players: Player[]): void {
    try {
      const serializedPlayers = JSON.stringify(players);
      localStorage.setItem('players', serializedPlayers);
    } catch (e) {
      console.error('Error saving players to localStorage', e);
    }
  }

  loadPlayersFromLocalStorage(): Player[] | null {
    try {
      const serializedPlayers = localStorage.getItem('players');
      if (serializedPlayers) {
        return JSON.parse(serializedPlayers);
      }
    } catch (e) {
      console.error('Error loading players from localStorage', e);
    }
    return null;
  }

  getCachedPlayers(): Player[] | null {
    return this.players;
  }
}