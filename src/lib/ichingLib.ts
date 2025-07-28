import { getRand } from '../random';
import hexagramsData from './hexagrams.json';

// Simple seeded random number generator (Linear Congruential Generator)
class SeededRNG {
	private seed: number;

	constructor(seed: number) {
		this.seed = seed;
	}

	next(): number {
		this.seed = (this.seed * 1664525 + 1013904223) % 4294967296;
		return this.seed / 4294967296;
	}

	range(min: number, max: number): number {
		return Math.floor(this.next() * (max - min)) + min;
	}
}

export interface Line {
	type: 'strong' | 'weak';
	changing: boolean;
}

export interface Hexagram {
	number: number;
	name: string;
	reading: string;
	symbol: string;
	lines: Line[];
}

const kingWenSequence: Array<number> = hexagramsData.kingWenSequence;

function kingWenNumber(lines: Line[]): number {
	if (lines.length != 6) {
		return -1;
	}
	let num = '';
	for (const line of lines) {
		if (line.type == 'strong') {
			num += '1';
		} else {
			num += '0';
		}
	}
	const bin = parseInt(num, 2);
	for (let i = 0; i < kingWenSequence.length; i++) {
		if (bin == kingWenSequence[i]) {
			return i + 1;
		}
	}
	throw 'no present in sequence: ' + bin;
}

// Load hexagram data from JSON
const hexagramData: Record<number, { name: string; reading: string; symbol: string }> =
	hexagramsData.hexagrams;

// adapted from: https://github.com/Brianfit/I-Ching
export function yarrow(rng: SeededRNG): Line {
	let Stalks = 50;
	let HandPile: number;
	let EastPile: number;
	let WestPile: number;
	let EastRemainder: number;
	let WestRemainder: number;
	let CountValue1: number;
	let CountValue2: number;
	let CountValue3: number;
	let LineValue: number;

	const DivideStalks = function (YarrowStalks: number) {
		// Divide 49 stalks into eastpile westpile
		// Subtract one from westpile put in handpile
		// Ensure we get at least 1 for WestPile so it doesn't become negative after subtraction
		WestPile = rng.range(1, YarrowStalks + 1);
		EastPile = YarrowStalks - WestPile;
		WestPile = WestPile - 1;
		HandPile = 1;
	};

	const DivideEastAndWest = function () {
		EastRemainder = EastPile % 4;
		WestRemainder = WestPile % 4;
		if (EastRemainder == 0) EastRemainder = 4;
		if (WestRemainder == 0) WestRemainder = 4;
		HandPile = HandPile + EastRemainder + WestRemainder;
	};

	const LineCast = function (): Line {
		Stalks = 49; //Remove one stalk and set it aside

		// Initialize count values
		CountValue1 = 0;
		CountValue2 = 0;
		CountValue3 = 0;

		DivideStalks(Stalks);
		DivideEastAndWest();

		if (EastRemainder + WestRemainder + 1 == 9) CountValue1 = 2;
		if (EastRemainder + WestRemainder + 1 == 5) CountValue1 = 3;
		Stalks = Stalks - HandPile;

		DivideStalks(Stalks);
		DivideEastAndWest();

		if (EastRemainder + WestRemainder + 1 == 8) CountValue2 = 2;
		if (EastRemainder + WestRemainder + 1 == 4) CountValue2 = 3;
		Stalks = Stalks - HandPile;

		DivideStalks(Stalks);
		DivideEastAndWest();

		if (EastRemainder + WestRemainder + 1 == 8) CountValue3 = 2;
		if (EastRemainder + WestRemainder + 1 == 4) CountValue3 = 3;

		LineValue = CountValue1 + CountValue2 + CountValue3;

		if (LineValue == 6) return { type: 'weak', changing: true };
		if (LineValue == 7) return { type: 'strong', changing: false };
		if (LineValue == 8) return { type: 'weak', changing: false };
		if (LineValue == 9) return { type: 'strong', changing: true };

		// This should never happen with proper I Ching algorithm, but adding safety
		console.warn('Unexpected LineValue in I Ching calculation:', LineValue);
		return { type: 'strong', changing: false }; // Default fallback
	};

	return LineCast();
}

export async function generateHexagram(randomGetter: () => Promise<number> = getRand): Promise<Hexagram> {
	// Get quantum random seed
	const quantumSeed = await randomGetter();
	const rng = new SeededRNG(quantumSeed);

	const lines: Line[] = [];
	for (let i = 0; i < 6; i++) {
		lines.push(yarrow(rng));
	}

	const number = kingWenNumber(lines);
	const data = hexagramData[number];

	return {
		number,
		name: data.name,
		reading: data.reading,
		symbol: data.symbol,
		lines
	};
}
