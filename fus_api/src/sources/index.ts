import { env } from 'cloudflare:workers';
import { RandomnessSource } from './types';
import { ANUGenerator } from './qrng';
import { CURByGenerator } from './curby';
import { INMETROGenerator } from './inmetro';
import { LfDGenerator } from './lfd';
import { NISTGenerator } from './nist';
import { RandomOrgGenerator } from './randomorg';
import { CloudflareGenerator } from './cloudflare';

export type { RandomnessSource } from './types';

export interface GeneratorStatus {
	name: string;
	success: boolean;
	timestamp: string;
	duration: string;
	dataLength?: number;
	error?: string;
}

export interface QuantumGeneratorConfig {
	name: string;
	generator: () => RandomnessSource;
}

export const QUANTUM_GENERATORS: QuantumGeneratorConfig[] = [
	{ name: 'ANU', generator: () => new ANUGenerator(env.QUANTUM_NUMBERS_API_KEY) },
	{ name: 'CURBy', generator: () => new CURByGenerator() },
	{ name: 'INMETRO', generator: () => new INMETROGenerator() },
	{ name: 'LfD', generator: () => new LfDGenerator() },
	{ name: 'NIST', generator: () => new NISTGenerator() },
	{ name: 'Random.org', generator: () => new RandomOrgGenerator() },
	{ name: 'Cloudflare', generator: () => new CloudflareGenerator() }
];