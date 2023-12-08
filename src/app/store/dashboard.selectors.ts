import { createSelector } from "@ngrx/store"
import { CustomGame } from "../controlpanel/controlpanel.component"
import { Planet } from '../map/planet/planet.component';
import { Player } from "../map/player/player.component"
import { Robot } from "../map/robot/robot.component"
import { Game } from "../controlpanel/gameshandler/gameshandler.component"
import { MapState } from "./dashboard.reducer";

export const selectCustomGames = (state: {
    customGames: CustomGame[]
}) => state.customGames

export const selectRobots = (state: MapState) => state.robots;
export const selectPlanets = (state: MapState) => state.planets;
export const selectPlayers = (state: MapState) => state.players;
export const selectGrid = (state: MapState) => state.grid;
export const selectGames = (state: MapState) => state.games;
export const selectMap = createSelector(
    selectRobots,
    selectGames,
    selectPlanets, 
    selectPlayers,
    selectGrid,
    (
        selectedRobots: Robot[],
        selectedGames: Game[],
        selectedPlanets: Planet[], 
        selectedPlayers: Player[],
        selectedGrid: (Planet | null)[][]
    ) => {
        return { selectedRobots, selectedGames, selectedPlanets, selectedPlayers, selectedGrid };
    }
);
