import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule, MatButtonModule } from '@angular/material';
import { AppComponent } from './app.component';
import { CheckersBoardComponent } from './checkers-board/checkers-board.component';

@NgModule({
  declarations: [
    AppComponent,
    CheckersBoardComponent
  ],
  imports: [
    BrowserModule,
    MatToolbarModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }