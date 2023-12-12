import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Robot } from "./map/robot/robot.component";

@Injectable({
    providedIn: 'root'
})
export class RobotsService {

    private robotsEndpoint = "http://localhost:8096/robots"
    constructor(private http: HttpClient) { }

    robots: Robot[] = [];
    highlightedRobots: Robot[] = [];

    fetchRobots() {
        this.http.get(this.robotsEndpoint).subscribe({
            next: (res: any[]) => {
                const updatedRobots = res.map(robotData => this.mapToRobot(robotData));
                let newRobotsArray: Robot[] = [];
                updatedRobots.forEach(newRobot => {
                    const existingRobot = this.robots.find(r => r.robotId === newRobot.robotId);
    
                    if (existingRobot) {
                        newRobotsArray.push({ ...existingRobot, ...newRobot });
                    } else {
                        const robotName = this.generateRobotName();                        
                        newRobotsArray.push({
                            ...newRobot,
                            name: robotName,
                            img: `https://robohash.org/${robotName}.png`
                        });
                    }
                });
                this.robots = newRobotsArray;
            },
            error: (error) => {
                console.error('Error fetching robots:', error);
            }
        });
    }

    getRobots() {
        this.fetchRobots();
        this.robots.forEach(robot => {
            this.highlightedRobots.forEach(hlRobot => {
                if (hlRobot.robotId === robot.robotId) {
                    robot.highlighted = true;
                }
            })
        })
        return this.robots;
    }

    highlightRobot(robot: Robot) {
        this.highlightedRobots.push(robot);
    }

    resetHighlightRobot(robot: Robot) {
        this.highlightedRobots = this.highlightedRobots.filter(r => r.robotId !== robot.robotId);
    }

    highlightRobotsOfPlayer(playerId: string) {
        this.robots.forEach(robot => {
            if (robot.playerId == playerId) {
                this.highlightedRobots.push(robot);
            }
        })
    }

    resetHighlightOfPlayer(playerId: string) {
        this.highlightedRobots = this.highlightedRobots.filter(r => r.playerId !== playerId);
    }

    areAttributesEqual(robot1: Robot, robot2: Robot): boolean {
        return (
            robot1.planetId === robot2.planetId &&
            robot1.playerId === robot2.playerId &&
            robot1.robotId === robot2.robotId &&
            robot1.vitals.health === robot2.vitals.health &&
            robot1.vitals.energy === robot2.vitals.energy &&
            robot1.cargo.capacity === robot2.cargo.capacity &&
            robot1.cargo.free === robot2.cargo.free &&
            robot1.cargo.used === robot2.cargo.used &&
            robot1.cargo.coal === robot2.cargo.coal &&
            robot1.cargo.iron === robot2.cargo.iron &&
            robot1.cargo.gem === robot2.cargo.gem &&
            robot1.cargo.gold === robot2.cargo.gold &&
            robot1.cargo.platin === robot2.cargo.platin &&
            robot1.highlighted === robot2.highlighted &&
            robot1.levels.damage === robot2.levels.damage &&
            robot1.levels.energy === robot2.levels.energy &&
            robot1.levels.energyRegeneration === robot2.levels.energyRegeneration &&
            robot1.levels.health === robot2.levels.health &&
            robot1.levels.miningLevel === robot2.levels.miningLevel &&
            robot1.levels.miningSpeed === robot2.levels.miningSpeed &&
            robot1.levels.storage === robot2.levels.storage
        );
    }
    generateRobotName(): string {
        const prefixes = ["RX", "QT", "ZB", "NV", "MK", "TR"];
        const randomNumber = Math.floor(100 + Math.random() * 900);
        const suffixes = ["A", "B", "X", "Y", "Z", "R"];
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
        return `${prefix}${randomNumber}${suffix}`;
    }
    mapToRobot(obj: any) {
        return {
            robotId: obj.robotId,
            planetId: obj.planetId,
            playerId: obj.playerId,
            vitals: obj.vitals,
            levels: obj.levels,
            cargo: obj.cargo,
            highlighted: false
        };
    }
}