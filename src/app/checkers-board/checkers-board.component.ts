import { Component, ChangeDetectorRef, Input } from '@angular/core';
import { BoardService } from '../board.service';
import { Board } from '../board'

@Component({
    selector: 'scoreboard-checkers-board',
    templateUrl: './checkers-board.component.html',
    styleUrls: ['./checkers-board.component.scss'],
    providers: [BoardService]
})
export class CheckersBoardComponent {

    @Input() boardId: string;

    constructor(private boardService: BoardService, private cdr: ChangeDetectorRef) {
        this.createBoards();
        // Listen for movements
        boardService.drawMovement$.subscribe(item => this.onMovement(item));
    }

    private onMovement(movement: any): void {
        if (movement != undefined && movement.board_id == this.boardId) {
            this.move(movement)
        }
    }

    createBoards() : CheckersBoardComponent {
        let init = true;
        this.boardService.drawBoard(init, 0);
        return this;
    }

    // get all boards and assign to boards property
    get boards() : Board[] {
        return this.boardService.getBoards()
    }

    getClass(row, pos) {
        if (row % 2 == 0) {
            if (pos % 2 == 0) {
                return 'white'
            } else {
                return 'black'
            }
        } else {
          if (pos % 2 == 0) {
              return 'black'
          } else {
              return 'white'
          }
        }
    }

    getValue(pice) {
        if (pice == 'WHITE') {
            return 'W'
        } else if (pice == 'BLACK') {
            return 'B'
        } else {
            return ''
        }
    }

    move(movement) {
        this.boardService.drawBoard(false, movement);
        this.cdr.detectChanges();
    }
}
