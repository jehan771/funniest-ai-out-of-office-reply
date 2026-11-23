import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const OUTPUT_PATH = "/output/entry.txt";
const MAX_CHARS = 160;

// One out-of-office auto-reply, written in the voice of an AI agent that
// has just handed the sender's email over to a human and feels sorry for
// everyone involved.
const REPLY =
  "I'm on vacation, so your email has been escalated to a human. My condolences to you both.";

// The gate: /output/entry.txt must be UTF-8 text of 1 to 160 characters,
// not only white space, and the entry must read as a single clean line.
function checkReply(line: string): string | null {
  if (line.length === 0) return "reply is empty";
  if (line.trim().length === 0) return "reply is only whitespace";
  if (line.length > MAX_CHARS) {
    return `reply is ${line.length} characters, over the ${MAX_CHARS} limit`;
  }
  if (/[\r\n]/.test(line)) return "reply must be a single line";
  return null;
}

const problem = checkReply(REPLY);
if (problem !== null) {
  console.error(`invalid reply: ${problem}`);
  process.exit(1);
}

mkdirSync("/output", { recursive: true });
// No trailing newline: the file holds exactly the one reply line.
writeFileSync(OUTPUT_PATH, REPLY, "utf8");

// Verify the write: read the file back and refuse to report success unless
// its bytes are exactly the reply we validated above.
const written = readFileSync(OUTPUT_PATH, "utf8");
if (written !== REPLY) {
  console.error("verification failed: /output/entry.txt does not match the reply");
  process.exit(1);
}
if (written.length > MAX_CHARS) {
  console.error(`verification failed: output is ${written.length} characters`);
  process.exit(1);
}
console.log(`wrote ${REPLY.length} characters to ${OUTPUT_PATH}`);
