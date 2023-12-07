import { createAction, props } from '@ngrx/store';
import { CustomGame } from '../controlpanel/controlpanel.component';


export const init = createAction(
  '[Dashboard] Init'
)

export const addCustomGame = createAction(
  '[Game] Add Custom Game',
  props<CustomGame>()
)


export const setCustomGames = createAction(
  '[Custom Game] Set',
  props<{customGames: CustomGame[]}>()
)

export const saveCustomGames = createAction(
  '[Custom Game] Save',
  props<{customGames: CustomGame[]}>()
)
// export const ADD_CUSTOM_GAME = '[Game] Add Custom Game';

// export class AddCustomGame implements Action {
//   readonly type = ADD_CUSTOM_GAME;

//   constructor(public payload: { players: number; rounds: number; duration: number; }) {}
// }

// export type GameActions = AddCustomGame;
