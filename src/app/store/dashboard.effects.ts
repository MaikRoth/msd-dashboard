import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { CustomGame } from '../controlpanel/controlpanel.component';
import { catchError, map, mergeMap, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { addCustomGame, init, loadPlayers, loadPlayersFailure, loadPlayersSuccess, loadRobots, loadRobotsFailure, loadRobotsSuccess, setCustomGames } from './dashboard.actions';
import { selectCustomGames } from './dashboard.selectors';
import { HttpClient } from '@angular/common/http';
import { Robot } from '../map/robot/robot.component';
import { PlayerService } from '../player.service';



@Injectable()
export class DashboardEffects {
    loadCustomGames$ = createEffect(
        () => this.actions$.pipe(
            ofType(init),
            switchMap(() => {
                const storedGames = localStorage.getItem("customGames");
                if (storedGames) {
                    return of(setCustomGames({ customGames: JSON.parse(storedGames) }))
                }
                return of(setCustomGames({ customGames: [] }))
            })
        )
    )
    saveCustomGames$ = createEffect(
        () => this.actions$.pipe(
            ofType(addCustomGame),
            withLatestFrom(this.store.select(selectCustomGames)),
            tap(([action, games]) => {
                localStorage.setItem('customGames', JSON.stringify(games))
            })
        ),
        { dispatch: false }
    )


    loadRobots$ = createEffect(() => this.actions$.pipe(
        ofType(loadRobots),
        switchMap(() => this.http.get<Robot[]>("http://localhost:8096/robots").pipe(
            map(robots => loadRobotsSuccess({ robots })),
            catchError(error => of(loadRobotsFailure({ error })))
        ))
    ));
    loadPlayers$ = createEffect(() => this.actions$.pipe(
        ofType(loadPlayers),
        mergeMap(() => this.playerService.getPlayers()
            .pipe(
                map(players => ({ type: '[Player] Players Loaded Success', payload: players })),
                catchError(error => of(loadPlayersFailure({ error })))
            ))
    )
    );
    constructor(
        private actions$: Actions, 
        private http: HttpClient, 
        private store: Store<{ customGames: CustomGame[] }>,
        private playerService : PlayerService) { }
}