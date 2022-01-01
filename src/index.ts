import { WriteStream as TtyWriteStream } from 'node:tty';
import stripAnsi from 'strip-ansi';

export interface UTty {
    /**
     * Replace a line.
     */
    replace(line: number, str: string): void;

    /**
     * Move cursor to the line.
     */
    moveToLine(line: number): void;

    /**
     * Clear a line.
     * @param dir see param `dir` in http://nodejs.org/api/tty.html#writestreamclearlinedir-callback
     */
    clearLine(line: number, dir: -1 | 0 | 1): void;

    /**
     * Push a new line.
     */
    pushLine(str: string): void;

    /**
     * In a terminal, some characters (such as Chinese characters) have 2 width,
     * while some may not display.
     * This function aimed to resolve the str to get the display width.
     * @returns The display length of str.
     */
    getStrDisplayWidth(str: string): number;
}


/**
 * Get the number of lines of `str`.
 * It returns `1` when `str` has no `\n`.
 */
function getLineNum(str: string): number {
    let lines = 1;
    for (let c of str) {
        if (c === "\n") {
            lines++;
        }
    }
    return lines;
}

export interface StdTty {
    write(buffer: Uint8Array | string, cb?: (err?: Error) => void): boolean;
    clearLine(dir: -1 | 0 | 1, callback?: () => void): boolean;
    moveCursor(dx: number, dy: number, callback?: () => void): boolean;
    cursorTo(x: number, y?: number, callback?: () => void): boolean;
}

export default class UStdTty implements UTty {
    constructor(tty: StdTty) {
        this.tty = tty;
    }

    /**
     * The output stream.
     */
    tty: StdTty;

    /**
     * Curent line in terminal (start by 0).
     */
    line = 0;

    /**
     * The number of lines.
     */
    nLine = 0;

    _write(str: string, add: boolean): void {
        this.tty.write(str);
        let dLine = getLineNum(str) - 1;
        this.line += dLine;
        if (add) this.nLine += dLine;
    }

    _clearLine(dir: -1 | 0 | 1 = 0): void {
        this.tty.clearLine(dir);
    }

    _replace(str: string): void {
        this._clearLine();
        this._write(str, false);
    }

    _move(dChar: number, dLine: number) {
        this.tty.moveCursor(dChar, dLine);
        this.line += dLine;
    }

    _moveChar(dChar: number): void {
        this._move(dChar, 0);
    }

    _moveLine(dLine: number): void {
        this._move(0, dLine);
    }

    _toChar(char: number): void {
        this.tty.cursorTo(char);
    }

    _toLine(line: number): void {
        this._moveLine(-this.line + line);
        if (this.line != line) throw new Error(`fn _toLine error: wanted to move to line${line}, but at line${this.line}`);
    }

    _toNewLine(): void {
        this._toLine(this.nLine);
    }

    replace(line: number, str: string): void {
        this._toLine(line);
        this._replace(str);
    }

    moveToLine(line: number): void {
        this._toLine(line);
        this._toChar(0);
    }

    clearLine(line: number, dir: -1 | 0 | 1 = 0): void {
        this._toLine(line);
        this._clearLine(dir);
    }

    pushLine(str: string): void {
        this._toNewLine();
        this._write(str + "\n", true);
    }

    getStrDisplayWidth(str: string): number {
        return stripAnsi(str).length;
        //return str.length;
    }
}
