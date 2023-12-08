import { Component, OnDestroy, OnInit } from '@angular/core';
import { GamelogService } from './gamelog.service';
import { Subscription, interval } from 'rxjs';
import { GamesService } from '../games.service';
import { Game } from '../controlpanel/gameshandler/gameshandler.component';

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
    achievements: { gameId: string, achievement: { name: string, image: string, category: string } }[]
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
    const container = document.getElementById('errorContainer');
    container.addEventListener('mousemove', (e) => {
      this.handleMouseMove(e);
    });
    this.scoreboardSubscription = interval(1000).subscribe(() => {
      this.gameLogService.getScoreboardWithAchievements().subscribe((res: ScoreboardWithAchievemnts) => {
        this.scoreboard = res;
        this.scoreboard.scoreboardEntriesWithAchievements = this.scoreboard.scoreboardEntriesWithAchievements.sort((a, b) => {
          if (a.totalScore < b.totalScore) {
            return 1;
          }
          if (a.totalScore > b.totalScore) {
            return -1
          }
          return 0
        })
      })
    })
    this.gameSubscription = interval(1000).subscribe(() => {
      this.gamesService.getRecentGame()
        .subscribe((res: Game[]) => {
          if (res.length > 0) {
            this.rounds = res[0].maxRounds
            this.game = res[0];
          }
        })
    });
  }
  handleMouseMove(e) {
    const errorContent = document.getElementById('errorContent');
    const { clientX, clientY } = e;
    const { width, height } = errorContent.getBoundingClientRect();

    const xVal = clientX / width;
    const yVal = clientY / height;

    const tiltX = (yVal - 0.5) * 15; 
    const tiltY = (xVal - 0.5) * -15; 

    errorContent.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
  }

  reloadPage() {
    window.location.reload();
  }
  getAchievements() {

  }

  ngOnDestroy(): void {
    this.scoreboardSubscription.unsubscribe();
    this.gameSubscription.unsubscribe();
  }
}
