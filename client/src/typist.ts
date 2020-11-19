export class Typist
{

    private position: number;

    constructor(private text: string) {
        this.position = 0;
    }

    public get Position() {
        return this.position / this.text.length;
    }

    public get Text() {
        return this.text;
    }

    public get TypedText() {
        return this.text.substr(0, this.position);
    }

    public get UnTypedText() {
        return this.text.substr(this.position, this.text.length - this.position);
    }

    public ProcessCharacter(char: string) {
        for(var i = 0; i < char.length; i++) {
            if (char[i] === this.text[this.position]) {
                this.position++;
            }
            else {
                if (this.position > 0)
                {
                    this.position--;
                }
            }
        }

        return this.position;
    }
}