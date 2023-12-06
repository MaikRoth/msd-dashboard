import { Action } from '@ngrx/store';

export interface GameState {
  customGames: {
    players: number;
    rounds: number;
    duration: number;
  }[];
}

export const ADD_CUSTOM_GAME = '[Game] Add Custom Game';

export class AddCustomGame implements Action {
  readonly type = ADD_CUSTOM_GAME;

  constructor(public payload: { players: number; rounds: number; duration: number; }) {}
}

export type GameActions = AddCustomGame;
