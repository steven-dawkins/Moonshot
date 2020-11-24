export class Typist
{

    private position: number;
    private lastId: string | null | undefined;

    constructor(private text: string) {
        this.position = 0;
        this.lastId = null;
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

    public ProcessCharacter(char: string, id: string | null | undefined) {
        // compensation for https://github.com/apollographql/apollo-client/issues/6037
        if (id !== null && this.lastId === id)
        {
            return;
        }

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

        this.lastId = id;

        return this.position;
    }
}