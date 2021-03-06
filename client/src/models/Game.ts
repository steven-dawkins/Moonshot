import { TypistPlayer } from "./TypistPlayer";

export enum LocalGameState { Lobby, Countdown, Started }

export class Game {

    private _state: LocalGameState;
    private _countdown: string;

    constructor(public gameName: string, public players: TypistPlayer[], public player: TypistPlayer, public gameText: string) {
        this._state = LocalGameState.Lobby;
        this._countdown = "";
    }

    public get state() { return this._state; }

    public get countdown() { return this._countdown; }

    public addPlayer(player: TypistPlayer) {
        var existing = this.players.filter(t => t.playerIndex === player.playerIndex);

        if (existing.length === 0) {
            this.players.push(player);
        }
    }

    public startCountdown(countdown: string) {
        this._state = LocalGameState.Countdown;
        this._countdown = countdown;
    }

    public startGame() {
        this._state = LocalGameState.Started;
    }

    public addKeystroke(playerName: string, keystroke: string, keystrokeId: string) {
        const p = this.players.filter(p => p.playerName === playerName)[0];

        // ignore own player keystrokes (they are processed directly)
        if (p !== this.player) {
            p.typist.ProcessCharacter(keystroke, keystrokeId);
        }
    }
}