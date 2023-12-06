import { Component, OnDestroy, OnInit } from '@angular/core';
import { GamelogService } from './gamelog.service';
import { Subscription, catchError, interval, of } from 'rxjs';
import { GamesService } from '../games.service';
import { Game } from '../controlpanel/log/log.component';

type ScoreboardWithAchievemnts = {
  gameId: string,
  gameStatus: string,
  roundNumber: number,
  scoreboardEntriesWithAchievements: {
    player: { id: string, name: string },
    totalScore: number,
    fightingScore: number,
    miningScore: number,
    tradingScore: number,
    travelingScore: number,
    achievements: { gameId: string, achievement: {name:string,image:string,category:string}}[]
  }[]
}

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrl: './scoreboard.component.css'
})
export class ScoreboardComponent implements OnInit, OnDestroy {

  game: Game;
  scoreboard: ScoreboardWithAchievemnts;
  private scoreboardSubscription: Subscription;
  private gameSubscription: Subscription;
  rounds: number;

  constructor(private gameLogService: GamelogService, private gamesService: GamesService) { }

  ngOnInit() {
    this.scoreboardSubscription = interval(5000).subscribe(() => {
      this.gameLogService.getScoreboardWithAchievements().subscribe((res: ScoreboardWithAchievemnts) => {
        this.scoreboard = res;
        this.scoreboard.scoreboardEntriesWithAchievements = this.scoreboard.scoreboardEntriesWithAchievements.sort((a, b) => {
          if (a.totalScore > b.totalScore) {
            return 1;
          }
          if (a.totalScore < b.totalScore) {
            return -1
          }
          return 0
        })
      })
    })
    this.gameSubscription = interval(5000).subscribe(() => {
      this.gamesService.getRecentGame()
        .subscribe((res: Game[]) => {
          if (res.length > 0) {
            this.rounds = res[0].maxRounds
            this.game = res[0];
          }
        })
    });
  }

  getAchievements() {

  }

  ngOnDestroy(): void {
    this.scoreboardSubscription.unsubscribe();
    this.gameSubscription.unsubscribe();
  }
}
