import { WriteStream as TtyWriteStream } from 'node:tty';
//import stripAnsi from 'strip-ansi';

export default class UTty {
    constructor(tty: TtyWriteStream & { fd: 1 }) {
        this.tty = tty;
    }

    /**
     * The output stream.
     */
    tty: TtyWriteStream & { fd: 1 };

    // /**
    //  * Curent x coord in terminal (start by 0).
    //  */
    // x = 0;

    /**
     * Curent line in terminal (start by 0).
     */
    line = 0;

    /**
     * The number of lines.
     */
    nLine = 0;

    /**
     * Write str and `'\n'` to stdout,
     * and add this.y according to number of `'\n'`s.
     */
    push(str: string): void {
        this.moveToLastLine();
        this.tty.write(str + "\n");
        for (let c of str) {
            if (c === "\n") {
                this.line++;
                this.nLine++;
            }
        }
        // add the additional "\n"
        this.line++;
        this.nLine++;
    }

    _write(str:string):void{
        this.tty.write(str);
    }

    _clearLine(dir: -1 | 0 | 1 = 0):void{
        this.tty.clearLine(dir);
    }

    _replace(str:string):void{
        this._clearLine();
        this._write(str);
    }

    _resetX():void{
        this.tty.cursorTo(0);
    }

    _move(dx:number,dLine:number){
        this.tty.moveCursor(dx,dLine);
        this.line+=dLine;
    }

    _moveX(dx:number):void{
        this._move(dx,0);
    }

    _moveY(dLine:number):void{
        this._move(0,dLine);
    }

    _yTo(line:number):void{
        this._moveY(-this.line+line);
        if(this.line!=line) throw new Error(`fn _yTo error: wanted to move to ${line}, but at ${this.line}`);
    }
    
    _moveToLastLine(): void {
        this._yTo(this.nLine);
    }

    /**
     * Replace the line with a new string.
     */
    replace(line: number, str: string): void {
        this.moveToY(line);
        this._replace(str);
    }

    /**
     * Move to the first line of line,
     * and reset x coord to `0`.
     * [BUG]: It cannot go to row that above the screen
     */
    moveToY(line: number): void {
        this._resetX();
        this._yTo(line);
        if (this.line !== line) throw new Error("//");
    }

    /**
     * Move to last line according to `this.yMax`.
     */

    /**
     * Clear a line.
     * @param dir see param `dir` in http://nodejs.org/api/tty.html#writestreamclearlinedir-callback
     */
    clearLine(dir: -1 | 0 | 1 = 0, line: number = this.line): void {
        this.moveToY(line);
        this._clearLine(0);
    }

    /**
     * In a terminal, some characters (such as Chinese characters) have 2 width,
     * while some may not display.
     * This function aimed to resolve the str to get the display width.
     * @returns The display length of str.
     */
    getStrDisplayWidth(str: string): number {
        //return stripAnsi(str).length;
        return str.length;
    }
}
