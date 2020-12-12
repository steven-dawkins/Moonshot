import { TypistPlayer } from "./TypistPlayer";

export enum GameState { Lobby, Started }

export class Game {

    private state: GameState;

    constructor(public players: TypistPlayer[], public player: TypistPlayer, public gameText: string) {
        this.state = GameState.Lobby;
    }

    public get State() { return this.state; }

    public addPlayer(player: TypistPlayer) {
        this.players.push(player);
    }

    public startGame() {
        this.state = GameState.Started;
    }
}