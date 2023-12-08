import { Game } from '../controlpanel/gameshandler/gameshandler.component';
import { Planet } from '../map/planet/planet.component';
import { Player } from '../map/player/player.component';
import { Robot } from '../map/robot/robot.component';
import { addCustomGame, loadGamesSuccess, loadPlanetsSuccess, loadPlayersSuccess, loadRobotsSuccess, saveMap, setMap } from './dashboard.actions';
import { createReducer, on } from '@ngrx/store';

const initialCustomGamesState = {
  customGames: [{ players: 6, rounds: 50, duration: 15000 }]
}
export const customGamesReducer = createReducer(
  initialCustomGamesState,
  on(addCustomGame, (state, { players, rounds, duration }) =>
    ({ ...state, customGames: [...state.customGames, { players, rounds, duration }] })
  ));


export interface MapState {
  robots: Robot[],
  planets: Planet[],
  grid: (Planet | null)[][],
  players: Player[],
  games: Game[],
}

const initialMapState: MapState = {
  robots: [],
  players: [],
  planets: [],
  games: [],
  grid: []
}

export const mapReducer = createReducer(
  initialMapState,
  on(saveMap, (state, { robots, planets, grid, player, games }) => ({
    ...state,
    robots: robots,
    planets: planets,
    grid: grid,
    players: player,
    games: games
  })),
  on(setMap, (state, { robots, planets, grid, player, games }) => ({
    ...state,
    robots: robots,
    planets: planets,
    grid: grid,
    players: player,
    games: games
  })),
  on(loadRobotsSuccess, (state, { robots }) => ({
    ...state,
    robots: robots
  })),
  on(loadPlanetsSuccess, (state, { planets }) => ({
    ...state,
    planets: planets
  })),
  on(loadGamesSuccess, (state, { games }) => ({
    ...state,
    games: games
  })),
  on(loadPlayersSuccess, (state, { players }) => ({
    ...state,
    players: players
  })),
)