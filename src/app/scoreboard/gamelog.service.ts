import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";



@Injectable({providedIn: 'root'})
export class GamelogService {

    private scoreboardEndpoint = 'http://localhost:8089/scoreboard';
    private achievementsEndpoint = 'http://localhost:8089/achievements';
    private mapEndpoint = 'http://localhost:8089/map';
    private scoreboardThrophiesEndpoint = 'http://localhost:8089/scoreboard-trophies';
    private scoreboardWithAchievementsEndpoint = 'http://localhost:8089/scoreboard-with-achievements';

    constructor (private http : HttpClient) {}

    getScoreboard() {
        return this.http.get(this.scoreboardEndpoint);
    }

    getAchievements() {
        return this.http.get(this.achievementsEndpoint);
    }

    getMap() {
        return this.http.get(this.mapEndpoint);
    }

    getScoreboardThrophies() {
        return this.http.get(this.scoreboardThrophiesEndpoint);
    }

    getScoreboardWithAchievements() {
        return this.http.get(this.scoreboardWithAchievementsEndpoint);
    }

    
}