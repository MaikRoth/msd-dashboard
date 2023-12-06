import { CustomGame } from "../controlpanel/controlpanel.component"
import { Planet } from "../map/planet/planet.component"
import { Player } from "../map/player/player.component"
import { Robot } from "../map/robot/robot.component"

export const selectCustomGames = (state: {
    customGames: CustomGame[]
  }) => state.customGames

export const selectRobots = (state: {
    robots: Robot[]
}) => state

export const selectPlanet = (state: {
    robots: Planet[]
}) => state

export const selectPlayers = (state: {
    robots: Player[]
}) => state