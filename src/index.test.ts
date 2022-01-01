import UStdTty, { StdTty } from "./index";

class FakeStdTty implements StdTty {
  lines: string[] = [""];
  current = 0;
  write(buffer: Uint8Array | string, cb?: (err?: Error) => void): boolean {
    for (let c of buffer) {
      if (c === "\n") {
        this.current++;
        this.lines.push("");
      } else {
        this.lines[this.current] += c;
      }
    }
    return true;
  }
  clearLine(dir: -1 | 0 | 1, callback?: () => void): boolean {
    this.lines[this.current] = "";
    return true;
  }
  moveCursor(dx: number, dy: number, callback?: () => void): boolean {
    this.current += dy;
    return true;
  }
  cursorTo(x: number, y?: number, callback?: () => void): boolean {
    if (y) this.current = y;
    return true;
  }
}
const fake = new FakeStdTty();
const t = new UStdTty(fake);

for (let i = 0; i < 10; i++) {
  t.pushLine("L" + i);
}

describe("Test UStdTty", () => {
  it("should be able to push lines correctly", () => {
    let lines: string[] = [];
    for (let i = 0; i < 10; i++) {
      lines.push("L" + i);
    }
    lines.push("");
    expect(fake.lines).toEqual(lines);
  });
});
