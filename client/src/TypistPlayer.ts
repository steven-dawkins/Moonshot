import { Player } from "./generated/graphql";
import { Typist } from "./typist";


export class TypistPlayer
{
    public readonly typist: Typist;

    constructor(public player: Player, text: string)
    {
        this.typist = new Typist(text);
    }
}