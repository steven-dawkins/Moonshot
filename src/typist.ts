export class Typist
{

    private position: number;

    constructor(private text: string) {
        this.position = 0;
    }

    public get Position() {
        return this.position
    }

    public ProcessCharacter(char: string) {
        for(var i = 0; i < char.length; i++) {
            if (char[i] === this.text[this.position])
            {
                this.position++;
                console.log("Recieved correct character: " + char[i] + " at " + this.position);
            }
            else {
                console.log("Recieved incorrect character: " + char[i] + " at " + this.position);
                if (this.position > 0)
                {
                    this.position--;
                }
            }
        }

        return this.position;
    }
}