import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ControlpanelComponent } from './controlpanel/controlpanel.component';
import { HeaderComponent } from './header/header.component';
import { MapComponent } from './map/map.component';
import { ScoreboardComponent } from './scoreboard/scoreboard.component';
import { SidebarComponent } from './map/sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { PlanetComponent } from './map/planet/planet.component';
import { GameComponent } from './controlpanel/gameshandler/game/game.component';
import { PlayerComponent } from './map/player/player.component';
import { RobotComponent } from './map/robot/robot.component';
import { SettingsbarComponent } from './map/settingsbar/settingsbar.component';
import { StoreModule } from '@ngrx/store';
import { customGamesReducer, mapReducer } from './store/dashboard.reducer';
import { EffectsModule } from '@ngrx/effects';
import { GameshandlerComponent } from './controlpanel/gameshandler/gameshandler.component';
import { TransactionItemFormatPipe } from './transaction-item-format.pipe';
import { ChartComponent } from './shared/chart/chart.component';


@NgModule({
  declarations: [
    AppComponent,
    ControlpanelComponent,
    HeaderComponent,
    MapComponent,
    ScoreboardComponent,
    SidebarComponent,
    PlanetComponent,
    GameComponent,
    PlayerComponent,
    RobotComponent,
    SettingsbarComponent,
    GameshandlerComponent,
    ChartComponent,
    TransactionItemFormatPipe,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    StoreModule.forRoot(
      { 
        customGames: customGamesReducer,
        map: mapReducer
      }),
    EffectsModule.forRoot([])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
