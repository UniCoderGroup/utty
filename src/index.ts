import { WriteStream as TtyWriteStream } from 'node:tty';
//import stripAnsi from 'strip-ansi';

/**
 * Get the number of lines of `str`.
 * It returns `1` when `str` has no `\n`.
 */
getLines(str:string): number{
    let lines = 1;
    for(let c of str){
        if(c === "\n"){
            lines++;
        }
    }
    return lines;
}

export default class UTty {
    constructor(tty: TtyWriteStream & { fd: 1 }) {
        this.tty = tty;
    }

    /**
     * The output stream.
     */
    tty: TtyWriteStream & { fd: 1 };

    /**
     * Curent line in terminal (start by 0).
     */
    line = 0;

    /**
     * The number of lines.
     */
    nLine = 0;

    _write(str:string, add:boolean): void{
        this.tty.write(str);
        let dLine = getLines(str) - 1;
        this.line += dLine;
        if(add) this.nLine += dLine;
    }

    _clearLine(dir: -1 | 0 | 1 = 0):void{
        this.tty.clearLine(dir);
    }

    _replace(str:string):void{
        this._clearLine();
        this._write(str);
    }

    _move(dChar:number,dLine:number){
        this.tty.moveCursor(dChar,dLine);
        this.line+=dLine;
    }

    _moveChar(dChar:number):void{
        this._move(dChar,0);
    }

    _moveLine(dLine:number):void{
        this._move(0,dLine);
    }
    
    _toChar(char:number):void{
        this.tty.cursorTo(char);
    }

    _toLine(line:number):void{
        this._moveLine(-this.line+line);
        if(this.line!=line) throw new Error(`fn _toLine error: wanted to move to line${line}, but at line${this.line}`);
    }
    
    _toNewLine(): void {
        this._yTo(this.nLine);
    }

    replace(line: number, str: string): void {
        this._toLine(line);
        this._replace(str);
    }

    moveToLine(line: number): void {
        this._toLine(line);
        this._toChar(0);
    }

    /**
     * Clear a line.
     * @param dir see param `dir` in http://nodejs.org/api/tty.html#writestreamclearlinedir-callback
     */
    clearLine(line: number,dir: -1 | 0 | 1 = 0): void {
        this._toLine(line);
        this._clearLine(dir);
    }
    
    pushLine(str:string):void{
        this._toNewLine();
        this._write(str, true);
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
