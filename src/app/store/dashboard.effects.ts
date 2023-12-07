import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { CustomGame } from '../controlpanel/controlpanel.component';
import { of, switchMap, tap, withLatestFrom } from 'rxjs';
import { addCustomGame, init, setCustomGames } from './dashboard.actions';
import { selectCustomGames } from './dashboard.selectors';



@Injectable()
export class DashboardEffects {
    loadCustomGames$ = createEffect(
        () => this.actions$.pipe(
            ofType(init),
            switchMap(()=>{
                const storedGames = localStorage.getItem("customGames");
                if (storedGames){
                    return of(setCustomGames({customGames: JSON.parse(storedGames)}))
                }
                return of(setCustomGames({customGames: []}))
            })
        )
    )
    saveCustomGames$ = createEffect(
        () => this.actions$.pipe(
            ofType(addCustomGame),
            withLatestFrom(this.store.select(selectCustomGames)),
            tap(([action, games])=>{
                localStorage.setItem('customGames', JSON.stringify(games))
            })
        ),
        { dispatch: false }
    )
    constructor(private actions$: Actions, private store: Store<{ customGames: CustomGame[] }>) { }
}