import { GameState, GameActions, ADD_CUSTOM_GAME } from './game.state';

const initialState: GameState = {
    customGames: []
};

export function gameReducer(state: GameState = initialState, action: GameActions): GameState {
  switch (action.type) {
    case ADD_CUSTOM_GAME:
      return {
        ...state,
        customGames: [...state.customGames, action.payload]
      };
    default:
      return state;
  }
}
