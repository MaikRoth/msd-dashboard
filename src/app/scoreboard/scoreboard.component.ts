import { Component, OnDestroy, OnInit } from '@angular/core';
import { GamelogService } from './gamelog.service';
import { Subscription, interval } from 'rxjs';
import { GamesService } from '../games.service';
import { Game } from '../controlpanel/gameshandler/gameshandler.component';

type ScoreboardWithAchievements = {
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
  scoreboard: ScoreboardWithAchievements;
  private scoreboardSubscription: Subscription;
  private gameSubscription: Subscription;
  rounds: number;
  fetching = true;
  constructor(private gameLogService: GamelogService, private gamesService: GamesService) { }

  ngOnInit() {
    this.loadFromLocalStorage();
    this.scoreboardSubscription = interval(1000).subscribe(() => {
      this.gameLogService.getScoreboardWithAchievements().subscribe((res: ScoreboardWithAchievements) => {
        this.scoreboard = res;
        this.sortScoreboard();
        localStorage.setItem('scoreboard', JSON.stringify(this.scoreboard));
      });
    });

    this.gameSubscription = interval(1000).subscribe(() => {
      this.gamesService.getRecentGame().subscribe((res: Game[]) => {
        if (res.length > 0) {
          this.rounds = res[0].maxRounds;
          this.game = res[0];
          this.fetching = false;
          localStorage.setItem('game', JSON.stringify(this.game));
        }
      });
    });
    const container = document.getElementById('errorContainer');
    if (container){
      container.addEventListener('mousemove', (e) => {
        this.handleMouseMove(e);
      });
    }
    setTimeout(() => {
      this.fetching = false;
    }, 10000);
  
  }

  loadFromLocalStorage() {
    const savedScoreboard = localStorage.getItem('scoreboard');
    const savedGame = localStorage.getItem('game');
    if (savedScoreboard) {
      this.scoreboard = JSON.parse(savedScoreboard);
      this.sortScoreboard();
    }
    if (savedGame) {
      this.game = JSON.parse(savedGame);
      this.rounds = this.game.maxRounds;
      this.fetching = false;
    }
  }
  sortScoreboard() {
    this.scoreboard.scoreboardEntriesWithAchievements = this.scoreboard.scoreboardEntriesWithAchievements.sort((a, b) => {
      return b.totalScore - a.totalScore;
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

  ngOnDestroy(): void {
    this.scoreboardSubscription.unsubscribe();
    this.gameSubscription.unsubscribe();
    
  }
}
