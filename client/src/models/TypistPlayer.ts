import { Typist } from "./Typist";


export class TypistPlayer
{
    public readonly typist: Typist;

    constructor(public playerName: string, public playerIndex: number, text: string)
    {
        this.typist = new Typist(text);
    }
}