import { Component, ViewContainerRef } from '@angular/core';
import { Board } from './board'
import { BoardService } from './board.service'

@Component({
  selector: 'scoreboard-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'scoreboard';

  canPlay: boolean = true;
  player: number = 0;
  players: number = 0;
  gameId: string;
  gameUrl: string = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port: '');

  constructor() {}
}