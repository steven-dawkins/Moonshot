

//import { performance } from "perf_hooks";

export class Typist
{

    private position: number;
    private lastId: string | null | undefined;
    private startTime: number | null;
    private endtime: number | null;

    constructor(private text: string/*, private onComplete: (() => void) | null = null*/) {
        this.position = 0;
        this.lastId = null;
        this.startTime = null;
        this.endtime = null;
    }

    public get Position() {
        return this.position / this.text.length;
    }

    public get Index() {
        return this.position;
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

    public get Words() {
        const words = this.TypedText.split(/[\s,\.]+/);

        // if the stream is totally complete return all the split words
        if (this.Finished) {
            return words.length;
        }
        // otherwise the last word must be incomplete so return words.length - 1
        else if (words.length > 0) {
            return words.length - 1;
        }
        else {
            return 0;
        }
    }

    public get Finished() {
        return this.position === this.text.length;
    }

    public get WordsPerMinute() {
        if (this.startTime === null) {
            return 0;
        }

        const endTime = this.endtime !== null
            ? this.endtime
            : performance.now();

        const elapsed = endTime - this.startTime;

        return this.Words / (elapsed / (1000 * 60));
    }

    public ProcessCharacter(char: string, id: string | null | undefined = null) {
        // compensation for https://github.com/apollographql/apollo-client/issues/6037
        if (id !== null && this.lastId === id)
        {
            return;
        }

        // don't accept further characters once finished
        if (this.Finished) {
            return;
        }

        if (this.startTime === null) {
            this.startTime = performance.now();
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

        if (this.position == this.text.length)
        {
            this.endtime = performance.now();
        }

        return this.position;
    }
}