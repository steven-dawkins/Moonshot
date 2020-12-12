import { expect } from "chai";
import { Game, GameState } from "../src/models/Game";
import { TypistPlayer } from "../src/models/TypistPlayer";

let defaultPlayer = new TypistPlayer("Default", 0, "");
let defaultText = "Lorem Ipsum";

describe('Game', function() {

    it('initial game state is lobby', function() {

        let game = new Game([], defaultPlayer, defaultText);
  
        expect(game.State).equal(GameState.Lobby);
      }); 

    it('process add player', function() {

      let game = new Game([], defaultPlayer, defaultText);

      game.addPlayer(new TypistPlayer("Player1", 0, ""));

      expect(game.players.length).equal(1);
    }); 


    it('process start game', function() {

        let game = new Game([], defaultPlayer, defaultText);
  
        game.startGame();
  
        expect(game.State).equal(GameState.Started);
      }); 

    // it('reject add player after start game', function() {

    //     expect(() => {
    //         let game = new Game([]);
    //         game.startGame();
            
    //         game.addPlayer(new TypistPlayer("Player1", 0, ""));
    //     }).to.throw("unable to add player to started game");
    // }); 
});