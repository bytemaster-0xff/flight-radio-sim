import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,  ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UntoweredComponent } from './untowered/untowered.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HTTPInterceptor } from './core/interceptors/http/http.interceptor';
import { ErrorInterceptor } from './core/interceptors/error/error.interceptor';
import { GameComponent } from './main/game/game.component';
import { CommonModule } from '@angular/common';
import { HighscoresComponent } from './main/dashboard/highscores/highscores.component';
import { SaveScoresComponent } from './main/dashboard/save-scores/save-scores.component';


@NgModule({
  declarations: [
    AppComponent,
    UntoweredComponent,
    GameComponent,
    HighscoresComponent,
    SaveScoresComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HTTPInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
