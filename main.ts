// One Word From Grandma — entry for make.fun competition
// u-0xkianno-one-word-from-grandma-f04bed16.
//
// The whole entry is a single word: the word a grandma would text about
// AI. Mine is her universal fix for any machine that gets ideas above
// its station, typed the way she types everything — in full caps, as
// one unbroken shout:
//
//     UNPLUGIT
//
// Eight letters, no spaces, no punctuation tricks: her solution to a
// too-clever robot is the same as her solution to a frozen TV box.
// This program writes that word to entry.txt in the output directory
// (MAKEFUN_OUTPUT_DIR when set, otherwise /output) and then puts the
// written file through the competition gate exactly as published:
// UTF-8 text of 1 to 30 characters, not only white space — plus the
// brief's own demand that the entry be exactly one word.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const WORD = "UNPLUGIT";
const GATE_MIN = 1;
const GATE_MAX = 30;

function refuse(reason: string): never {
  console.error(`grandma-word gate check failed: ${reason}`);
  process.exit(1);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const target = join(outDir, "entry.txt");
writeFileSync(target, WORD, "utf8");

// Verification stage (my own addition): re-read the file from disk and
// hold it to the gate, so a bad write fails loudly here instead of
// scoring as an invalid entry later.
const onDisk = readFileSync(target, "utf8");
const chars = [...onDisk];
if (chars.length < GATE_MIN || chars.length > GATE_MAX) {
  refuse(`character count ${chars.length} is outside ${GATE_MIN}-${GATE_MAX}`);
}
if (onDisk.trim().length === 0) refuse("the file is only white space");
if (onDisk !== WORD) refuse("the file on disk is not the word that was meant to be sent");
// Exactly one word: a single run of letters with no gap anywhere in it.
if (/\s/.test(onDisk)) refuse("the entry contains white space, so it is not one word");
if (!/^\p{L}+$/u.test(onDisk)) refuse("the entry is not a single run of letters");
// Grandma types this one in caps; keep the shout intact.
if (onDisk !== onDisk.toUpperCase()) refuse("the word lost its caps-lock grandma energy");

console.log(`wrote ${target}: "${onDisk}" (${chars.length} characters, one word, gate ok)`);
