import { McpAgent } from 'agents/mcp';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { generateHexagram } from '../../src/lib/ichingLib.js';

// Define our Free Universe Splitter MCP agent with quantum tools
export class UniverseSplitterMCP extends McpAgent {
	server = new McpServer({
		name: 'freeuniversesplitter.com',
		version: '0.1.0'
	});

	async init() {
		// Quantum choice between multiple options
		this.server.tool(
			'quantum_choice',
			'Make a quantum choice between multiple options using true quantum randomness from multiple sources',
			{
				options: z.array(z.string()).min(2).max(20),
				description: z.string().optional()
			},
			async ({ options, description }) => {
				const env = this.env as Env;
				const response = await env.QUANTUM_API.fetch('http://dummy/');
				const outcome = await response.text();

				// Use quantum randomness to select option
				const selectedIndex = this.hashToIndex(outcome, options.length);
				const selectedOption = options[selectedIndex];

				return {
					content: [
						{
							type: 'text',
							text: `🌌 Quantum decision${
								description ? ` for "${description}"` : ''
							}: **${selectedOption}**\n\nThe universe has split and in this branch you chose: ${selectedOption}`
						}
					]
				};
			}
		);

		// Quantum Magic 8-Ball
		this.server.tool(
			'magic_8_ball',
			'Get a quantum Magic 8-Ball response using true quantum randomness',
			{
				question: z.string().optional()
			},
			async ({ question }) => {
				const env = this.env as Env;
				const response = await env.QUANTUM_API.fetch('http://dummy/');
				const outcome = await response.text();

				return {
					content: [
						{
							type: 'text',
							text: `🎱 ${
								question ? `Question: "${question}"\n` : ''
							}Quantum Magic 8-Ball says: **${outcome}**\n\nThis answer comes from true quantum randomness across multiple sources.`
						}
					]
				};
			}
		);

		// Pure quantum random number
		this.server.tool(
			'quantum_number',
			'Generate a truly random number within a specified range using quantum sources',
			{
				min: z.number().int().default(1),
				max: z.number().int().default(100)
			},
			async ({ min, max }) => {
				const env = this.env as Env;
				const response = await env.QUANTUM_API.fetch('http://dummy/rndnum');
				const quantumNum = parseInt(await response.text());

				// Scale to desired range
				const result = min + (quantumNum % (max - min + 1));

				return {
					content: [
						{
							type: 'text',
							text: `🔢 Quantum random number: **${result}** (range: ${min}-${max})\n\nGenerated using quad-source quantum randomness from ANU, CURBy, INMETRO, and LfD.`
						}
					]
				};
			}
		);

		// Quantum coin flip
		this.server.tool(
			'coin_flip',
			'Flip a quantum coin with true randomness from quantum measurements',
			{},
			async () => {
				const env = this.env as Env;
				const response = await env.QUANTUM_API.fetch('http://dummy/rndnum');
				const quantumNum = parseInt(await response.text());

				const result = quantumNum % 2 === 0 ? 'Heads' : 'Tails';

				return {
					content: [
						{
							type: 'text',
							text: `🪙 Quantum coin flip: **${result}**\n\nThis result comes from true quantum measurements, splitting the universe into two branches.`
						}
					]
				};
			}
		);

		// Quantum I Ching reading
		this.server.tool(
			'quantum_iching',
			'Generate a quantum I Ching hexagram reading using true quantum randomness',
			{
				question: z.string().optional()
			},
			async ({ question }) => {
				const env = this.env as Env;
				
				// Create quantum random getter that uses our API
				const quantumRandom = async (): Promise<number> => {
					const response = await env.QUANTUM_API.fetch('http://dummy/rndnum');
					return parseInt(await response.text());
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

				return {
					content: [
						{
							type: 'text',
							text: `${hexagram.symbol} **${hexagram.name}** (Hexagram ${hexagram.number})${question ? `\n\nQuestion: "${question}"` : ''}\n\n**Reading:** ${hexagram.reading}\n\n**Lines (bottom to top):**\n${linesDisplay}\n\nThis reading was generated using true quantum randomness from multiple sources, ensuring the universe has truly split to provide your answer.`
						}
					]
				};
			}
		);
	}

	// Helper to convert quantum randomness hash to array index
	private hashToIndex(hash: string, arrayLength: number): number {
		let sum = 0;
		for (let i = 0; i < hash.length; i++) {
			sum += hash.charCodeAt(i);
		}
		return sum % arrayLength;
	}
}

export default {
	fetch(request: Request, env: Env, ctx: ExecutionContext) {
		const url = new URL(request.url);

		if (url.pathname === '/sse' || url.pathname === '/sse/message') {
			return UniverseSplitterMCP.serveSSE('/sse').fetch(request, env, ctx);
		}

		if (url.pathname === '/mcp') {
			return UniverseSplitterMCP.serve('/mcp').fetch(request, env, ctx);
		}

		return new Response('Not found', { status: 404 });
	}
};
