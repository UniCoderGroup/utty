/**
 * UTty's main declaration.
 * A standard for tty.
 */
export default interface UTty {
    /**
     * Push a new line at the end of lines.
     */
    pushLine(str: string): void;

    /**
     * 
     * Pop the last line.
     */
    popLine():void;

    /**
     * Replace a line.
     */
    replace(line: number, str: string): void;

    /**
     * In a terminal, some characters (such as Chinese characters) have 2 width,
     * while some may not display.
     * This function is used to resolve str to get the display width.
     * @returns The display length of str.
     */
    getStrDisplayWidth(str: string): number;
}