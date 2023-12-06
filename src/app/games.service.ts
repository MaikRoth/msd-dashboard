import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, map, mergeMap, of } from "rxjs";
import { Game } from "./controlpanel/log/log.component";

@Injectable({
  providedIn: 'root'
})
export class GamesService {

  private gamesEndpoint = "http://localhost:8080/games"
  constructor(private http: HttpClient) { }

  fetchGames(): Observable<any> {
    return this.http.get(this.gamesEndpoint).pipe(
      catchError(error => {
        console.error('No Connection to Enpoint: ', this.gamesEndpoint, '\nError: ', error)   
        return of([]);
      })
    );
  }

  getRecentGame() {
    return this.http.get<Game[]>(this.gamesEndpoint);
  }

  getPlayingPlayers(): Observable<string[]> {
    return this.http.get(this.gamesEndpoint).pipe(
      map((res: Game[]) => res[0].participatingPlayers)
    );
  }

  createCustom(player: number, rounds: number, dur: number): Observable<any> {
    return this.http.post<{ gameId: string }>(this.gamesEndpoint, {
      maxRounds: rounds,
      maxPlayers: player
    }).pipe(
      mergeMap((game) => {
        return this.http.patch(this.gamesEndpoint + '/' + game.gameId + '/duration', {
          duration: dur
        });
      }),
      catchError((error) => {
        console.error("Error:", error);
        return of(null);
      })
    );
  }

  startGame(gameId: string) {
    return this.http.post(this.gamesEndpoint + '/' + gameId + '/gameCommands/start', {})
  }

  endGame(gameId: string) {
    return this.http.post(this.gamesEndpoint + '/' + gameId + '/gameCommands/end', {})
  }
}