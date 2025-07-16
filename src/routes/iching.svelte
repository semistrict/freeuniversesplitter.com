<script lang="ts">
	import { getRandomRange } from '../random';

	let lines: Array<Line> = [];

	const kingWenSequence: Array<number> = [
		63, 0, 17, 34, 23, 58, 2, 16, 55, 59, 7, 56, 61, 47, 4, 8, 25, 38, 3, 48, 41, 37, 32, 1, 57, 39,
		33, 30, 18, 45, 28, 14, 60, 15, 40, 5, 53, 43, 20, 10, 35, 49, 31, 62, 24, 6, 26, 22, 29, 46, 9,
		36, 52, 11, 13, 44, 54, 27, 50, 19, 51, 12, 21, 42
	];

	function kingWenNumber(lines: Line[]): number {
		if (lines.length != 6) {
			return -1;
		}
		let num = '';
		for (let line of lines) {
			if (line.type == 'strong') {
				num += '1';
			} else {
				num += '0';
			}
		}
		let bin = parseInt(num, 2);
		for (let i = 0; i < kingWenSequence.length; i++) {
			if (bin == kingWenSequence[i]) {
				return i + 1;
			}
		}

		throw 'no present in sequence: ' + bin;
	}

	interface Line {
		type: 'strong' | 'weak';
		changing: boolean;
	}

	// adapted from: https://github.com/Brianfit/I-Ching
	function yarrow(): Line {
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

		let DivideStalks = async function (YarrowStalks: number) {
			// Divide 49 stalks into eastpile westpile
			// Subtract one from westpile put in handpile

			let randomRange = await getRandomRange(0, YarrowStalks + 1);

			WestPile = Math.floor(randomRange);
			EastPile = YarrowStalks - WestPile;
			WestPile = WestPile - 1;
			HandPile = 1;
		};

		let DivideEastAndWest = function () {
			EastRemainder = EastPile % 4;
			WestRemainder = WestPile % 4;
			if (EastRemainder == 0) EastRemainder = 4;
			if (WestRemainder == 0) WestRemainder = 4;
			HandPile = HandPile + EastRemainder + WestRemainder;
		};
		let LineCast = function (): Line | undefined {
			//This function creates the pictures of lines as broken or unbroken
			//and changing or unchanging

			Stalks = 49; //Remove one stalk and set it aside

			DivideStalks(Stalks);
			// Divide 49 Yarrow stalks into two piles at random: East and West
			// Subtract a single stalk from the West and put it in your hand
			// between thumb and pointer finger
			DivideEastAndWest();
			// Pick up stalks from the West pile in sets of 4 and set aside
			// until 4 or fewer stalks remain
			// Put those 4 or fewer stalks between your pointer and ring fingers
			// Now divide the West pile by 4 until 4 or fewer stalks remain
			// Remainder goes in hand again between ring and fourth finger
			// Now count the total remainder stalks in your hand
			// Remainder will always be 9 or 5 (1+x+x where x is 0-4)
			// If 9 stalks remain an arbitrary value of 2 was assigned to this step
			// If 5 stalks remain an arbitrary value of 3 was assigned.
			if (EastRemainder + WestRemainder + 1 == 9) CountValue1 = 2;
			if (EastRemainder + WestRemainder + 1 == 5) CountValue1 = 3;
			Stalks = Stalks - HandPile;
			// Remove stalks from you hand and set aside.
			DivideStalks(Stalks);
			// Now divide the pile of stalks before you into two piles again
			// And remove one from the West pile.
			DivideEastAndWest();
			// And sort each pile again by sets of four stalks
			// Until 4 or fewer remain, place those remainder stalks in your hand
			// As your stalks are now 49-9 = 40 or 49-5 = 44, minus
			// the 1 you always take from the westpile
			// the number you are dividing by 4 is either 39 or 43:
			// the remainder will now always be 8 or 4
			// 1+1+2=4
			// 1+2+1=4
			// 1+3+4=8
			// 1+4+3=8
			// (4 can only occur once, as neither 39 nor 43 are evenly divisible
			// by 4)
			// If 8 stalks are in your hand, the arbitrary counting value is assigned 2
			// If 4 stalks, the counting value is assigned 3
			if (EastRemainder + WestRemainder + 1 == 8) CountValue2 = 2;
			if (EastRemainder + WestRemainder + 1 == 4) CountValue2 = 3;
			Stalks = Stalks - HandPile;
			// For the third and final time for this line,
			// you set aside the 8 or 4 stalks in your HandPile
			DivideStalks(Stalks);
			// You now have 35, 31, or 39 stalks before you
			// Divide them into East and West piles for a third time
			DivideEastAndWest();
			// Remove one from the west pile again
			// and repeat the removal of 4 stalks from each pile
			// the possible outcomes are again 8 or 4
			// and the same arbitrary count value is assigned as
			// in the last step: an 8 means that value = 2 and a 4 means
			// it is assigned a 3.
			if (EastRemainder + WestRemainder + 1 == 8) CountValue3 = 2;
			if (EastRemainder + WestRemainder + 1 == 4) CountValue3 = 3;
			LineValue = CountValue1 + CountValue2 + CountValue3;
			// You now have 3 counting values of 2 or 3 which you
			// add together.
			// the results determine the nature of this single line:
			// If 7 Line = strong
			// If 8 Line = yielding
			// if 9 Line = strong but Changing
			// if 6 Line = yielding but Changing
			if (LineValue == 6) return { type: 'weak', changing: true };
			if (LineValue == 7) return { type: 'strong', changing: false };
			if (LineValue == 8) return { type: 'weak', changing: false };
			if (LineValue == 9) return { type: 'strong', changing: true };

			// This should never happen with proper I Ching algorithm, but adding safety
			console.warn('Unexpected LineValue in I Ching calculation:', LineValue);
			return { type: 'strong', changing: false }; // Default fallback
		}; // End LineCast Function

		return LineCast();
	}

	async function consult() {
		var newLines: Array<Line> = [];
		for (let i = 0; i < 6; i++) {
			newLines.push(yarrow());
		}
		lines = newLines;
	}

	async function runTrials(n: number) {
		let counts: Array<number> = [];
		for (let i = 0; i < 64; i++) {
			counts.push(0);
		}
		for (let trial = 0; trial < n; trial++) {
			let newLines: Array<Line> = [];
			for (let i = 0; i < 6; i++) {
				newLines.push(yarrow());
			}
			counts[kingWenNumber(newLines) - 1]++;
		}
		trialResult = counts;
	}

	let trialResult: Array<number> | undefined;

	const N_TRIALS = 100_000;

	$: number = kingWenNumber(lines);
</script>

<button on:click={() => consult()}>Consult</button>

<div>
	{#if number >= 0}
		<a style="font-size: 24pt;" href="https://divination.com/iching/lookup/{number}-2/"
			>Hexagram {number}</a
		>
		<ol reversed>
			{#each lines as line}
				<li>
					{line.changing ? 'changing' : 'unchanging'}
					{line.type == 'strong' ? 'yin' : 'yang'}
				</li>
			{/each}
		</ol>
	{/if}
</div>

<div>
	<button on:click={() => runTrials(N_TRIALS)}>Run Trials</button>
	{#if trialResult}
		<table>
			{#each trialResult as count, index}
				<tr>
					<td>{index + 1}</td>
					<td>{count / N_TRIALS}</td>
				</tr>
			{/each}
		</table>
	{/if}
</div>
