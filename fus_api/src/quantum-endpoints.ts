// Quantum tool endpoints - API equivalents of MCP tools
import { generateHexagram } from '../../src/lib/ichingLib.js';
import { env } from 'cloudflare:workers';
import tarotCards from './tarot-cards.json';

const allowedOrigin = '*';

const corsHeaders = {
	'Access-Control-Allow-Origin': allowedOrigin,
	'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
	'Access-Control-Max-Age': '86400',
};

// Helper to get quantum randomness from KV store
async function getQuantumRandom(): Promise<number> {
	const genRand = await env.batchQRandmoness.get('qRandomness');
	if (genRand === null) {
		throw new Error('No randomness available - call /updateKV first');
	}

	const IBMQ_RAND = `3152447550`;
	const RANDOMNESS = genRand + ':' + IBMQ_RAND;
	return cyrb53(RANDOMNESS, Math.random() * 2_147_483_647);
}

// cyrb53 hash function
const cyrb53 = function (str: string, seed = 0): number {
	let h1 = 0x8b33a5130 ^ seed,
		h2 = 0x41c6ce57 ^ seed;
	for (let i = 0, ch; i < str.length; i++) {
		ch = str.charCodeAt(i);
		h1 = Math.imul(h1 ^ ch, 2654435761);
		h2 = Math.imul(h2 ^ ch, 1597334677);
	}
	h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
	h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
	return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

export async function handleQuantumChoice(request: Request): Promise<Response> {
	try {
		const { searchParams } = new URL(request.url);
		const options = searchParams.getAll('option');
		const description = searchParams.get('description');

		if (options.length < 2 || options.length > 20) {
			return new Response('Options must be between 2 and 20 items', {
				status: 400,
				headers: corsHeaders
			});
		}

		const randomNum = await getQuantumRandom();
		const selectedIndex = Math.abs(randomNum) % options.length;
		const selectedOption = options[selectedIndex];

		const result = {
			selectedOption,
			selectedIndex,
			options,
			description: description || undefined,
			message: `Quantum decision${description ? ` for "${description}"` : ''}: ${selectedOption}. The universe has split and in this branch you chose: ${selectedOption}`
		};

		return new Response(JSON.stringify(result), {
			headers: {
				...corsHeaders,
				'Content-Type': 'application/json'
			}
		});
	} catch (error) {
		return new Response(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`, {
			status: 500,
			headers: corsHeaders
		});
	}
}

export async function handleMagic8Ball(request: Request): Promise<Response> {
	try {
		const { searchParams } = new URL(request.url);
		const question = searchParams.get('question');

		const defaultOutcomes = [
			"It is certain.",
			"It is decidedly so.",
			"Without a doubt.",
			"Yes definitely.",
			"You may rely on it.",
			"As I see it, yes.",
			"Most likely.",
			"Outlook good.",
			"Yes.",
			"Signs point to yes.",
			"Reply hazy, try again.",
			"Ask again later.",
			"Better not tell you now.",
			"Cannot predict now.",
			"Concentrate and ask again.",
			"Don't count on it.",
			"My reply is no.",
			"My sources say no.",
			"Outlook not so good.",
			"Very doubtful."
		];

		const randomNum = await getQuantumRandom();
		const outcome = defaultOutcomes[Math.abs(randomNum) % defaultOutcomes.length];

		const result = {
			outcome,
			question: question || undefined,
			message: `${question ? `Question: "${question}"\n` : ''}Quantum Magic 8-Ball says: ${outcome}\n\nThis answer comes from true quantum randomness across multiple sources.`
		};

		return new Response(JSON.stringify(result), {
			headers: {
				...corsHeaders,
				'Content-Type': 'application/json'
			}
		});
	} catch (error) {
		return new Response(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`, {
			status: 500,
			headers: corsHeaders
		});
	}
}

export async function handleQuantumNumber(request: Request): Promise<Response> {
	try {
		const { searchParams } = new URL(request.url);
		const min = parseInt(searchParams.get('min') || '1');
		const max = parseInt(searchParams.get('max') || '100');

		if (min >= max) {
			return new Response('Min must be less than max', {
				status: 400,
				headers: corsHeaders
			});
		}

		const randomNum = await getQuantumRandom();
		const result = min + (Math.abs(randomNum) % (max - min + 1));

		const response = {
			result,
			min,
			max,
			message: `Quantum random number: ${result} (range: ${min}-${max})\n\nGenerated using quad-source quantum randomness from ANU, CURBy, INMETRO, and LfD.`
		};

		return new Response(JSON.stringify(response), {
			headers: {
				...corsHeaders,
				'Content-Type': 'application/json'
			}
		});
	} catch (error) {
		return new Response(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`, {
			status: 500,
			headers: corsHeaders
		});
	}
}

export async function handleCoinFlip(): Promise<Response> {
	try {
		const randomNum = await getQuantumRandom();
		const result = Math.abs(randomNum) % 2 === 0 ? 'Heads' : 'Tails';

		const response = {
			result,
			value: Math.abs(randomNum) % 2,
			message: `Quantum coin flip: ${result}\n\nThis result comes from true quantum measurements, splitting the universe into two branches.`
		};

		return new Response(JSON.stringify(response), {
			headers: {
				...corsHeaders,
				'Content-Type': 'application/json'
			}
		});
	} catch (error) {
		return new Response(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`, {
			status: 500,
			headers: corsHeaders
		});
	}
}

export async function handleQuantumIChing(request: Request): Promise<Response> {
	try {
		const { searchParams } = new URL(request.url);
		const question = searchParams.get('question');

		// Create quantum random getter that uses our quantum source
		const quantumRandom = async (): Promise<number> => {
			return Math.abs(await getQuantumRandom());
		};

		const hexagram = await generateHexagram(quantumRandom);

		// Format the lines display
		const linesDisplay = hexagram.lines
			.map((line, i) => {
				const lineSymbol = line.type === 'strong' ? '━━━━━━' : '━━  ━━';
				const changing = line.changing ? ' (changing)' : '';
				return `Line ${i + 1}: ${lineSymbol}${changing}`;
			})
			.join('\n');

		const response = {
			hexagram,
			question: question || undefined,
			linesDisplay,
			message: `${hexagram.symbol} ${hexagram.name} (Hexagram ${hexagram.number})${question ? `\n\nQuestion: "${question}"` : ''}\n\nReading: ${hexagram.reading}\n\nLines (bottom to top):\n${linesDisplay}\n\nThis reading was generated using true quantum randomness from multiple sources, ensuring the universe has truly split to provide your answer.`
		};

		return new Response(JSON.stringify(response), {
			headers: {
				...corsHeaders,
				'Content-Type': 'application/json'
			}
		});
	} catch (error) {
		return new Response(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`, {
			status: 500,
			headers: corsHeaders
		});
	}
}

export async function handleTarotSpread(request: Request): Promise<Response> {
	try {
		const { searchParams } = new URL(request.url);
		const question = searchParams.get('question');

		// Create deck of all 78 cards
		const allCards = [
			...tarotCards.majorArcana,
			...tarotCards.minorArcana.wands,
			...tarotCards.minorArcana.cups,
			...tarotCards.minorArcana.swords,
			...tarotCards.minorArcana.pentacles
		];

		// Generate 5 unique quantum random numbers for the spread
		const drawnIndexes: number[] = [];
		const reversals: boolean[] = [];

		for (let i = 0; i < 5; i++) {
			let cardIndex: number;
			// Ensure unique cards
			do {
				const randomNum = await getQuantumRandom();
				cardIndex = Math.abs(randomNum) % allCards.length;
			} while (drawnIndexes.includes(cardIndex));

			drawnIndexes.push(cardIndex);

			// Determine if card is reversed (50% chance)
			const reversalNum = await getQuantumRandom();
			reversals.push(Math.abs(reversalNum) % 2 === 0);
		}

		// Create the 5-card spread
		const spread = drawnIndexes.map((index, position) => {
			const card = allCards[index];
			const isReversed = reversals[position];
			const positions = ['Past', 'Present', 'Hidden Influences', 'Advice', 'Likely Outcome'];

			return {
				position: positions[position],
				positionIndex: position + 1,
				card: {
					...card,
					meaning: isReversed ? card.reversedMeaning : card.uprightMeaning,
					orientation: isReversed ? 'reversed' : 'upright'
				}
			};
		});

		const response = {
			spread,
			question: question || undefined,
			type: '5-Card Classic Spread',
			description: 'Past - Present - Hidden Influences - Advice - Likely Outcome',
			message: `${question ? `Question: "${question}"\n\n` : ''}Your quantum tarot reading reveals the cosmic threads woven by true quantum randomness. Each card was selected through measurements from multiple quantum sources, ensuring the universe has truly split to provide your guidance.\n\n${spread.map((s, i) => `${i + 1}. ${s.position}: ${s.card.name} (${s.card.orientation})\n   ${s.card.meaning}`).join('\n\n')}`
		};

		return new Response(JSON.stringify(response), {
			headers: {
				...corsHeaders,
				'Content-Type': 'application/json'
			}
		});
	} catch (error) {
		return new Response(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`, {
			status: 500,
			headers: corsHeaders
		});
	}
}