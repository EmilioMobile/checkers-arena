import { Injectable, EventEmitter } from '@angular/core';
import { timer, Observable } from 'rxjs';
import { Board } from './board'
import { Player } from './player'
import * as socketIo from 'socket.io-client';

// Socket.io events
export enum Event {
    CONNECT = 'connect',
    DISCONNECT = 'disconnect'
}

@Injectable({
  providedIn: 'root'
})

export class BoardService {

    moves = [];

    moves_test = [
        {
        "env_id": 123456789,
        "board_id": "0",
        "game_num": 13,
        "black": {
            "name": "random_agent",
            "pices": [
                2, 3, 4, 5, 6, 7, 9, 10, 11, 20, 30
            ],
            "win_num": 7
        },
        "white": {
            "name": "emilio",
            "pices": [
                1, 22, 23, 24, 25, 26, 27, 28, 29, 31, 32
            ],
            "win_num": 8
        },
        "kings": {
            "pices": [ 4, 5, 5]
        }
    },
        {
            "env_id": 123456789,
            "board_id": "0",
            "game_num": 13,
            "black": {
                "name": "random_agent",
                "pices": [
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 20
                ],
                "win_num": 6
            },
            "white": {
                "name": "emilio",
                "pices": [
                    21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32
                ],
                "win_num": 8
            },
            "kings": {
                "pices": [ 10, 15, 30]
            }
        },
        {
            "env_id": 123456789,
            "board_id": "7",
            "game_num": 13,
            "black": {
                "name": "random_agent",
                "pices": [
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
                ],
                "win_num": 6
            },
            "white": {
                "name": "emilio",
                "pices": [
                    21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32
                ],
                "win_num": 7
            },
            "kings": {
                "pices": [ 10, 15, 30]
            }
        },
        {
            "env_id": 123456789,
            "board_id": "7",
            "game_num": 13,
            "black": {
                "name": "random_agent",
                "pices": [
                    1, 2, 3, 10, 11, 12
                ],
                "win_num": 10
            },
            "white": {
                "name": "emilio",
                "pices": [
                    21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32
                ],
                "win_num": 20
            },
            "kings": {
                "pices": [ 10, 15, 30]
            }
        }
    ]

    playerId: number = 1;
    boards: Board[] = [];
    public drawMovement$: EventEmitter<any>;
    count = 0;
    pices: any[][]
    ioConnection: any;

    constructor() {

        // Initialize the websocket
        this.initSocket();

        this.ioConnection = this.onMessage().subscribe((message: any) => {
           // console.log(message)
            this.moves.push(message);
        });

        this.onEvent(Event.CONNECT).subscribe(() => {
            //console.log('connected');
        });

        this.onEvent(Event.DISCONNECT).subscribe(() => {
            //console.log('disconnected');
        });

        this.drawMovement$ = new EventEmitter();
        let timer$ = timer(1000,200);
        timer$.subscribe(t => {
            this.render(this.count);

            // for test data only
            this.count = this.count + 1
            if (this.count == 4) {
                this.count = 0;
            }
        });
    }

    public render(movement): void {
        // Test
        if (this.moves_test.length > 0) {
            let move = this.moves_test.pop()
            this.drawMovement$.emit(move);
        }

       // if (this.moves.length > 0) {
       //     let move = this.moves.pop()
       //     this.drawMovement$.emit(move);
       // }
    }

    boardRowDistribution(item) {
        if (item >= 0 && item <= 4) {
            var row = 0;
        } else if (item >= 5 && item <= 8) {
            var row = 1;
        } else if (item >= 9 && item <= 12) {
            var row = 2;
        } else if (item >= 13 && item <= 16) {
            var row = 3;
        } else if (item >= 17 && item <= 20) {
            var row = 4;
        } else if (item >= 21 && item <= 24) {
            var row = 5;
        } else if (item >= 25 && item <= 28) {
            var row = 6;
        } else if (item >= 29 && item <= 32) {
            var row = 7;
        }
        return row
    }

    boardColumDistribution(row, item) {
        if (row % 2 == 0) {
            var column = (item - row * 4);
            if (column == 2) {
                column = 3
            }
            else if (column == 3) {
                column = 5
            }
            else if (column == 4) {
                column = 7
            }
        } else {
            var column = (item - row * 4) - 1;
            if (column == 1) {
                column = 2
            }
            else if (column == 2) {
                column = 4
            }
            else if (column == 3) {
                column = 6
            }
        }
        return column
    }

    lastTurn: any;
    drawBoard(init, movement) : BoardService {

        if (init === true ) {
            // Weird way to initialize a multidimensional array
            this.pices = [];
            for(var i: number = 0; i < 8; i++) {
                this.pices[i] = [];
                for(var j: number = 0; j< 10; j++) {
                    this.pices[i][j] = [];
                }
            }
        }

        let turn = { game_num: 0, black: { name: '', pices: [], win_num: 0 }, white: { name: '', pices: [], win_num: 0 }, kings: { pices: [] }};

        if (init == false) {
            var nextTurn = movement //; this.movements[movement] // .pop();

            if (nextTurn != undefined) {

                turn = nextTurn;

                // Weird way to initialize a multidimensional array
                this.pices = [];
                for(var i: number = 0; i < 8; i++) {
                    this.pices[i] = [];
                    for(var j: number = 0; j< 10; j++) {
                        this.pices[i][j] = [];
                    }
                }

                let blacks = turn.black.pices;

                blacks.forEach((item, index) => {
                    var row = this.boardRowDistribution(item);
                    var column = this.boardColumDistribution(row, item)
                    this.pices[row][column] = 'B'
                });

                let whites = turn.white.pices;
                whites.forEach((item, index) => {
                    var row = this.boardRowDistribution(item);
                    var column = this.boardColumDistribution(row, item)
                    this.pices[row][column] = 'W'
                });

                let kings = turn.kings.pices;
                kings.forEach((item, index) => {
                    var row = this.boardRowDistribution(item);
                    var column = this.boardColumDistribution(row, item)
                    this.pices[row][column] = 'K'
                });

                this.lastTurn = turn;
            } else {
                turn = this.lastTurn;
            }
        }

        // create tiles for board
        let tiles = [];
        for(let i=0; i < 8; i++) {
            tiles[i] = [];
            for(let j=0; j< 8; j++) {
                tiles[i][j] = { used: false, value: this.pices[i][j], status: '' };
            }
        }

        // create board
        let board = new Board({
            game_num: turn.game_num,
            player: new Player({ id: this.playerId++ }),
            player_black_name: turn.black.name,
            player_black_wins: turn.black.win_num,
            player_whites_name: turn.white.name,
            player_whites_wins: turn.white.win_num,
            tiles: tiles
        });
        // append created board to `boards` property
        this.boards = [];
        this.boards.push(board);
        return this;
    }

    // returns all created boards
    getBoards() : Board[] {
        return this.boards;
    }

    private SERVER_URL = 'http://localhost:5000';
    private socket;

    public initSocket(): void {
        this.socket = socketIo(this.SERVER_URL);
    }

    public send(message: any): void {
        this.socket.emit('message', message);
    }

    public onMessage(): Observable<any> {
        return new Observable<any>(observer => {
            this.socket.on('message', (data: any) => { observer.next(data) });
        });
    }

    public onEvent(event: Event): Observable<any> {
        return new Observable<Event>(observer => {
            this.socket.on(event, () => observer.next());
        });
    }
}