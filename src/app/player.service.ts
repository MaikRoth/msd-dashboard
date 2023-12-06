import { Injectable } from "@angular/core";
import { GamesService } from "./games.service";
import { HttpClient } from "@angular/common/http";
import { Game } from "./controlpanel/log/log.component";
import { Player } from './map/player/player.component';
import { RobotsService } from "./robot.service";
import { Robot } from "./map/robot/robot.component";
import { Observable, switchMap, of, catchError, Subject } from "rxjs";

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
type AchievementsResponse = {
    gameId: string,
    playerAchievements: Entrie[]
}

@Injectable({ providedIn: 'root' })
export class PlayerService {

    private playersEndpoint = 'http://localhost:8089/achievements'

    constructor(
        private http: HttpClient,
        private gameService: GamesService) { }

    private players$ = new Subject<Player[]>();

    getPlayers() {
        this.gameService.getPlayingPlayers().pipe(
            switchMap((playingPlayers: string[]) => {
                let players: Player[] = [];
                return this.http.get<AchievementsResponse>(this.playersEndpoint).pipe(
                    switchMap((res: AchievementsResponse) => {
                        res.playerAchievements.forEach(entrie => {
                            if (playingPlayers.includes(entrie.player.name) && players.length < playingPlayers.length && !players.some(player => player.name === entrie.player.name)) {
                                players.push({
                                    playerId: entrie.player.id,
                                    name: entrie.player.name,
                                    money: 500,
                                    robots: []
                                });
                            }
                        });
                        this.players$.next(players);
                        return of(players);
                    }),
                    catchError(error => {
                        console.error('Error fetching players:', error);
                        return of([]);
                    })
                );
            })
        ).subscribe();
    }

    getPlayersObservable() {
        return this.players$.asObservable();
    }

   
}