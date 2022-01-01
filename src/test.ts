import UStdTty from "./index";

const t = new UStdTty(process.stdout);

for (let i = 0; i < 10; i++) {
  t.pushLine("L" + i);
}