import { addCustomGame } from './dashboard.actions';
import { createReducer, on } from '@ngrx/store';

const initialCustomGamesState = [{ players: 6, rounds: 50, duration: 15000 }]
export const customGamesReducer = createReducer(
  initialCustomGamesState,
  on(addCustomGame, (state, { players, rounds, duration }) => ([...state, { players, rounds, duration }]))
)
const initialRobotsState = []
export const robotsReducer = createReducer(
  initialRobotsState,
)

const initialPlanetsState = []
export const planetsReducer = createReducer(
  initialPlanetsState
)

const initialPlayersState = []
export const playersReducer = createReducer(
  initialPlayersState
)

// export function gameReducer(state: GameState = initialState, action: GameActions): GameState {
//   switch (action.type) {
//     case ADD_CUSTOM_GAME:
//       return {
//         ...state,
//         customGames: [...state.customGames, action.payload]
//       };
//     default:
//       return state;
//   }
// }
