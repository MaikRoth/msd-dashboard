import { createAction, props } from '@ngrx/store';
import { CustomGame } from '../controlpanel/controlpanel.component';
import { Game } from '../controlpanel/gameshandler/gameshandler.component';
import { Planet } from '../map/planet/planet.component';
import { Player } from '../map/player/player.component';
import { Robot } from '../map/robot/robot.component';


export const init = createAction(
  '[Dashboard] Init'
)
export const addCustomGame = createAction(
  '[Game] Add Custom Game',
  props<CustomGame>()
)
export const setCustomGames = createAction(
  '[Custom Game] Set',
  props<{ customGames: CustomGame[] }>()
)
export const saveCustomGames = createAction(
  '[Custom Game] Save',
  props<{ customGames: CustomGame[] }>()
)


export const gridInit = createAction(
  '[Map] Init'
)

export const saveMap = createAction(
  '[Map] Save',
  props<{
    robots: Robot[],
    planets: Planet[],
    grid: (Planet | null)[][],
    player: Player[],
    games: Game[]
  }>()
)

export const setMap = createAction(
  '[Map] Set',
  props<{
    robots: Robot[],
    planets: Planet[],
    grid: (Planet | null)[][],
    player: Player[],
    games: Game[]
  }>()
)

export const loadRobots = createAction(
  '[Robot] Load'
)
export const loadRobotsSuccess = createAction(
  '[Robot] Load Succes',
  props<{ robots: Robot[] }>()
)
export const loadRobotsFailure = createAction(
  '[Robot] Load Failure',
  props<{ error: any }>()
)

export const loadGames = createAction(
  '[Game] Load'
)
export const loadGamesSuccess = createAction(
  '[Game] Load Succes',
  props<{ games: Game[] }>()
)
export const loadGamesFailure = createAction(
  '[Game] Load Failure',
  props<{ error: any }>()
)

export const loadPlayers = createAction(
  '[Player] Load'
)
export const loadPlayersSuccess = createAction(
  '[Player] Load Succes',
  props<{ players: Player[] }>()
)
export const loadPlayersFailure = createAction(
  '[Player] Load Failure',
  props<{ error: any }>()
)

export const loadPlanets = createAction(
  '[Planet] Load'
)
export const loadPlanetsSuccess = createAction(
  '[Planet] Load Succes',
  props<{ planets: Planet[] }>()
)
export const loadPlanetsFailure = createAction(
  '[Planet] Load Failure',
  props<{ error: any }>()
)


export const highlightRobot = createAction(
  '[Robot] Highlight',
  props<{ robotId: string }>()
);

export const resetHighlightRobot = createAction(
  '[Robot] Reset Highlight',
  props<{ robotId: string }>()
);

export const highlightRobotsOfPlayer = createAction(
  '[Robot] Highlight Of Player',
  props<{ playerId: string }>()
);

export const resetHighlightOfPlayer = createAction(
  '[Robot] Reset Highlight Of Player',
  props<{ playerId: string }>()
);