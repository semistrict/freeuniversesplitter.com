import { RandomnessSource } from './types';

export class RandomOrgGenerator implements RandomnessSource {
	async generate(): Promise<string> {
		// Fetch random bytes from random.org API
		// Using 32 bytes (256 bits) to match other sources
		const response = await fetch('https://www.random.org/cgi-bin/randbyte?nbytes=32&format=h');

		if (!response.ok) {
			throw new Error(`Random.org API returned ${response.status}: ${response.statusText}`);
		}

		const data = await response.text();

		// Remove any whitespace and convert to lowercase
		const hexString = data.trim().toLowerCase().replace(/\s/g, '');

		if (!hexString || hexString.length !== 64) {
			throw new Error(`Invalid hex string length: expected 64, got ${hexString.length}`);
		}

		// Validate it's a proper hex string
		if (!/^[0-9a-f]+$/.test(hexString)) {
			throw new Error('Invalid hex string format');
		}

		return hexString;
	}
}